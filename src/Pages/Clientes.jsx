import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, TextField, InputAdornment, IconButton, Typography,
  Card, CardContent, Tabs, Tab, Button
} from '@mui/material'
import { Search, PersonAdd, AttachMoney, People, Star } from '@mui/icons-material'
import { formatMoney } from '../utilities'

const Clientes = (props) => {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState(0)

  const clientes = props.clientes ? Object.entries(props.clientes) : []

  const stats = {
    total: clientes.length,
    conDeuda: clientes.filter(([_, c]) => c.datos?.deuda > 0).length,
    deudaTotal: clientes.reduce((sum, [_, c]) => sum + (c.datos?.deuda || 0), 0),
  }

  const filtered = clientes.filter(([name, c]) => {
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === 0 ? true : tab === 1 ? (c.datos?.deuda || 0) > 0 : true
    return matchSearch && matchTab
  })

  return (
    <Layout history={props.history} page="Clientes" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4} sm={3}>
            <Card sx={{ borderRadius: 3, textAlign: 'center', py: 1 }}>
              <CardContent sx={{ py: '8px !important' }}>
                <People color="primary" />
                <Typography variant="h5" fontWeight={700}>{stats.total}</Typography>
                <Typography variant="caption" color="text.secondary">Total</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} sm={3}>
            <Card sx={{ borderRadius: 3, textAlign: 'center', py: 1 }}>
              <CardContent sx={{ py: '8px !important' }}>
                <AttachMoney color="error" />
                <Typography variant="h5" fontWeight={700}>$ {formatMoney(stats.deudaTotal)}</Typography>
                <Typography variant="caption" color="text.secondary">Deuda total</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} sm={3}>
            <Card sx={{ borderRadius: 3, textAlign: 'center', py: 1 }}>
              <CardContent sx={{ py: '8px !important' }}>
                <Star color="warning" />
                <Typography variant="h5" fontWeight={700}>{stats.conDeuda}</Typography>
                <Typography variant="caption" color="text.secondary">Con deuda</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button component={Link} to="/Nuevo-Cliente" variant="contained" startIcon={<PersonAdd />}>
              Nuevo
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <TextField
            fullWidth size="small" placeholder="Buscar cliente..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            sx={{ maxWidth: 400 }}
          />
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Todos" />
          <Tab label="Con deuda" />
        </Tabs>

        {filtered.length > 0 ? (
          <Grid container spacing={2}>
            {filtered.map(([name, c]) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
                <Card sx={{ borderRadius: 3, transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600}
                      component={Link} to={`/Cliente?${encodeURIComponent(name)}`}
                      sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' } }}>
                      {name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                      <Button size="small" variant="outlined" color={c.datos?.deuda > 0 ? 'error' : 'success'}
                        component={Link} to={`/Nuevo-Pago-Cliente?${encodeURIComponent(name)}`}>
                        $ {formatMoney(c.datos?.deuda || 0)}
                      </Button>
                      <Button size="small" component={Link} to={`/Historial-Cliente?${encodeURIComponent(name)}`}>
                        Historial
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No se encontraron clientes.</Typography>
          </Box>
        )}
      </Box>
    </Layout>
  )
}

export default withStore(Clientes)
