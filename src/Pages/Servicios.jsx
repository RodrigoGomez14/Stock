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
import { Add, ChevronLeft, ChevronRight, Edit, Delete, Receipt, Check, Search, Close } from '@mui/icons-material'
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
    if (statusTab === 0) return status === 'sin-boleta'
    if (statusTab === 1) return status === 'pendiente'
    if (statusTab === 2) return status === 'pagado'
    return true
  })

  // Group by category
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

  const isPaidTab = statusTab === 2

  const ServiceTable = ({ title, items }) => (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
      <Box sx={{ px: 2, py: 1.5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Servicio</TableCell>
            <TableCell>Vencimiento</TableCell>
            {isPaidTab && <TableCell>Pagado el</TableCell>}
            <TableCell align="right">Monto</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(([id, s]) => {
            const inst = instancias[id]
            return (
              <React.Fragment key={id}>
                <TableRow hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{s.nombre}</Typography>
                  </TableCell>
                  <TableCell>{inst?.vencimiento || '—'}</TableCell>
                  {isPaidTab && <TableCell>{inst?.fechaPago || '—'}</TableCell>}
                  <TableCell align="right">
                    {inst ? `$ ${formatMoney(inst.monto || 0)}` : '—'}
                  </TableCell>
                  <TableCell>{statusChip(id)}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
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
                    <TableCell colSpan={isPaidTab ? 6 : 5} sx={{ py: 0, borderBottom: 0 }}>
                      <Collapse in={recibirId === id}>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, my: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Recibir boleta — {s.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            {MONTHS[month]} {year}
                          </Typography>
                          <TextField size="small" label="Monto ($)" type="number" value={recibirMonto}
                            onChange={(e) => setRecibirMonto(e.target.value)} sx={{ mr: 1, mb: 1 }} />
                          <TextField size="small" label="Vencimiento" type="date" value={recibirVto}
                            onChange={(e) => setRecibirVto(e.target.value)}
                            InputLabelProps={{ shrink: true }} sx={{ mr: 1, mb: 1 }} />
                          <Box sx={{ mt: 1 }}>
                            <Button size="small" variant="contained" startIcon={<Check />} onClick={guardarBoleta}>Guardar</Button>
                            <Button size="small" startIcon={<Close />} onClick={() => setRecibirId(null)} sx={{ ml: 1 }}>Cancelar</Button>
                          </Box>
                        </Paper>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
          <IconButton size="small" onClick={() => setMonth((m) => Math.max(0, m - 1))}><ChevronLeft /></IconButton>
          <Typography variant="h6" fontWeight={600} sx={{ minWidth: 150, textAlign: 'center' }}>
            {MONTHS[month]} {year}
          </Typography>
          <IconButton size="small" onClick={() => setMonth((m) => Math.min(11, m + 1))}><ChevronRight /></IconButton>
          <TextField size="small" placeholder="Buscar servicio..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
            sx={{ minWidth: 200 }} />
          <Button component={Link} to="/Nuevo-Servicio" startIcon={<Add />} variant="contained" size="small">Nuevo</Button>
        </Box>

        <Tabs value={statusTab} onChange={(_, v) => setStatusTab(v)} sx={{ mb: 2 }}>
          <Tab label={`Sin boleta (${counts.sinBoleta})`} />
          <Tab label={`Pendiente (${counts.pendiente})`} />
          <Tab label={`Pagado (${counts.pagado})`} />
        </Tabs>

        {Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([cat, items]) => (
            <ServiceTable key={cat} title={cat} items={items} />
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">
              {statusTab === 0 ? 'Todos los servicios tienen boleta este mes.' :
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
