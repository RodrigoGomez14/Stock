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
                <Card sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <CardContent sx={{ flex: 1, pb: 1 }}>
                    {/* Header: client name + date */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          component={Link}
                          to={`/Cliente?${encodeURIComponent(p.cliente)}`}
                          sx={{
                            textDecoration: 'none', color: 'inherit',
                            '&:hover': { color: 'primary.light' },
                            display: 'flex', alignItems: 'center', gap: 0.5,
                          }}
                        >
                          <Person fontSize="small" sx={{ color: 'text.secondary' }} />
                          {p.cliente}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {p.fecha}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {/* Articles list */}
                    {p.articulos && p.articulos.length > 0 ? (
                      <Box sx={{ mb: 1 }}>
                        {p.articulos.slice(0, 4).map((art, i) => (
                          <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ flex: 1, mr: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {art.cantidad}x {art.nombre || art.producto}
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              $ {formatMoney((art.cantidad || 0) * (art.precio || 0))}
                            </Typography>
                          </Box>
                        ))}
                        {p.articulos.length > 4 && (
                          <Typography variant="caption" color="text.secondary">
                            +{p.articulos.length - 4} artículos más
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Sin artículos
                      </Typography>
                    )}

                    <Divider sx={{ my: 1 }} />

                    {/* Total */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">{p.articulos?.length || 0} artículo(s)</Typography>
                      <Typography variant="h6" fontWeight={700} color="primary.main">
                        $ {formatMoney(p.total || 0)}
                      </Typography>
                    </Box>
                  </CardContent>

                  {/* Actions integrated */}
                  <Box sx={{ display: 'flex', borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button
                      component={Link}
                      to={`/Enviar-Pedido?${id}`}
                      startIcon={<Send />}
                      size="small"
                      fullWidth
                      sx={{ borderRadius: 0, py: 1 }}
                    >
                      Enviar
                    </Button>
                    <Button
                      component={Link}
                      to={`/Editar-Pedido?${id}`}
                      startIcon={<Edit />}
                      size="small"
                      fullWidth
                      sx={{ borderRadius: 0, py: 1, borderLeft: '1px solid', borderColor: 'divider' }}
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
