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
  AttachMoney, History, Send
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { removeData } from '../services'
import { formatMoney } from '../utilities'
import { ImgCache } from '../components/ImgCache'

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
  if (v.descripcion) return v.descripcion
  if (v.nombre) return v.nombre
  return JSON.stringify(v)
}

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
  const pedidos = Object.values(cliente.pedidos || {})
  const pagos = Object.values(cliente.pagos || {})

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
                <Button variant="contained" component={Link} to={`/Nuevo-Pago-Cliente?${encodeURIComponent(nombre)}`} startIcon={<AttachMoney />}>
                  Registrar Pago
                </Button>
                <Button variant="outlined" component={Link} to={`/Historial-Cliente?${encodeURIComponent(nombre)}`} startIcon={<History />}>
                  Historial
                </Button>
                <Button variant="outlined" component={Link} to={`/Editar-Cliente?${encodeURIComponent(nombre)}`} startIcon={<Edit />}>
                  Editar
                </Button>
                <IconButton color="error" onClick={() => { if (window.confirm('Eliminar cliente?')) eliminar() }}>
                  <Delete />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* CONTENT: 2-COLUMN LAYOUT */}
        <Grid container spacing={3}>
          {/* LEFT COLUMN: Contact info */}
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
                    <LocalShipping sx={{ fontSize: 14 }} /> Transporte preferido
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

            {/* Info extra */}
            {d.infoExtra?.length > 0 && (
              <Paper sx={{ borderRadius: 2, p: 2.5, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>Notas</Typography>
                <Divider sx={{ mb: 1.5 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {d.infoExtra.map((item, i) => (
                    <Paper key={i} variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
                      <Typography variant="body2">{fmt(item)}</Typography>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            )}
          </Grid>

          {/* RIGHT COLUMN: Stats + Orders + Payments */}
          <Grid item xs={12} md={7}>
            {/* Stats row */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={4}>
                <Card sx={{ borderRadius: 2, textAlign: 'center', py: 2 }}>
                  <AttachMoney sx={{ fontSize: 32, color: d.deuda > 0 ? 'error.main' : 'success.main' }} />
                  <Typography variant="h5" fontWeight={800}>$ {formatMoney(d.deuda || 0)}</Typography>
                  <Typography variant="caption" color="text.secondary">Deuda actual</Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ borderRadius: 2, textAlign: 'center', py: 2 }}>
                  <Receipt sx={{ fontSize: 32, color: 'primary.light' }} />
                  <Typography variant="h5" fontWeight={800}>{pedidos.length}</Typography>
                  <Typography variant="caption" color="text.secondary">Pedidos</Typography>
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

            {/* Pedidos */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Pedidos {pedidos.length > 5 && <Typography variant="caption" color="text.secondary" component="span">(últimos 5)</Typography>}
              </Typography>
              {pedidos.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {pedidos.slice(0, 5).map((p, i) => (
                    <Paper key={i} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                      {/* Header */}
                      <Box sx={{ px: 2, py: 1.5, bgcolor: 'action.selected', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">{p.fecha}</Typography>
                        <Typography variant="h6" fontWeight={800} color="primary.main">$ {formatMoney(p.total || 0)}</Typography>
                      </Box>
                      {/* Articles */}
                      <Box sx={{ px: 2, py: 1.5 }}>
                        {p.articulos?.map((art, j) => {
                          const prodData = props.productos?.[art.nombre || art.producto]
                          return (
                            <Box key={j} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                              {prodData?.imagen ? (
                                <ImgCache src={prodData.imagen} sx={{ width: 32, height: 32, borderRadius: 1, objectFit: 'cover', flexShrink: 0 }} />
                              ) : null}
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="body2" fontWeight={600}>{art.nombre || art.producto}</Typography>
                                <Typography variant="caption" color="text.disabled">{art.cantidad}u × $ {formatMoney(art.precio || 0)}</Typography>
                              </Box>
                              <Typography variant="body2" fontWeight={700}>$ {formatMoney((art.cantidad || 0) * (art.precio || 0))}</Typography>
                            </Box>
                          )
                        })}
                        {/* Shipping */}
                        {p.metodoDeEnvio && typeof p.metodoDeEnvio === 'object' && (
                          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="caption" color="text.secondary">
                              📦 Envío: {p.metodoDeEnvio.expreso || 'Particular'}
                              {p.metodoDeEnvio.remito && ` — Remito: ${p.metodoDeEnvio.remito}`}
                              {p.metodoDeEnvio.precio > 0 && ` (+$${formatMoney(p.metodoDeEnvio.precio)})`}
                            </Typography>
                          </Box>
                        )}
                        {/* Payment */}
                        {p.metodoDePago && (
                          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {p.metodoDePago.efectivo && <Chip label={`Efectivo: $${formatMoney(p.metodoDePago.efectivo)}`} size="small" variant="outlined" />}
                            {p.metodoDePago.totalTransferencia && <Chip label={`Transf.: $${formatMoney(p.metodoDePago.totalTransferencia)}`} size="small" variant="outlined" />}
                            {p.metodoDePago.cheques?.length > 0 && <Chip label={`${p.metodoDePago.cheques.length} cheque(s)`} size="small" variant="outlined" />}
                          </Box>
                        )}
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'center', py: 3 }}>Sin pedidos</Typography>
              )}
            </Box>

            {/* Pagos */}
            <Box>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>Pagos</Typography>
              {pagos.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {pagos.map((p, i) => (
                    <Paper key={i} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                      <Box sx={{ px: 2, py: 1.5, bgcolor: 'action.selected', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">{p.fecha}</Typography>
                        <Typography variant="h6" fontWeight={800} color="success.main">$ {formatMoney(p.total || p.monto || 0)}</Typography>
                      </Box>
                      <Box sx={{ px: 2, py: 1.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {p.efectivo && <Chip label={`Efectivo: $${formatMoney(p.efectivo)}`} size="small" />}
                        {p.transferencias?.map((t, j) => <Chip key={j} label={`${t.cuenta}: $${formatMoney(t.monto)}`} size="small" variant="outlined" />)}
                        {p.cheques?.length > 0 && <Chip label={`${p.cheques.length} cheque(s)`} size="small" variant="outlined" />}
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'center', py: 3 }}>Sin pagos</Typography>
              )}
            </Box>
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

export default withStore(Cliente)
