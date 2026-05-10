import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, TextField, Autocomplete, Typography, Grid, Paper,
  Backdrop, CircularProgress, Snackbar, Button, Chip,
  IconButton, Collapse, Divider, ToggleButton, ToggleButtonGroup,
  Table, TableHead, TableBody, TableRow, TableCell, Avatar
} from '@mui/material'
import { Alert } from '@mui/material'
import { Add, Delete, Check, Close, Edit } from '@mui/icons-material'
import { BaseWizard } from '../components/BaseWizard'
import { pushData, updateData } from '../services'
import { fechaDetallada, formatMoney } from '../utilities'

const emptyProd = { producto: '', cantidad: 1, precio: 0, precioOriginal: 0, descuento: 0, redondeo: 0, tipoAjuste: 'ninguno' }

const NuevoPedido = (props) => {
  const [cliente, setCliente] = useState('')
  const [productos, setProductos] = useState([])
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
      const p = props.pedidos?.[props.history.location.search.slice(1)]
      if (p) {
        setCliente(p.cliente || '')
        setProductos(p.articulos || [])
        setTotal(p.total || 0)
      }
    }
  }, [])

  const guardar = async () => {
    setLoading(true)
    try {
      const aux = { cliente, fecha: fechaDetallada(), articulos: productos, total }
      if (isEdit) {
        await updateData(props.user.uid, `pedidos/${props.history.location.search.slice(1)}`, aux)
      } else {
        await pushData(props.user.uid, 'pedidos', aux)
      }
      setSnack(isEdit ? 'Pedido editado' : 'Pedido creado')
      setTimeout(() => props.history.replace('/Pedidos'), 1500)
    } catch { setLoading(false) }
  }

  const getPrecioFinal = (p) => {
    if (p.tipoAjuste === 'redondeo' && p.redondeo > 0) return p.redondeo
    if (p.tipoAjuste === 'descuento' && p.descuento > 0) return p.precioOriginal * (1 - p.descuento / 100)
    return p.precioOriginal
  }

  const agregarProducto = () => {
    if (!newProd.producto || !newProd.cantidad) return
    const precioFinal = getPrecioFinal(newProd)
    const item = {
      producto: newProd.producto, cantidad: newProd.cantidad,
      precio: precioFinal, precioOriginal: newProd.precioOriginal,
      descuento: newProd.tipoAjuste === 'descuento' ? newProd.descuento : 0,
      redondeo: newProd.tipoAjuste === 'redondeo' ? newProd.redondeo : 0,
      tipoAjuste: newProd.tipoAjuste,
      total: newProd.cantidad * precioFinal,
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
      ...p, producto: name,
      precioOriginal: prod?.precio || 0, precio: prod?.precio || 0,
    }))
  }

  const editarProducto = (idx) => {
    const p = productos[idx]
    setNewProd({
      producto: p.producto, cantidad: p.cantidad,
      precioOriginal: p.precioOriginal || p.precio,
      precio: p.precio, descuento: p.descuento || 0,
      redondeo: p.redondeo || 0, tipoAjuste: p.tipoAjuste || 'ninguno',
    })
    setEditIdx(idx)
    setShowForm(true)
  }

  const eliminarProducto = (idx) => {
    const p = productos[idx]
    setTotal(t => t - p.cantidad * p.precio)
    setProductos(productos.filter((_, i) => i !== idx))
  }

  const precioFinal = getPrecioFinal(newProd)

  return (
    <Layout history={props.history} page={isEdit ? 'Editar Pedido' : 'Nuevo Pedido'} user={props.user?.uid} blockGoBack={true}>
      <BaseWizard
        stepLabels={['Cliente', 'Productos', 'Confirmar']}
        steps={[
          /* STEP 1 — Cliente */
          <Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Seleccionar cliente</Typography>
            <Autocomplete freeSolo value={cliente}
              options={props.clientes ? Object.keys(props.clientes) : []}
              getOptionLabel={(o) => o}
              onChange={(_, v) => setCliente(v)}
              onInputChange={(_, v) => setCliente(v)}
              renderInput={(params) => <TextField {...params} label="Cliente *" fullWidth />}
            />
          </Box>,

          /* STEP 2 — Productos */
          <Box>
            {/* Stats row */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Productos</Typography>
                  <Typography variant="h4" fontWeight={800}>{productos.length}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center', borderColor: 'primary.main', borderWidth: 2 }}>
                  <Typography variant="caption" color="text.secondary">Total del pedido</Typography>
                  <Typography variant="h4" fontWeight={900} color="primary.main">$ {formatMoney(total)}</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Tabla de productos */}
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
                            <Box>
                              <Typography variant="body2" fontWeight={600}>{p.producto}</Typography>
                              {p.tipoAjuste !== 'ninguno' && (
                                <Typography variant="caption" color="warning.main">
                                  {p.tipoAjuste === 'descuento' ? `${p.descuento}% dto.` : 'redondeo'}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{p.cantidad}</TableCell>
                        <TableCell align="right">$ {formatMoney(p.precio)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>$ {formatMoney(p.cantidad * p.precio)}</TableCell>
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

            {/* Formulario inline */}
            <Collapse in={showForm}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  {editIdx >= 0 ? 'Editar producto' : 'Agregar producto'}
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <Autocomplete freeSolo value={newProd.producto}
                      options={props.productos ? Object.keys(props.productos) : []}
                      getOptionLabel={(o) => o}
                      onChange={handleProductoChange}
                      onInputChange={(_, v) => handleProductoChange(_, v)}
                      renderInput={(params) => <TextField {...params} label="Producto" fullWidth size="small" />} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth size="small" label="Cantidad" type="number" value={newProd.cantidad}
                      onChange={(e) => setNewProd(p => ({ ...p, cantidad: parseInt(e.target.value) || 0 }))} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth size="small" label="Precio unitario ($)" type="number" value={newProd.precioOriginal}
                      onChange={(e) => setNewProd(p => ({ ...p, precioOriginal: parseFloat(e.target.value) || 0 }))} />
                  </Grid>
                </Grid>

                {/* Ajuste de precio */}
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  AJUSTE DE PRECIO
                </Typography>
                <ToggleButtonGroup value={newProd.tipoAjuste} exclusive
                  onChange={(_, v) => setNewProd(p => ({ ...p, tipoAjuste: v || 'ninguno', descuento: 0, redondeo: 0 }))}
                  size="small" sx={{ mb: 2 }}>
                  <ToggleButton value="ninguno" sx={{ px: 2 }}>Sin ajuste</ToggleButton>
                  <ToggleButton value="descuento" sx={{ px: 2 }}>% Descuento</ToggleButton>
                  <ToggleButton value="redondeo" sx={{ px: 2 }}>Redondear</ToggleButton>
                </ToggleButtonGroup>

                {newProd.tipoAjuste === 'descuento' && (
                  <TextField fullWidth size="small" label="Porcentaje de descuento (%)" type="number" value={newProd.descuento}
                    onChange={(e) => setNewProd(p => ({ ...p, descuento: parseFloat(e.target.value) || 0 }))}
                    sx={{ mb: 2, maxWidth: 300 }} />
                )}
                {newProd.tipoAjuste === 'redondeo' && (
                  <TextField fullWidth size="small" label="Redondear a ($)" type="number" value={newProd.redondeo}
                    onChange={(e) => setNewProd(p => ({ ...p, redondeo: parseFloat(e.target.value) || 0 }))}
                    sx={{ mb: 2, maxWidth: 300 }} />
                )}

                {/* Resumen */}
                <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Precio original</Typography>
                      <Typography variant="body2">$ {formatMoney(newProd.precioOriginal)}</Typography>
                    </Grid>
                    {newProd.tipoAjuste === 'descuento' && newProd.descuento > 0 && (
                      <Grid item xs={6}>
                        <Typography variant="caption" color="error.main">Descuento {newProd.descuento}%</Typography>
                        <Typography variant="body2" color="error.main">-$ {formatMoney(newProd.precioOriginal * newProd.descuento / 100)}</Typography>
                      </Grid>
                    )}
                    {newProd.tipoAjuste === 'redondeo' && newProd.redondeo > 0 && (
                      <Grid item xs={6}>
                        <Typography variant="caption" color="warning.main">Redondeo aplicado</Typography>
                        <Typography variant="body2" color="warning.main">a $ {formatMoney(newProd.redondeo)}</Typography>
                      </Grid>
                    )}
                  </Grid>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight={700}>Precio final por unidad</Typography>
                    <Typography variant="body1" fontWeight={800} color="primary.main">$ {formatMoney(precioFinal)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Subtotal ({newProd.cantidad} u)</Typography>
                    <Typography variant="body2" fontWeight={700}>$ {formatMoney(precioFinal * newProd.cantidad)}</Typography>
                  </Box>
                </Paper>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button variant="contained" size="small" startIcon={<Check />} onClick={agregarProducto} disabled={!newProd.producto || !newProd.cantidad}>
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
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Confirmar pedido</Typography>
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Datos del pedido</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
                  <Typography variant="body2" color="text.secondary">Cliente</Typography>
                  <Typography variant="body2" fontWeight={600}>{cliente}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
                  <Typography variant="body2" color="text.secondary">Productos</Typography>
                  <Typography variant="body2" fontWeight={600}>{productos.length}</Typography>
                </Box>
              </Box>

              {productos.length > 0 && (
                <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Artículos</Typography>
                  <Grid container spacing={1}>
                    {productos.map((p, i) => (
                      <Grid item xs={12} sm={6} md={4} key={i}>
                        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
                          <Typography variant="body2" fontWeight={600}>{p.producto}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {p.cantidad} u × $ {formatMoney(p.precio)}
                            {p.tipoAjuste !== 'ninguno' && (
                              <Box component="span" sx={{ color: 'warning.main', ml: 1 }}>
                                ({p.tipoAjuste === 'descuento' ? `${p.descuento}%` : 'redondeo'})
                              </Box>
                            )}
                          </Typography>
                          <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>
                            $ {formatMoney(p.cantidad * p.precio)}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
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
        disabled={(() => { switch (activeStep) { case 0: return !cliente; case 1: return productos.length === 0; default: return false } })()}
        finishLabel={isEdit ? 'Guardar Cambios' : 'Crear Pedido'}
      />
      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(NuevoPedido)
