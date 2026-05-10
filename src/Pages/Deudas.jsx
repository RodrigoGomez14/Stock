import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Card, CardContent, Paper, Tabs, Tab,
  TextField, InputAdornment
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { formatMoney } from '../utilities'
import CardDeudaCliente from '../components/Deudas/CardDeudaCliente'
import CardDeudaProveedor from '../components/Deudas/CardDeudaProveedor'

const Deudas = (props) => {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const clientes = props.clientes ? Object.entries(props.clientes) : []
  const proveedores = props.proveedores ? Object.entries(props.proveedores) : []
  const totalDeudaClientes = clientes.reduce((s, [_, c]) => s + (c.datos?.deuda || 0), 0)
  const totalDeudaProv = proveedores.reduce((s, [_, p]) => s + (p.datos?.deuda || 0), 0)

  return (
    <Layout history={props.history} page="Deudas" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Card sx={{ borderRadius: 3, textAlign: 'center', py: 1 }}>
              <CardContent sx={{ py: '8px !important' }}>
                <Typography variant="h5" fontWeight={700} color="error">$ {formatMoney(totalDeudaClientes)}</Typography>
                <Typography variant="caption" color="text.secondary">Deuda de clientes</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ borderRadius: 3, textAlign: 'center', py: 1 }}>
              <CardContent sx={{ py: '8px !important' }}>
                <Typography variant="h5" fontWeight={700} color="warning.main">$ {formatMoney(totalDeudaProv)}</Typography>
                <Typography variant="caption" color="text.secondary">Deuda a proveedores</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <TextField fullWidth size="small" placeholder="Buscar..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          sx={{ maxWidth: 400, mb: 2 }} />

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label={`Clientes (${clientes.filter(([_, c]) => c.datos?.deuda > 0).length})`} />
          <Tab label={`Proveedores (${proveedores.filter(([_, p]) => p.datos?.deuda > 0).length})`} />
        </Tabs>

        {tab === 0 && (
          <Grid container spacing={2}>
            {clientes.filter(([_, c]) => c.datos?.deuda > 0 && (!search || c.nombre?.toLowerCase().includes(search.toLowerCase()))).map(([nombre, c]) => (
              <Grid item xs={12} sm={6} md={4} key={nombre}>
                <CardDeudaCliente nombre={nombre} deuda={c.datos.deuda} />
              </Grid>
            ))}
          </Grid>
        )}
        {tab === 1 && (
          <Grid container spacing={2}>
            {proveedores.filter(([_, p]) => p.datos?.deuda > 0 && (!search || p.datos?.nombre?.toLowerCase().includes(search.toLowerCase()))).map(([nombre, p]) => (
              <Grid item xs={12} sm={6} md={4} key={nombre}>
                <CardDeudaProveedor nombre={nombre} deuda={p.datos.deuda} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  )
}
export default withStore(Deudas)
