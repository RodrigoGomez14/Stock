import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Typography, Paper, Button, IconButton, Chip, TextField, Tabs, Tab,
  Collapse, Backdrop, CircularProgress, Snackbar,
  Table, TableHead, TableBody, TableRow, TableCell,
  Select, MenuItem, FormControl, InputLabel, InputAdornment
} from '@mui/material'
import { Alert } from '@mui/material'
import { Add, ChevronLeft, ChevronRight, Edit, Delete, Receipt, Check, Search, Close } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { database } from '../services'
import { formatMoney, obtenerFecha } from '../utilities'

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const Servicios = (props) => {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [statusTab, setStatusTab] = useState(0)
  const [filterCat, setFilterCat] = useState('todas')
  const [search, setSearch] = useState('')
  const [snack, setSnack] = useState('')
  const [loading, setLoading] = useState(false)
  const [recibirId, setRecibirId] = useState(null)
  const [recibirMonto, setRecibirMonto] = useState('')
  const [recibirVto, setRecibirVto] = useState('')

  const servicios = props.servicios ? Object.entries(props.servicios) : []
  const cats = [...new Set(servicios.map(([_, s]) => s.categoria).filter(Boolean))]

  const idPeriodo = `${year}-${month + 1}`
  const instancias = props.instanciasPago?.[idPeriodo] || {}

  const getStatus = (id) => {
    const inst = instancias[id]
    if (!inst) return 'sin-boleta'
    if (inst.estado === 'pagado') return 'pagado'
    return 'pendiente'
  }

  const mostrarEnMes = (s) => {
    if (s.frecuencia === 'mensual') return true
    if (s.frecuencia === 'anual' || s.frecuencia === 'unico') {
      if (s.mesesPago?.length > 0) return s.mesesPago.includes(month)
      return month === 0
    }
    return true
  }

  const filtered = servicios.filter(([id, s]) => {
    if (!mostrarEnMes(s)) return false
    if (filterCat !== 'todas' && s.categoria !== filterCat) return false
    if (search && !s.nombre.toLowerCase().includes(search.toLowerCase())) return false
    const status = getStatus(id)
    if (statusTab === 0) return status === 'sin-boleta'
    if (statusTab === 1) return status === 'pendiente'
    if (statusTab === 2) return status === 'pagado'
    return true
  })

  const guardarBoleta = async () => {
    if (!recibirMonto || !recibirVto) return
    setLoading(true)
    try {
      await database().ref().child(props.user.uid).child('instanciasPago').child(idPeriodo).child(recibirId).set({
        monto: parseFloat(recibirMonto), vencimiento: recibirVto, estado: 'pendiente', fechaRegistro: obtenerFecha(),
      })
      setSnack('Boleta registrada')
      setRecibirId(null)
    } catch { }
    setLoading(false)
  }

  const abrirRecibir = (id) => {
    setRecibirId(id)
    setRecibirMonto('')
    setRecibirVto('')
  }

  const eliminar = async (id) => {
    setLoading(true)
    try {
      await database().ref().child(props.user.uid).child('servicios').child(id).remove()
      setSnack('Servicio eliminado')
    } catch { }
    setLoading(false)
  }

  const statusChip = (id) => {
    const status = getStatus(id)
    switch (status) {
      case 'sin-boleta': return <Chip size="small" label="Sin boleta" variant="outlined" sx={{ color: 'text.secondary' }} />
      case 'pendiente': return <Chip size="small" label="Pendiente" color="warning" variant="outlined" />
      case 'pagado': return <Chip size="small" label="Pagado" color="success" variant="outlined" />
    }
  }

  const counts = {
    sinBoleta: servicios.filter(([id]) => getStatus(id) === 'sin-boleta').length,
    pendiente: servicios.filter(([id]) => getStatus(id) === 'pendiente').length,
    pagado: servicios.filter(([id]) => getStatus(id) === 'pagado').length,
  }

  return (
    <Layout history={props.history} page="Servicios" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
          <IconButton size="small" onClick={() => setMonth((m) => Math.max(0, m - 1))}><ChevronLeft /></IconButton>
          <Typography variant="h6" fontWeight={600} sx={{ minWidth: 150, textAlign: 'center' }}>
            {MONTHS[month]} {year}
          </Typography>
          <IconButton size="small" onClick={() => setMonth((m) => Math.min(11, m + 1))}><ChevronRight /></IconButton>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Categoría</InputLabel>
            <Select value={filterCat} label="Categoría" onChange={(e) => setFilterCat(e.target.value)}>
              <MenuItem value="todas">Todas</MenuItem>
              {cats.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField size="small" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
            sx={{ minWidth: 200 }} />
          <Button component={Link} to="/Nuevo-Servicio" startIcon={<Add />} variant="contained" size="small">Nuevo</Button>
        </Box>

        <Tabs value={statusTab} onChange={(_, v) => setStatusTab(v)} sx={{ mb: 2 }}>
          <Tab label={`Sin boleta (${counts.sinBoleta})`} />
          <Tab label={`Pendiente (${counts.pendiente})`} />
          <Tab label={`Pagado (${counts.pagado})`} />
        </Tabs>

        {filtered.length > 0 ? (
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Servicio</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Frecuencia</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Monto</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(([id, s]) => (
                  <React.Fragment key={id}>
                    <TableRow hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{s.nombre}</Typography>
                      </TableCell>
                      <TableCell><Chip size="small" label={s.categoria || '—'} variant="outlined" /></TableCell>
                      <TableCell>
                        {s.frecuencia === 'mensual' ? 'Mensual' :
                         s.frecuencia === 'anual' ? 'Anual' :
                         s.frecuencia === 'unico' ? 'Único' : s.frecuencia || '—'}
                      </TableCell>
                      <TableCell>{statusChip(id)}</TableCell>
                      <TableCell align="right">
                        {instancias[id] ? `$ ${formatMoney(instancias[id].monto || 0)}` : '—'}
                      </TableCell>
                      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                        {getStatus(id) === 'sin-boleta' && (
                          <IconButton size="small" onClick={() => abrirRecibir(id)}><Receipt fontSize="small" /></IconButton>
                        )}
                        <IconButton size="small" component={Link} to={`/Editar-Servicio?${id}`}><Edit fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => { if (window.confirm('Eliminar?')) eliminar(id) }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    {recibirId === id && (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ py: 0, borderBottom: 0 }}>
                          <Collapse in={recibirId === id}>
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, my: 1 }}>
                              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                Recibir boleta — {s.nombre}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                {MONTHS[month]} {year}
                              </Typography>
                              <TextField size="small" label="Monto" type="number" value={recibirMonto}
                                onChange={(e) => setRecibirMonto(e.target.value)} sx={{ mr: 1, mb: 1 }} />
                              <TextField size="small" label="Vencimiento" type="date" value={recibirVto}
                                onChange={(e) => setRecibirVto(e.target.value)}
                                InputLabelProps={{ shrink: true }} sx={{ mr: 1, mb: 1 }} />
                              <Button size="small" variant="contained" startIcon={<Check />} onClick={guardarBoleta}>Guardar</Button>
                              <Button size="small" startIcon={<Close />} onClick={() => setRecibirId(null)} sx={{ ml: 1 }}>Cancelar</Button>
                            </Paper>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">
              {statusTab === 0 ? 'Todos los servicios tienen boleta registrada este mes.' :
               statusTab === 1 ? 'No hay servicios pendientes.' :
               'No hay servicios pagados este mes.'}
            </Typography>
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
