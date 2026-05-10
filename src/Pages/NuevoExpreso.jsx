import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, TextField, Button, Grid, Typography, Paper,
  Backdrop, CircularProgress, Snackbar, IconButton
} from '@mui/material'
import { Alert } from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import { BaseWizard } from '../components/BaseWizard'
import { removeData, updateData } from '../services'
import { checkSearch } from '../utilities'

const NuevoExpreso = (props) => {
  const [data, setData] = useState({
    nombre: '', telefono: '', direccion: '',
    telefonos: [], mails: [], infoExtra: [],
  })
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const isEdit = !!props.history.location.search

  useEffect(() => {
    if (isEdit) {
      const e = props.expresos?.[checkSearch(props.history.location.search)]
      const d = e?.datos
      if (d) {
        setData({
          nombre: d.nombre || '', telefono: (d.telefono || [''])[0], direccion: (d.direccion || [''])[0],
          telefonos: d.telefonos || [], mails: d.mails || [],
          infoExtra: d.infoExtra || [],
        })
      }
    }
  }, [])

  const set = (f) => (v) => setData((prev) => ({ ...prev, [f]: v }))
  const addItem = (f) => setData((prev) => ({ ...prev, [f]: [...prev[f], ''] }))
  const updItem = (f, i) => (e) => {
    const copy = [...data[f]]; copy[i] = e.target.value
    setData((prev) => ({ ...prev, [f]: copy }))
  }
  const rmItem = (f, i) => () => setData((prev) => ({ ...prev, [f]: prev[f].filter((_, j) => j !== i) }))

  const listEditor = (items, label, field) => (
    <Box>
      {items.map((item, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField fullWidth size="small" label={`${label} ${i + 1}`} value={item} onChange={updItem(field, i)} />
          <IconButton color="error" onClick={rmItem(field, i)}><Delete /></IconButton>
        </Box>
      ))}
      <Button size="small" startIcon={<Add />} onClick={() => addItem(field)}>Agregar {label.toLowerCase()}</Button>
    </Box>
  )

  const guardar = async () => {
    setLoading(true)
    const payload = { datos: { nombre: data.nombre, telefono: [data.telefono], direccion: [data.direccion], telefonos: data.telefonos, mails: data.mails, infoExtra: data.infoExtra } }
    try {
      if (isEdit) {
        await removeData(props.user.uid, `expresos/${props.history.location.search.slice(1)}`)
      }
      await updateData(props.user.uid, 'expresos', { [data.nombre]: payload })
      setSnack(isEdit ? 'Transporte editado' : 'Transporte creado')
      setTimeout(() => props.history.replace(`/Expreso?${data.nombre}`), 1500)
    } catch { setLoading(false) }
  }

  const steps = [
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Datos del transporte</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}><TextField fullWidth label="Nombre *" value={data.nombre} onChange={(e) => set('nombre')(e.target.value)} /></Grid>
        <Grid item xs={6}><TextField fullWidth label="Teléfono" value={data.telefono} onChange={(e) => set('telefono')(e.target.value)} /></Grid>
        <Grid item xs={6}><TextField fullWidth label="Dirección" value={data.direccion} onChange={(e) => set('direccion')(e.target.value)} /></Grid>
      </Grid>
    </Box>,
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Teléfonos adicionales</Typography>
      {listEditor(data.telefonos, 'Teléfono', 'telefonos')}
      <Box sx={{ mt: 3 }}><Typography variant="subtitle1" fontWeight={600} gutterBottom>Emails</Typography>{listEditor(data.mails, 'Email', 'mails')}</Box>
    </Box>,
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Info adicional</Typography>
      {listEditor(data.infoExtra, 'Nota', 'infoExtra')}
    </Box>,
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Confirmar</Typography>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography><strong>Nombre:</strong> {data.nombre}</Typography>
        <Typography><strong>Teléfono:</strong> {data.telefono || '—'}</Typography>
        <Typography><strong>Dirección:</strong> {data.direccion || '—'}</Typography>
      </Paper>
    </Box>,
  ]

  return (
    <Layout history={props.history} page={isEdit ? 'Editar Transporte' : 'Nuevo Transporte'} user={props.user?.uid} blockGoBack={true}>
      <BaseWizard stepLabels={['Datos', 'Contacto', 'Adicional', 'Confirmar']} steps={steps} activeStep={activeStep} onNext={() => setActiveStep((s) => s + 1)} onBack={() => setActiveStep((s) => s - 1)} onFinish={guardar} disabled={!data.nombre} finishLabel={isEdit ? 'Guardar' : 'Crear Transporte'} />
      <Backdrop open={loading} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}><Alert severity="success">{snack}</Alert></Snackbar>
    </Layout>
  )
}

export default withStore(NuevoExpreso)
