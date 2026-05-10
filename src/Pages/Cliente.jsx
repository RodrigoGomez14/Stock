import React, { useState, useEffect } from 'react'
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

const Cliente = (props) => {
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
  const [snack, setSnack] = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const nombre = checkSearch(props.history.location.search)

  useEffect(() => {
    if (props.clientes && nombre) {
      setCliente({ nombre, ...props.clientes[nombre] })
      setLoading(false)
    }
  }, [props.clientes, nombre])

  const eliminar = async () => {
    setLoading(true)
    try {
      await database().ref().child(props.user.uid).child('clientes').child(nombre).remove()
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

  return (
    <Layout history={props.history} page={nombre} user={props.user?.uid}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
        {/* Header */}
        <Card sx={{ borderRadius: 3, mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h5" fontWeight={700}>{nombre}</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {d.telefono?.map((t, i) => (
                    <Chip key={i} icon={<Phone />} label={t} size="small" variant="outlined" />
                  ))}
                  {d.mails?.map((m, i) => (
                    <Chip key={i} icon={<Email />} label={m} size="small" variant="outlined" />
                  ))}
                  {d.direcciones?.map((dir, i) => (
                    <Chip key={i} icon={<Place />} label={dir} size="small" variant="outlined" />
                  ))}
                  {d.expresos?.map((ex, i) => (
                    <Chip key={i} icon={<LocalShipping />} label={ex} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton component={Link} to={`/Editar-Cliente?${nombre}`}><Edit /></IconButton>
                <IconButton color="error" onClick={() => { if (window.confirm('Eliminar cliente?')) eliminar() }}><Delete /></IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: 3, textAlign: 'center', py: 1 }}>
              <CardContent sx={{ py: '8px !important' }}>
                <Typography variant="h5" fontWeight={700} color={d.deuda > 0 ? 'error' : 'success'}>
                  $ {formatMoney(d.deuda || 0)}
                </Typography>
                <Typography variant="caption" color="text.secondary">Deuda</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: 3, textAlign: 'center', py: 1 }}>
              <CardContent sx={{ py: '8px !important' }}>
                <Typography variant="h5" fontWeight={700}>{pedidos.length}</Typography>
                <Typography variant="caption" color="text.secondary">Pedidos</Typography>
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

        {/* Acciones */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button variant="contained" component={Link} to={`/Nuevo-Pago-Cliente?${nombre}`}>
            Registrar Pago
          </Button>
          <Button variant="outlined" component={Link} to={`/Historial-Cliente?${nombre}`}>
            Ver Historial
          </Button>
        </Box>

        {/* Tabs */}
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Pedidos" />
          <Tab label="Pagos" />
          <Tab label="Info Extra" />
        </Tabs>

        {tab === 0 && (
          pedidos.length > 0 ? (
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Artículos</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pedidos.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell>{p.fecha}</TableCell>
                      <TableCell>{p.articulos?.map(a => `${a.cantidad}x ${a.nombre}`).join(', ') || '—'}</TableCell>
                      <TableCell align="right">$ {formatMoney(p.total || 0)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Sin pedidos</Typography>
          )
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
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Sin pagos registrados</Typography>
          )
        )}

        {tab === 2 && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              {d.infoExtra?.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {d.infoExtra.map((item, i) => (
                    <Paper key={i} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                      <Typography variant="body2">{item}</Typography>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>Sin info adicional</Typography>
              )}
            </CardContent>
          </Card>
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
