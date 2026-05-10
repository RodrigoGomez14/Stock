import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import { Box, Grid, TextField, InputAdornment, IconButton, Typography, Tabs, Tab } from '@mui/material'
import { Search, Add } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { CardProducto } from '../components/Productos/CardProducto'

const Productos = (props) => {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState(0)

  const productos = props.productos ? Object.entries(props.productos) : []
  const filtered = productos.filter(([_, p]) => {
    if (tab === 1) return p.isSubproducto
    if (tab === 2) return !p.isSubproducto
    return true
  }).filter(([name]) => !search || name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Layout history={props.history} page="Productos" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField fullWidth size="small" placeholder="Buscar producto..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            sx={{ maxWidth: 400 }} />
          <IconButton component={Link} to="/Nuevo-Producto" color="primary"><Add /></IconButton>
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Todos" />
          <Tab label="Subproductos" />
          <Tab label="Productos finales" />
        </Tabs>

        {filtered.length > 0 ? (
          <Grid container spacing={2}>
            {filtered.map(([name, p]) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
                <CardProducto name={name} precio={p.precio} cantidad={p.cantidad} isSubproducto={p.isSubproducto} imagen={p.imagen} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No se encontraron productos.</Typography>
          </Box>
        )}
      </Box>
    </Layout>
  )
}

export default withStore(Productos)
