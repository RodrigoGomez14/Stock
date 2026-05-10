import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Card, CardContent, Paper, Tabs, Tab,
  TextField, InputAdornment
} from '@mui/material'
import { Search, AttachMoney, People, Business } from '@mui/icons-material'
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

  const clientesConDeuda = clientes.filter(([_, c]) => (c.datos?.deuda || 0) > 0)
  const provConDeuda = proveedores.filter(([_, p]) => (p.datos?.deuda || 0) > 0)

  return (
    <Layout history={props.history} page="Deudas" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
        {/* STATS BAR */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4} sm={2}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 1.5 }}>
              <AttachMoney color="error" sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight={800}>$ {formatMoney(totalDeudaClientes)}</Typography>
              <Typography variant="caption" color="text.secondary">Clientes deben</Typography>
            </Card>
          </Grid>
          <Grid item xs={4} sm={2}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 1.5 }}>
              <People color="warning" sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight={800}>{clientesConDeuda.length}</Typography>
              <Typography variant="caption" color="text.secondary">Clientes</Typography>
            </Card>
          </Grid>
          <Grid item xs={4} sm={2}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 1.5 }}>
              <AttachMoney color="warning" sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight={800}>$ {formatMoney(totalDeudaProv)}</Typography>
              <Typography variant="caption" color="text.secondary">Debemos a prov.</Typography>
            </Card>
          </Grid>
          <Grid item xs={4} sm={2}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 1.5 }}>
              <Business color="error" sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight={800}>{provConDeuda.length}</Typography>
              <Typography variant="caption" color="text.secondary">Proveedores</Typography>
            </Card>
          </Grid>
          <Grid item xs={4} sm={2}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 1.5, border: '2px solid', borderColor: 'primary.main' }}>
              <Typography variant="h4" fontWeight={900} color="primary.main">
                $ {formatMoney(totalDeudaClientes - totalDeudaProv)}
              </Typography>
              <Typography variant="caption" color="text.secondary">Balance neto</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* SEARCH */}
        <TextField fullWidth size="small" placeholder="Buscar..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          sx={{ maxWidth: 400, mb: 2 }} />

        {/* TABS */}
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label={`Clientes (${clientesConDeuda.length})`} />
          <Tab label={`Proveedores (${provConDeuda.length})`} />
        </Tabs>

        {/* CLIENTES */}
        {tab === 0 && (
          <Grid container spacing={2}>
            {clientesConDeuda.filter(([n]) => !search || n.toLowerCase().includes(search.toLowerCase())).map(([nombre, c]) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={nombre}>
                <CardDeudaCliente nombre={nombre} deuda={c.datos.deuda} />
              </Grid>
            ))}
            {clientesConDeuda.length === 0 && (
              <Grid item xs={12}><Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>No hay deudas de clientes</Typography></Grid>
            )}
          </Grid>
        )}

        {/* PROVEEDORES */}
        {tab === 1 && (
          <Grid container spacing={2}>
            {provConDeuda.filter(([n]) => !search || n.toLowerCase().includes(search.toLowerCase())).map(([nombre, p]) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={nombre}>
                <CardDeudaProveedor nombre={nombre} deuda={p.datos.deuda} />
              </Grid>
            ))}
            {provConDeuda.length === 0 && (
              <Grid item xs={12}><Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>No hay deudas a proveedores</Typography></Grid>
            )}
          </Grid>
        )}
      </Box>
    </Layout>
  )
}
export default withStore(Deudas)
