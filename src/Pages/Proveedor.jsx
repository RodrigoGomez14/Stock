import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Card, CardContent, IconButton,
  Button, Tabs, Tab, Backdrop, CircularProgress, Snackbar,
  Table, TableHead, TableBody, TableRow, TableCell, Paper,
  Divider
} from '@mui/material'
import { Alert } from '@mui/material'
import {
  Edit, Delete, Phone, Email, Place, LocalShipping,
  Badge, CreditCard, Payment
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { removeData } from '../services'
import { formatMoney } from '../utilities'

const toStr = (v) => typeof v === 'string' ? v : JSON.stringify(v)

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.8 }}>
    <Box sx={{ color: 'primary.light', display: 'flex' }}>{icon}</Box>
    <Box sx={{ minWidth: 80 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Box>
    <Typography variant="body2">{value || '—'}</Typography>
  </Box>
)

const Proveedor = (props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [proveedor, setProveedor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
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
  const entregas = proveedor.entregas ? Object.values(proveedor.entregas) : []
  const pagos = proveedor.pagos ? Object.values(proveedor.pagos) : []

  return (
    <Layout history={props.history} page={nombre} user={props.user?.uid}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
        <Card sx={{ borderRadius: 3, mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight={700}>{nombre}</Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button size="small" component={Link} to={`/Editar-Proveedor?${encodeURIComponent(nombre)}`} startIcon={<Edit />}>Editar</Button>
                <IconButton size="small" color="error" onClick={() => { if (window.confirm('Eliminar proveedor?')) eliminar() }}><Delete /></IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Badge fontSize="small" /> Información de contacto
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            <Grid container spacing={0}>
              <Grid item xs={12} sm={6}>
                {d.telefono?.length > 0 && (
                  <InfoRow icon={<Phone fontSize="small" />} label="Teléfono" value={d.telefono.map(toStr).join(' | ')} />
                )}
                {d.mails?.length > 0 && (
                  <InfoRow icon={<Email fontSize="small" />} label="Email" value={d.mails.map(toStr).join(' | ')} />
                )}
                {d.direcciones?.length > 0 && (
                  <InfoRow icon={<Place fontSize="small" />} label="Dirección" value={d.direcciones.map(toStr).join(' | ')} />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {d.expresos?.length > 0 && (
                  <InfoRow icon={<LocalShipping fontSize="small" />} label="Expreso" value={d.expresos.map(toStr).join(' | ')} />
                )}
                {d.dni && <InfoRow icon={<Badge fontSize="small" />} label="DNI" value={d.dni} />}
                {d.cuit && <InfoRow icon={<CreditCard fontSize="small" />} label="CUIT" value={d.cuit} />}
                <InfoRow icon={<Payment fontSize="small" />} label="Deuda" value={`$ ${formatMoney(d.deuda || 0)}`} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button variant="contained" component={Link} to={`/Nuevo-Pago-Proveedor?${encodeURIComponent(nombre)}`}>Registrar Pago</Button>
          <Button variant="outlined" component={Link} to={`/Historial-Proveedor?${encodeURIComponent(nombre)}`}>Ver Historial</Button>
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Entregas" />
          <Tab label="Pagos" />
        </Tabs>

        {tab === 0 && (
          entregas.length > 0 ? (
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Productos</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entregas.map((e, i) => (
                    <TableRow key={i}>
                      <TableCell>{e.fecha}</TableCell>
                      <TableCell>{e.articulos?.map(a => `${a.cantidad}x ${a.producto}`).join(', ') || '—'}</TableCell>
                      <TableCell align="right">$ {formatMoney(e.total || 0)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ) : <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Sin entregas</Typography>
        )}

        {tab === 1 && (
          pagos.length > 0 ? (
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell align="right">Monto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagos.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell>{p.fecha}</TableCell>
                      <TableCell align="right">$ {formatMoney(p.monto || 0)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ) : <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Sin pagos</Typography>
        )}
      </Box>

      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(Proveedor)
