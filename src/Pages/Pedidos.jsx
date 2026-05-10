import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, TextField, InputAdornment, IconButton, Typography,
  Card, CardContent, Button, Chip, Divider, Tooltip
} from '@mui/material'
import { Search, Add, Send, Edit, Person } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../utilities'

const Pedidos = (props) => {
  const [search, setSearch] = useState('')
  const pedidos = props.pedidos ? Object.entries(props.pedidos) : []
  const filtered = pedidos.filter(([_, p]) => !search || p.cliente?.toLowerCase().includes(search.toLowerCase()))

  return (
    <Layout history={props.history} page="Pedidos" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField fullWidth size="small" placeholder="Buscar por cliente..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            sx={{ maxWidth: 400 }} />
          <IconButton component={Link} to="/Nuevo-Pedido" color="primary"><Add /></IconButton>
        </Box>
        {filtered.length > 0 ? (
          <Grid container spacing={2}>
            {filtered.map(([id, p]) => (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Card sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'visible' }}>
                  <CardContent sx={{ flex: 1, pb: 1 }}>
                    {/* Header: client name + date + chip */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          component={Link}
                          to={`/Cliente?${encodeURIComponent(p.cliente)}`}
                          sx={{
                            textDecoration: 'none', color: 'inherit',
                            '&:hover': { color: 'primary.light' },
                            display: 'flex', alignItems: 'center', gap: 0.5,
                            fontSize: '1rem',
                          }}
                        >
                          <Person fontSize="small" sx={{ color: 'text.secondary' }} />
                          {p.cliente}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ ml: 3 }}>
                          {p.fecha}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip size="small" label={`${p.articulos?.length || 0} art.`} variant="outlined" sx={{ fontSize: 11 }} />
                        <IconButton
                          size="small"
                          component={Link}
                          to={`/Editar-Pedido?${id}`}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main' } }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Articles list */}
                    {p.articulos && p.articulos.length > 0 ? (
                      <Box sx={{ mb: 1.5 }}>
                        {p.articulos.slice(0, 5).map((art, i) => (
                          <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 0.5, px: 0.5 }}>
                            <Box sx={{ flex: 1, mr: 1, minWidth: 0 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                {art.nombre || art.producto}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                {art.cantidad}u × $ {formatMoney(art.precio || 0)}
                              </Typography>
                            </Box>
                            <Typography variant="body2" fontWeight={700} sx={{ color: 'text.primary', flexShrink: 0, mt: 0.2 }}>
                              $ {formatMoney((art.cantidad || 0) * (art.precio || 0))}
                            </Typography>
                          </Box>
                        ))}
                        {p.articulos.length > 5 && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 0.5, pt: 0.5 }}>
                            +{p.articulos.length - 5} artículo(s) más
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.disabled" sx={{ mb: 1.5, fontStyle: 'italic' }}>
                        Sin artículos
                      </Typography>
                    )}

                    <Divider sx={{ mb: 1.5 }} />

                    {/* Total */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <Typography variant="caption" color="text.secondary">Total</Typography>
                      <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ fontSize: '1.25rem' }}>
                        $ {formatMoney(p.total || 0)}
                      </Typography>
                    </Box>
                  </CardContent>

                  {/* Enviar full-width */}
                  <Button
                    component={Link}
                    to={`/Enviar-Pedido?${id}`}
                    startIcon={<Send />}
                    fullWidth
                    color="primary"
                    variant="contained"
                    sx={{ borderRadius: 0, py: 1.3, fontWeight: 600, fontSize: 13 }}
                  >
                    Enviar pedido
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No hay pedidos.</Typography>
          </Box>
        )}
      </Box>
    </Layout>
  )
}
export default withStore(Pedidos)
