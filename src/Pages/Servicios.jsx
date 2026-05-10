import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Paper, Card, CardContent, Button, IconButton,
  Chip, TextField, Tabs, Tab, Collapse, Backdrop, CircularProgress, Snackbar,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material'
import { Alert } from '@mui/material'
import { Add, ChevronLeft, ChevronRight, Edit, Delete, Receipt, Check } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { database } from '../services'
import { formatMoney, obtenerFecha } from '../utilities'

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const Servicios = (props) => {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [tab, setTab] = useState(0)
  const [filterCat, setFilterCat] = useState('todas')
  const [snack, setSnack] = useState('')
  const [loading, setLoading] = useState(false)
  const [recibirId, setRecibirId] = useState(null)
  const [recibirMonto, setRecibirMonto] = useState('')
  const [recibirVto, setRecibirVto] = useState('')

  const servicios = props.servicios ? Object.entries(props.servicios) : []
  const cats = [...new Set(servicios.map(([_, s]) => s.categoria).filter(Boolean))]

  const filtered = servicios.filter(([id, s]) => {
    if (filterCat !== 'todas' && s.categoria !== filterCat) return false
    if (tab === 1 && s.frecuencia === 'mensual') return false
    if (tab === 2 && s.frecuencia !== 'mensual') return false
    return true
  })

  const abrirRecibir = (id, nombre) => {
    setRecibirId(id)
    setRecibirMonto('')
    setRecibirVto('')
  }

  const guardarBoleta = async () => {
    if (!recibirMonto || !recibirVto) return
    setLoading(true)
    const idPeriodo = `${year}-${month + 1}`
    try {
      await database().ref().child(props.user.uid).child('instanciasPago').child(idPeriodo).child(recibirId).set({
        monto: parseFloat(recibirMonto), vencimiento: recibirVto, estado: 'pendiente', fechaRegistro: obtenerFecha(),
      })
      setSnack('Boleta registrada')
      setRecibirId(null)
    } catch { }
    setLoading(false)
  }

  const eliminarServicio = async (id) => {
    setLoading(true)
    try {
      await database().ref().child(props.user.uid).child('servicios').child(id).remove()
      setSnack('Servicio eliminado')
    } catch { }
    setLoading(false)
  }

  return (
    <Layout history={props.history} page="Servicios" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <IconButton onClick={() => { if (month > 0) setMonth(m => m - 1) }}><ChevronLeft /></IconButton>
          <Typography variant="h6" fontWeight={600} sx={{ minWidth: 160, textAlign: 'center' }}>
            {MONTHS[month]} {year}
          </Typography>
          <IconButton onClick={() => { if (month < 11) setMonth(m => m + 1) }}><ChevronRight /></IconButton>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Categoría</InputLabel>
            <Select value={filterCat} label="Categoría" onChange={(e) => setFilterCat(e.target.value)}>
              <MenuItem value="todas">Todas</MenuItem>
              {cats.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <Button component={Link} to="/Nuevo-Servicio" startIcon={<Add />} variant="contained" size="small">Nuevo</Button>
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Todos" />
          <Tab label="Anuales" />
          <Tab label="Mensuales" />
        </Tabs>

        {filtered.length > 0 ? (
          <Grid container spacing={2}>
            {filtered.map(([id, s]) => (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>{s.nombre}</Typography>
                        <Chip size="small" label={s.categoria} variant="outlined" sx={{ mt: 0.5 }} />
                      </Box>
                      <Box>
                        <IconButton size="small" onClick={() => abrirRecibir(id, s.nombre)}><Receipt fontSize="small" /></IconButton>
                        <IconButton size="small" component={Link} to={`/Editar-Servicio?${id}`}><Edit fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => { if (window.confirm('Eliminar servicio?')) eliminarServicio(id) }}><Delete fontSize="small" /></IconButton>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {s.frecuencia === 'mensual' ? 'Mensual' : s.frecuencia || '—'}
                    </Typography>

                    {recibirId === id && (
                      <Collapse in={recibirId === id}>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mt: 2 }}>
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Recibir boleta — {s.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                            {MONTHS[month]} {year}
                          </Typography>
                          <TextField fullWidth size="small" label="Monto" type="number" value={recibirMonto}
                            onChange={(e) => setRecibirMonto(e.target.value)} sx={{ mb: 1 }} />
                          <TextField fullWidth size="small" label="Vencimiento" type="date" value={recibirVto}
                            onChange={(e) => setRecibirVto(e.target.value)}
                            InputLabelProps={{ shrink: true }} sx={{ mb: 1 }} />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="contained" startIcon={<Check />} onClick={guardarBoleta}>Guardar</Button>
                            <Button size="small" variant="outlined" onClick={() => setRecibirId(null)}>Cancelar</Button>
                          </Box>
                        </Paper>
                      </Collapse>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No hay servicios.</Typography>
          </Box>
        )}
      </Box>

      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(Servicios)
