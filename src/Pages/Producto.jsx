import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Typography, Grid, Card, CardContent, Chip,
  Button, Snackbar, Backdrop, CircularProgress, Paper, Avatar
} from '@mui/material'
import { Alert } from '@mui/material'
import { Edit } from '@mui/icons-material'
import { formatMoney } from '../utilities'

const Producto = (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const [producto, setProducto] = useState(null)
  const nombre = decodeURIComponent(location.search.replace(/^\?/, ''))

  useEffect(() => {
    if (props.productos && nombre) {
      const p = props.productos[nombre]
      if (p) setProducto({ nombre, ...p })
    }
  }, [props.productos, nombre])

  if (!producto) {
    return (
      <Layout history={props.history} page="Producto" user={props.user?.uid}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, py: 8 }}>
          <CircularProgress />
          <Typography color="text.secondary">Cargando producto...</Typography>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout history={props.history} page={nombre} user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* HEADER */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3, alignItems: 'flex-start' }}>
          {producto.imagen ? (
            <Avatar src={producto.imagen} variant="rounded" sx={{ width: 160, height: 160, boxShadow: 2 }} />
          ) : (
            <Box sx={{ width: 120, height: 120, borderRadius: 2, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography variant="h2">📷</Typography>
            </Box>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={700}>{nombre}</Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
              <Chip label={producto.isSubproducto ? 'Subproducto' : 'Producto final'} color={producto.isSubproducto ? 'warning' : 'primary'} size="small" />
              <Chip label={`Stock: ${producto.cantidad || 0}`} color={(producto.cantidad || 0) > 0 ? 'success' : 'error'} variant="outlined" size="small" />
            </Box>
          </Box>
        </Box>

        {/* PRICE + STOCK */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 2 }}>
              <Typography variant="h3" fontWeight={900} color="primary">$ {formatMoney(producto.precio || 0)}</Typography>
              <Typography variant="caption" color="text.secondary">Precio</Typography>
              <Button size="small" variant="outlined" startIcon={<Edit />} sx={{ mt: 1, display: 'block', mx: 'auto', fontSize: 11 }}>
                Editar precio
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 2 }}>
              <Typography variant="h3" fontWeight={900}>{producto.cantidad || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Stock</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* ACTIONS */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Button variant="contained" onClick={() => navigate('/Editar-Producto?' + nombre)}>Editar producto</Button>
          {producto.cadenaDeProduccion?.length > 0 && (
            <Button variant="outlined" onClick={() => navigate('/Finalizar-Proceso?' + nombre)}>Iniciar cadena</Button>
          )}
        </Box>

        {/* CADENA DE PRODUCCIÓN */}
        {producto.cadenaDeProduccion?.length > 0 && (
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
            <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={700}>Cadena de producción</Typography>
              <Typography variant="caption" color="text.secondary">{producto.cadenaDeProduccion.length} paso(s)</Typography>
            </Box>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={1.5}>
                {producto.cadenaDeProduccion.map((p, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Typography variant="body2" fontWeight={700} color="#fff">{i + 1}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{p.proceso}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {p.isProcesoPropio ? 'Proceso propio' : p.proveedor}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        )}

        {/* SUBPRODUCTOS — tabla */}
        {producto.subproductos?.length > 0 && (
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
            <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={700}>Componentes / Subproductos</Typography>
              <Typography variant="caption" color="text.secondary">{producto.subproductos.length} componente(s)</Typography>
            </Box>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={1.5}>
                {producto.subproductos.map((sp, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="body2" fontWeight={600}>{sp.nombre}</Typography>
                      <Typography variant="h5" fontWeight={800} color="primary.main">{sp.cantidad}</Typography>
                      <Typography variant="caption" color="text.secondary">unidades</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        )}

        {/* MATRICES */}
        {producto.matrices?.length > 0 && (
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
            <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={700}>Matrices / Noyos</Typography>
              <Typography variant="caption" color="text.secondary">{producto.matrices.length} matriz(ces)</Typography>
            </Box>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={1.5}>
                {producto.matrices.map((m, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                      <Typography variant="body2" fontWeight={600}>{m.nombre}</Typography>
                      <Typography variant="caption" color="text.secondary">{m.ubicacion || '—'}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
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

export default withStore(Producto)
