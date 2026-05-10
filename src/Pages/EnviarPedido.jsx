import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Paper, Button, TextField,
  Backdrop, CircularProgress, Snackbar, Autocomplete,
  Table, TableHead, TableBody, TableRow, TableCell, Avatar,
  Collapse, Chip, FormControlLabel, Switch
} from '@mui/material'
import { Alert } from '@mui/material'

import { BaseWizard } from '../components/BaseWizard'
import { pushData, updateData, removeData, setData, getPushKey } from '../services'
import { ingresoCaja } from '../services/cajaService'
import { formatMoney, obtenerFecha } from '../utilities'
import { InlineChequeForm } from '../components/Cheques/InlineChequeForm'
import { InlineTransferenciaForm } from '../components/InlineTransferenciaForm'

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
  const allExpresos = props.expresos ? Object.keys(props.expresos) : []

  // Envío
  const [usarExpreso, setUsarExpreso] = useState(false)
  const [expreso, setExpreso] = useState('')
  const [remito, setRemito] = useState('')
  const [precioEnvio, setPrecioEnvio] = useState(0)

  // Pago
  const [efectivo, setEfectivo] = useState('')
  const [transferencias, setTransferencias] = useState([])
  const [totalTransferencias, setTotalTransferencias] = useState(0)
  const [cheques, setCheques] = useState([])
  const [totalCheques, setTotalCheques] = useState(0)
  const [showChequeForm, setShowChequeForm] = useState(false)
  const [showTransfForm, setShowTransfForm] = useState(false)
  const [transfEditIdx, setTransfEditIdx] = useState(-1)
  const [agregarCostoEnvio, setAgregarCostoEnvio] = useState(false)
  const [selectedPago, setSelectedPago] = useState('noPagar')

  const totalEnvio = usarExpreso && agregarCostoEnvio && precioEnvio ? parseFloat(precioEnvio) : 0
  const totalPagado = (parseFloat(efectivo || 0) || 0) + (totalTransferencias || 0) + (totalCheques || 0)
  const totalAdeudado = (orderTotal + totalEnvio) - totalPagado

  const resetPago = () => { setEfectivo(''); setTransferencias([]); setTotalTransferencias(0); setCheques([]); setTotalCheques(0) }

  const guardar = async () => {
    setLoading(true)
    const aux = {
      fecha: obtenerFecha(), cliente: clienteNombre,
      articulos: pedido?.productos || pedido?.articulos || [],
      metodoDePago: {
        facturacion: facturacion || null,
        efectivo: efectivo || null,
        transferencias: transferencias.length ? transferencias : null,
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

      // Caja: ingreso de efectivo
      if (parseFloat(efectivo || 0) > 0) {
        await ingresoCaja(props.user.uid, parseFloat(efectivo), `Pago de pedido - ${clienteNombre}`, `pedidos/${id}`)
      }

      // Transferencias bancarias
      for (const t of transferencias) {
        await pushData(props.user.uid, `CuentasBancarias/${t.cuenta}/ingresos`, {
          fecha: obtenerFecha(), tipo: 'transferencia', total: parseFloat(t.monto),
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
      <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ mb: 2 }}>Resumen del pedido</Typography>

      {/* Cliente + Total */}
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Cliente</Typography>
            <Typography variant="h6" fontWeight={700}>{clienteNombre}</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">Total del pedido</Typography>
            <Typography variant="h4" fontWeight={900} color="primary.main">$ {formatMoney(orderTotal)}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Artículos — tabla con fotos */}
      {articulos.length > 0 && (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" fontWeight={600}>{articulos.length} artículo(s)</Typography>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell align="right">Cant.</TableCell>
                <TableCell align="right">P. unitario</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articulos.map((art, i) => {
                const prodData = props.productos?.[art.producto || art.nombre]
                return (
                  <TableRow key={i} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {prodData?.imagen ? (
                          <Avatar src={prodData.imagen} variant="rounded" sx={{ width: 32, height: 32 }} />
                        ) : null}
                        <Typography variant="body2" fontWeight={500}>{art.nombre || art.producto}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{art.cantidad}</TableCell>
                    <TableCell align="right">$ {formatMoney(art.precio || 0)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>$ {formatMoney((art.cantidad || 0) * (art.precio || 0))}</TableCell>
                  </TableRow>
                )
              })}
              <TableRow>
                <TableCell colSpan={3} align="right" sx={{ fontWeight: 700, py: 1.5 }}>Total</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: 'primary.main', fontSize: 16, py: 1.5 }}>$ {formatMoney(orderTotal)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Método de envío</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper variant="outlined" onClick={() => { setUsarExpreso(false); setExpreso(''); setRemito(''); setPrecioEnvio(0) }}
            sx={{
              p: 2, borderRadius: 2, textAlign: 'center', cursor: 'pointer',
              borderColor: !usarExpreso ? 'primary.main' : 'divider',
              bgcolor: !usarExpreso ? 'action.selected' : 'transparent',
              transition: '0.15s', '&:hover': { borderColor: 'primary.light' },
            }}>
            <Typography variant="body2" fontWeight={600}>🚚 Particular</Typography>
            <Typography variant="caption" color="text.secondary">El cliente retira o coordina</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper variant="outlined" onClick={() => setUsarExpreso(true)}
            sx={{
              p: 2, borderRadius: 2, textAlign: 'center', cursor: 'pointer',
              borderColor: usarExpreso ? 'primary.main' : 'divider',
              bgcolor: usarExpreso ? 'action.selected' : 'transparent',
              transition: '0.15s', '&:hover': { borderColor: 'primary.light' },
            }}>
            <Typography variant="body2" fontWeight={600}>📦 Expreso</Typography>
            <Typography variant="caption" color="text.secondary">Envío por transportista</Typography>
          </Paper>
        </Grid>
      </Grid>
      {usarExpreso && (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete value={expreso} options={allExpresos} getOptionLabel={(o) => o}
                onChange={(_, v) => setExpreso(v || '')} onInputChange={(_, v) => setExpreso(v || '')}
                renderInput={(p) => <TextField {...p} label="Seleccionar expreso" fullWidth />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="N° de remito" value={remito} onChange={(e) => setRemito(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Switch checked={agregarCostoEnvio} onChange={(e) => { setAgregarCostoEnvio(e.target.checked); if (!e.target.checked) setPrecioEnvio(0) }} />}
                label="Agregar costo de envío"
                sx={{ mb: 1 }}
              />
              <Collapse in={agregarCostoEnvio}>
                <TextField fullWidth label="Costo de envío ($)" type="number" value={precioEnvio}
                  onChange={(e) => setPrecioEnvio(parseFloat(e.target.value) || 0)} />
              </Collapse>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>,

    <Box>
      {/* TOTALS BAR — RESUMEN arriba como NuevoPago */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Efectivo</Typography>
            <Typography variant="h5" fontWeight={800}>$ {formatMoney(efectivo || 0)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Transferencias</Typography>
            <Typography variant="h5" fontWeight={800}>$ {formatMoney(totalTransferencias)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Cheques</Typography>
            <Typography variant="h5" fontWeight={800}>$ {formatMoney(totalCheques)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, textAlign: 'center', borderColor: 'primary.main', borderWidth: 2 }}>
            <Typography variant="h3" fontWeight={900} color="primary.main">$ {formatMoney(totalPagado)}</Typography>
            {totalAdeudado > 0 && (
              <Typography variant="body1" color="error.main" fontWeight={700}>
                +$ {formatMoney(totalAdeudado)} a deuda
              </Typography>
            )}
            {totalAdeudado === 0 && totalPagado > 0 && (
              <Typography variant="body1" color="success.main" fontWeight={700}>✓ Pagado completo</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* MÉTODOS DE PAGO */}
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        {[
          { key: 'efectivo', icon: '💵', label: 'Efectivo', desc: 'Pago en efectivo' },
          { key: 'transferencia', icon: '🏦', label: 'Transferencia', desc: 'Transferencia bancaria' },
          { key: 'cheques', icon: '📄', label: 'Cheques', desc: 'Cheques a cobrar' },
          { key: 'noPagar', icon: '⏭️', label: 'No pagar', desc: 'No registra pago' },
        ].map((opt) => (
          <Grid item xs={3} key={opt.key}>
            <Paper variant="outlined"
              onClick={() => { setSelectedPago(opt.key); if (opt.key === 'noPagar') resetPago() }}
              sx={{
                py: 2, px: 1, borderRadius: 2, textAlign: 'center', cursor: 'pointer',
                borderColor: selectedPago === opt.key ? 'primary.main' : 'divider',
                borderWidth: selectedPago === opt.key ? 2 : 1,
                bgcolor: selectedPago === opt.key ? 'action.selected' : 'transparent',
                transition: '0.15s', '&:hover': { borderColor: 'primary.light' },
              }}
            >
              <Typography variant="h4" sx={{ mb: 0.5 }}>{opt.icon}</Typography>
              <Typography variant="body2" fontWeight={600}>{opt.label}</Typography>
              <Typography variant="caption" color="text.secondary" display="block">{opt.desc}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* FORM SEGÚN MÉTODO */}
      {selectedPago === 'efectivo' && (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
          <TextField fullWidth label="Monto en efectivo ($)" type="number" value={efectivo}
            onChange={(e) => setEfectivo(e.target.value)} autoFocus />
        </Paper>
      )}

      {selectedPago === 'transferencia' && (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>Transferencias bancarias</Typography>
          <InlineTransferenciaForm show={showTransfForm} setShow={setShowTransfForm}
            datos={transferencias} setdatos={setTransferencias}
            editIndex={transfEditIdx} seteditIndex={setTransfEditIdx}
            total={totalTransferencias} settotal={setTotalTransferencias}
            cuentasBancarias={props.CuentasBancarias} />
          {!showTransfForm && (
            <Button variant="contained" size="small" onClick={() => setShowTransfForm(true)}>+ Agregar transferencia</Button>
          )}
        </Paper>
      )}

      {selectedPago === 'cheques' && (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>Cheques de terceros</Typography>
          <InlineChequeForm show={showChequeForm} setShow={setShowChequeForm}
            datos={cheques} setdatos={setCheques} total={totalCheques} settotal={setTotalCheques}
            cliente={clienteNombre} editIndex={-1} seteditIndex={() => {}} />
          {!showChequeForm && (
            <Button variant="contained" size="small" onClick={() => setShowChequeForm(true)} sx={{ mt: 1 }}>+ Agregar cheque</Button>
          )}
        </Paper>
      )}
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Confirmar y enviar pedido</Typography>
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Datos del pedido</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Cliente</Typography>
            <Typography variant="body2" fontWeight={600}>{clienteNombre}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Total pedido</Typography>
            <Typography variant="body2" fontWeight={700}>$ {formatMoney(orderTotal)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Envío</Typography>
            <Typography variant="body2" fontWeight={500}>
              {usarExpreso && expreso ? `${expreso} (+$${formatMoney(precioEnvio)})` : 'Particular (sin costo)'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Resumen de pagos</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Efectivo</Typography>
            <Typography variant="body2" fontWeight={500}>$ {formatMoney(efectivo || 0)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Transferencia</Typography>
            <Typography variant="body2" fontWeight={500}>$ {formatMoney(totalTransferencias)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Cheques ({cheques.length})</Typography>
            <Typography variant="body2" fontWeight={500}>$ {formatMoney(totalCheques)}</Typography>
          </Box>
        </Box>

        <Box sx={{ px: 2.5, py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography variant="body1" fontWeight={700}>Total a pagar</Typography>
            <Typography variant="h6" fontWeight={800} color="primary.main">
              $ {formatMoney(totalPagado)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">Restante</Typography>
            {totalAdeudado > 0 ? (
              <Typography variant="body2" fontWeight={700} color="error.main">
                $ {formatMoney(totalAdeudado)} → a deuda
              </Typography>
            ) : totalAdeudado === 0 && totalPagado > 0 ? (
              <Typography variant="body2" fontWeight={700} color="success.main">✓ Pagado completo</Typography>
            ) : (
              <Typography variant="body2" fontWeight={500} color="text.secondary">$0 → a deuda</Typography>
            )}
          </Box>
        </Box>
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
