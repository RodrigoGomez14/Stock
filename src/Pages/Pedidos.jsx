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
                      <Chip
                        size="small"
                        label={`${p.articulos?.length || 0} art.`}
                        variant="outlined"
                        sx={{ fontSize: 11, flexShrink: 0 }}
                      />
                    </Box>

                    {/* Articles list */}
                    {p.articulos && p.articulos.length > 0 ? (
                      <Box sx={{ mb: 1.5 }}>
                        {p.articulos.slice(0, 5).map((art, i) => (
                          <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4, px: 0.5 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                flex: 1, mr: 1,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                color: 'text.primary',
                              }}
                            >
                              <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                {art.cantidad}x
                              </Box>{' '}
                              {art.nombre || art.producto}
                            </Typography>
                            <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary', flexShrink: 0 }}>
                              $ {formatMoney((art.cantidad || 0) * (art.precio || 0))}
                            </Typography>
                          </Box>
                        ))}
                        {p.articulos.length > 5 && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 0.5, pt: 0.3 }}>
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

                  {/* Actions integrated — colored */}
                  <Box sx={{ display: 'flex', borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button
                      component={Link}
                      to={`/Enviar-Pedido?${id}`}
                      startIcon={<Send />}
                      size="small"
                      fullWidth
                      color="primary"
                      variant="contained"
                      sx={{ borderRadius: 0, py: 1.2, fontWeight: 600, fontSize: 12 }}
                    >
                      Enviar
                    </Button>
                    <Button
                      component={Link}
                      to={`/Editar-Pedido?${id}`}
                      startIcon={<Edit />}
                      size="small"
                      fullWidth
                      color="warning"
                      variant="contained"
                      sx={{ borderRadius: 0, py: 1.2, fontWeight: 600, fontSize: 12, borderLeft: '1px solid', borderColor: 'divider' }}
                    >
                      Editar
                    </Button>
                  </Box>
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
