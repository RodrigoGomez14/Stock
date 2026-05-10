import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, TextField, Button, Grid, Typography, Paper, Autocomplete,
  Backdrop, CircularProgress, Snackbar, IconButton
} from '@mui/material'
import { Alert } from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import { BaseWizard } from '../components/BaseWizard'
import { removeData, updateData } from '../services'
import { checkSearch } from '../utilities'

const NuevoProveedor = (props) => {
  const [data, setData] = useState({
    nombre: '', dni: '', cuit: '', expreso: null,
    telefonos: [], mails: [], direcciones: [], infoExtra: [], deuda: 0,
  })
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const isEdit = !!props.history.location.search

  useEffect(() => {
    if (isEdit) {
      const p = props.proveedores?.[checkSearch(props.history.location.search)]?.datos
      if (p) {
        setData({
          nombre: p.nombre || '', dni: p.dni || '', cuit: p.cuit || '',
          expreso: p.expreso || null, telefonos: p.telefonos || [],
          mails: p.mails || [], direcciones: p.direcciones || [],
          infoExtra: p.infoExtra || [], deuda: p.deuda || 0,
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
    const payload = { datos: { nombre: data.nombre, dni: data.dni, cuit: data.cuit, expresos: data.expreso ? [data.expreso] : [], mails: data.mails, direcciones: data.direcciones, telefonos: data.telefonos, infoExtra: data.infoExtra, deuda: data.deuda } }
    try {
      if (isEdit) {
        await removeData(props.user.uid, `proveedores/${props.history.location.search.slice(1)}`)
        await updateData(props.user.uid, `proveedores/${data.nombre}`, payload)
      } else {
        await updateData(props.user.uid, 'proveedores', { [data.nombre]: payload })
      }
      setSnack(isEdit ? 'Proveedor editado' : 'Proveedor creado')
      setTimeout(() => props.history.replace(`/Proveedor?${data.nombre}`), 1500)
    } catch { setLoading(false) }
  }

  const steps = [
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Datos del proveedor</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}><TextField fullWidth label="Nombre *" value={data.nombre} onChange={(e) => set('nombre')(e.target.value)} /></Grid>
        <Grid item xs={6}><TextField fullWidth label="DNI" value={data.dni} onChange={(e) => set('dni')(e.target.value)} /></Grid>
        <Grid item xs={6}><TextField fullWidth label="CUIT" value={data.cuit} onChange={(e) => set('cuit')(e.target.value)} /></Grid>
      </Grid>
    </Box>,
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Teléfonos</Typography>
      {listEditor(data.telefonos, 'Teléfono', 'telefonos')}
      <Box sx={{ mt: 3 }}><Typography variant="subtitle1" fontWeight={600} gutterBottom>Emails</Typography>{listEditor(data.mails, 'Email', 'mails')}</Box>
    </Box>,
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Direcciones</Typography>
      {listEditor(data.direcciones, 'Dirección', 'direcciones')}
      <Box sx={{ mt: 3 }}><Typography variant="subtitle1" fontWeight={600} gutterBottom>Expreso</Typography>
        <Autocomplete freeSolo value={data.expreso} options={props.expresos ? Object.keys(props.expresos) : []} onChange={(_, v) => set('expreso')(v)} onInputChange={(_, v) => set('expreso')(v)} renderInput={(p) => <TextField {...p} label="Expreso" fullWidth size="small" />} />
      </Box>
    </Box>,
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Info adicional</Typography>
      {listEditor(data.infoExtra, 'Nota', 'infoExtra')}
      <Box sx={{ mt: 2 }}><TextField fullWidth label="Deuda inicial ($)" type="number" value={data.deuda} onChange={(e) => set('deuda')(parseFloat(e.target.value) || 0)} /></Box>
    </Box>,
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Confirmar</Typography>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography><strong>Nombre:</strong> {data.nombre}</Typography>
        <Typography><strong>Teléfonos:</strong> {data.telefonos.length} | <strong>Emails:</strong> {data.mails.length} | <strong>Direcciones:</strong> {data.direcciones.length}</Typography>
      </Paper>
    </Box>,
  ]

  return (
    <Layout history={props.history} page={isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor'} user={props.user?.uid} blockGoBack={true}>
      <BaseWizard stepLabels={['Datos', 'Contacto', 'Dirección', 'Adicional', 'Confirmar']} steps={steps} activeStep={activeStep} onNext={() => setActiveStep((s) => s + 1)} onBack={() => setActiveStep((s) => s - 1)} onFinish={guardar} disabled={!data.nombre} finishLabel={isEdit ? 'Guardar' : 'Crear Proveedor'} />
      <Backdrop open={loading} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}><Alert severity="success">{snack}</Alert></Snackbar>
    </Layout>
  )
}

export default withStore(NuevoProveedor)
