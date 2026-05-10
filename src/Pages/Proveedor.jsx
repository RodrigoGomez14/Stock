import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Card, CardContent, Chip, IconButton,
  Button, Tabs, Tab, Backdrop, CircularProgress, Snackbar,
  Table, TableHead, TableBody, TableRow, TableCell, Paper
} from '@mui/material'
import { Alert } from '@mui/material'
import { Edit, Delete, Phone, Email, Place, LocalShipping } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { database } from '../services'
import { checkSearch, formatMoney } from '../utilities'

const Proveedor = (props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [proveedor, setProveedor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
  const [snack, setSnack] = useState('')
  const nombre = checkSearch(location.search)

  useEffect(() => {
    if (props.proveedores && nombre) {
      const p = props.proveedores[nombre]
      if (p) setProveedor({ nombre, ...p })
      setLoading(false)
    }
  }, [props.proveedores, nombre])

  const eliminar = async () => {
    setLoading(true)
    try {
      await database().ref().child(props.user.uid).child('proveedores').child(nombre).remove()
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h5" fontWeight={700}>{nombre}</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {d.telefono?.map((t, i) => <Chip key={i} icon={<Phone />} label={t} size="small" variant="outlined" />)}
                  {d.mails?.map((m, i) => <Chip key={i} icon={<Email />} label={m} size="small" variant="outlined" />)}
                  {d.direcciones?.map((dir, i) => <Chip key={i} icon={<Place />} label={dir} size="small" variant="outlined" />)}
                  {d.expresos?.map((ex, i) => <Chip key={i} icon={<LocalShipping />} label={ex} size="small" variant="outlined" />)}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton component={Link} to={`/Editar-Proveedor?${nombre}`}><Edit /></IconButton>
                <IconButton color="error" onClick={() => { if (window.confirm('Eliminar proveedor?')) eliminar() }}><Delete /></IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: 3, textAlign: 'center', py: 1 }}>
              <CardContent sx={{ py: '8px !important' }}>
                <Typography variant="h5" fontWeight={700} color={d.deuda > 0 ? 'error' : 'success'}>$ {formatMoney(d.deuda || 0)}</Typography>
                <Typography variant="caption" color="text.secondary">Deuda</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: 3, textAlign: 'center', py: 1 }}>
              <CardContent sx={{ py: '8px !important' }}>
                <Typography variant="h5" fontWeight={700}>{entregas.length}</Typography>
                <Typography variant="caption" color="text.secondary">Entregas</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: 3, textAlign: 'center', py: 1 }}>
              <CardContent sx={{ py: '8px !important' }}>
                <Typography variant="h5" fontWeight={700}>{pagos.length}</Typography>
                <Typography variant="caption" color="text.secondary">Pagos</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button variant="contained" component={Link} to={`/Nuevo-Pago-Proveedor?${nombre}`}>Registrar Pago</Button>
          <Button variant="outlined" component={Link} to={`/Historial-Proveedor?${nombre}`}>Ver Historial</Button>
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
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}><Alert severity="success">{snack}</Alert></Snackbar>
    </Layout>
  )
}

export default withStore(Proveedor)
