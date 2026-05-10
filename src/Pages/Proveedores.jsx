import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import { Box, Grid, TextField, InputAdornment, IconButton, Typography, Card, CardContent, Button } from '@mui/material'
import { Search, PersonAdd, AttachMoney, People } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { CardProveedor } from '../components/Proveedores/CardProveedor'
import { formatMoney } from '../utilities'

const Proveedores = (props) => {
  const [search, setSearch] = useState('')
  const proveedores = props.proveedores ? Object.entries(props.proveedores) : []

  const stats = {
    total: proveedores.length,
    conDeuda: proveedores.filter(([_, p]) => p.datos?.deuda > 0).length,
    deudaTotal: proveedores.reduce((sum, [_, p]) => sum + (p.datos?.deuda || 0), 0),
  }

  return (
    <Layout history={props.history} page="Proveedores" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
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
              <AttachMoney color="warning" sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight={800}>{stats.conDeuda}</Typography>
              <Typography variant="caption" color="text.secondary">Con deuda</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button component={Link} to="/Nuevo-Proveedor" variant="contained" startIcon={<PersonAdd />}>Nuevo Proveedor</Button>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <TextField fullWidth size="small" placeholder="Buscar proveedor..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            sx={{ maxWidth: 400 }} />
        </Box>

        {proveedores.length > 0 ? (
          <Grid container spacing={2}>
            {proveedores.map(([key, p]) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                <CardProveedor datos={p.datos} search={search} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No hay proveedores.</Typography>
          </Box>
        )}
      </Box>
    </Layout>
  )
}

export default withStore(Proveedores)
