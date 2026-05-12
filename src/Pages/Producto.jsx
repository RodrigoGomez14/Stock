import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Typography, Grid,
  Button, Snackbar, Backdrop, CircularProgress, Paper, Avatar
} from '@mui/material'
import { Alert } from '@mui/material'
import { formatMoney, getProducto } from '../utilities'
import StockHistory from '../components/StockHistory'

const Producto = (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const [producto, setProducto] = useState(null)
  const nombre = decodeURIComponent(location.search.replace(/^\?/, ''))

  useEffect(() => {
    if (props.productos && nombre) {
      const p = getProducto(props.productos, nombre)
      if (p) setProducto({ nombre: p.nombre || nombre, ...p })
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
    <Layout history={props.history} page={producto.nombre || nombre} user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* HEADER */}
        <Paper sx={{ borderRadius: 2, p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {producto.imagen ? (
              <Avatar src={producto.imagen} variant="rounded" sx={{ width: 80, height: 80, boxShadow: 2 }} />
            ) : (
              <Box sx={{ width: 80, height: 80, borderRadius: 2, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Typography variant="h3">📷</Typography>
              </Box>
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700}>{producto.nombre || nombre}</Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                <Paper variant="outlined" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.2, py: 0.3, borderRadius: 1.5, bgcolor: producto.isSubproducto ? 'warning.main' : 'primary.dark' }}>
                  <Typography variant="body2">{producto.isSubproducto ? '🧩' : '📦'}</Typography>
                  <Typography variant="caption" fontWeight={700} sx={{ color: '#fff' }}>{producto.isSubproducto ? 'Subproducto' : 'Producto final'}</Typography>
                </Paper>
                {producto.seVendePorSeparado && (
                  <Paper variant="outlined" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.2, py: 0.3, borderRadius: 1.5, bgcolor: 'success.main' }}>
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#fff' }}>Se vende por separado</Typography>
                  </Paper>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              <Button variant="contained" onClick={() => navigate('/Editar-Producto?' + encodeURIComponent(producto.nombre || nombre))} startIcon={<span>✏️</span>} sx={{ px: 2.5 }}>
                Editar
              </Button>
              {producto.cadenaDeProduccion?.length > 0 && (
                <Button variant="outlined" onClick={() => navigate('/Finalizar-Proceso?' + encodeURIComponent(producto.nombre || nombre))} startIcon={<span>▶️</span>} sx={{ px: 2.5 }}>
                  Iniciar cadena
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* PRICE + MELI + TYPE + STOCK */}
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center', bgcolor: 'primary.main' }}>
              <Typography variant="h3" fontWeight={900} sx={{ color: '#fff' }}>$ {formatMoney(producto.precio || 0)}</Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: 'rgba(255,255,255,0.7)' }}>Precio</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center', bgcolor: '#ECC400' }}>
              <Typography variant="h3" fontWeight={900} sx={{ color: '#1a1a1a' }}>$ {formatMoney(producto.precioMeli || 0)}</Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: 'rgba(26,26,26,0.6)' }}>Precio MELI</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ mb: 0.2 }}>📋</Typography>
              <Typography variant="body2" fontWeight={700}>{producto.categoria || 'Sin categoría'}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={900}>{producto.cantidad || 0}</Typography>
              <Typography variant="caption" fontWeight={700} color="text.secondary">Stock</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* VARIANTES */}
        {producto.variantes && Object.keys(producto.variantes).length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Variantes ({Object.keys(producto.variantes).length})</Typography>
            <Grid container spacing={1.5}>
              {Object.entries(producto.variantes).map(([key, v]) => (
                <Grid item xs={6} sm={4} md={3} key={key}>
                  <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center', bgcolor: 'primary.dark' }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff' }}>{v.cantidad ?? 0}</Typography>
                    <Typography variant="caption" fontWeight={600} sx={{ color: 'rgba(255,255,255,0.7)' }}>{key}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* CADENA DE PRODUCCIÓN */}
        {producto.cadenaDeProduccion?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Cadena de producción ({producto.cadenaDeProduccion.length} pasos)</Typography>
            <Grid container spacing={1.5}>
              {producto.cadenaDeProduccion.map((p, i) => (
                <Grid item xs={6} sm={4} md={3} key={i}>
                  <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center' }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 0.5 }}>
                      <Typography variant="h5" fontWeight={800} color="#fff">{i + 1}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={600}>{p.proceso}</Typography>
                    <Typography variant="caption" color="text.disabled" display="block">{p.isProcesoPropio ? 'Propio' : p.proveedor}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* SUBPRODUCTOS */}
        {producto.subproductos?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Componentes ({producto.subproductos.length})</Typography>
            <Grid container spacing={1.5}>
              {producto.subproductos.map((sp, i) => (
                <Grid item xs={6} sm={4} md={3} key={i}>
                  <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ mb: 0.3 }}>🧩</Typography>
                    <Typography variant="body2" fontWeight={600}>{sp.nombre}</Typography>
                    <Typography variant="h5" fontWeight={800} color="primary.main">{sp.cantidad}</Typography>
                    <Typography variant="caption" color="text.secondary">unidades</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* MATRICES */}
        {producto.matrices?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Matrices / Noyos ({producto.matrices.length})</Typography>
            <Grid container spacing={1.5}>
              {producto.matrices.map((m, i) => (
                <Grid item xs={6} sm={4} md={3} key={i}>
                  <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ mb: 0.3 }}>🔧</Typography>
                    <Typography variant="body2" fontWeight={600}>{m.nombre}</Typography>
                    <Typography variant="caption" color="text.disabled">{m.ubicacion || '—'}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* STOCK HISTORY */}
        <StockHistory historial={producto.historialDeStock} currentStock={producto.cantidad} />
      </Box>

      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(Producto)
