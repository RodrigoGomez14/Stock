import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, TextField, Typography, Paper, Button, Grid, Backdrop,
  CircularProgress, Snackbar
} from '@mui/material'
import { Alert } from '@mui/material'
import { pushData, updateData } from '../services'
import { ingresoCaja } from '../services/cajaService'
import { checkSearch, formatMoney, obtenerFecha } from '../utilities'
import { InlineChequeForm } from '../components/Cheques/InlineChequeForm'
import { InlineChequePersonalForm } from '../components/Cheques/InlineChequePersonalForm'
import { InlineTransferenciaForm } from '../components/InlineTransferenciaForm'

const NuevoPagoProveedor = (props) => {
  const nombre = checkSearch(props.history.location.search)
  const [selectedPago, setSelectedPago] = useState('noPagar')
  const [efectivo, setEfectivo] = useState('')
  const [transferencias, setTransferencias] = useState([])
  const [totalTransferencias, setTotalTransferencias] = useState(0)
  const [cheques, setCheques] = useState([])
  const [totalCheques, setTotalCheques] = useState(0)
  const [cheqPers, setCheqPers] = useState([])
  const [totalCheqPers, setTotalCheqPers] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const [showChequeForm, setShowChequeForm] = useState(false)
  const [showChequePersForm, setShowChequePersForm] = useState(false)
  const [showTransfForm, setShowTransfForm] = useState(false)
  const [transfEditIdx, setTransfEditIdx] = useState(-1)

  const total = (parseFloat(efectivo || 0) || 0) + (totalTransferencias || 0) + (totalCheques || 0) + (totalCheqPers || 0)
  const deuda = props.proveedores?.[nombre]?.datos?.deuda || 0
  const restante = deuda - total

  const guardar = async () => {
    setLoading(true)
    try {
      const pago = {
        efectivo: efectivo || null, fecha: obtenerFecha(),
        transferencias: transferencias.length ? transferencias : null,
        cheques: cheques.length ? cheques : null,
        chequesPersonales: cheqPers.length ? cheqPers : null,
        pagado: total, total, deudaPasada: deuda, deudaActualizada: Math.max(0, restante),
      }
      await pushData(props.user.uid, `proveedores/${nombre}/pagos`, pago)
      await updateData(props.user.uid, `proveedores/${nombre}/datos`, { deuda: Math.max(0, restante) })

      if (parseFloat(efectivo || 0) > 0) {
        await ingresoCaja(props.user.uid, parseFloat(efectivo), `Pago a proveedor ${nombre}`, `proveedores/${nombre}`)
      }

      for (const t of transferencias) {
        await pushData(props.user.uid, `CuentasBancarias/${t.cuenta}/egresos`, {
          total: parseFloat(t.monto), fecha: obtenerFecha(), concepto: `Pago a proveedor ${nombre}`
        })
      }
      setSnack('Pago registrado')
      setTimeout(() => props.history.replace(`/Historial-Proveedor?${nombre}`), 1500)
    } catch { setLoading(false) }
  }

  const resetPago = () => { setEfectivo(''); setTransferencias([]); setTotalTransferencias(0); setCheques([]); setTotalCheques(0); setCheqPers([]); setTotalCheqPers(0) }

  return (
    <Layout history={props.history} page={`Pago - ${nombre}`} user={props.user?.uid} blockGoBack={true}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Registrar pago — {nombre}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Deuda actual: <Box component="span" fontWeight={700} color={deuda > 0 ? 'error.main' : 'success.main'}>$ {formatMoney(deuda)}</Box>
        </Typography>

        {/* RESUMEN */}
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
              <Typography variant="h3" fontWeight={900} color="primary.main">$ {formatMoney(total)}</Typography>
              <Typography variant="body1" color={restante > 0 ? 'error.main' : 'success.main'} fontWeight={700}>
                {restante > 0 ? `Restan $ ${formatMoney(restante)} a deuda` : '✓ Deuda cubierta'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* MÉTODOS */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {[
            { key: 'efectivo', icon: '💵', label: 'Efectivo', desc: 'Pago en efectivo' },
            { key: 'transferencia', icon: '🏦', label: 'Transferencia', desc: 'Transferencia bancaria' },
            { key: 'cheques', icon: '📄', label: 'Cheques', desc: 'Cheques de terceros' },
            { key: 'cheqPers', icon: '✍️', label: 'Ch. Personal', desc: 'Cheques personales' },
            { key: 'noPagar', icon: '⏭️', label: 'No pagar', desc: 'No registra pago' },
          ].map((opt) => (
            <Grid item xs={opt.key === 'noPagar' ? 2.4 : 2.4} key={opt.key} sx={{ flex: opt.key === 'noPagar' ? '0 0 20%' : '0 0 20%' }}>
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

        {/* FORMULARIOS */}
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
              cliente={nombre} editIndex={-1} seteditIndex={() => {}} />
            {!showChequeForm && (
              <Button variant="contained" size="small" onClick={() => setShowChequeForm(true)}>+ Agregar cheque</Button>
            )}
          </Paper>
        )}

        {selectedPago === 'cheqPers' && (
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>Cheques personales</Typography>
            <InlineChequePersonalForm show={showChequePersForm} setShow={setShowChequePersForm}
              listaChequesPersonales={cheqPers} setListaChequesPersonales={setCheqPers}
              totalChequesPersonales={totalCheqPers} setTotalChequesPersonales={setTotalCheqPers}
              cliente={nombre} editIndex={-1} seteditIndex={() => {}} />
            {!showChequePersForm && (
              <Button variant="contained" size="small" onClick={() => setShowChequePersForm(true)}>+ Agregar cheque personal</Button>
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
export default withStore(NuevoPagoProveedor)
