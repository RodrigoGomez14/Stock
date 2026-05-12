import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Paper, Button, TextField, Backdrop,
  CircularProgress, Snackbar, Chip, Divider, FormControlLabel, Switch
} from '@mui/material'
import { Alert } from '@mui/material'
import { BaseWizard } from '../components/BaseWizard'
import { pushData, updateData, removeData, setData, getPushKey } from '../services'
import { ingresoCaja } from '../services/cajaService'
import { formatMoney, obtenerFecha, getProducto } from '../utilities'
import { ChequesSelection } from '../components/Cheques/ChequesSelection'
import { InlineChequePersonalForm } from '../components/Cheques/InlineChequePersonalForm'
import { InlineTransferenciaForm } from '../components/InlineTransferenciaForm'

const FinalizarProceso = (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')

  const id = location.search.slice(1)
  const cadena = props.cadenasActivas?.[id]
  const procesos = cadena?.procesos || []
  const stepIndex = procesos.findIndex((p) => p.fechaDeInicio && !p.fechaDeEntrega)
  const proceso = procesos[stepIndex] || {}
  const proveedorNombre = proceso.proveedor || ''
  const proveedorData = props.proveedores?.[proveedorNombre]

  const [precio, setPrecio] = useState('')
  const [cantidad, setCantidad] = useState(cadena?.cantidad || '')
  const [facturacion, setFacturacion] = useState(false)

  // Payment
  const [selectedPago, setSelectedPago] = useState('noPagar')
  const [efectivo, setEfectivo] = useState('')
  const [transferencias, setTransferencias] = useState([])
  const [totalTransferencias, setTotalTransferencias] = useState(0)
  const [cheques, setCheques] = useState([])
  const [totalCheques, setTotalCheques] = useState(0)
  const [cheqPers, setCheqPers] = useState([])
  const [totalCheqPers, setTotalCheqPers] = useState(0)
  const [showChequePersForm, setShowChequePersForm] = useState(false)
  const [showTransfForm, setShowTransfForm] = useState(false)
  const [transfEditIdx, setTransfEditIdx] = useState(-1)

  const totalPagado = (parseFloat(efectivo || 0) || 0) + (totalTransferencias || 0) + (totalCheques || 0) + (totalCheqPers || 0)
  const precioNum = parseFloat(precio || 0)
  const restante = precioNum - totalPagado

  const resetPago = () => {
    setEfectivo(''); setTransferencias([]); setTotalTransferencias(0)
    setCheques([]); setTotalCheques(0); setCheqPers([]); setTotalCheqPers(0)
  }

  const toggleCheque = (key) => {
    if (!props.cheques?.[key]) return
    const idx = cheques.indexOf(key)
    const copy = [...cheques]
    if (idx !== -1) {
      copy.splice(idx, 1)
      setTotalCheques((t) => t - parseFloat(props.cheques[key].valor || 0))
    } else {
      copy.push(key)
      setTotalCheques((t) => t + parseFloat(props.cheques[key].valor || 0))
    }
    setCheques(copy)
  }

  const guardar = async () => {
    setLoading(true)
    try {
      const cant = parseInt(cantidad || 0, 10)
      const unitPrice = precioNum / (cant || 1)

      // Mark third-party cheques as used
      const chequesUsados = []
      for (const ch of cheques) {
        const chData = props.cheques?.[ch]
        if (chData) {
          await updateData(props.user.uid, `cheques/${ch}`, { destinatario: proveedorNombre, egreso: obtenerFecha() })
          chequesUsados.push(chData.numero || ch)
        }
      }

      // Save personal cheques
      const cheqPersData = []
      for (const cp of cheqPers) {
        const item = { ...cp, egreso: obtenerFecha(), destinatario: proveedorNombre }
        await pushData(props.user.uid, 'chequesPersonales', item)
        cheqPersData.push(item)
      }

      // Update supplier debt
      const deudaPasada = proveedorData?.datos?.deuda || 0
      const nuevaDeuda = restante > 0 ? deudaPasada + restante : Math.max(0, deudaPasada + restante)
      await updateData(props.user.uid, `proveedores/${proveedorNombre}/datos`, { deuda: nuevaDeuda })

      // Build the entrega/compra record
      const entregaKey = getPushKey(props.user.uid, `proveedores/${proveedorNombre}/entregas`)
      const entrega = {
        fecha: obtenerFecha(),
        proveedor: proveedorNombre,
        articulos: [{
          cantidad: cant,
          precio: unitPrice,
          producto: cadena.producto,
          total: precioNum,
        }],
        metodoDePago: {
          efectivo: efectivo || null,
          transferencias: transferencias.length ? transferencias : null,
          cheques: chequesUsados.length ? chequesUsados : null,
          chequesPersonales: cheqPersData.length ? cheqPersData : null,
          fecha: obtenerFecha(),
          total: totalPagado || null,
          deudaPasada,
          deudaActualizada: nuevaDeuda,
          pagado: totalPagado,
          adeudado: restante > 0 ? restante : 0,
        },
        metodoDeEnvio: 'Particular',
        total: precioNum,
      }

      // Push to compras
      await pushData(props.user.uid, 'compras', { ...entrega, idEntrega: entregaKey })

      // Push payment to supplier history
      await pushData(props.user.uid, `proveedores/${proveedorNombre}/pagos`, {
        ...entrega.metodoDePago, idEntrega: entregaKey,
      })

      // Save full entregas record
      await setData(props.user.uid, `proveedores/${proveedorNombre}/entregas/${entregaKey}`, entrega)

      // Caja: egreso de efectivo
      if (parseFloat(efectivo || 0) > 0) {
        await ingresoCaja(props.user.uid, -parseFloat(efectivo), `Pago a proveedor ${proveedorNombre} - ${cadena.producto}`, `cadenasActivas/${id}`)
      }

      // Bank transfers
      for (const t of transferencias) {
        await pushData(props.user.uid, `CuentasBancarias/${t.cuenta}/egresos`, {
          fecha: obtenerFecha(), tipo: 'transferencia', total: parseFloat(t.monto),
          concepto: `Pago a proveedor ${proveedorNombre} - ${cadena.producto}`,
        })
      }

      // Update production chain
      const updatedProcesos = [...procesos]
      updatedProcesos[stepIndex] = {
        ...proceso,
        fechaDeEntrega: obtenerFecha(),
        idEntrega: entregaKey,
        precio: precioNum,
      }
      const updatedCadena = { ...cadena, procesos: updatedProcesos }

      // If last step: increase product stock, decrease subproducts
      if (stepIndex === procesos.length - 1) {
        // Increase product
        const prodActual = parseInt(getProducto(props.productos, cadena.producto)?.cantidad || 0, 10)
        await updateData(props.user.uid, `productos/${cadena.producto}`, { cantidad: prodActual + cant })
        await pushData(props.user.uid, `productos/${cadena.producto}/historialDeStock`, {
          cantidad: prodActual + cant, fecha: obtenerFecha(),
        })

        // Decrease subproducts
        const subproductos = getProducto(props.productos, cadena.producto)?.subproductos
        if (subproductos) {
          for (const sp of subproductos) {
            const spActual = parseInt(getProducto(props.productos, sp.nombre)?.cantidad || 0, 10)
            const spDescuento = cant * parseInt(sp.cantidad || 1, 10)
            await updateData(props.user.uid, `productos/${sp.nombre}`, { cantidad: Math.max(0, spActual - spDescuento) })
            await pushData(props.user.uid, `productos/${sp.nombre}/historialDeStock`, {
              cantidad: Math.max(0, spActual - spDescuento), fecha: obtenerFecha(),
            })
          }
        }

        // Save to historial de cadenas
        await pushData(props.user.uid, `productos/${cadena.producto}/historialDeCadenas`, updatedCadena)
      }

      // Update or remove cadena activa
      if (stepIndex === procesos.length - 1 && cant >= parseInt(cadena.cantidad || 0, 10)) {
        await removeData(props.user.uid, `cadenasActivas/${id}`)
      } else if (stepIndex === procesos.length - 1 && cant < parseInt(cadena.cantidad || 0, 10)) {
        const remainder = { ...cadena }
        remainder.cantidad = cadena.cantidad - cant
        remainder.procesos[stepIndex].fechaDeInicio = null
        remainder.procesos[stepIndex].fechaDeEntrega = null
        remainder.procesos[stepIndex].idEntrega = null
        remainder.procesos[stepIndex].precio = null
        await updateData(props.user.uid, `cadenasActivas/${id}`, remainder)
      } else {
        await updateData(props.user.uid, `cadenasActivas/${id}`, updatedCadena)
      }

      setSnack('Proceso finalizado correctamente')
      setTimeout(() => navigate('/Cadenas-De-Produccion', { replace: true }), 1500)
    } catch {
      setLoading(false)
    }
  }

  if (!cadena) {
    return (
      <Layout history={props.history} page="Finalizar Proceso" user={props.user?.uid}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography>Cadena no encontrada</Typography>
        </Box>
      </Layout>
    )
  }

  const steps = [
    // Step 1: Detalles
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ mb: 2 }}>Detalles del proceso</Typography>

      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Producto</Typography>
            <Typography variant="body1" fontWeight={700}>{cadena.producto}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Proveedor</Typography>
            <Typography variant="body1" fontWeight={700}>{proveedorNombre}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Paso actual</Typography>
            <Typography variant="body1" fontWeight={500}>{proceso.nombre || `Paso ${stepIndex + 1}`}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Cantidad planificada</Typography>
            <Typography variant="body1" fontWeight={500}>{cadena.cantidad} unidad(es)</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" fontWeight={600} gutterBottom>Cantidad recibida</Typography>
            <TextField fullWidth type="number" value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              InputProps={{ inputProps: { min: 1 } }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" fontWeight={600} gutterBottom>Precio final ($)</Typography>
            <TextField fullWidth type="number" value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }} />
          </Grid>
        </Grid>
        {precioNum > 0 && parseFloat(cantidad || 0) > 0 && (
          <Box sx={{ mt: 1.5, textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              Precio unitario: $ {formatMoney(precioNum / parseFloat(cantidad))}
            </Typography>
          </Box>
        )}
        <Divider sx={{ my: 2 }} />
        <FormControlLabel
          control={<Switch checked={facturacion} onChange={(e) => setFacturacion(e.target.checked)} />}
          label={
            <Box>
              <Typography variant="body2" fontWeight={600}>Facturar a nombre de la empresa</Typography>
              <Typography variant="caption" color="text.secondary">El gasto se registrará en IVA Compras</Typography>
            </Box>
          }
        />
      </Paper>
    </Box>,

    // Step 2: Pago
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={3}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Efectivo</Typography>
            <Typography variant="h5" fontWeight={800}>$ {formatMoney(efectivo || 0)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Transferencias</Typography>
            <Typography variant="h5" fontWeight={800}>$ {formatMoney(totalTransferencias)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Cheques</Typography>
            <Typography variant="h5" fontWeight={800}>$ {formatMoney(totalCheques)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Ch. Personales</Typography>
            <Typography variant="h5" fontWeight={800}>$ {formatMoney(totalCheqPers)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, textAlign: 'center', borderColor: 'primary.main', borderWidth: 2 }}>
            <Typography variant="h3" fontWeight={900} color="primary.main">$ {formatMoney(totalPagado)}</Typography>
            <Typography variant="body1" color={restante > 0 ? 'error.main' : 'success.main'} fontWeight={700}>
              {restante > 0 ? `Restan $ ${formatMoney(restante)} a deuda` : restante < 0 ? `Sobran $ ${formatMoney(Math.abs(restante))}` : '✓ Pagado completo'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        {[
          { key: 'efectivo', icon: '💵', label: 'Efectivo', desc: 'Pago en efectivo' },
          { key: 'transferencia', icon: '🏦', label: 'Transferencia', desc: 'Transferencia bancaria' },
          { key: 'cheques', icon: '📄', label: 'Cheques', desc: 'Cheques de terceros' },
          { key: 'cheqPers', icon: '✍️', label: 'Ch. Personal', desc: 'Cheques personales' },
          { key: 'noPagar', icon: '⏭️', label: 'No pagar', desc: 'No registra pago' },
        ].map((opt) => (
          <Grid item xs={opt.key === 'noPagar' ? 2.4 : 2.4} key={opt.key} sx={{ flex: '0 0 20%' }}>
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
          <Typography variant="body2" fontWeight={600} gutterBottom>Cheques de terceros disponibles</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Seleccioná los cheques que tenés en tu poder para entregar como pago.
          </Typography>
          {props.cheques && Object.keys(props.cheques).some((k) => !props.cheques[k].egreso && !props.cheques[k].destinatario && !props.cheques[k].dadoDeBaja) ? (
            <ChequesSelection chequesList={props.cheques} cheques={cheques} addCheque={toggleCheque} />
          ) : (
            <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic', py: 2, textAlign: 'center' }}>
              No hay cheques disponibles en tu poder.
            </Typography>
          )}
          {cheques.length > 0 && (
            <Box sx={{ mt: 1.5, textAlign: 'right' }}>
              <Typography variant="body2" fontWeight={700}>
                Total seleccionado: $ {formatMoney(totalCheques)}
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {selectedPago === 'cheqPers' && (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>Cheques personales</Typography>
          <InlineChequePersonalForm show={showChequePersForm} setShow={setShowChequePersForm}
            listaChequesPersonales={cheqPers} setListaChequesPersonales={setCheqPers}
            totalChequesPersonales={totalCheqPers} setTotalChequesPersonales={setTotalCheqPers}
            cliente={proveedorNombre} editIndex={-1} seteditIndex={() => {}} />
          {!showChequePersForm && (
            <Button variant="contained" size="small" onClick={() => setShowChequePersForm(true)}>+ Agregar cheque personal</Button>
          )}
        </Paper>
      )}
    </Box>,

    // Step 3: Confirmar
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Confirmar y finalizar proceso</Typography>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Proceso</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Producto</Typography>
            <Typography variant="body2" fontWeight={600}>{cadena.producto}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Proveedor</Typography>
            <Typography variant="body2" fontWeight={600}>{proveedorNombre}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Paso</Typography>
            <Typography variant="body2" fontWeight={500}>{proceso.nombre || `Paso ${stepIndex + 1}`}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Cantidad</Typography>
            <Typography variant="body2" fontWeight={700}>{cantidad} unidad(es)</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Total</Typography>
            <Typography variant="body2" fontWeight={700}>$ {formatMoney(precioNum)}</Typography>
          </Box>
        </Box>

        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Resumen de pagos</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Efectivo</Typography>
            <Typography variant="body2" fontWeight={500}>$ {formatMoney(efectivo || 0)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Transferencias</Typography>
            <Typography variant="body2" fontWeight={500}>$ {formatMoney(totalTransferencias)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Cheques ({cheques.length})</Typography>
            <Typography variant="body2" fontWeight={500}>$ {formatMoney(totalCheques)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Ch. Personales ({cheqPers.length})</Typography>
            <Typography variant="body2" fontWeight={500}>$ {formatMoney(totalCheqPers)}</Typography>
          </Box>
        </Box>

        <Box sx={{ px: 2.5, py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography variant="body1" fontWeight={700}>Total pagado</Typography>
            <Typography variant="h6" fontWeight={800} color="primary.main">$ {formatMoney(totalPagado)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">Restante</Typography>
            {restante > 0 ? (
              <Typography variant="body2" fontWeight={700} color="error.main">$ {formatMoney(restante)} → a deuda</Typography>
            ) : restante === 0 && totalPagado > 0 ? (
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
      case 0: return !precio || !cantidad || parseFloat(precio) <= 0 || parseInt(cantidad) <= 0
      case 1: return false
      case 2: return false
      default: return false
    }
  }

  return (
    <Layout history={props.history} page="Finalizar Proceso" user={props.user?.uid} blockGoBack={true}>
      <BaseWizard
        stepLabels={['Detalles', 'Pago', 'Confirmar']}
        steps={steps}
        activeStep={activeStep}
        onNext={() => setActiveStep((s) => s + 1)}
        onBack={() => setActiveStep((s) => s - 1)}
        onFinish={guardar}
        disabled={getDisabled(activeStep)}
        finishLabel="Finalizar Proceso"
      />
      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(FinalizarProceso)
