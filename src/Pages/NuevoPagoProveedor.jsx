import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, TextField, Typography, Paper, Button, Grid, Backdrop,
  CircularProgress, Snackbar, Autocomplete
} from '@mui/material'
import { Alert } from '@mui/material'
import { BaseWizard } from '../components/BaseWizard'
import { pushData, updateData } from '../services'
import { checkSearch, formatMoney, obtenerFecha } from '../utilities'
import { InlineChequeForm } from '../components/Cheques/InlineChequeForm'
import { InlineChequePersonalForm } from '../components/Cheques/InlineChequePersonalForm'

const NuevoPagoProveedor = (props) => {
  const nombre = checkSearch(props.history.location.search)
  const [efectivo, setEfectivo] = useState('')
  const [ctaTransferencia, setCtaTransferencia] = useState('')
  const [montoTransferencia, setMontoTransferencia] = useState('')
  const [cheques, setCheques] = useState([])
  const [totalCheques, setTotalCheques] = useState(0)
  const [cheqPers, setCheqPers] = useState([])
  const [totalCheqPers, setTotalCheqPers] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const [showChequeForm, setShowChequeForm] = useState(false)
  const [showChequePersForm, setShowChequePersForm] = useState(false)

  const total = (parseFloat(efectivo || 0) || 0) + (parseFloat(montoTransferencia || 0) || 0) + (totalCheques || 0) + (totalCheqPers || 0)
  const deuda = props.proveedores?.[nombre]?.datos?.deuda || 0

  const guardar = async () => {
    setLoading(true)
    try {
      const pago = {
        efectivo: efectivo || null, fecha: obtenerFecha(),
        cuentaTransferencia: ctaTransferencia || null, totalTransferencia: montoTransferencia || null,
        cheques: cheques.length ? cheques : null, chequesPersonales: cheqPers.length ? cheqPers : null,
        pagado: total, total, deudaPasada: deuda, deudaActualizada: deuda - total,
      }
      await pushData(props.user.uid, `proveedores/${nombre}/pagos`, pago)
      await updateData(props.user.uid, `proveedores/${nombre}/datos`, { deuda: deuda - total })
      if (ctaTransferencia && montoTransferencia) {
        await pushData(props.user.uid, `CuentasBancarias/${ctaTransferencia}/egresos`, {
          total: parseFloat(montoTransferencia), fecha: obtenerFecha(), concepto: `Pago a proveedor ${nombre}`
        })
      }
      setSnack('Pago registrado')
      setTimeout(() => props.history.replace(`/Historial-Proveedor?${nombre}`), 1500)
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
          <Autocomplete freeSolo value={ctaTransferencia}
            options={props.cuentasBancarias ? Object.keys(props.cuentasBancarias) : []}
            onChange={(_, v) => setCtaTransferencia(v)} onInputChange={(_, v) => setCtaTransferencia(v)}
            renderInput={(p) => <TextField {...p} label="Cuenta origen" fullWidth size="small" />} />
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
      {!showChequeForm && <Button variant="contained" onClick={() => setShowChequeForm(true)} sx={{ mt: 1 }}>Agregar cheque</Button>}
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Cheques personales</Typography>
      <InlineChequePersonalForm show={showChequePersForm} setShow={setShowChequePersForm}
        listaChequesPersonales={cheqPers} setListaChequesPersonales={setCheqPers}
        totalChequesPersonales={totalCheqPers} setTotalChequesPersonales={setTotalCheqPers}
        cliente={nombre} editIndex={-1} seteditIndex={() => {}} />
      {!showChequePersForm && <Button variant="contained" onClick={() => setShowChequePersForm(true)} sx={{ mt: 1 }}>Agregar cheque personal</Button>}
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Confirmar pago</Typography>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography><strong>Proveedor:</strong> {nombre}</Typography>
        <Typography><strong>Deuda actual:</strong> $ {formatMoney(deuda)}</Typography>
        <Typography><strong>Efectivo:</strong> $ {formatMoney(efectivo || 0)}</Typography>
        <Typography><strong>Transferencia:</strong> $ {formatMoney(montoTransferencia || 0)}</Typography>
        <Typography><strong>Cheques:</strong> {cheques.length} por $ {formatMoney(totalCheques)}</Typography>
        <Typography><strong>Cheques personales:</strong> {cheqPers.length} por $ {formatMoney(totalCheqPers)}</Typography>
        <Typography sx={{ mt: 1, fontWeight: 700, fontSize: 18 }}>Total: $ {formatMoney(total)}</Typography>
        <Typography color="success.light" fontWeight={600}>Deuda restante: $ {formatMoney(deuda - total)}</Typography>
      </Paper>
    </Box>,
  ]

  return (
    <Layout history={props.history} page={`Pago - ${nombre}`} user={props.user?.uid} blockGoBack={true}>
      <BaseWizard stepLabels={['Efectivo', 'Transf.', 'Cheques', 'Ch. Pers.', 'Confirmar']} steps={steps}
        activeStep={activeStep} onNext={() => setActiveStep(s => s + 1)}
        onBack={() => setActiveStep(s => s - 1)} onFinish={guardar}
        disabled={activeStep === 4 && total === 0} finishLabel="Registrar Pago" />
      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}><Alert severity="success">{snack}</Alert></Snackbar>
    </Layout>
  )
}
export default withStore(NuevoPagoProveedor)
