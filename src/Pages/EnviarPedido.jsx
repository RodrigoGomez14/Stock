import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Paper, Button, TextField, Chip,
  Backdrop, CircularProgress, Snackbar, Autocomplete,
  FormControlLabel, Switch, Table, TableHead, TableBody, TableRow, TableCell,
  Collapse
} from '@mui/material'
import { Alert } from '@mui/material'
import { Check, Close, AttachMoney } from '@mui/icons-material'
import { BaseWizard } from '../components/BaseWizard'
import { pushData, updateData, removeData, setData, getPushKey } from '../services'
import { formatMoney, obtenerFecha } from '../utilities'
import { InlineChequeForm } from '../components/Cheques/InlineChequeForm'

const EnviarPedido = (props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')

  // id del pedido
  const id = location.search.slice(1)
  const pedido = props.pedidos?.[id]
  const orderTotal = location.state?.total || pedido?.total || 0
  const facturacion = location.state?.facturacion || false
  const clienteNombre = pedido?.cliente || location.state?.nombre || ''
  const clienteData = props.clientes?.[clienteNombre]
  const expresosList = clienteData?.datos?.expresos || []

  // Envío
  const [usarExpreso, setUsarExpreso] = useState(false)
  const [expreso, setExpreso] = useState('')
  const [remito, setRemito] = useState('')
  const [precioEnvio, setPrecioEnvio] = useState(0)

  // Pago
  const [efectivo, setEfectivo] = useState('')
  const [ctaTransferencia, setCtaTransferencia] = useState('')
  const [montoTransferencia, setMontoTransferencia] = useState('')
  const [cheques, setCheques] = useState([])
  const [totalCheques, setTotalCheques] = useState(0)
  const [showChequeForm, setShowChequeForm] = useState(false)

  const totalEnvio = usarExpreso && precioEnvio ? parseFloat(precioEnvio) : 0
  const totalPagado = (parseFloat(efectivo || 0) || 0) + (parseFloat(montoTransferencia || 0) || 0) + (totalCheques || 0)
  const totalAdeudado = (orderTotal + totalEnvio) - totalPagado

  const guardar = async () => {
    setLoading(true)
    const aux = {
      fecha: obtenerFecha(), cliente: clienteNombre,
      articulos: pedido?.productos || pedido?.articulos || [],
      metodoDePago: {
        facturacion: facturacion || null,
        efectivo: efectivo || null,
        cuentaTransferencia: ctaTransferencia || null,
        totalTransferencia: montoTransferencia || null,
        cheques: cheques.map(c => c.numero),
        fecha: obtenerFecha(),
        total: totalPagado || null,
        deudaPasada: clienteData?.datos?.deuda || 0,
        deudaActualizada: (clienteData?.datos?.deuda || 0) + (totalAdeudado > 0 ? totalAdeudado : 0),
        pagado: totalPagado,
        adeudado: totalAdeudado > 0 ? totalAdeudado : 0,
      },
      metodoDeEnvio: usarExpreso && expreso ? { expreso, remito, precio: precioEnvio } : 'Particular',
      total: orderTotal,
    }

    try {
      // Descontar stock
      const articulos = pedido?.productos || pedido?.articulos || []
      for (const art of articulos) {
        if (props.productos?.[art.producto]) {
          const nuevaCantidad = parseInt(props.productos[art.producto].cantidad) - parseInt(art.cantidad)
          await updateData(props.user.uid, `productos/${art.producto}`, { cantidad: nuevaCantidad })
        }
      }

      // Guardar cheques recibidos
      for (const ch of cheques) {
        await pushData(props.user.uid, 'cheques', {
          ingreso: obtenerFecha(), nombre: ch.nombre, numero: ch.numero,
          vencimiento: ch.vencimiento, banco: ch.banco, valor: ch.valor,
        })
      }

      // Actualizar deuda
      const deudaPasada = clienteData?.datos?.deuda || 0
      if (totalAdeudado > 0) {
        await updateData(props.user.uid, `clientes/${clienteNombre}/datos`, { deuda: deudaPasada + totalAdeudado })
      } else if (totalAdeudado < 0) {
        await updateData(props.user.uid, `clientes/${clienteNombre}/datos`, { deuda: Math.max(0, deudaPasada + totalAdeudado) })
      }

      // IVA
      if (facturacion) {
        await pushData(props.user.uid, 'iva/ventas', {
          fecha: obtenerFecha(), iva: orderTotal - (orderTotal / 1.21), total: orderTotal,
        })
      }

      // Ventas
      const key = getPushKey(props.user.uid, `clientes/${clienteNombre}/pedidos`)
      const venta = { ...aux, idPedido: key }
      await pushData(props.user.uid, 'ventas', venta)

      // Pago al historial
      await pushData(props.user.uid, `clientes/${clienteNombre}/pagos`, { ...aux.metodoDePago, idPedido: key })

      // Transferencia bancaria
      if (ctaTransferencia && montoTransferencia) {
        await pushData(props.user.uid, `CuentasBancarias/${ctaTransferencia}/ingresos`, {
          fecha: obtenerFecha(), tipo: 'transferencia', total: parseFloat(montoTransferencia),
        })
      }

      // Envío por expreso
      if (usarExpreso && expreso) {
        await pushData(props.user.uid, `expresos/${expreso}/envios`, {
          fecha: obtenerFecha(), id: key, remito, cliente: clienteNombre,
        })
      }

      // Guardar pedido completo + eliminar pedido original
      await setData(props.user.uid, `clientes/${clienteNombre}/pedidos/${key}`, aux)
      await removeData(props.user.uid, `pedidos/${id}`)

      setSnack('Pedido enviado correctamente')
      setTimeout(() => navigate('/Pedidos', { replace: true }), 1500)
    } catch {
      setLoading(false)
    }
  }

  if (!pedido) {
    return (
      <Layout history={props.history} page="Enviar Pedido" user={props.user?.uid}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography>Pedido no encontrado</Typography>
        </Box>
      </Layout>
    )
  }

  const articulos = pedido?.productos || pedido?.articulos || []

  const steps = [
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Resumen del pedido</Typography>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Typography><strong>Cliente:</strong> {clienteNombre}</Typography>
        <Typography variant="caption" color="text.secondary">Total del pedido: $ {formatMoney(orderTotal)}</Typography>
      </Paper>
      {articulos.length > 0 && (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell align="right">Cant.</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articulos.map((art, i) => (
                <TableRow key={i}>
                  <TableCell>{art.nombre || art.producto}</TableCell>
                  <TableCell align="right">{art.cantidad}</TableCell>
                  <TableCell align="right">$ {formatMoney(art.precio || 0)}</TableCell>
                  <TableCell align="right">$ {formatMoney((art.cantidad || 0) * (art.precio || 0))}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right"><strong>Total</strong></TableCell>
                <TableCell align="right"><strong>$ {formatMoney(orderTotal)}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Método de envío</Typography>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <FormControlLabel
          control={<Switch checked={usarExpreso} onChange={(e) => { setUsarExpreso(e.target.checked); if (!e.target.checked) { setExpreso(''); setRemito(''); setPrecioEnvio(0) } }} />}
          label="Enviar con expreso"
        />
        {usarExpreso && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo value={expreso}
                options={expresosList}
                onChange={(_, v) => setExpreso(v || '')}
                onInputChange={(_, v) => setExpreso(v || '')}
                renderInput={(p) => <TextField {...p} label="Expreso" fullWidth size="small" />}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="N° de remito" value={remito} onChange={(e) => setRemito(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Costo de envío ($)" type="number" value={precioEnvio}
                onChange={(e) => setPrecioEnvio(parseFloat(e.target.value) || 0)} />
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Método de pago</Typography>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Efectivo ($)" type="number" value={efectivo}
              onChange={(e) => setEfectivo(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete freeSolo value={ctaTransferencia}
              options={props.cuentasBancarias ? Object.keys(props.cuentasBancarias) : []}
              onChange={(_, v) => setCtaTransferencia(v || '')}
              onInputChange={(_, v) => setCtaTransferencia(v || '')}
              renderInput={(p) => <TextField {...p} label="Cuenta destino (transferencia)" fullWidth size="small" />}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Monto transferencia ($)" type="number" value={montoTransferencia}
              onChange={(e) => setMontoTransferencia(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>Cheques</Typography>
            <InlineChequeForm show={showChequeForm} setShow={setShowChequeForm}
              datos={cheques} setdatos={setCheques} total={totalCheques} settotal={setTotalCheques}
              cliente={clienteNombre} editIndex={-1} seteditIndex={() => {}} />
            {!showChequeForm && (
              <Button variant="contained" size="small" onClick={() => setShowChequeForm(true)}>Agregar cheque</Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Confirmar y enviar</Typography>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography><strong>Cliente:</strong> {clienteNombre}</Typography>
        <Typography><strong>Total pedido:</strong> $ {formatMoney(orderTotal)}</Typography>
        <Typography><strong>Envío:</strong> {usarExpreso && expreso ? `${expreso} - $${formatMoney(precioEnvio)}` : 'Sin expreso'}</Typography>
        <Typography><strong>Efectivo:</strong> $ {formatMoney(efectivo || 0)}</Typography>
        <Typography><strong>Transferencia:</strong> $ {formatMoney(montoTransferencia || 0)}</Typography>
        <Typography><strong>Cheques:</strong> {cheques.length} por $ {formatMoney(totalCheques)}</Typography>
        <Typography sx={{ mt: 1 }}><strong>Total pagado:</strong> $ {formatMoney(totalPagado)}</Typography>
        {totalAdeudado > 0 && (
          <Typography color="error.main" fontWeight={600}>Adeuda: $ {formatMoney(totalAdeudado)}</Typography>
        )}
        {totalAdeudado === 0 && (
          <Typography color="success.main" fontWeight={600}>✓ Pagado completo</Typography>
        )}
      </Paper>
    </Box>,
  ]

  const getDisabled = (step) => {
    switch (step) {
      case 0: return false
      case 1: return false
      case 2: return false
      case 3: return false
      default: return false
    }
  }

  return (
    <Layout history={props.history} page="Enviar Pedido" user={props.user?.uid} blockGoBack={true}>
      <BaseWizard
        stepLabels={['Pedido', 'Envío', 'Pago', 'Confirmar']}
        steps={steps}
        activeStep={activeStep}
        onNext={() => setActiveStep((s) => s + 1)}
        onBack={() => setActiveStep((s) => s - 1)}
        onFinish={guardar}
        disabled={getDisabled(activeStep)}
        finishLabel="Enviar Pedido"
      />
      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(EnviarPedido)
