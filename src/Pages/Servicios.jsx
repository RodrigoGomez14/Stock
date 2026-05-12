import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Typography, Paper, Button, IconButton, Chip, TextField, Tabs, Tab,
  Collapse, Backdrop, CircularProgress, Snackbar, Grid,
  InputAdornment
} from '@mui/material'
import { Alert } from '@mui/material'
import { Add, ChevronLeft, ChevronRight, Edit, Delete, Receipt, Check, Search, Close } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { setData, removeData } from '../services'
import { formatMoney, obtenerFecha } from '../utilities'

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const ServiceCard = ({ id, s, inst, status, statusChip, onRecibir, onEliminar, onGuardar, recibirId, recibirMonto, setRecibirMonto, recibirVto, setRecibirVto, month, year }) => {
  const statusIcons = { 'sin-boleta': '❌', 'pendiente': '📄', 'pagado': '✅' }
  const icon = statusIcons[status] || '📋'

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 1.5, position: 'relative' }}>
      <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="h3" sx={{ flexShrink: 0 }}>{icon}</Typography>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body1" fontWeight={700}>{s.nombre}</Typography>
          <Typography variant="caption" color="text.disabled">
            {s.frecuencia === 'mensual' ? 'Mensual' : s.frecuencia === 'anual' ? 'Anual' : 'Único'}
          </Typography>
          {inst?.vencimiento && <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>Vence: {inst.vencimiento}</Typography>}
          {inst?.fechaPago && <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>Pagado: {inst.fechaPago}</Typography>}
        </Box>
        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          {inst ? (
            <Typography variant="h6" fontWeight={800} color="primary.main">$ {formatMoney(inst.monto || 0)}</Typography>
          ) : (
            <Typography variant="body2" color="text.disabled">—</Typography>
          )}
          <Box sx={{ mt: 0.5 }}>{statusChip(status)}</Box>
        </Box>
      </Box>
      <Box sx={{ px: 2, pb: 1.5, display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
        {status === 'sin-boleta' && (
          <Button size="small" variant="outlined" color="warning" startIcon={<Receipt />}
            onClick={() => onRecibir(id)} sx={{ fontSize: 10, height: 26 }}>
            Recibir boleta
          </Button>
        )}
        <IconButton size="small" component={Link} to={`/Editar-Servicio?${id}`}
          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
          <Edit fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => { if (window.confirm('¿Eliminar?')) onEliminar(id) }}
          sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
          <Delete fontSize="small" />
        </IconButton>
      </Box>

      {recibirId === id && (
        <Collapse in={recibirId === id}>
          <Box sx={{ px: 2, pb: 2, bgcolor: 'action.hover', mx: 2, mb: 2, borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>Recibir boleta — {s.nombre}</Typography>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>{MONTHS[month]} {year}</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <TextField size="small" label="Monto ($)" type="number" value={recibirMonto}
                onChange={(e) => setRecibirMonto(e.target.value)} sx={{ minWidth: 130 }} />
              <TextField size="small" label="Vencimiento" type="date" value={recibirVto}
                onChange={(e) => setRecibirVto(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ minWidth: 150 }} />
              <Button size="small" variant="contained" startIcon={<Check />} onClick={onGuardar}>Guardar</Button>
              <Button size="small" startIcon={<Close />} onClick={() => onRecibir(null)}>Cancelar</Button>
            </Box>
          </Box>
        </Collapse>
      )}
    </Paper>
  )
}

const Servicios = (props) => {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [statusTab, setStatusTab] = useState(0)
  const [search, setSearch] = useState('')
  const [snack, setSnack] = useState('')
  const [loading, setLoading] = useState(false)
  const [recibirId, setRecibirId] = useState(null)
  const [recibirMonto, setRecibirMonto] = useState('')
  const [recibirVto, setRecibirVto] = useState('')

  const servicios = props.servicios ? Object.entries(props.servicios) : []
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
    if (search && !s.nombre.toLowerCase().includes(search.toLowerCase())) return false
    const status = getStatus(id)
    if (statusTab === 1) return status === 'sin-boleta'
    if (statusTab === 2) return status === 'pendiente'
    if (statusTab === 3) return status === 'pagado'
    return true
  })

  const grouped = {}
  filtered.forEach(([id, s]) => {
    const cat = s.categoria || 'Sin categoría'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push([id, s])
  })

  const guardarBoleta = async () => {
    if (!recibirMonto || !recibirVto) return
    setLoading(true)
    try {
      await setData(props.user.uid, `instanciasPago/${idPeriodo}/${recibirId}`, {
        monto: parseFloat(recibirMonto), vencimiento: recibirVto, estado: 'pendiente', fechaRegistro: obtenerFecha(),
      })
      setSnack('Boleta registrada')
      setRecibirId(null)
    } catch { }
    setLoading(false)
  }

  const eliminar = async (id) => {
    setLoading(true)
    try { await removeData(props.user.uid, `servicios/${id}`); setSnack('Servicio eliminado') } catch { }
    setLoading(false)
  }

  const statusChip = (status) => {
    switch (status) {
      case 'sin-boleta': return <Chip size="small" label="Sin boleta" variant="outlined" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: 10 }} />
      case 'pendiente': return <Chip size="small" label="Pendiente" color="warning" variant="filled" sx={{ fontWeight: 600, fontSize: 10 }} />
      case 'pagado': return <Chip size="small" icon={<Check sx={{ fontSize: 12 }} />} label="Pagado" color="success" variant="filled" sx={{ fontWeight: 600, fontSize: 10 }} />
    }
  }

  const counts = {
    todos: servicios.length,
    sinBoleta: servicios.filter(([id]) => getStatus(id) === 'sin-boleta').length,
    pendiente: servicios.filter(([id]) => getStatus(id) === 'pendiente').length,
    pagado: servicios.filter(([id]) => getStatus(id) === 'pagado').length,
  }

  return (
    <Layout history={props.history} page="Servicios" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        {/* Stats */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {[
            { label: 'Total', value: counts.todos, color: 'primary', icon: '📋' },
            { label: 'Sin boleta', value: counts.sinBoleta, color: 'default', icon: '📄' },
            { label: 'Pendiente', value: counts.pendiente, color: 'warning', icon: '⏳' },
            { label: 'Pagado', value: counts.pagado, color: 'success', icon: '✅' },
          ].map((s) => (
            <Grid item xs={3} key={s.label}>
              <Paper variant="outlined" sx={{ py: 1.5, px: 1, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ mb: 0.2 }}>{s.icon}</Typography>
                <Typography variant="h5" fontWeight={800}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" onClick={() => setMonth((m) => Math.max(0, m - 1))}><ChevronLeft /></IconButton>
            <Typography variant="h5" fontWeight={800} sx={{ minWidth: 160, textAlign: 'center' }}>{MONTHS[month]} {year}</Typography>
            <IconButton size="small" onClick={() => setMonth((m) => Math.min(11, m + 1))}><ChevronRight /></IconButton>
          </Box>
          <TextField size="small" placeholder="Buscar servicio..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} sx={{ minWidth: 220 }} />
          <Button component={Link} to="/Nuevo-Servicio" startIcon={<Add />} variant="contained" size="small">Nuevo servicio</Button>
        </Box>

        <Tabs value={statusTab} onChange={(_, v) => setStatusTab(v)} sx={{ mb: 2 }} variant="scrollable" scrollButtons="auto">
          <Tab label={`Todos (${counts.todos})`} sx={{ fontWeight: 600 }} />
          <Tab label={`Sin boleta (${counts.sinBoleta})`} sx={{ fontWeight: 600 }} />
          <Tab label={`Pendiente (${counts.pendiente})`} sx={{ fontWeight: 600 }} />
          <Tab label={`Pagado (${counts.pagado})`} sx={{ fontWeight: 600 }} />
        </Tabs>

        {Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([cat, items]) => (
            <Paper key={cat} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
              <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'primary.dark', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff' }}>
                  {cat} ({items.length})
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                {items.map(([id, s]) => {
                  const status = getStatus(id)
                  const inst = instancias[id]
                  return (
                    <ServiceCard key={id} id={id} s={s} inst={inst} status={status}
                      statusChip={statusChip} onRecibir={setRecibirId} onEliminar={eliminar}
                      onGuardar={guardarBoleta}
                      recibirId={recibirId} recibirMonto={recibirMonto} setRecibirMonto={setRecibirMonto}
                      recibirVto={recibirVto} setRecibirVto={setRecibirVto}
                      month={month} year={year} />
                  )
                })}
              </Box>
            </Paper>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h6" color="text.disabled" fontWeight={500}>
              {statusTab === 0 ? 'No hay servicios registrados.' :
               statusTab === 1 ? 'Todos los servicios tienen boleta este mes.' :
               statusTab === 2 ? 'No hay servicios pendientes.' :
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
