import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, TextField, Typography, Paper, Button, Grid, Backdrop,
  CircularProgress, Snackbar, Autocomplete, Select, MenuItem,
  FormControl, InputLabel
} from '@mui/material'
import { Alert } from '@mui/material'
import { BaseWizard } from '../components/BaseWizard'
import { pushData, updateData } from '../services'
import { checkSearch, formatMoney, obtenerFecha } from '../utilities'
import { InlineChequeForm } from '../components/Cheques/InlineChequeForm'

const NuevoPagoCliente = (props) => {
  const nombre = checkSearch(props.history.location.search)
  const [efectivo, setEfectivo] = useState('')
  const [ctaTransferencia, setCtaTransferencia] = useState('')
  const [montoTransferencia, setMontoTransferencia] = useState('')
  const [cheques, setCheques] = useState([])
  const [totalCheques, setTotalCheques] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const [showChequeForm, setShowChequeForm] = useState(false)

  const total = (parseFloat(efectivo || 0) || 0) + (parseFloat(montoTransferencia || 0) || 0) + (totalCheques || 0)
  const deuda = props.clientes?.[nombre]?.datos?.deuda || 0

  const guardar = async () => {
    setLoading(true)
    try {
      const pago = {
        efectivo: efectivo || null, fecha: obtenerFecha(),
        cuentaTransferencia: ctaTransferencia || null, totalTransferencia: montoTransferencia || null,
        cheques: cheques.length ? cheques : null,
        pagado: total, total, deudaPasada: deuda, deudaActualizada: deuda - total,
      }
      await pushData(props.user.uid, `clientes/${nombre}/pagos`, pago)
      await updateData(props.user.uid, `clientes/${nombre}/datos`, { deuda: deuda - total })
      if (ctaTransferencia && montoTransferencia) {
        await pushData(props.user.uid, `CuentasBancarias/${ctaTransferencia}/ingresos`, {
          total: parseFloat(montoTransferencia), fecha: obtenerFecha(), concepto: `Pago de cliente ${nombre}`
        })
      }
      setSnack('Pago registrado')
      setTimeout(() => props.history.replace(`/Historial-Cliente?${nombre}`), 1500)
    } catch { setLoading(false) }
  }

  const steps = [
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Efectivo</Typography>
      <TextField fullWidth label="Monto en efectivo ($)" type="number" value={efectivo}
        onChange={(e) => setEfectivo(e.target.value)} />
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Transferencia bancaria</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            freeSolo value={ctaTransferencia}
            options={props.cuentasBancarias ? Object.keys(props.cuentasBancarias) : []}
            onChange={(_, v) => setCtaTransferencia(v)} onInputChange={(_, v) => setCtaTransferencia(v)}
            renderInput={(p) => <TextField {...p} label="Cuenta destino" fullWidth size="small" />}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Monto" type="number" value={montoTransferencia}
            onChange={(e) => setMontoTransferencia(e.target.value)} />
        </Grid>
      </Grid>
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Cheques de terceros</Typography>
      <InlineChequeForm show={showChequeForm} setShow={setShowChequeForm}
        datos={cheques} setdatos={setCheques} total={totalCheques} settotal={setTotalCheques}
        cliente={nombre} editIndex={-1} seteditIndex={() => {}} />
      {!showChequeForm && (
        <Button variant="contained" onClick={() => setShowChequeForm(true)} sx={{ mt: 1 }}>Agregar cheque</Button>
      )}
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Confirmar pago</Typography>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography><strong>Cliente:</strong> {nombre}</Typography>
        <Typography><strong>Deuda actual:</strong> $ {formatMoney(deuda)}</Typography>
        <Typography><strong>Efectivo:</strong> $ {formatMoney(efectivo || 0)}</Typography>
        <Typography><strong>Transferencia:</strong> $ {formatMoney(montoTransferencia || 0)}</Typography>
        <Typography><strong>Cheques:</strong> {cheques.length} por $ {formatMoney(totalCheques)}</Typography>
        <Typography sx={{ mt: 1, fontWeight: 700, fontSize: 18 }}>Total: $ {formatMoney(total)}</Typography>
        <Typography color="success.light" fontWeight={600}>Deuda restante: $ {formatMoney(deuda - total)}</Typography>
      </Paper>
    </Box>,
  ]

  return (
    <Layout history={props.history} page={`Pago - ${nombre}`} user={props.user?.uid} blockGoBack={true}>
      <BaseWizard stepLabels={['Efectivo', 'Transf.', 'Cheques', 'Confirmar']} steps={steps}
        activeStep={activeStep} onNext={() => setActiveStep(s => s + 1)}
        onBack={() => setActiveStep(s => s - 1)} onFinish={guardar}
        disabled={activeStep === 3 && total === 0} finishLabel="Registrar Pago" />
      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}><Alert severity="success">{snack}</Alert></Snackbar>
    </Layout>
  )
}
export default withStore(NuevoPagoCliente)
