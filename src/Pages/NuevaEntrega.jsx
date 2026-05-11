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
import { obtenerFecha, formatMoney } from '../utilities'

const emptyProd = { producto: '', variante: '', cantidad: 1, precio: 0 }

const NuevaEntrega = (props) => {
  const [proveedor, setProveedor] = useState('')
  const [productos, setProductos] = useState([])
  const productosSinCadena = props.productos
    ? Object.entries(props.productos).filter(([_, p]) => !p.cadenaDeProduccion || p.cadenaDeProduccion.length === 0).map(([k]) => k)
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
    const prod = props.productos?.[name]
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
            <Autocomplete freeSolo value={proveedor}
              options={props.proveedores ? Object.keys(props.proveedores) : []}
              getOptionLabel={(o) => o}
              onChange={(_, v) => setProveedor(v)}
              onInputChange={(_, v) => setProveedor(v)}
              renderInput={(params) => <TextField {...params} label="Proveedor *" fullWidth />}
            />
          </Box>,

          /* STEP 2 — Productos */
          <Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Productos</Typography>
                  <Typography variant="h4" fontWeight={800}>{productos.length}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center', borderColor: 'primary.main', borderWidth: 2 }}>
                  <Typography variant="caption" color="text.secondary">Total de la entrega</Typography>
                  <Typography variant="h4" fontWeight={900} color="primary.main">$ {formatMoney(total)}</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cant.</TableCell>
                    <TableCell align="right">P. unitario</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productos.map((p, i) => {
                    const prodData = props.productos?.[p.producto]
                    return (
                      <TableRow key={i} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {prodData?.imagen ? (
                              <Avatar src={prodData.imagen} variant="rounded" sx={{ width: 36, height: 36 }} />
                            ) : (
                              <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="caption">📷</Typography>
                              </Box>
                            )}
                            <Typography variant="body2" fontWeight={600}
                              component={Link} to={`/Producto?${encodeURIComponent(p.producto)}`}
                              sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' } }}>
                              {p.producto}
                            </Typography>
                            {p.variante && <Typography variant="caption" color="text.secondary"> — {p.variante}</Typography>}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{p.cantidad}</TableCell>
                        <TableCell align="right">$ {formatMoney(p.precio)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>$ {formatMoney(p.total)}</TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          <IconButton size="small" onClick={() => editarProducto(i)}
                            sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main' } }}><Edit fontSize="small" /></IconButton>
                          <IconButton size="small" color="error" onClick={() => eliminarProducto(i)}><Delete fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Paper>

            <Collapse in={showForm}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  {editIdx >= 0 ? 'Editar producto' : 'Agregar producto'}
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <Autocomplete freeSolo value={newProd.producto}
                      options={productosSinCadena}
                      getOptionLabel={(o) => o}
                      onChange={handleProductoChange}
                      onInputChange={(_, v) => handleProductoChange(_, v)}
                      renderInput={(params) => <TextField {...params} label="Producto" fullWidth size="small" />} />
                  </Grid>
                  {newProd.producto && props.productos?.[newProd.producto]?.variantes && Object.keys(props.productos[newProd.producto].variantes).length > 0 && (
                    <Grid item xs={12}>
                      <Autocomplete freeSolo value={newProd.variante}
                        options={Object.keys(props.productos[newProd.producto].variantes)}
                        getOptionLabel={(o) => o}
                        onChange={(_, v) => {
                          const varData = props.productos[newProd.producto].variantes[v]
                          setNewProd(p => ({ ...p, variante: v || '', precio: varData?.precio || p.precio }))
                        }}
                        onInputChange={(_, v) => {
                          const varData = props.productos[newProd.producto].variantes[v]
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
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" size="small" startIcon={<Check />} onClick={agregarProducto}
                    disabled={!newProd.producto || !newProd.cantidad || !newProd.precio}>
                    {editIdx >= 0 ? 'Guardar cambios' : 'Agregar'}
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<Close />}
                    onClick={() => { setShowForm(false); setEditIdx(-1); setNewProd({ ...emptyProd }) }}>
                    Cancelar
                  </Button>
                </Box>
              </Paper>
            </Collapse>

            {!showForm && (
              <Button variant="contained" startIcon={<Add />} onClick={() => setShowForm(true)} sx={{ mb: 2 }}>
                Agregar Producto
              </Button>
            )}
          </Box>,

          /* STEP 3 — Confirmar */
          <Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Confirmar entrega</Typography>
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Datos de la entrega</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
                  <Typography variant="body2" color="text.secondary">Proveedor</Typography>
                  <Typography variant="body2" fontWeight={600}>{proveedor}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
                  <Typography variant="body2" color="text.secondary">Productos</Typography>
                  <Typography variant="body2" fontWeight={600}>{productos.length}</Typography>
                </Box>
              </Box>

              {productos.length > 0 && (
                <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Artículos</Typography>
                  {productos.map((p, i) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                      <Typography variant="body2">
                        {p.producto} <Typography variant="caption" color="text.secondary">× {p.cantidad}</Typography>
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>$ {formatMoney(p.total)}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              <Box sx={{ px: 2.5, py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Typography variant="body1" fontWeight={700}>Total</Typography>
                  <Typography variant="h5" fontWeight={800} color="primary.main">$ {formatMoney(total)}</Typography>
                </Box>
              </Box>
            </Paper>
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
