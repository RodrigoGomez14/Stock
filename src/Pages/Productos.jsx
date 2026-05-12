import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import { Box, Grid, TextField, InputAdornment, IconButton, Typography, Tabs, Tab, Button, Snackbar, Backdrop, CircularProgress, Paper, Chip } from '@mui/material'
import { Alert } from '@mui/material'
import { Search, Add, TrendingUp, Category } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { CardProducto } from '../components/Productos/CardProducto'
import { updateData } from '../services'

const CATEGORIAS = ['V\u00e1lvulas', 'Descarga de Combustible', 'Sistema ca\u00f1o camisa succi\u00f3n', 'Accesorios para despacho de combustible', 'Mangueras y accesorios', 'Repuestos para surtidores', 'Cajas antiexplosivas', 'Selladores y flexibles']

const Productos = (props) => {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState(0)
  const [catFiltro, setCatFiltro] = useState('')
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')

  const productos = props.productos ? Object.entries(props.productos) : []
  const filtered = productos.filter(([_, p]) => {
    if (tab === 0) return !p.isSubproducto || p.seVendePorSeparado
    if (tab === 1) return p.isSubproducto && !p.seVendePorSeparado
    return true
  }).filter(([_, p]) => !search || (p.nombre || '').toLowerCase().includes(search.toLowerCase()))
  .filter(([_, p]) => !catFiltro || p.categoria === catFiltro)

  return (
    <Layout history={props.history} page="Productos" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField fullWidth size="small" placeholder="Buscar producto..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            sx={{ maxWidth: 400 }} />
          <IconButton component={Link} to="/Nuevo-Producto" color="primary"><Add /></IconButton>
          <Button size="small" variant="outlined" startIcon={<TrendingUp />} onClick={async () => {
            if (!props.productos) return
            setLoading(true)
            let count = 0
            for (const [key, p] of Object.entries(props.productos)) {
              const nuevoMeli = p.precio > 0 ? Math.round(p.precio * 1.4 * 100) / 100 : 0
              if (nuevoMeli !== p.precioMeli) {
                await updateData(props.user.uid, `productos/${key}`, { precioMeli: nuevoMeli })
                count++
              }
            }
            setSnack(`${count} producto(s) actualizados`)
            setLoading(false)
          }} sx={{ fontSize: 11 }}>
            Actualizar MELI
          </Button>
        </Box>

        <Tabs value={tab} onChange={(_, v) => { setTab(v); setCatFiltro('') }} sx={{ mb: 1 }}>
          <Tab label="Productos finales" />
          <Tab label="Subproductos" />
        </Tabs>

        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item>
            <Paper variant="outlined" onClick={() => setCatFiltro('')}
              sx={{ py: 0.8, px: 1.5, borderRadius: 2, textAlign: 'center', cursor: 'pointer', borderColor: !catFiltro ? 'primary.main' : 'divider', borderWidth: !catFiltro ? 2 : 1, bgcolor: !catFiltro ? 'action.selected' : 'transparent', transition: '0.12s' }}>
              <Typography variant="caption" fontWeight={!catFiltro ? 700 : 500}>Todas</Typography>
            </Paper>
          </Grid>
          {(tab === 0 ? CATEGORIAS : CATEGORIAS).map((cat) => (
            <Grid item key={cat}>
              <Paper variant="outlined" onClick={() => setCatFiltro(catFiltro === cat ? '' : cat)}
                sx={{ py: 0.8, px: 1.5, borderRadius: 2, textAlign: 'center', cursor: 'pointer', borderColor: catFiltro === cat ? 'primary.main' : 'divider', borderWidth: catFiltro === cat ? 2 : 1, bgcolor: catFiltro === cat ? 'action.selected' : 'transparent', transition: '0.12s', '&:hover': { borderColor: 'primary.light' } }}>
                <Typography variant="caption" fontWeight={catFiltro === cat ? 700 : 500}>{cat}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {filtered.length > 0 ? (() => {
          const grouped = {}
          filtered.forEach(([key, p]) => {
            const cat = p.categoria || (p.isSubproducto ? 'Subproductos' : 'Sin categoría')
            if (!grouped[cat]) grouped[cat] = []
            grouped[cat].push([key, p])
          })
          return Object.entries(grouped).map(([cat, items]) => (
            <Box key={cat} sx={{ mb: 3 }}>
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'primary.dark', borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Category fontSize="small" sx={{ color: '#fff' }} />
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff' }}>{cat}</Typography>
                    <Chip label={`${items.length}`} size="small" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }} variant="outlined" />
                  </Box>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    {items.map(([key, p]) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                        <CardProducto name={p.nombre || key} precio={p.precio} precioMeli={p.precioMeli} cantidad={p.cantidad} isSubproducto={p.isSubproducto} seVendePorSeparado={p.seVendePorSeparado} imagen={p.imagen} variantes={p.variantes} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Paper>
            </Box>
          ))
        })() : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No se encontraron productos.</Typography>
          </Box>
        )}
      </Box>
      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(Productos)
