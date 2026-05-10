import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  Badge, CreditCard, Payment, Person,
  AttachMoney, History, Send
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { removeData } from '../services'
import { formatMoney } from '../utilities'

const fmt = (v) => {
  if (typeof v === 'string') return v
  if (typeof v !== 'object' || v === null) return ''
  if (v.mail) return v.mail
  if (v.email) return v.email
  if (v.telefono) return v.telefono
  if (v.numero) return v.numero
  if (v.calleYnumero) {
    const parts = [v.calleYnumero, v.ciudad, v.cp, v.provincia].filter(Boolean)
    return parts.join(', ')
  }
  if (v.nombre) return v.nombre
  return JSON.stringify(v)
}

const Proveedor = (props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [proveedor, setProveedor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [snack, setSnack] = useState('')
  const nombre = decodeURIComponent(location.search.replace(/^\?/, ''))

  useEffect(() => {
    if (props.proveedores && nombre) {
      setProveedor({ nombre, ...props.proveedores[nombre] })
      setLoading(false)
    }
  }, [props.proveedores, nombre])

  const eliminar = async () => {
    setLoading(true)
    try {
      await removeData(props.user.uid, `proveedores/${nombre}`)
      setSnack('Proveedor eliminado')
      setTimeout(() => navigate('/Proveedores', { replace: true }), 1500)
    } catch { setLoading(false) }
  }

  if (loading || !proveedor) {
    return (
      <Layout history={props.history} page="Proveedor" user={props.user?.uid}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      </Layout>
    )
  }

  const d = proveedor.datos || {}
  const entregas = Object.values(proveedor.entregas || {})
  const pagos = Object.values(proveedor.pagos || {})

  return (
    <Layout history={props.history} page={nombre} user={props.user?.uid}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>

        {/* HEADER */}
        <Paper sx={{ borderRadius: 2, p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 64, height: 64, borderRadius: 2, bgcolor: 'primary.dark',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Person sx={{ fontSize: 32, color: 'primary.light' }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>{nombre}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                    {d.dni && <Chip icon={<Badge />} label={`DNI: ${d.dni}`} size="small" variant="outlined" />}
                    {d.cuit && <Chip icon={<CreditCard />} label={`CUIT: ${d.cuit}`} size="small" variant="outlined" />}
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { md: 'flex-end' }, flexWrap: 'wrap' }}>
                <Button variant="contained" component={Link} to={`/Nuevo-Pago-Proveedor?${encodeURIComponent(nombre)}`} startIcon={<AttachMoney />}>
                  Registrar Pago
                </Button>
                <Button variant="outlined" component={Link} to={`/Historial-Proveedor?${encodeURIComponent(nombre)}`} startIcon={<History />}>
                  Historial
                </Button>
                <Button variant="outlined" component={Link} to={`/Editar-Proveedor?${encodeURIComponent(nombre)}`} startIcon={<Edit />}>
                  Editar
                </Button>
                <IconButton color="error" onClick={() => { if (window.confirm('Eliminar?')) eliminar() }}><Delete /></IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* 2-COLUMN LAYOUT */}
        <Grid container spacing={3}>
          {/* LEFT: Contacto */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ borderRadius: 2, p: 2.5, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>Contacto</Typography>
              <Divider sx={{ mb: 2 }} />

              {d.telefono?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <Phone sx={{ fontSize: 14 }} /> Teléfono
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {d.telefono.map((t, i) => <Chip key={i} label={fmt(t)} size="small" />)}
                  </Box>
                </Box>
              )}

              {d.mails?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <Email sx={{ fontSize: 14 }} /> Email
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {d.mails.map((m, i) => <Chip key={i} label={fmt(m)} size="small" />)}
                  </Box>
                </Box>
              )}

              {d.direcciones?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <Place sx={{ fontSize: 14 }} /> Direcciones
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {d.direcciones.map((dir, i) => <Chip key={i} label={fmt(dir)} size="small" variant="outlined" />)}
                  </Box>
                </Box>
              )}

              {d.expresos?.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <LocalShipping sx={{ fontSize: 14 }} /> Transporte
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {d.expresos.map((ex, i) => (
                      <Chip key={i} label={fmt(ex)} size="small" variant="outlined" component={Link}
                        to={`/Expreso?${encodeURIComponent(fmt(ex))}`} clickable />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* RIGHT: Stats + Tables */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={4}>
                <Card sx={{ borderRadius: 2, textAlign: 'center', py: 2 }}>
                  <AttachMoney sx={{ fontSize: 32, color: d.deuda > 0 ? 'error.main' : 'success.main' }} />
                  <Typography variant="h5" fontWeight={800}>$ {formatMoney(d.deuda || 0)}</Typography>
                  <Typography variant="caption" color="text.secondary">Deuda</Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ borderRadius: 2, textAlign: 'center', py: 2 }}>
                  <Send sx={{ fontSize: 32, color: 'primary.light' }} />
                  <Typography variant="h5" fontWeight={800}>{entregas.length}</Typography>
                  <Typography variant="caption" color="text.secondary">Entregas</Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ borderRadius: 2, textAlign: 'center', py: 2 }}>
                  <Payment sx={{ fontSize: 32, color: 'success.main' }} />
                  <Typography variant="h5" fontWeight={800}>{pagos.length}</Typography>
                  <Typography variant="caption" color="text.secondary">Pagos</Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Entregas */}
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
              <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight={700}>Entregas recibidas</Typography>
              </Box>
              {entregas.length > 0 ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Productos</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entregas.slice(0, 5).map((e, i) => (
                      <TableRow key={i} hover>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{e.fecha}</TableCell>
                        <TableCell>{e.articulos?.map(a => `${a.cantidad}x ${a.producto || a.nombre}`).join(', ') || '—'}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>$ {formatMoney(e.total || 0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}><Typography color="text.secondary">Sin entregas</Typography></Box>
              )}
            </Paper>

            {/* Pagos */}
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight={700}>Pagos realizados</Typography>
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
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{p.fecha}</TableCell>
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
                <Box sx={{ p: 3, textAlign: 'center' }}><Typography color="text.secondary">Sin pagos</Typography></Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(Proveedor)
