import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, TextField, Typography, Paper, Button, Select, MenuItem,
  FormControl, InputLabel, Chip, Backdrop, CircularProgress, Snackbar,
  FormControlLabel, Checkbox
} from '@mui/material'
import { Alert } from '@mui/material'
import { Add } from '@mui/icons-material'
import { BaseWizard } from '../components/BaseWizard'
import { database } from '../services'
import { checkSearch } from '../utilities'

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const NuevoServicio = (props) => {
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('')
  const [nuevaCat, setNuevaCat] = useState('')
  const [showNewCat, setShowNewCat] = useState(false)
  const [nota, setNota] = useState('')
  const [frecuencia, setFrecuencia] = useState('mensual')
  const [mesesPago, setMesesPago] = useState([])
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const isEdit = !!props.history.location.search

  useEffect(() => {
    if (isEdit) {
      const s = props.servicios?.[checkSearch(props.history.location.search)]
      if (s) {
        setNombre(s.nombre || '')
        setCategoria(s.categoria || '')
        setNota(s.nota || '')
        setFrecuencia(s.frecuencia || 'mensual')
        setMesesPago(s.mesesPago || [])
      }
    }
  }, [])

  const cats = props.servicios ? [...new Set(Object.values(props.servicios).map(s => s.categoria).filter(Boolean))] : []

  const toggleMes = (m) => {
    setMesesPago((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m])
  }

  const guardar = async () => {
    setLoading(true)
    const payload = { nombre, categoria: showNewCat ? nuevaCat : categoria, nota, frecuencia, mesesPago }
    try {
      if (isEdit) {
        await database().ref().child(props.user.uid).child('servicios').child(checkSearch(props.history.location.search)).update(payload)
      } else {
        const key = database().ref().child(props.user.uid).child('servicios').push().key
        await database().ref().child(props.user.uid).child('servicios').child(key).set(payload)
      }
      setSnack(isEdit ? 'Servicio editado' : 'Servicio creado')
      setTimeout(() => props.history.replace('/Servicios'), 1500)
    } catch { setLoading(false) }
  }

  const steps = [
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Nombre y categoría</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Nombre del servicio *" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth size="small" disabled={showNewCat}>
            <InputLabel>Categoría</InputLabel>
            <Select value={showNewCat ? '' : categoria} label="Categoría" onChange={(e) => setCategoria(e.target.value)}>
              {cats.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              <MenuItem value="">
                <Button size="small" onClick={() => setShowNewCat(true)}>+ Nueva categoría</Button>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {showNewCat && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField fullWidth size="small" label="Nueva categoría" value={nuevaCat} onChange={(e) => setNuevaCat(e.target.value)} />
              <Button onClick={() => setShowNewCat(false)}>Usar existente</Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Frecuencia</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Frecuencia</InputLabel>
            <Select value={frecuencia} label="Frecuencia" onChange={(e) => setFrecuencia(e.target.value)}>
              <MenuItem value="mensual">Mensual</MenuItem>
              <MenuItem value="bimestral">Bimestral</MenuItem>
              <MenuItem value="trimestral">Trimestral</MenuItem>
              <MenuItem value="anual">Anual</MenuItem>
              <MenuItem value="unico">Único</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {frecuencia !== 'mensual' && (
          <Grid item xs={12}>
            <Typography variant="body2" gutterBottom>Meses de pago</Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {MONTHS.map((m, i) => (
                <Chip key={i} label={m} variant={mesesPago.includes(i) ? 'filled' : 'outlined'}
                  color={mesesPago.includes(i) ? 'primary' : 'default'}
                  onClick={() => toggleMes(i)} size="small" />
              ))}
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Nota adicional</Typography>
      <TextField fullWidth multiline rows={3} label="Nota (opcional)" value={nota} onChange={(e) => setNota(e.target.value)} />
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Confirmar</Typography>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography><strong>Nombre:</strong> {nombre}</Typography>
        <Typography><strong>Categoría:</strong> {showNewCat ? nuevaCat : categoria || '—'}</Typography>
        <Typography><strong>Frecuencia:</strong> {frecuencia}</Typography>
        {nota && <Typography><strong>Nota:</strong> {nota}</Typography>}
      </Paper>
    </Box>,
  ]

  return (
    <Layout history={props.history} page={isEdit ? 'Editar Servicio' : 'Nuevo Servicio'} user={props.user?.uid} blockGoBack={true}>
      <BaseWizard
        stepLabels={['Datos', 'Frecuencia', 'Nota', 'Confirmar']}
        steps={steps} activeStep={activeStep}
        onNext={() => setActiveStep((s) => s + 1)}
        onBack={() => setActiveStep((s) => s - 1)}
        onFinish={guardar} disabled={!nombre}
        finishLabel={isEdit ? 'Guardar' : 'Crear Servicio'}
      />
      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(NuevoServicio)
