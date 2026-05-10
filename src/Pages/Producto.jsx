import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Typography, Grid, Card, CardContent, Chip, IconButton,
  Button, Snackbar, Backdrop, CircularProgress, Paper
} from '@mui/material'
import { Alert } from '@mui/material'
import { ArrowBack, Delete } from '@mui/icons-material'
import { formatMoney } from '../utilities'
import { removeData } from '../services'
import ApexCharts from 'react-apexcharts'

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

  const eliminar = async () => {
    setLoading(true)
    try {
      await removeData(props.user.uid, `productos/${nombre}`)
      setSnack('Producto eliminado')
      setTimeout(() => navigate('/Productos', { replace: true }), 1500)
    } catch { setLoading(false) }
  }

  if (!producto) {
    return (
      <Layout history={props.history} page="Producto" user={props.user?.uid}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2, py: 8 }}>
          <CircularProgress />
          <Typography color="text.secondary">Cargando producto...</Typography>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout history={props.history} page={nombre} user={props.user?.uid}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
        <Card sx={{ borderRadius: 3, mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
              <Typography variant="h5" fontWeight={700} sx={{ flex: 1 }}>{nombre}</Typography>
              <IconButton color="error" onClick={eliminar}><Delete /></IconButton>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={producto.isSubproducto ? 'Subproducto' : 'Producto final'} color={producto.isSubproducto ? 'warning' : 'primary'} />
              <Chip label={`Stock: ${producto.cantidad || 0}`} color={(producto.cantidad || 0) > 0 ? 'success' : 'error'} variant="outlined" />
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Card sx={{ borderRadius: 3, textAlign: 'center', py: 1 }}>
              <CardContent sx={{ py: '8px !important' }}>
                <Typography variant="h4" fontWeight={700} color="primary">$ {formatMoney(producto.precio || 0)}</Typography>
                <Typography variant="caption" color="text.secondary">Precio</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ borderRadius: 3, textAlign: 'center', py: 1 }}>
              <CardContent sx={{ py: '8px !important' }}>
                <Typography variant="h4" fontWeight={700}>{producto.cantidad || 0}</Typography>
                <Typography variant="caption" color="text.secondary">Stock</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button variant="contained" onClick={() => navigate('/Editar-Producto?' + nombre)}>Editar</Button>
          {producto.cadenaDeProduccion?.length > 0 && (
            <Button variant="outlined" onClick={() => navigate('/Finalizar-Proceso?' + nombre)}>Iniciar Cadena</Button>
          )}
        </Box>

        {producto.cadenaDeProduccion?.length > 0 && (
          <Card sx={{ borderRadius: 3, mb: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Cadena de Producción</Typography>
              <Grid container spacing={1}>
                {producto.cadenaDeProduccion.map((p, i) => (
                  <Grid item xs={12} key={i}>
                    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                      <Typography variant="body2" fontWeight={600}>Paso {i + 1}: {p.nombre}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {producto.subproductos?.length > 0 && (
          <Card sx={{ borderRadius: 3, mb: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Componentes</Typography>
              <ApexCharts
                options={{
                  labels: producto.subproductos.map(s => s.nombre),
                  theme: { mode: 'dark', palette: 'palette2' },
                  chart: { sparkline: { enabled: true } },
                }}
                series={producto.subproductos.map(s => parseInt(s.cantidad))}
                type="donut"
                height={250}
              />
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

export default withStore(Producto)
