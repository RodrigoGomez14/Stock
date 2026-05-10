import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Card, CardContent, IconButton,
  Button, Backdrop, CircularProgress, Snackbar,
  Table, TableHead, TableBody, TableRow, TableCell, Paper,
  Chip, Divider
} from '@mui/material'
import { Alert } from '@mui/material'
import {
  Edit, Delete, Phone, Email, Place, LocalShipping,
  Badge, CreditCard, Receipt, Payment, Person,
  CalendarMonth, AttachMoney
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { removeData } from '../services'
import { formatMoney } from '../utilities'

const toStr = (v) => (typeof v === 'string' ? v : JSON.stringify(v))

const Cliente = (props) => {
  const location = useLocation()
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [snack, setSnack] = useState('')
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
  const pedidos = cliente.pedidos ? Object.values(cliente.pedidos) : []
  const pagos = cliente.pagos ? Object.values(cliente.pagos) : []
  const totalPedidos = pedidos.reduce((s, p) => s + parseFloat(p.total || 0), 0)
  const totalPagado = pagos.reduce((s, p) => s + parseFloat(p.total || p.monto || 0), 0)

  return (
    <Layout history={props.history} page={nombre} user={props.user?.uid}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', p: 2.5 }}>
        {/* === CABECERA === */}
        <Paper sx={{ borderRadius: 2, p: 3, mb: 2, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 56, height: 56, borderRadius: 2, bgcolor: 'primary.dark',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Person sx={{ fontSize: 28, color: 'primary.light' }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>{nombre}</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                  {d.dni && <Chip icon={<Badge />} label={`DNI: ${d.dni}`} size="small" variant="outlined" />}
                  {d.cuit && <Chip icon={<CreditCard />} label={`CUIT: ${d.cuit}`} size="small" variant="outlined" />}
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Button size="small" component={Link} to={`/Editar-Cliente?${encodeURIComponent(nombre)}`} startIcon={<Edit />}>Editar</Button>
              <IconButton size="small" color="error" onClick={() => { if (window.confirm('Eliminar cliente?')) eliminar() }}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* === FILA DE TARJETAS RESUMEN === */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 1.5 }}>
              <AttachMoney sx={{ color: d.deuda > 0 ? 'error.main' : 'success.main', fontSize: 28 }} />
              <Typography variant="h5" fontWeight={700}>
                $ {formatMoney(d.deuda || 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">Deuda actual</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 1.5 }}>
              <Receipt sx={{ color: 'primary.light', fontSize: 28 }} />
              <Typography variant="h5" fontWeight={700}>{pedidos.length}</Typography>
              <Typography variant="caption" color="text.secondary">Pedidos</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 1.5 }}>
              <Payment sx={{ color: 'success.main', fontSize: 28 }} />
              <Typography variant="h5" fontWeight={700}>{pagos.length}</Typography>
              <Typography variant="caption" color="text.secondary">Pagos</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 1.5 }}>
              <CalendarMonth sx={{ color: 'warning.main', fontSize: 28 }} />
              <Typography variant="h5" fontWeight={700}>
                $ {formatMoney(totalPedidos - totalPagado - d.deuda > 0 ? totalPedidos - totalPagado - d.deuda : 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">Pendiente</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* === INFORMACIÓN DE CONTACTO — DOS COLUMNAS === */}
        <Paper sx={{ borderRadius: 2, p: 2.5, mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge fontSize="small" color="primary" /> Datos de contacto
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              {d.telefono?.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <Phone fontSize="small" /> Teléfono
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {d.telefono.map((t, i) => <Chip key={i} label={toStr(t)} size="small" variant="filled" />)}
                  </Box>
                </Box>
              )}
              {d.mails?.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <Email fontSize="small" /> Email
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {d.mails.map((m, i) => <Chip key={i} label={toStr(m)} size="small" variant="filled" />)}
                  </Box>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {d.direcciones?.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <Place fontSize="small" /> Direcciones
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {d.direcciones.map((dir, i) => <Chip key={i} label={toStr(dir)} size="small" variant="outlined" />)}
                  </Box>
                </Box>
              )}
              {d.expresos?.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <LocalShipping fontSize="small" /> Expreso / Transporte
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {d.expresos.map((ex, i) => <Chip key={i} label={toStr(ex)} size="small" variant="outlined" />)}
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* === ACCIONES === */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button variant="contained" component={Link} to={`/Nuevo-Pago-Cliente?${encodeURIComponent(nombre)}`}>
            Registrar Pago
          </Button>
          <Button variant="outlined" component={Link} to={`/Historial-Cliente?${encodeURIComponent(nombre)}`}>
            Ver Historial
          </Button>
        </Box>

        {/* === PEDIDOS RECIENTES === */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
          <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight={700}>Pedidos</Typography>
            {pedidos.length > 5 && (
              <Typography variant="caption" color="text.secondary">Últimos 5</Typography>
            )}
          </Box>
          {pedidos.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Artículos</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidos.slice(0, 5).map((p, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{p.fecha}</TableCell>
                    <TableCell>
                      {p.articulos?.map(a => `${a.cantidad}x ${a.nombre || a.producto}`).join(', ') || '—'}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>$ {formatMoney(p.total || 0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary" variant="body2">Sin pedidos registrados</Typography>
            </Box>
          )}
        </Paper>

        {/* === PAGOS RECIENTES === */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
          <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight={700}>Pagos</Typography>
          </Box>
          {pagos.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Método</TableCell>
                  <TableCell align="right">Monto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagos.slice(0, 5).map((p, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{p.fecha}</TableCell>
                    <TableCell>
                      {p.efectivo && <Chip label="Efectivo" size="small" variant="outlined" sx={{ mr: 0.3 }} />}
                      {p.totalTransferencia && <Chip label="Transf." size="small" variant="outlined" sx={{ mr: 0.3 }} />}
                      {p.cheques?.length > 0 && <Chip label={`${p.cheques.length} ch.`} size="small" variant="outlined" />}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>$ {formatMoney(p.total || p.monto || 0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary" variant="body2">Sin pagos registrados</Typography>
            </Box>
          )}
        </Paper>

        {/* === INFO EXTRA === */}
        {d.infoExtra?.length > 0 && (
          <Paper sx={{ borderRadius: 2, p: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Notas</Typography>
            <Divider sx={{ mb: 1.5 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {d.infoExtra.map((item, i) => (
                <Paper key={i} variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
                  <Typography variant="body2">{toStr(item)}</Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
        )}
      </Box>

      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(Cliente)
