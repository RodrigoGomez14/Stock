import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Paper, Button, TextField, Backdrop,
  CircularProgress, Snackbar, Chip, Divider, FormControlLabel, Switch
} from '@mui/material'
import { Alert } from '@mui/material'
import { BaseWizard } from '../components/BaseWizard'
import { pushData, updateData, removeData, getPushKey } from '../services'
import { egresoCaja } from '../services/cajaService'
import { formatMoney, obtenerFecha, getProducto } from '../utilities'
import { ChequesSelection } from '../components/Cheques/ChequesSelection'
import { InlineChequePersonalForm } from '../components/Cheques/InlineChequePersonalForm'
import { InlineTransferenciaForm } from '../components/InlineTransferenciaForm'

const RecibirEntrega = (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')

  const id = location.search.slice(1)
  const entrega = props.entregas?.[id]
  const proveedorNombre = entrega?.proveedor || ''
  const proveedorData = props.proveedores?.[proveedorNombre]
  const articulos = entrega ? (entrega.productos || entrega.articulos || []) : []
  const orderTotal = entrega?.total || 0

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
  const restante = orderTotal - totalPagado

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
    if (!entrega) return
    setLoading(true)
    try {
      // Increase product stock
      for (const art of articulos) {
        const prodName = art.producto || art.nombre
        if (getProducto(props.productos, prodName)) {
          const actual = parseInt(getProducto(props.productos, prodName)?.cantidad || 0, 10)
          await updateData(props.user.uid, `productos/${prodName}`, { cantidad: actual + parseInt(art.cantidad || 1, 10) })
          await pushData(props.user.uid, `productos/${prodName}/historialDeStock`, {
            cantidad: actual + parseInt(art.cantidad || 1, 10), fecha: obtenerFecha(),
          })
        }
      }

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

      // Build compra record
      const entregaKey = getPushKey(props.user.uid, `proveedores/${proveedorNombre}/entregas`)
      const compra = {
        fecha: obtenerFecha(),
        proveedor: proveedorNombre,
        articulos,
        metodoDePago: {
          facturacion: facturacion || null,
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
        total: orderTotal,
      }

      // Save to compras
      await pushData(props.user.uid, 'compras', { ...compra, idEntrega: entregaKey })

      // Push payment to supplier history
      await pushData(props.user.uid, `proveedores/${proveedorNombre}/pagos`, {
        ...compra.metodoDePago, idEntrega: entregaKey,
      })

      // Save full entrega record
      await updateData(props.user.uid, `proveedores/${proveedorNombre}/entregas/${entregaKey}`, compra)

      // Caja: egreso de efectivo
      if (parseFloat(efectivo || 0) > 0) {
        await egresoCaja(props.user.uid, parseFloat(efectivo), `Pago a proveedor ${proveedorNombre}`, `entregas/${id}`)
      }

      // Bank transfers
      for (const t of transferencias) {
        await pushData(props.user.uid, `CuentasBancarias/${t.cuenta}/egresos`, {
          fecha: obtenerFecha(), tipo: 'transferencia', total: parseFloat(t.monto),
          concepto: `Pago a proveedor ${proveedorNombre}`,
        })
      }

      // Remove entrega from list
      await removeData(props.user.uid, `entregas/${id}`)

      setSnack('Entrega recibida correctamente')
      await new Promise(r => setTimeout(r, 1500))
      navigate('/Entregas', { replace: true })
    } catch (e) {
      setSnack('Error: ' + (e?.message || ''))
      setLoading(false)
    }
  }

  if (!entrega) {
    return (
      <Layout history={props.history} page="Recibir Entrega" user={props.user?.uid}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography>Entrega no encontrada</Typography>
        </Box>
      </Layout>
    )
  }

  const steps = [
    // Step 1: Detalles
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ mb: 2 }}>Detalles de la entrega</Typography>

      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Proveedor</Typography>
            <Typography variant="h6" fontWeight={700}>{proveedorNombre}</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">Total</Typography>
            <Typography variant="h4" fontWeight={900} color="primary.main">$ {formatMoney(orderTotal)}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600}>{articulos.length} artículo(s)</Typography>
        </Box>
        {articulos.map((art, i) => (
          <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', px: 2.5, py: 1.5, borderBottom: i < articulos.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600}
                component={Link} to={`/Producto?${encodeURIComponent(art.producto || art.nombre)}`}
                sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' } }}>
                {art.producto || art.nombre}
              </Typography>
              <Typography variant="caption" color="text.disabled">{art.cantidad}u × $ {formatMoney(art.precio || 0)}</Typography>
            </Box>
            <Typography variant="body2" fontWeight={700}>
              $ {formatMoney((art.cantidad || 0) * (art.precio || 0))}
            </Typography>
          </Box>
        ))}
      </Paper>

      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mt: 2 }}>
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
              {restante > 0 ? `Restan $ ${formatMoney(restante)} a deuda` : '✓ Pagado completo'}
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
          {props.cheques && Object.keys(props.cheques).some((k) => !props.cheques[k].egreso && !props.cheques[k].destinatario && !props.cheques[k].dadoDeBaja) ? (
            <ChequesSelection chequesList={props.cheques} cheques={cheques} addCheque={toggleCheque} />
          ) : (
            <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic', py: 2, textAlign: 'center' }}>
              No hay cheques disponibles.
            </Typography>
          )}
          {cheques.length > 0 && (
            <Box sx={{ mt: 1.5, textAlign: 'right' }}>
              <Typography variant="body2" fontWeight={700}>Total: $ {formatMoney(totalCheques)}</Typography>
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
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Confirmar y recibir entrega</Typography>
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Entrega</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Proveedor</Typography>
            <Typography variant="body2" fontWeight={600}>{proveedorNombre}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Productos</Typography>
            <Typography variant="body2" fontWeight={600}>{articulos.length}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
            <Typography variant="body2" color="text.secondary">Total</Typography>
            <Typography variant="body2" fontWeight={700}>$ {formatMoney(orderTotal)}</Typography>
          </Box>
          {facturacion && <Chip size="small" label="Facturado (IVA Compras)" color="warning" variant="outlined" sx={{ mt: 0.5 }} />}
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
    if (loading) return true
    return false
  }

  return (
    <Layout history={props.history} page="Recibir Entrega" user={props.user?.uid} blockGoBack={true}>
      <BaseWizard
        stepLabels={['Detalles', 'Pago', 'Confirmar']}
        steps={steps}
        activeStep={activeStep}
        onNext={() => setActiveStep((s) => s + 1)}
        onBack={() => setActiveStep((s) => s - 1)}
        onFinish={guardar}
        disabled={getDisabled(activeStep)}
        finishLabel="Recibir Entrega"
      />
      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity={snack?.includes('Error') ? 'error' : 'success'}>{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(RecibirEntrega)
