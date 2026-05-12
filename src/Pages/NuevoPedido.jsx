import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { Layout } from './Layout'
import {
  Box, TextField, Autocomplete, Typography, Grid, Paper,
  Backdrop, CircularProgress, Snackbar, Button, Chip,
  IconButton, Collapse, Divider,
  Table, TableHead, TableBody, TableRow, TableCell, Avatar
} from '@mui/material'
import { Alert } from '@mui/material'
import { Add, Delete, Check, Close, Edit } from '@mui/icons-material'
import { BaseWizard } from '../components/BaseWizard'
import { pushData, updateData } from '../services'
import { fechaDetallada, formatMoney, getProducto } from '../utilities'
import meliLogo from '../images/logomeli.png'
import { ImgCache } from '../components/ImgCache'

const emptyProd = { producto: '', variante: '', cantidad: 1, precio: 0, precioOriginal: 0, descuento: 0, redondeo: 0, tipoAjuste: 'ninguno' }

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
  const [esMeli, setEsMeli] = useState(false)
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
      const aux = { cliente, fecha: fechaDetallada(), articulos: productos, total, esMeli }
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
    return p.precio || p.precioOriginal
  }

  const agregarProducto = () => {
    if (!newProd.producto || !newProd.cantidad) return
    const precioFinal = getPrecioFinal(newProd)
    const item = {
      producto: newProd.producto, variante: newProd.variante || null,
      cantidad: newProd.cantidad,
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
    const prod = getProducto(props.productos, name)
    const precioBase = prod?.precio || 0
    const meliValue = esMeli ? (prod?.precioMeli || Math.round(precioBase * 1.4 * 100) / 100) : precioBase
    setNewProd(p => ({
      ...p, producto: name, variante: '',
      precioOriginal: precioBase, precio: meliValue,
    }))
  }

  const editarProducto = (idx) => {
    const p = productos[idx]
    setNewProd({
      producto: p.producto, variante: p.variante || '',
      cantidad: p.cantidad,
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
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>Tipo de pedido</Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {[
                { key: false, icon: <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 0.5, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}><Typography variant="h4">🛒</Typography></Box>, label: 'Pedido normal', desc: '' },
                { key: true, icon: <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 0.5, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}><Box component="img" src={meliLogo} sx={{ width: 48, height: 48, objectFit: 'contain' }} /></Box>, label: 'Pedido MELI', desc: '' },
              ].map((opt) => (
                <Grid item xs={6} key={String(opt.key)}>
                  <Paper variant="outlined" onClick={() => { setEsMeli(opt.key); if (opt.key) setCliente('') }}
                    sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center', cursor: 'pointer', borderColor: esMeli === opt.key ? '#ECC400' : 'divider', borderWidth: esMeli === opt.key ? 2 : 1, bgcolor: esMeli === opt.key ? 'action.selected' : 'transparent', transition: '0.15s', '&:hover': { borderColor: 'primary.light' } }}>
                    {typeof opt.icon === 'string' ? <Typography variant="h4" sx={{ mb: 0.5 }}>{opt.icon}</Typography> : opt.icon}
                    <Typography variant="body2" fontWeight={600}>{opt.label}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">{opt.desc}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, opacity: esMeli ? 0.4 : 1, transition: '0.2s' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Typography variant="h4" sx={{ opacity: esMeli ? 0.4 : 1 }}>👤</Typography>
                <Typography variant="subtitle1" fontWeight={700} sx={{ opacity: esMeli ? 0.4 : 1 }}>Seleccionar cliente</Typography>
              </Box>
              <Autocomplete freeSolo value={cliente}
                options={props.clientes ? Object.values(props.clientes).map((c) => c.datos?.nombre || c.nombre || '').filter(Boolean) : []}
                getOptionLabel={(o) => o}
                onChange={(_, v) => setCliente(v)}
                onInputChange={(_, v) => setCliente(v)}
                disabled={esMeli}
                renderInput={(params) => <TextField {...params} label="Cliente *" fullWidth />}
              />
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
                <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center', borderColor: esMeli ? '#ECC400' : 'primary.main', borderWidth: 2 }}>
                  <Typography variant="h4" sx={{ mb: 0.2 }}>💰</Typography>
                  <Typography variant="h4" fontWeight={900} color={esMeli ? '#ECC400' : 'primary.main'}>$ {formatMoney(total)}</Typography>
                  <Typography variant="caption" color="text.secondary">Total{esMeli ? ' MELI' : ''}</Typography>
                </Paper>
              </Grid>
            </Grid>

            {productos.length > 0 && (
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 600, fontSize: 11, color: 'text.secondary', letterSpacing: 0.3 } }}>
                      <TableCell sx={{ width: 44 }}></TableCell>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Cant.</TableCell>
                      <TableCell align="right">P. unitario</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                      <TableCell align="center" sx={{ width: 40 }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productos.map((p, i) => {
                      const prodData = getProducto(props.productos, p.producto)
                      return (
                        <TableRow key={i} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }} onClick={() => editarProducto(i)}>
                          <TableCell sx={{ p: 0.5 }}>
                            {prodData?.imagen ? (
                              <Avatar src={prodData.imagen} variant="rounded" sx={{ width: 36, height: 36 }} />
                            ) : (
                              <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="caption">📷</Typography>
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>{p.producto}</Typography>
                            {p.variante && <Typography variant="caption" color="text.disabled">{p.variante}</Typography>}
                            {p.tipoAjuste !== 'ninguno' && (
                              <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
                                {p.tipoAjuste === 'descuento' ? `${p.descuento}% dto.` : 'Redondeo'}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">{p.cantidad}</TableCell>
                          <TableCell align="right">$ {formatMoney(p.precio)}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>$ {formatMoney(p.cantidad * p.precio)}</TableCell>
                          <TableCell align="center" sx={{ p: 0.2 }}>
                            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); eliminarProducto(i) }}><Delete fontSize="small" /></IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </Paper>
            )}

            <Collapse in={showForm}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  {editIdx >= 0 ? 'Editar producto' : 'Nuevo producto'}
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <Autocomplete freeSolo value={newProd.producto}
                      options={props.productos ? Object.values(props.productos).filter((p) => !p.isSubproducto || p.seVendePorSeparado).map((p) => p.nombre).filter(Boolean) : []}
                      getOptionLabel={(o) => o}
                      onChange={handleProductoChange}
                      onInputChange={(_, v) => handleProductoChange(_, v)}
                      renderInput={(params) => <TextField {...params} label="Producto" fullWidth size="small" />} />
                  </Grid>
                  {newProd.producto && (() => {
                    const prodActual = getProducto(props.productos, newProd.producto)
                    if (!prodActual?.variantes) return null
                    const varKeys = Object.keys(prodActual.variantes)
                    if (varKeys.length === 0) return null
                    return (
                      <Grid item xs={12}>
                        <Autocomplete freeSolo value={newProd.variante}
                          options={varKeys}
                          getOptionLabel={(o) => o}
                          onChange={(_, v) => {
                            const varData = prodActual.variantes[v]
                            const precioVar = varData?.precio || newProd.precioOriginal
                            const newPrecio = esMeli ? (prodActual.precioMeli || Math.round(precioVar * 1.4 * 100) / 100) : precioVar
                            setNewProd(prev => ({ ...prev, variante: v || '', precioOriginal: precioVar, precio: newPrecio }))
                          }}
                          onInputChange={(_, v) => {
                            const varData = prodActual.variantes[v]
                            const precioVar = varData?.precio || newProd.precioOriginal
                            const newPrecio = esMeli ? (prodActual.precioMeli || Math.round(precioVar * 1.4 * 100) / 100) : precioVar
                            setNewProd(prev => ({ ...prev, variante: v || '', precioOriginal: precioVar, precio: newPrecio }))
                          }}
                          renderInput={(params) => <TextField {...params} label="Variante" fullWidth size="small" />} />
                      </Grid>
                    )
                  })()}
                  {newProd.producto && <Grid item xs={12}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>Cantidad</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                      {[1,2,3,4,5].map(n => (
                        <Box key={n} sx={{ flex: '1 1 16%', minWidth: 48 }}>
                          <Paper variant="outlined" onClick={() => setNewProd(p => ({ ...p, cantidad: n }))}
                            sx={{ py: 1.5, px: 0.5, borderRadius: 2, textAlign: 'center', cursor: 'pointer', borderColor: newProd.cantidad === n ? 'primary.main' : 'divider', borderWidth: newProd.cantidad === n ? 2 : 1, bgcolor: newProd.cantidad === n ? 'action.selected' : 'transparent', transition: '0.12s', '&:hover': { borderColor: 'primary.light' } }}>
                            <Typography variant="h5" fontWeight={800}>{n}</Typography>
                          </Paper>
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5, alignItems: 'center' }}>
                      {[6,7,8,9].map(n => (
                        <Box key={n} sx={{ flex: '1 1 16%', minWidth: 48 }}>
                          <Paper variant="outlined" onClick={() => setNewProd(p => ({ ...p, cantidad: n }))}
                            sx={{ py: 1.5, px: 0.5, borderRadius: 2, textAlign: 'center', cursor: 'pointer', borderColor: newProd.cantidad === n ? 'primary.main' : 'divider', borderWidth: newProd.cantidad === n ? 2 : 1, bgcolor: newProd.cantidad === n ? 'action.selected' : 'transparent', transition: '0.12s', '&:hover': { borderColor: 'primary.light' } }}>
                            <Typography variant="h5" fontWeight={800}>{n}</Typography>
                          </Paper>
                        </Box>
                      ))}
                      <Box sx={{ flex: '1 1 16%', minWidth: 48 }}>
                        <TextField variant="outlined" type="number" value={newProd.cantidad && newProd.cantidad > 9 ? newProd.cantidad : ''}
                          onChange={(e) => setNewProd(p => ({ ...p, cantidad: parseInt(e.target.value) || 0 }))}
                          placeholder={String(newProd.cantidad <= 9 && newProd.cantidad > 0 ? newProd.cantidad : 'Cant')}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, py: 1.2, px: 0.5, textAlign: 'center', fontSize: '1.1rem', fontWeight: 800 } }} />
                      </Box>
                    </Box>
                  </Grid>}
                </Grid>
                {!esMeli && (
                <>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>AJUSTE DE PRECIO</Typography>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  {[
                    { key: 'ninguno', icon: '🚫', label: 'Sin ajuste', desc: 'Precio original' },
                    { key: 'descuento', icon: '🏷️', label: '% Descuento', desc: 'Aplicar porcentaje' },
                    { key: 'redondeo', icon: '🔄', label: 'Redondear', desc: 'Redondear precio' },
                  ].map((opt) => (
                    <Grid item xs={4} key={opt.key}>
                      <Paper variant="outlined" onClick={() => { setNewProd(p => ({ ...p, tipoAjuste: opt.key, descuento: 0, redondeo: 0 })) }}
                        sx={{ py: 1.5, px: 0.5, borderRadius: 2, textAlign: 'center', cursor: 'pointer', borderColor: newProd.tipoAjuste === opt.key ? 'primary.main' : 'divider', borderWidth: newProd.tipoAjuste === opt.key ? 2 : 1, bgcolor: newProd.tipoAjuste === opt.key ? 'action.selected' : 'transparent', transition: '0.15s', '&:hover': { borderColor: 'primary.light' } }}>
                        <Typography variant="h5" sx={{ mb: 0.2 }}>{opt.icon}</Typography>
                        <Typography variant="caption" fontWeight={600} display="block">{opt.label}</Typography>
                        <Typography variant="caption" color="text.secondary">{opt.desc}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                {newProd.tipoAjuste === 'descuento' && (
                  <TextField fullWidth size="small" label="Porcentaje de descuento (%)" type="number" value={newProd.descuento}
                    onChange={(e) => setNewProd(p => ({ ...p, descuento: parseFloat(e.target.value) || 0 }))} sx={{ mb: 2 }} />
                )}
                {newProd.tipoAjuste === 'redondeo' && (
                  <TextField fullWidth size="small" label="Redondear a ($)" type="number" value={newProd.redondeo}
                    onChange={(e) => setNewProd(p => ({ ...p, redondeo: parseFloat(e.target.value) || 0 }))} sx={{ mb: 2 }} />
                )}
                </>
                )}
                <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.dark' }}>
                  {newProd.tipoAjuste !== 'ninguno' && (
                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      <Grid item xs={6}><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Precio original</Typography><Typography variant="body2" fontWeight={700} sx={{ color: '#fff' }}>$ {formatMoney(newProd.precioOriginal)}</Typography></Grid>
                      {newProd.tipoAjuste === 'descuento' && newProd.descuento > 0 && (
                        <Grid item xs={6}><Typography variant="caption" sx={{ color: '#ef9a9a' }}>Descuento {newProd.descuento}%</Typography><Typography variant="body2" fontWeight={700} sx={{ color: '#ef9a9a' }}>-$ {formatMoney(newProd.precioOriginal * newProd.descuento / 100)}</Typography></Grid>
                      )}
                      {newProd.tipoAjuste === 'redondeo' && newProd.redondeo > 0 && (
                        <Grid item xs={6}><Typography variant="caption" sx={{ color: '#ffcc80' }}>Redondeo aplicado</Typography><Typography variant="body2" fontWeight={700} sx={{ color: '#ffcc80' }}>a $ {formatMoney(newProd.redondeo)}</Typography></Grid>
                      )}
                      <Grid item xs={12}><Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} /></Grid>
                    </Grid>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={700} sx={{ color: 'rgba(255,255,255,0.8)' }}>Precio final por unidad</Typography>
                    <Typography variant="body1" fontWeight={800} sx={{ color: '#fff' }}>$ {formatMoney(precioFinal)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" fontWeight={700} sx={{ color: 'rgba(255,255,255,0.8)' }}>Subtotal ({newProd.cantidad} u)</Typography>
                    <Typography variant="h6" fontWeight={800} sx={{ color: '#fff' }}>$ {formatMoney(precioFinal * newProd.cantidad)}</Typography>
                  </Box>
                </Paper>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button variant="contained" size="small" startIcon={<Check />} onClick={agregarProducto} disabled={!newProd.producto || !newProd.cantidad}>
                    {editIdx >= 0 ? 'Guardar' : 'Agregar'}
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<Close />} onClick={() => { setShowForm(false); setEditIdx(-1); setNewProd({ ...emptyProd }) }}>Cancelar</Button>
                </Box>
              </Paper>
            </Collapse>

            {!showForm && (
              <Paper variant="outlined" onClick={() => { setShowForm(true); setEditIdx(-1); setNewProd({ ...emptyProd }) }}
                sx={{ py: 2.5, px: 1, borderRadius: 2, textAlign: 'center', cursor: 'pointer', mb: 2, borderStyle: 'dashed', transition: '0.15s', '&:hover': { borderColor: 'primary.light', bgcolor: 'action.hover' } }}>
                <Typography variant="h4" sx={{ mb: 0.3 }}>➕</Typography>
                <Typography variant="body2" fontWeight={600}>Agregar producto</Typography>
                <Typography variant="caption" color="text.secondary" display="block">Seleccionar producto del catálogo</Typography>
              </Paper>
            )}
          </Box>,

          /* STEP 3 — Confirmar */
          <Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Confirmar pedido</Typography>
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              <Grid item xs={6} sm={4}>
                <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ mb: 0.3 }}>👤</Typography>
                  <Typography variant="body2" fontWeight={600}>{cliente || (esMeli ? 'MELI' : '—')}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">Cliente</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center', borderColor: esMeli ? '#ECC400' : 'primary.main', borderWidth: 2 }}>
                  <Typography variant="h4" sx={{ mb: 0.3 }}>💰</Typography>
                  <Typography variant="h5" fontWeight={900} color={esMeli ? '#ECC400' : 'primary.main'}>$ {formatMoney(total)}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">Total{esMeli ? ' MELI' : ''}</Typography>
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
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 600, fontSize: 11, color: 'text.secondary', letterSpacing: 0.3 } }}>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Cant.</TableCell>
                      <TableCell align="right">P. unitario</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productos.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {p.producto}{p.variante ? ` (${p.variante})` : ''}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{p.cantidad}</TableCell>
                        <TableCell align="right">$ {formatMoney(p.precio)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>$ {formatMoney(p.cantidad * p.precio)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            )}
          </Box>,
        ]}
        activeStep={activeStep}
        onNext={(step) => setActiveStep(step !== undefined ? step : (s) => s + 1)}
        onBack={() => setActiveStep((s) => s - 1)}
        onFinish={guardar}
        disabled={(() => { switch (activeStep) { case 0: return !cliente && !esMeli; case 1: return productos.length === 0; default: return false } })()}
        finishLabel={isEdit ? 'Guardar Cambios' : 'Crear Pedido'}
        showJumpToLast={isEdit}
      />
      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(NuevoPedido)
