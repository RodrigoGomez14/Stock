import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, TextField, InputAdornment, Typography,
  Card, CardContent, Button, Chip, Divider
} from '@mui/material'
import { Search, Add, Send, Person } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney, getProducto } from '../utilities'
import { ImgCache } from '../components/ImgCache'

const Entregas = (props) => {
  const [search, setSearch] = useState('')
  const entregas = props.entregas ? Object.entries(props.entregas) : []
  const filtered = entregas.filter(([_, e]) => !search || e.proveedor?.toLowerCase().includes(search.toLowerCase()))

  return (
    <Layout history={props.history} page="Entregas" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField fullWidth size="small" placeholder="Buscar por proveedor..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            sx={{ maxWidth: 400 }} />
          <Button component={Link} to="/Nueva-Entrega" variant="contained" startIcon={<Add />}>
            Nueva entrega
          </Button>
        </Box>
        {filtered.length > 0 ? (
          <Grid container spacing={2}>
            {filtered.map(([id, e]) => {
              const productos = e.productos || e.articulos || []
              return (
                <Grid item xs={12} sm={6} md={4} key={id}>
                  <Card sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <CardContent sx={{ flex: 1, pb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="subtitle1" fontWeight={700}
                            component={Link} to={`/Proveedor?${encodeURIComponent(e.proveedor)}`}
                            sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' }, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '1rem' }}>
                            <Person fontSize="small" sx={{ color: 'text.secondary' }} />
                            {e.proveedor}
                          </Typography>
                          <Typography variant="caption" color="text.disabled" sx={{ ml: 3 }}>{e.fecha}</Typography>
                        </Box>
                        <Chip size="small" label={`${productos.length} art.`} variant="outlined" sx={{ fontSize: 11 }} />
                      </Box>

                      {productos.length > 0 && (
                        <Box sx={{ mb: 1.5 }}>
                          {productos.slice(0, 5).map((art, i) => {
                            const prodData = getProducto(props.productos, art.producto || art.nombre)
                            return (
                              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5, px: 0.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flex: 1, minWidth: 0 }}>
                                  {prodData?.imagen && (
                                    <ImgCache src={prodData.imagen} sx={{ width: 28, height: 28, borderRadius: 1, objectFit: 'cover' }} />
                                  )}
                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500, textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' } }}
                                    component={Link} to={`/Producto?${encodeURIComponent(art.producto || art.nombre)}`}>
                                    {art.producto || art.nombre}
                                  </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>{art.cantidad}u × $ {formatMoney(art.precio || 0)}</Typography>
                                  </Box>
                                </Box>
                                <Typography variant="body2" fontWeight={700} sx={{ flexShrink: 0, ml: 1 }}>
                                  $ {formatMoney((art.cantidad || 0) * (art.precio || 0))}
                                </Typography>
                              </Box>
                            )
                          })}
                          {productos.length > 5 && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 0.5, pt: 0.5 }}>
                              +{productos.length - 5} artículo(s) más
                            </Typography>
                          )}
                        </Box>
                      )}

                      <Divider sx={{ mb: 1.5 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <Typography variant="caption" color="text.secondary">Total</Typography>
                        <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ fontSize: '1.25rem' }}>
                          $ {formatMoney(e.total || 0)}
                        </Typography>
                      </Box>
                    </CardContent>

                    <Box sx={{ display: 'flex', borderTop: '1px solid', borderColor: 'divider' }}>
                      <Button component={Link} to={`/Recibir-Entrega?${id}`}
                        startIcon={<Send />} fullWidth color="primary" variant="contained"
                        sx={{ borderRadius: 0, py: 1.3, fontWeight: 600, fontSize: 12 }}>
                        Recibir
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No hay entregas.</Typography>
          </Box>
        )}
      </Box>
    </Layout>
  )
}
export default withStore(Entregas)
