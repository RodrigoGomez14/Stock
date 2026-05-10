import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, TextField, InputAdornment, IconButton, Typography,
  Card, CardContent, Tabs, Tab, Button, Chip, Divider
} from '@mui/material'
import { Search, PersonAdd, AttachMoney, People, Star, Edit, Visibility, Phone, Email } from '@mui/icons-material'
import { formatMoney } from '../utilities'

const toStr = (v) => (typeof v === 'string' ? v : JSON.stringify(v))

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
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
        {/* STATS BAR */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4} sm={2}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 1.5 }}>
              <People color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight={800}>{stats.total}</Typography>
              <Typography variant="caption" color="text.secondary">Total</Typography>
            </Card>
          </Grid>
          <Grid item xs={4} sm={2}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 1.5 }}>
              <AttachMoney color="error" sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight={800}>$ {formatMoney(stats.deudaTotal)}</Typography>
              <Typography variant="caption" color="text.secondary">Deuda total</Typography>
            </Card>
          </Grid>
          <Grid item xs={4} sm={2}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 1.5 }}>
              <Star color="warning" sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight={800}>{stats.conDeuda}</Typography>
              <Typography variant="caption" color="text.secondary">Con deuda</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button component={Link} to="/Nuevo-Cliente" variant="contained" startIcon={<PersonAdd />}>Nuevo Cliente</Button>
          </Grid>
        </Grid>

        {/* SEARCH + TABS */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField fullWidth size="small" placeholder="Buscar cliente..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            sx={{ maxWidth: 400 }} />
        </Box>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Todos" />
          <Tab label="Con deuda" />
        </Tabs>

        {/* CARDS */}
        {filtered.length > 0 ? (
          <Grid container spacing={2}>
            {filtered.map(([name, c]) => {
              const d = c.datos || {}
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
                  <Card sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
                    <CardContent sx={{ flex: 1, pb: 1 }}>
                      {/* Top: name + edit */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body1" fontWeight={700}
                          component={Link} to={`/Cliente?${encodeURIComponent(name)}`}
                          sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' }, flex: 1 }}>
                          {name}
                        </Typography>
                        <IconButton size="small" component={Link} to={`/Editar-Cliente?${encodeURIComponent(name)}`}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main' }, ml: 1 }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Contact chips */}
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                        {d.telefono?.length > 0 && (
                          <Chip icon={<Phone />} label={toStr(d.telefono[0])} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                        )}
                        {d.mails?.length > 0 && (
                          <Chip icon={<Email />} label={toStr(d.mails[0])} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                        )}
                      </Box>

                      <Divider sx={{ mb: 1.5 }} />

                      {/* Debt amount */}
                      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Deuda</Typography>
                        <Typography variant="h6" fontWeight={800} color={d.deuda > 0 ? 'error.main' : 'success.main'}>
                          $ {formatMoney(d.deuda || 0)}
                        </Typography>
                      </Box>
                      {d.dni && <Typography variant="caption" color="text.disabled">DNI: {d.dni}</Typography>}
                    </CardContent>

                    {/* Ver detalle — full width */}
                    <Button component={Link} to={`/Cliente?${encodeURIComponent(name)}`}
                      startIcon={<Visibility />} fullWidth color="primary" variant="contained"
                      sx={{ borderRadius: 0, py: 1.2, fontWeight: 600, fontSize: 12 }}>
                      Ver detalle
                    </Button>
                  </Card>
                </Grid>
              )
            })}
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
