import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, IconButton, Button, Backdrop, CircularProgress, Snackbar,
  Paper, Chip, Menu, MenuItem, Avatar, Divider
} from '@mui/material'
import { Alert } from '@mui/material'
import {
  Edit, Delete, Phone, Email, Place, LocalShipping,
  Badge, CreditCard, Person, AttachMoney, History,
  MoreVert, ArrowUpward, ArrowDownward
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { removeData } from '../services'
import { formatMoney } from '../utilities'
import { ImgCache } from '../components/ImgCache'

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

const fmt = (v) => {
  if (typeof v === 'string') return v
  if (typeof v !== 'object' || v === null) return ''
  if (v.mail) return v.mail || v.nombre || ''
  if (v.email) return v.email
  if (v.telefono) return v.telefono
  if (v.numero) return v.numero
  if (v.calleYnumero) return [v.calleYnumero, v.ciudad, v.cp, v.provincia].filter(Boolean).join(', ')
  if (v.nombre) return v.nombre
  if (v.descripcion) return v.descripcion
  return JSON.stringify(v)
}

const Cliente = (props) => {
  const location = useLocation()
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [snack, setSnack] = useState('')
  const [menuAnchor, setMenuAnchor] = useState(null)
  const nombre = decodeURIComponent(location.search.replace(/^\?/, ''))

  useEffect(() => {
    if (props.clientes && nombre) {
      setCliente({ nombre, ...props.clientes[nombre] })
      setLoading(false)
    }
  }, [props.clientes, nombre])

  const eliminar = async () => {
    setLoading(true)
    try {
      await removeData(props.user.uid, `clientes/${nombre}`)
      setSnack('Cliente eliminado')
      setTimeout(() => props.history.replace('/Clientes'), 1500)
    } catch { setLoading(false) }
  }

  if (loading || !cliente) {
    return (
      <Layout history={props.history} page="Cliente" user={props.user?.uid}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      </Layout>
    )
  }

  const d = cliente.datos || {}
  const pedidos = Object.values(cliente.pedidos || {})
  const pagos = Object.values(cliente.pagos || {})

  // Merge timeline
  const timeline = []
  pedidos.forEach((p, i) => {
    if (p.metodoDePago) {
      timeline.push({ fecha: p.fecha, tipo: 'pedido', data: p, key: `p-${i}`, monto: p.total || 0, aumento: true, concepto: `${p.articulos?.length || 0} artículo(s)` })
    }
  })
  pagos.forEach((p, i) => {
    const monto = parseFloat(p.total || p.monto || 0)
    if (monto > 0) {
      timeline.push({ fecha: p.fecha, tipo: 'pago', data: p, key: `pay-${i}`, monto, aumento: false, concepto: p.efectivo ? 'Efectivo' : 'Pago' })
    }
  })
  timeline.sort((a, b) => {
    const [dA, mA, yA] = (a.fecha || '').split('/')
    const [dB, mB, yB] = (b.fecha || '').split('/')
    return new Date(yB, mB - 1, dB) - new Date(yA, mA - 1, dA)
  })

  // Group by month
  const grouped = {}
  timeline.forEach((entry) => {
    const [d, m, y] = (entry.fecha || '').split('/')
    const key = `${y}-${m}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(entry)
  })
  const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <Layout history={props.history} page={nombre} user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* HEADER */}
        <Paper sx={{ borderRadius: 2, p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.dark', fontSize: 24, fontWeight: 700 }}>
                  {nombre[0]?.toUpperCase() || '?'}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{nombre}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.3 }}>
                    {d.dni && <Chip size="small" label={`DNI: ${d.dni}`} variant="outlined" />}
                    {d.cuit && <Chip size="small" label={`CUIT: ${d.cuit}`} variant="outlined" />}
                    {d.telefono?.map((t, i) => <Chip key={i} icon={<Phone sx={{ fontSize: 12 }} />} label={fmt(t)} size="small" />)}
                    {d.mails?.map((m, i) => <Chip key={i} icon={<Email sx={{ fontSize: 12 }} />} label={fmt(m)} size="small" />)}
                    {d.direcciones?.map((dir, i) => <Chip key={i} icon={<Place sx={{ fontSize: 12 }} />} label={fmt(dir)} size="small" variant="outlined" />)}
                    {d.expresos?.map((ex, i) => (
                      <Chip key={i} icon={<LocalShipping sx={{ fontSize: 12 }} />} label={fmt(ex)} size="small" variant="outlined"
                        component={Link} to={`/Expreso?${encodeURIComponent(fmt(ex))}`} clickable />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" size="small" component={Link} to={`/Nuevo-Pago-Cliente?${encodeURIComponent(nombre)}`} startIcon={<AttachMoney />}>
                  Cobrar
                </Button>
                <Button variant="outlined" size="small" component={Link} to={`/Historial-Cliente?${encodeURIComponent(nombre)}`} startIcon={<History />}>
                  Historial
                </Button>
                <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} size="small"><MoreVert /></IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* DEUDA */}
        <Paper sx={{ borderRadius: 2, p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">Deuda actual</Typography>
            <Typography variant="h4" fontWeight={900} color={d.deuda > 0 ? 'error.main' : 'success.main'}>
              $ {formatMoney(d.deuda || 0)}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.disabled">
            {pedidos.length} pedidos · {pagos.length} pagos
          </Typography>
        </Paper>

        {/* TIMELINE by month */}
        <Box sx={{ flex: 1 }}>
          {sortedKeys.length > 0 ? (
            sortedKeys.map((key) => {
              const [y, m] = key.split('-')
              const label = `${MONTHS[parseInt(m) - 1]} ${y}`
              const items = grouped[key]
              return (
                <Paper key={key} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                  <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'action.selected', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" fontWeight={700}>{label}</Typography>
                  </Box>
                  <Box sx={{ px: 2.5, py: 1 }}>
                    {items.map((entry) => (
                      <Box key={entry.key} sx={{ py: 0.8 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {entry.aumento ? <ArrowUpward sx={{ fontSize: 18, color: 'error.main' }} /> : <ArrowDownward sx={{ fontSize: 18, color: 'success.main' }} />}
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {entry.tipo === 'pedido' ? 'Pedido' : 'Pago'}
                              </Typography>
                              <Typography variant="caption" color="text.disabled">
                                {entry.fecha} · {entry.concepto}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" fontWeight={700} color={entry.aumento ? 'error.main' : 'success.main'}>
                            {entry.aumento ? '+' : '-'}$ {formatMoney(entry.monto)}
                          </Typography>
                        </Box>
                        {entry.tipo === 'pedido' && entry.data.articulos?.slice(0, 3).map((art, j) => {
                          const prodData = props.productos?.[art.nombre || art.producto]
                          return (
                            <Box key={j} sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 4.5, py: 0.2 }}>
                              {prodData?.imagen && <ImgCache src={prodData.imagen} sx={{ width: 20, height: 20, borderRadius: 0.5 }} />}
                              <Typography variant="caption" sx={{ flex: 1 }}>{art.nombre || art.producto}</Typography>
                              <Typography variant="caption" color="text.disabled">{art.cantidad}u</Typography>
                              <Typography variant="caption" fontWeight={600}>$ {formatMoney((art.cantidad || 0) * (art.precio || 0))}</Typography>
                            </Box>
                          )
                        })}
                      </Box>
                    ))}
                  </Box>
                </Paper>
              )
            })
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>Sin movimientos.</Typography>
          )}
        </Box>
      </Box>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MenuItem component={Link} to={`/Editar-Cliente?${encodeURIComponent(nombre)}`} onClick={() => setMenuAnchor(null)}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Editar
        </MenuItem>
        <MenuItem onClick={() => { setMenuAnchor(null); if (window.confirm('Eliminar?')) eliminar() }}>
          <Delete fontSize="small" sx={{ mr: 1, color: 'error.main' }} /> Eliminar
        </MenuItem>
      </Menu>

      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(Cliente)
