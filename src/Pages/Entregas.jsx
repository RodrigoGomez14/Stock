import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, TextField, InputAdornment, IconButton, Typography,
  Card, CardContent, CardActions, Button, Chip
} from '@mui/material'
import { Search, Add } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../utilities'

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
          <IconButton component={Link} to="/Nueva-Entrega" color="primary"><Add /></IconButton>
        </Box>
        {filtered.length > 0 ? (
          <Grid container spacing={2}>
            {filtered.map(([id, e]) => (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600}>{e.proveedor}</Typography>
                    <Typography variant="caption" color="text.secondary">{e.fecha}</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip size="small" label={`$ ${formatMoney(e.total || 0)}`} color="primary" variant="outlined" />
                      <Chip size="small" label={`${e.articulos?.length || 0} productos`} sx={{ ml: 1 }} variant="outlined" />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" component={Link} to={`/Recibir-Entrega?${id}`}>Recibir</Button>
                    <Button size="small" component={Link} to={`/Editar-Entrega?${id}`}>Editar</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
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
