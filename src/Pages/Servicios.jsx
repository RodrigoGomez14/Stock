import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Typography, Paper, Button, IconButton, Chip, TextField, Tabs, Tab,
  Collapse, Backdrop, CircularProgress, Snackbar,
  Table, TableHead, TableBody, TableRow, TableCell, Divider,
  InputAdornment
} from '@mui/material'
import { Alert } from '@mui/material'
import { Add, ChevronLeft, ChevronRight, Edit, Delete, Receipt, Check, Search, Close, Category } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { setData, removeData } from '../services'
import { formatMoney, obtenerFecha } from '../utilities'

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

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

  const abrirRecibir = (id) => {
    setRecibirId(id)
    setRecibirMonto('')
    setRecibirVto('')
  }

  const eliminar = async (id) => {
    setLoading(true)
    try {
      await removeData(props.user.uid, `servicios/${id}`)
      setSnack('Servicio eliminado')
    } catch { }
    setLoading(false)
  }

  const statusChip = (id) => {
    switch (getStatus(id)) {
      case 'sin-boleta':
        return <Chip size="small" label="Sin boleta" variant="outlined" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: 11 }} />
      case 'pendiente':
        return <Chip size="small" label="Pendiente" color="warning" variant="filled" sx={{ fontWeight: 600, fontSize: 11 }} />
      case 'pagado':
        return <Chip size="small" icon={<Check sx={{ fontSize: 13 }} />} label="Pagado" color="success" variant="filled" sx={{ fontWeight: 600, fontSize: 11 }} />
    }
  }

  const counts = {
    todos: servicios.length,
    sinBoleta: servicios.filter(([id]) => getStatus(id) === 'sin-boleta').length,
    pendiente: servicios.filter(([id]) => getStatus(id) === 'pendiente').length,
    pagado: servicios.filter(([id]) => getStatus(id) === 'pagado').length,
  }

  const isPaidTab = statusTab === 3
  const isSinBoletaTab = statusTab === 1

  const ServiceTable = ({ title, items }) => (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
      <Box sx={{ px: 2.5, py: 1.8, bgcolor: 'action.selected', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Category fontSize="small" color="primary" />
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.1rem' }}>
            {title}
          </Typography>
          <Chip size="small" label={`${items.length} servicio(s)`} variant="outlined" sx={{ fontSize: 10, height: 20 }} />
        </Box>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary', letterSpacing: 0.3 }}>Servicio</TableCell>
            {!isSinBoletaTab && <TableCell sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary', letterSpacing: 0.3 }}>Vencimiento</TableCell>}
            {isPaidTab && <TableCell sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary', letterSpacing: 0.3 }}>Pagado el</TableCell>}
            {!isSinBoletaTab && <TableCell align="right" sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary', letterSpacing: 0.3 }}>Monto</TableCell>}
            <TableCell sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary', letterSpacing: 0.3 }}>Estado</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary', letterSpacing: 0.3 }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(([id, s]) => {
            const inst = instancias[id]
            return (
              <React.Fragment key={id}>
                <TableRow hover sx={{ '&:last-child td': { borderBottom: recibirId === id ? 0 : undefined } }}>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body1" fontWeight={600} sx={{ fontSize: '0.95rem' }}>
                      {s.nombre}
                    </Typography>
                    {s.frecuencia && (
                      <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
                        {s.frecuencia === 'mensual' ? 'Mensual' : s.frecuencia === 'anual' ? 'Anual' : 'Único'}
                      </Typography>
                    )}
                  </TableCell>
                  {!isSinBoletaTab && (
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {inst?.vencimiento || '—'}
                      </Typography>
                    </TableCell>
                  )}
                  {isPaidTab && (
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {inst?.fechaPago || '—'}
                      </Typography>
                    </TableCell>
                  )}
                  {!isSinBoletaTab && (
                    <TableCell align="right" sx={{ py: 1.5 }}>
                      {inst ? (
                        <Typography variant="body1" fontWeight={700} sx={{ fontSize: '1rem' }}>
                          $ {formatMoney(inst.monto || 0)}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.disabled">—</Typography>
                      )}
                    </TableCell>
                  )}
                  <TableCell sx={{ py: 1.5 }}>{statusChip(id)}</TableCell>
                  <TableCell align="right" sx={{ py: 1.5, whiteSpace: 'nowrap' }}>
                    {getStatus(id) === 'sin-boleta' && (
                      <IconButton size="small" onClick={() => abrirRecibir(id)}
                        sx={{ color: 'warning.main', '&:hover': { bgcolor: 'warning.main', color: '#fff' } }}>
                        <Receipt fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton size="small" component={Link} to={`/Editar-Servicio?${id}`}
                      sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => { if (window.confirm('¿Eliminar?')) eliminar(id) }}
                      sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                {recibirId === id && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ py: 0, borderBottom: 0 }}>
                      <Collapse in={recibirId === id}>
                        <Box sx={{ py: 1.5, px: 2, bgcolor: 'action.hover', borderRadius: 1, mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Recibir boleta — {s.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            {MONTHS[month]} {year}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                            <TextField size="small" label="Monto ($)" type="number" value={recibirMonto}
                              onChange={(e) => setRecibirMonto(e.target.value)} sx={{ minWidth: 140 }} />
                            <TextField size="small" label="Vencimiento" type="date" value={recibirVto}
                              onChange={(e) => setRecibirVto(e.target.value)}
                              InputLabelProps={{ shrink: true }} sx={{ minWidth: 160 }} />
                            <Button size="small" variant="contained" startIcon={<Check />} onClick={guardarBoleta}>
                              Guardar
                            </Button>
                            <Button size="small" startIcon={<Close />} onClick={() => setRecibirId(null)}>
                              Cancelar
                            </Button>
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            )
          })}
        </TableBody>
      </Table>
    </Paper>
  )

  return (
    <Layout history={props.history} page="Servicios" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" onClick={() => setMonth((m) => Math.max(0, m - 1))}><ChevronLeft /></IconButton>
            <Typography variant="h5" fontWeight={800} sx={{ minWidth: 160, textAlign: 'center' }}>
              {MONTHS[month]} {year}
            </Typography>
            <IconButton size="small" onClick={() => setMonth((m) => Math.min(11, m + 1))}><ChevronRight /></IconButton>
          </Box>
          <TextField size="small" placeholder="Buscar servicio..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
            sx={{ minWidth: 220 }} />
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
            <ServiceTable key={cat} title={cat} items={items} />
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
