import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, TextField, InputAdornment, IconButton, Typography,
  Paper, Card, CardContent, CardActions, Button, Chip
} from '@mui/material'
import { Search, Add } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../utilities'
import { database } from '../services'

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
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600}>{p.cliente}</Typography>
                    <Typography variant="caption" color="text.secondary">{p.fecha}</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip size="small" label={`$ ${formatMoney(p.total || 0)}`} color="primary" variant="outlined" />
                      <Chip size="small" label={`${p.articulos?.length || 0} artículos`} sx={{ ml: 1 }} variant="outlined" />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" component={Link} to={`/Enviar-Pedido?${id}`}>Enviar</Button>
                    <Button size="small" component={Link} to={`/Editar-Pedido?${id}`}>Editar</Button>
                  </CardActions>
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
