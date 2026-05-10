import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, TextField, Typography, Paper, Button, Grid, Backdrop,
  CircularProgress, Snackbar, Autocomplete
} from '@mui/material'
import { Alert } from '@mui/material'
import { pushData, updateData } from '../services'
import { ingresoCaja } from '../services/cajaService'
import { checkSearch, formatMoney, obtenerFecha } from '../utilities'
import { InlineChequeForm } from '../components/Cheques/InlineChequeForm'

const NuevoPagoCliente = (props) => {
  const nombre = checkSearch(props.history.location.search)
  const [selectedPago, setSelectedPago] = useState('noPagar')
  const [efectivo, setEfectivo] = useState('')
  const [ctaTransferencia, setCtaTransferencia] = useState('')
  const [montoTransferencia, setMontoTransferencia] = useState('')
  const [cheques, setCheques] = useState([])
  const [totalCheques, setTotalCheques] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const [showChequeForm, setShowChequeForm] = useState(false)

  const total = (parseFloat(efectivo || 0) || 0) + (parseFloat(montoTransferencia || 0) || 0) + (totalCheques || 0)
  const deuda = props.clientes?.[nombre]?.datos?.deuda || 0
  const restante = deuda - total

  const guardar = async () => {
    setLoading(true)
    try {
      const pago = {
        efectivo: efectivo || null, fecha: obtenerFecha(),
        cuentaTransferencia: ctaTransferencia || null, totalTransferencia: montoTransferencia || null,
        cheques: cheques.length ? cheques : null,
        pagado: total, total, deudaPasada: deuda, deudaActualizada: Math.max(0, restante),
      }
      await pushData(props.user.uid, `clientes/${nombre}/pagos`, pago)
      await updateData(props.user.uid, `clientes/${nombre}/datos`, { deuda: Math.max(0, restante) })

      // Caja: ingreso de efectivo
      if (parseFloat(efectivo || 0) > 0) {
        await ingresoCaja(props.user.uid, parseFloat(efectivo), `Pago de cliente ${nombre}`, `clientes/${nombre}`)
      }

      if (ctaTransferencia && montoTransferencia) {
        await pushData(props.user.uid, `CuentasBancarias/${ctaTransferencia}/ingresos`, {
          total: parseFloat(montoTransferencia), fecha: obtenerFecha(), concepto: `Pago de cliente ${nombre}`
        })
      }
      setSnack('Pago registrado')
      setTimeout(() => props.history.replace(`/Historial-Cliente?${nombre}`), 1500)
    } catch { setLoading(false) }
  }

  return (
    <Layout history={props.history} page={`Pago - ${nombre}`} user={props.user?.uid} blockGoBack={true}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Registrar pago — {nombre}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Deuda actual: <Box component="span" fontWeight={700} color={deuda > 0 ? 'error.main' : 'success.main'}>$ {formatMoney(deuda)}</Box>
        </Typography>

        {/* RESUMEN arriba */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={3}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">Efectivo</Typography>
              <Typography variant="h5" fontWeight={800}>$ {formatMoney(efectivo || 0)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">Transferencia</Typography>
              <Typography variant="h5" fontWeight={800}>$ {formatMoney(montoTransferencia || 0)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">Cheques</Typography>
              <Typography variant="h5" fontWeight={800}>$ {formatMoney(totalCheques)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center', borderColor: 'primary.main', borderWidth: 2 }}>
              <Typography variant="caption" color="text.secondary">Total</Typography>
              <Typography variant="h4" fontWeight={900} color="primary.main">$ {formatMoney(total)}</Typography>
              <Typography variant="caption" color={restante > 0 ? 'error.main' : 'success.main'} fontWeight={700}>
                {restante > 0 ? `Restan $ ${formatMoney(restante)}` : restante < 0 ? `Sobran $ ${formatMoney(Math.abs(restante))}` : '✓ Deuda cubierta'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* MÉTODOS — 4 en línea */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {[
            { key: 'noPagar', icon: '⏭️', label: 'No pagar', desc: 'No registra pago' },
            { key: 'efectivo', icon: '💵', label: 'Efectivo', desc: 'Pago en efectivo' },
            { key: 'transferencia', icon: '🏦', label: 'Transferencia', desc: 'Transferencia bancaria' },
            { key: 'cheques', icon: '📄', label: 'Cheques', desc: 'Cheques a cobrar' },
          ].map((opt) => (
            <Grid item xs={3} key={opt.key}>
              <Paper
                variant="outlined"
                onClick={() => {
                  setSelectedPago(opt.key)
                  if (opt.key === 'noPagar') { setEfectivo(''); setCtaTransferencia(''); setMontoTransferencia(''); setCheques([]); setTotalCheques(0) }
                }}
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

        {/* FORMULARIO SEGÚN MÉTODO */}
        {selectedPago === 'efectivo' && (
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mb: 2 }}>
            <TextField fullWidth label="Monto en efectivo ($)" type="number" value={efectivo}
              onChange={(e) => setEfectivo(e.target.value)} autoFocus />
          </Paper>
        )}

        {selectedPago === 'transferencia' && (
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={ctaTransferencia}
                  options={props.CuentasBancarias ? Object.keys(props.CuentasBancarias) : []}
                  getOptionLabel={(o) => o}
                  onChange={(_, v) => setCtaTransferencia(v || '')}
                  onInputChange={(_, v) => setCtaTransferencia(v || '')}
                  renderInput={(p) => <TextField {...p} label="Cuenta destino" fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Monto ($)" type="number" value={montoTransferencia}
                  onChange={(e) => setMontoTransferencia(e.target.value)} />
              </Grid>
            </Grid>
          </Paper>
        )}

        {selectedPago === 'cheques' && (
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mb: 2 }}>
            <InlineChequeForm show={showChequeForm} setShow={setShowChequeForm}
              datos={cheques} setdatos={setCheques} total={totalCheques} settotal={setTotalCheques}
              cliente={nombre} editIndex={-1} seteditIndex={() => {}} />
            {!showChequeForm && (
              <Button variant="contained" size="small" onClick={() => setShowChequeForm(true)}>Agregar cheque</Button>
            )}
          </Paper>
        )}

        {/* BOTÓN GUARDAR */}
        <Box sx={{ textAlign: 'right', mt: 3 }}>
          <Button variant="contained" size="large" onClick={guardar} disabled={selectedPago !== 'noPagar' && total === 0}
            sx={{ px: 4, py: 1.2 }}>
            {selectedPago === 'noPagar' ? 'Solo actualizar deuda' : `Registrar pago — $ ${formatMoney(total)}`}
          </Button>
        </Box>
      </Box>

      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}><Alert severity="success">{snack}</Alert></Snackbar>
    </Layout>
  )
}
export default withStore(NuevoPagoCliente)
