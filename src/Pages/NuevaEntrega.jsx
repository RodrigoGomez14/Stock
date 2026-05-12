import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { Layout } from './Layout'
import {
  Box, TextField, Autocomplete, Typography, Grid, Paper,
  Backdrop, CircularProgress, Snackbar, Button,
  IconButton, Collapse, Divider,
  Table, TableHead, TableBody, TableRow, TableCell, Avatar
} from '@mui/material'
import { Alert } from '@mui/material'
import { Add, Delete, Check, Close, Edit } from '@mui/icons-material'
import { BaseWizard } from '../components/BaseWizard'
import { pushData, updateData } from '../services'
import { obtenerFecha, formatMoney, getProducto } from '../utilities'

const emptyProd = { producto: '', variante: '', cantidad: 1, precio: 0 }

const NuevaEntrega = (props) => {
  const [proveedor, setProveedor] = useState('')
  const [productos, setProductos] = useState([])
  const productosSinCadena = props.productos
    ? Object.entries(props.productos).filter(([_, p]) => !p.cadenaDeProduccion || p.cadenaDeProduccion.length === 0).map(([k, p]) => p.nombre || k)
    : []
  const [total, setTotal] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [newProd, setNewProd] = useState({ ...emptyProd })
  const [editIdx, setEditIdx] = useState(-1)
  const isEdit = !!props.history.location.search

  useEffect(() => {
    if (isEdit) {
      const e = props.entregas?.[props.history.location.search.slice(1)]
      if (e) {
        setProveedor(e.proveedor || '')
        setProductos(e.productos || [])
        setTotal(e.total || 0)
      }
    }
  }, [])

  const guardar = async () => {
    setLoading(true)
    try {
      const aux = { proveedor, productos, total, fecha: obtenerFecha() }
      if (isEdit) {
        await updateData(props.user.uid, `entregas/${props.history.location.search.slice(1)}`, aux)
      } else {
        await pushData(props.user.uid, 'entregas', aux)
      }
      setSnack(isEdit ? 'Entrega editada' : 'Entrega creada')
      setTimeout(() => props.history.replace('/Entregas'), 1500)
    } catch { setLoading(false) }
  }

  const agregarProducto = () => {
    if (!newProd.producto || !newProd.cantidad || !newProd.precio) return
    const item = {
      producto: newProd.producto, variante: newProd.variante || null,
      cantidad: newProd.cantidad,
      precio: newProd.precio,
      total: newProd.cantidad * newProd.precio,
    }
    if (editIdx >= 0) {
      const copy = [...productos]
      const oldTotal = copy[editIdx].cantidad * copy[editIdx].precio
      copy[editIdx] = item
      setProductos(copy)
      setTotal(t => t - oldTotal + item.total)
    } else {
      setProductos([...productos, item])
      setTotal(t => t + item.total)
    }
    setNewProd({ ...emptyProd })
    setShowForm(false)
    setEditIdx(-1)
  }

  const handleProductoChange = (_, v) => {
    const name = v || ''
    const prod = getProducto(props.productos, name)
    setNewProd(p => ({
      ...p, producto: name, variante: '',
      precio: prod?.precio || 0,
    }))
  }

  const editarProducto = (idx) => {
    const p = productos[idx]
    setNewProd({ producto: p.producto, cantidad: p.cantidad, precio: p.precio })
    setEditIdx(idx)
    setShowForm(true)
  }

  const eliminarProducto = (idx) => {
    const p = productos[idx]
    setTotal(t => t - p.total)
    setProductos(productos.filter((_, i) => i !== idx))
  }

  return (
    <Layout history={props.history} page={isEdit ? 'Editar Entrega' : 'Nueva Entrega'} user={props.user?.uid} blockGoBack={true}>
      <BaseWizard
        stepLabels={['Proveedor', 'Productos', 'Confirmar']}
        steps={[
          /* STEP 1 — Proveedor */
          <Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Seleccionar proveedor</Typography>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h4">🏭</Typography>
                <Box sx={{ flex: 1 }}>
                  <Autocomplete freeSolo value={proveedor}
                    options={props.proveedores ? Object.values(props.proveedores).map(p => p.datos?.nombre || p.nombre || '').filter(Boolean) : []}
                    getOptionLabel={(o) => o}
                    onChange={(_, v) => setProveedor(v)}
                    onInputChange={(_, v) => setProveedor(v)}
                    renderInput={(params) => <TextField {...params} label="Proveedor *" fullWidth />} />
                </Box>
              </Box>
            </Paper>
          </Box>,

          /* STEP 2 — Productos */
          <Box>
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ mb: 0.2 }}>📦</Typography>
                  <Typography variant="h4" fontWeight={800}>{productos.length}</Typography>
                  <Typography variant="caption" color="text.secondary">Productos</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center', borderColor: 'primary.main', borderWidth: 2 }}>
                  <Typography variant="h4" sx={{ mb: 0.2 }}>💰</Typography>
                  <Typography variant="h4" fontWeight={900} color="primary.main">$ {formatMoney(total)}</Typography>
                  <Typography variant="caption" color="text.secondary">Total</Typography>
                </Paper>
              </Grid>
            </Grid>

            {productos.length > 0 && (
              <Grid container spacing={1.5} sx={{ mb: 2 }}>
                {productos.map((p, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <Paper variant="outlined"
                      onClick={() => editarProducto(i)}
                      sx={{ py: 2, px: 1.5, borderRadius: 2, textAlign: 'center', cursor: 'pointer', transition: '0.15s', '&:hover': { borderColor: 'primary.light' }, position: 'relative' }}>
                      <Typography variant="h3" sx={{ mb: 0.3 }}>📦</Typography>
                      <Typography variant="body2" fontWeight={600}>{p.producto}{p.variante ? ` (${p.variante})` : ''}</Typography>
                      <Typography variant="caption" color="primary.main" fontWeight={700} display="block">$ {formatMoney(p.precio)}</Typography>
                      <Typography variant="caption" color="text.disabled" display="block">× {p.cantidad}</Typography>
                      <IconButton size="small" color="error"
                        onClick={(e) => { e.stopPropagation(); eliminarProducto(i) }}
                        sx={{ position: 'absolute', top: 2, right: 2, p: 0.3 }}>
                        <Delete fontSize="inherit" />
                      </IconButton>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}

            <Collapse in={showForm}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  {editIdx >= 0 ? 'Editar producto' : 'Nuevo producto'}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Autocomplete freeSolo value={newProd.producto}
                      options={productosSinCadena}
                      getOptionLabel={(o) => o}
                      onChange={handleProductoChange}
                      onInputChange={(_, v) => handleProductoChange(_, v)}
                      renderInput={(params) => <TextField {...params} label="Producto" fullWidth size="small" />} />
                  </Grid>
                  {newProd.producto && getProducto(props.productos, newProd.producto)?.variantes && Object.keys(getProducto(props.productos, newProd.producto).variantes).length > 0 && (
                    <Grid item xs={12}>
                      <Autocomplete freeSolo value={newProd.variante}
                        options={Object.keys(getProducto(props.productos, newProd.producto).variantes)}
                        getOptionLabel={(o) => o}
                        onChange={(_, v) => {
                          const varData = getProducto(props.productos, newProd.producto).variantes[v]
                          setNewProd(p => ({ ...p, variante: v || '', precio: varData?.precio || p.precio }))
                        }}
                        onInputChange={(_, v) => {
                          const varData = getProducto(props.productos, newProd.producto).variantes[v]
                          setNewProd(p => ({ ...p, variante: v || '', precio: varData?.precio || p.precio }))
                        }}
                        renderInput={(params) => <TextField {...params} label="Variante" fullWidth size="small" />} />
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <TextField fullWidth size="small" label="Cantidad" type="number" value={newProd.cantidad}
                      onChange={(e) => setNewProd(p => ({ ...p, cantidad: parseInt(e.target.value) || 0 }))} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth size="small" label="Precio unitario ($)" type="number" value={newProd.precio}
                      onChange={(e) => setNewProd(p => ({ ...p, precio: parseFloat(e.target.value) || 0 }))} />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button variant="contained" size="small" startIcon={<Check />} onClick={agregarProducto} disabled={!newProd.producto || !newProd.cantidad || !newProd.precio}>
                    {editIdx >= 0 ? 'Guardar' : 'Agregar'}
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<Close />}
                    onClick={() => { setShowForm(false); setEditIdx(-1); setNewProd({ ...emptyProd }) }}>Cancelar</Button>
                </Box>
              </Paper>
            </Collapse>

            <Paper variant="outlined" onClick={() => { setShowForm(true); setEditIdx(-1); setNewProd({ ...emptyProd }) }}
              sx={{ py: 2.5, px: 1, borderRadius: 2, textAlign: 'center', cursor: 'pointer', mb: 2, borderStyle: 'dashed', transition: '0.15s', '&:hover': { borderColor: 'primary.light', bgcolor: 'action.hover' } }}>
              <Typography variant="h4" sx={{ mb: 0.3 }}>➕</Typography>
              <Typography variant="body2" fontWeight={600}>Agregar producto</Typography>
              <Typography variant="caption" color="text.secondary" display="block">Seleccionar de la lista de productos</Typography>
            </Paper>
          </Box>,

          /* STEP 3 — Confirmar */
          <Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Confirmar entrega</Typography>
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              <Grid item xs={6} sm={4}>
                <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ mb: 0.3 }}>🏭</Typography>
                  <Typography variant="body2" fontWeight={600}>{proveedor}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">Proveedor</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center', borderColor: 'primary.main', borderWidth: 2 }}>
                  <Typography variant="h4" sx={{ mb: 0.3 }}>💰</Typography>
                  <Typography variant="h5" fontWeight={900} color="primary.main">$ {formatMoney(total)}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">Total</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ mb: 0.3 }}>📦</Typography>
                  <Typography variant="body2" fontWeight={600}>{productos.length}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">Productos</Typography>
                </Paper>
              </Grid>
            </Grid>

            {productos.length > 0 && (
              <Grid container spacing={1}>
                {productos.map((p, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <Paper variant="outlined" sx={{ py: 1.5, px: 1, borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ mb: 0.2 }}>📦</Typography>
                      <Typography variant="caption" fontWeight={600} display="block">{p.producto}{p.variante ? ` (${p.variante})` : ''}</Typography>
                      <Typography variant="caption" color="primary.main" fontWeight={700}>$ {formatMoney(p.precio)} × {p.cantidad}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>,
        ]}
        activeStep={activeStep}
        onNext={() => setActiveStep((s) => s + 1)}
        onBack={() => setActiveStep((s) => s - 1)}
        onFinish={guardar}
        disabled={(() => { switch (activeStep) { case 0: return !proveedor; case 1: return productos.length === 0; default: return false } })()}
        finishLabel={isEdit ? 'Guardar Cambios' : 'Crear Entrega'}
      />
      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(NuevaEntrega)
