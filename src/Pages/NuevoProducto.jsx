import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, TextField, Grid, Typography, Switch, FormControlLabel, Paper,
  Backdrop, CircularProgress, Snackbar, Button, Collapse, Chip, IconButton,
  Divider, Select, MenuItem, InputLabel, FormControl, Autocomplete
} from '@mui/material'
import { Alert } from '@mui/material'
import { Add, Check, Close, Delete, Edit } from '@mui/icons-material'
import { BaseWizard } from '../components/BaseWizard'
import { removeData, updateData, setData, getPushKey } from '../services'
import { registrarMovimientoStock } from '../services/productosService'
import { checkSearchProducto, formatMoney, getProducto } from '../utilities'
import { ImageUpload } from '../components/ImageUpload'

const NuevoProducto = (props) => {
  const [nombre, setNombre] = useState('')
  const [cantidad, setCantidad] = useState(0)
  const [isSubproducto, setIsSubproducto] = useState(false)
  const [seVendePorSeparado, setSeVendePorSeparado] = useState(false)
  const [imagen, setImagen] = useState(null)
  const [cadena, setCadena] = useState([])
  const [subproductos, setSubproductos] = useState([])
  const [matrices, setMatrices] = useState([])
  const [variantes, setVariantes] = useState({})
  const [precio, setPrecio] = useState(0)
  const [categoria, setCategoria] = useState('')
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const isEdit = !!props.history.location.search

  // Subproducto form state
  const [showSubForm, setShowSubForm] = useState(false)
  const [subNombre, setSubNombre] = useState('')
  const [subCantidad, setSubCantidad] = useState('')
  const [subEditIdx, setSubEditIdx] = useState(-1)

  // Matriz form state
  const [showMatForm, setShowMatForm] = useState(false)
  const [matNombre, setMatNombre] = useState('')
  const [matUbicacion, setMatUbicacion] = useState('Taller')
  const [matEditIdx, setMatEditIdx] = useState(-1)

  // Variante form state
  const [showVarForm, setShowVarForm] = useState(false)
  const [varNombre, setVarNombre] = useState('')
  const [varPrecio, setVarPrecio] = useState('')
  const [varCantidad, setVarCantidad] = useState('')
  const [varCodigo, setVarCodigo] = useState('')
  const [varEditKey, setVarEditKey] = useState('')

  // Cadena form state
  const [showCadenaForm, setShowCadenaForm] = useState(false)
  const [editCadenaIndex, seteditCadenaIndex] = useState(-1)
  const [editCadenaProceso, seteditCadenaProceso] = useState('')
  const [editCadenaProveedor, seteditCadenaProveedor] = useState('')
  const [editCadenaPropio, seteditCadenaPropio] = useState(false)

  useEffect(() => {
    if (isEdit) {
      const p = getProducto(props.productos, checkSearchProducto(props.history.location.search))
      if (p) {
        setNombre(p.nombre || '')
        setCantidad(p.cantidad || 0)
        setIsSubproducto(!!p.isSubproducto)
        setImagen(p.imagen || null)
        setCadena(p.cadenaDeProduccion || [])
        setSubproductos(p.subproductos || [])
        setMatrices(p.matrices || [])
        setVariantes(p.variantes || {})
        setCategoria(p.categoria || '')
        setSeVendePorSeparado(p.seVendePorSeparado || false)
        setPrecio(p.precio || 0)
      }
    }
  }, [])

  const guardar = async () => {
    setLoading(true)
    const old = getProducto(props.productos, checkSearchProducto(props.history.location.search))
    const cantidadAnterior = isEdit ? old?.cantidad || 0 : 0
    const precioMeli = precio > 0 ? Math.round(precio * 1.4 * 100) / 100 : 0
    const payload = { nombre, precio, precioMeli, cantidad, isSubproducto, seVendePorSeparado, imagen, cadenaDeProduccion: cadena, subproductos, matrices, variantes, categoria }
    try {
      if (isEdit) {
        const nombreBuscado = checkSearchProducto(props.history.location.search)
        const entry = Object.entries(props.productos || {}).find(([k, p]) => k === nombreBuscado || p.nombre === nombreBuscado || p.id === nombreBuscado)
        const key = entry ? entry[0] : nombreBuscado
        await setData(props.user.uid, `productos/${key}`, payload)
        if (nombre !== key) {
          await removeData(props.user.uid, `productos/${nombre}`)
        }
      } else {
        await setData(props.user.uid, `productos/${getPushKey(props.user.uid, 'productos')}`, payload)
      }
      if (cantidad > 0 && cantidad !== cantidadAnterior) {
        await registrarMovimientoStock(props.user.uid, nombre, {
          movimiento: cantidad - cantidadAnterior,
          concepto: isEdit ? 'Ajuste de stock' : 'Stock inicial',
          referencia: 'productos',
        })
      }
      setSnack(isEdit ? 'Producto editado' : 'Producto creado')
      setTimeout(() => props.history.replace('/Productos'), 1500)
    } catch { setLoading(false) }
  }

  const subProductosList = Object.values(props.productos || {}).filter((p) => p.isSubproducto)
  const CATEGORIAS = ['Válvulas', 'Descarga de Combustible', 'Sistema caño camisa succión', 'Accesorios para despacho de combustible', 'Mangueras y accesorios', 'Repuestos para surtidores', 'Cajas antiexplosivas', 'Selladores y flexibles']
  const steps = [
    // STEP 1 — Info
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Información básica</Typography>
      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: { sm: 'center' } }}>
          <ImageUpload uid={props.user?.uid} path="productos" currentImage={imagen} onImageChange={setImagen} />
        </Grid>
        <Grid item xs={12} sm={10}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Nombre *" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Stock" type="number" value={Object.keys(variantes).length > 0 ? Object.values(variantes).reduce((s, v) => s + (parseInt(v.cantidad) || 0), 0) : cantidad}
                onChange={(e) => setCantidad(parseFloat(e.target.value) || 0)}
                disabled={Object.keys(variantes).length > 0}
                helperText={Object.keys(variantes).length > 0 ? 'Stock calculado de las variantes' : ''} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Precio ($)" type="number" value={precio} onChange={(e) => setPrecio(parseFloat(e.target.value) || 0)} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Tipo de producto
              </Typography>
              <Grid container spacing={1}>
                {[
                  { key: false, icon: '📦', label: 'Producto final', desc: 'Se vende al cliente' },
                  { key: true, icon: '🧩', label: 'Subproducto', desc: 'Componente para fabricar' },
                ].map((opt) => (
                  <Grid item xs={6} key={String(opt.key)}>
                    <Paper variant="outlined"
                      onClick={() => setIsSubproducto(opt.key)}
                      sx={{
                        py: 2, px: 1, borderRadius: 2, textAlign: 'center', cursor: 'pointer',
                        borderColor: isSubproducto === opt.key ? 'primary.main' : 'divider',
                        borderWidth: isSubproducto === opt.key ? 2 : 1,
                        bgcolor: isSubproducto === opt.key ? 'action.selected' : 'transparent',
                        transition: '0.15s', '&:hover': { borderColor: 'primary.light' },
                      }}>
                      <Typography variant="h4" sx={{ mb: 0.3 }}>{opt.icon}</Typography>
                      <Typography variant="body2" fontWeight={600}>{opt.label}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block">{opt.desc}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 1.5 }}>
                <FormControlLabel
                  control={<Switch checked={!isSubproducto || seVendePorSeparado} onChange={(e) => setSeVendePorSeparado(e.target.checked)} disabled={!isSubproducto} />}
                  label={<Box><Typography variant="body2" fontWeight={600}>Vendible por separado</Typography><Typography variant="caption" color="text.secondary">Aparece en la lista de precios y puede venderse individualmente</Typography></Box>}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
                Categoría
              </Typography>
              <Grid container spacing={1}>
                {CATEGORIAS.map((cat) => {
                  const icons = { 'Válvulas': '🔧', 'Descarga de Combustible': '⛽', 'Sistema caño camisa succión': '🔩', 'Accesorios para despacho de combustible': '⛽', 'Mangueras y accesorios': '🔗', 'Repuestos para surtidores': '⚙️', 'Cajas antiexplosivas': '📦', 'Selladores y flexibles': '🧴' }
                  return (
                    <Grid item xs={6} sm={4} md={3} key={cat}>
                      <Paper variant="outlined"
                        onClick={() => setCategoria(categoria === cat ? '' : cat)}
                        sx={{
                          py: 1.5, px: 0.5, borderRadius: 2, textAlign: 'center', cursor: 'pointer',
                          borderColor: categoria === cat ? 'primary.main' : 'divider',
                          borderWidth: categoria === cat ? 2 : 1,
                          bgcolor: categoria === cat ? 'action.selected' : 'transparent',
                          transition: '0.15s', '&:hover': { borderColor: 'primary.light' },
                        }}>
                        <Typography variant="h5" sx={{ mb: 0.2 }}>{icons[cat] || '📋'}</Typography>
                        <Typography variant="caption" fontWeight={categoria === cat ? 700 : 500} display="block" sx={{ lineHeight: 1.2 }}>
                          {cat}
                        </Typography>
                      </Paper>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
            {nombre && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  {isEdit ? 'Se actualizará el producto existente.' : 'Se creará un nuevo producto.'}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>,

    // STEP 2 — Variantes
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Variantes del producto</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Si este producto tiene variantes (ej: colores, tamaños), agregalas acá.
      </Typography>

      {Object.keys(variantes).length > 0 && (
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {Object.entries(variantes).map(([key, v]) => (
            <Grid item xs={6} sm={4} md={3} key={key}>
              <Paper variant="outlined"
                onClick={() => { setVarNombre(key); setVarPrecio(String(v.precio || '')); setVarCantidad(String(v.cantidad || '')); setVarCodigo(v.codigo || ''); setVarEditKey(key); setShowVarForm(true) }}
                sx={{
                  p: 1.5, borderRadius: 2, textAlign: 'center', cursor: 'pointer',
                  transition: '0.15s', '&:hover': { borderColor: 'primary.light' },
                  position: 'relative',
                }}>
                <Typography variant="h3" sx={{ mb: 0.3 }}>🎨</Typography>
                <Typography variant="body2" fontWeight={600}>{key}</Typography>
                <Typography variant="caption" color="primary.main" fontWeight={700} display="block">
                  {v.precio ? `$${formatMoney(v.precio)}` : '—'}
                </Typography>
                <Typography variant="caption" color="text.disabled" display="block">
                  Stock: {v.cantidad ?? '—'} {v.codigo ? `· ${v.codigo}` : ''}
                </Typography>
                <IconButton size="small" color="error"
                  onClick={(e) => { e.stopPropagation(); const aux = { ...variantes }; delete aux[key]; setVariantes(aux) }}
                  sx={{ position: 'absolute', top: 2, right: 2, p: 0.3 }}>
                  <Delete fontSize="inherit" />
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Paper variant="outlined"
        onClick={() => { setShowVarForm(true); setVarEditKey(''); setVarNombre(''); setVarPrecio(String(precio || '')); setVarCantidad(''); setVarCodigo('') }}
        sx={{ py: 2.5, px: 1, borderRadius: 2, textAlign: 'center', cursor: 'pointer', mb: 2, borderStyle: 'dashed', transition: '0.15s', '&:hover': { borderColor: 'primary.light', bgcolor: 'action.hover' } }}>
        <Typography variant="h4" sx={{ mb: 0.3 }}>➕</Typography>
        <Typography variant="body2" fontWeight={600}>Agregar variante</Typography>
        <Typography variant="caption" color="text.secondary" display="block">Color, talle, medida, etc.</Typography>
      </Paper>

      <Collapse in={showVarForm}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {varEditKey ? 'Editar Variante' : 'Nueva Variante'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Nombre de la variante *" value={varNombre}
                onChange={(e) => setVarNombre(e.target.value)} placeholder="Ej: Amarillo, XL, 5mm" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Precio ($)" type="number" value={varPrecio || precio}
                disabled />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Stock" type="number" value={varCantidad}
                onChange={(e) => setVarCantidad(e.target.value)} />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button variant="contained" size="small" startIcon={<Check />} disabled={!varNombre}
              onClick={() => {
                const aux = { ...variantes }
                if (varEditKey && varEditKey !== varNombre) delete aux[varEditKey]
                aux[varNombre] = {
                  precio: varPrecio ? parseFloat(varPrecio) : null,
                  cantidad: varCantidad ? parseInt(varCantidad) : null,
                  codigo: varCodigo || null,
                }
                setVariantes(aux)
                setShowVarForm(false); setVarEditKey(''); setVarNombre(''); setVarPrecio(''); setVarCantidad(''); setVarCodigo('')
              }}>
              {varEditKey ? 'Guardar' : 'Agregar'}
            </Button>
            <Button variant="outlined" size="small" startIcon={<Close />}
              onClick={() => { setShowVarForm(false); setVarEditKey(''); setVarNombre(''); setVarPrecio(''); setVarCantidad(''); setVarCodigo('') }}>
              Cancelar
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </Box>,

    // STEP 3 — Producción
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Cadena de producción</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Definí los pasos necesarios para producir este producto.
      </Typography>

      {cadena.length > 0 && (
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {cadena.map((p, i) => (
            <Grid item xs={6} sm={4} md={3} key={i}>
              <Paper variant="outlined"
                onClick={() => {
                  seteditCadenaIndex(i);
                  seteditCadenaProceso(p.proceso);
                  seteditCadenaProveedor(p.proveedor || '');
                  seteditCadenaPropio(p.isProcesoPropio);
                  setShowCadenaForm(true)
                }}
                sx={{ py: 2, px: 1.5, borderRadius: 2, textAlign: 'center', cursor: 'pointer', transition: '0.15s', '&:hover': { borderColor: 'primary.light' }, position: 'relative' }}>
                <Typography variant="h3" sx={{ mb: 0.3 }}>⚙️</Typography>
                <Typography variant="body2" fontWeight={600}>{p.proceso}</Typography>
                <Typography variant="caption" color="text.disabled" display="block">
                  {p.isProcesoPropio ? 'Propio' : (p.proveedor || '—')}
                </Typography>
                <IconButton size="small" color="error"
                  onClick={(e) => { e.stopPropagation(); setCadena(cadena.filter((_, j) => j !== i)) }}
                  sx={{ position: 'absolute', top: 2, right: 2, p: 0.3 }}>
                  <Delete fontSize="inherit" />
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Paper variant="outlined"
        onClick={() => { setShowCadenaForm(true); seteditCadenaIndex(-1); seteditCadenaProceso(''); seteditCadenaProveedor(''); seteditCadenaPropio(false) }}
        sx={{ py: 2.5, px: 1, borderRadius: 2, textAlign: 'center', cursor: 'pointer', mb: 2, borderStyle: 'dashed', transition: '0.15s', '&:hover': { borderColor: 'primary.light', bgcolor: 'action.hover' } }}>
        <Typography variant="h4" sx={{ mb: 0.3 }}>➕</Typography>
        <Typography variant="body2" fontWeight={600}>Agregar paso</Typography>
        <Typography variant="caption" color="text.secondary" display="block">Fundido, Mecanizado, Pintado, etc.</Typography>
      </Paper>

      <Collapse in={showCadenaForm}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {editCadenaIndex !== -1 ? 'Editar paso' : 'Nuevo paso'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Nombre del proceso *" value={editCadenaProceso}
                onChange={(e) => seteditCadenaProceso(e.target.value)} placeholder="Ej: Fundido, Mecanizado, Pintado" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Switch checked={editCadenaPropio} onChange={(e) => seteditCadenaPropio(e.target.checked)} />}
                label="Proceso propio" sx={{ mt: 1 }} />
            </Grid>
            {!editCadenaPropio && (
              <Grid item xs={12}>
                <Autocomplete freeSolo value={editCadenaProveedor}
                  options={props.proveedores ? Object.values(props.proveedores).map(p => p.datos?.nombre || p.nombre || '').filter(Boolean) : []}
                  getOptionLabel={(o) => o}
                  onChange={(_, v) => seteditCadenaProveedor(v || '')}
                  onInputChange={(_, v) => seteditCadenaProveedor(v || '')}
                  renderInput={(params) => <TextField {...params} label="Proveedor" fullWidth size="small" />} />
              </Grid>
            )}
          </Grid>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button variant="contained" size="small" startIcon={<Check />} disabled={!editCadenaProceso}
              onClick={() => {
                const item = { proceso: editCadenaProceso, proveedor: editCadenaPropio ? null : editCadenaProveedor || null, isProcesoPropio: editCadenaPropio }
                if (editCadenaIndex !== -1) {
                  const aux = [...cadena]; aux[editCadenaIndex] = item; setCadena(aux)
                } else {
                  setCadena([...cadena, item])
                }
                setShowCadenaForm(false); seteditCadenaIndex(-1); seteditCadenaProceso(''); seteditCadenaProveedor(''); seteditCadenaPropio(false)
              }}>
              {editCadenaIndex !== -1 ? 'Guardar' : 'Agregar'}
            </Button>
            <Button variant="outlined" size="small" startIcon={<Close />}
              onClick={() => { setShowCadenaForm(false); seteditCadenaIndex(-1); seteditCadenaProceso(''); seteditCadenaProveedor(''); seteditCadenaPropio(false) }}>
              Cancelar
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </Box>,

    // STEP 4 — Subproductos
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Subproductos asociados</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Componentes necesarios para fabricar este producto.
      </Typography>
      {subproductos.length > 0 && (
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {subproductos.map((sp, i) => (
            <Grid item xs={6} sm={4} md={3} key={i}>
              <Paper variant="outlined"
                onClick={() => { setSubEditIdx(i); setSubNombre(sp.nombre); setSubCantidad(sp.cantidad); setShowSubForm(true) }}
                sx={{ py: 2, px: 1.5, borderRadius: 2, textAlign: 'center', cursor: 'pointer', transition: '0.15s', '&:hover': { borderColor: 'primary.light' }, position: 'relative' }}>
                <Typography variant="h3" sx={{ mb: 0.3 }}>🧩</Typography>
                <Typography variant="body2" fontWeight={600}>{sp.nombre}</Typography>
                <Typography variant="body2" fontWeight={700} color="primary.main">{sp.cantidad}</Typography>
                <Typography variant="caption" color="text.disabled" display="block">unidades</Typography>
                <IconButton size="small" color="error"
                  onClick={(e) => { e.stopPropagation(); setSubproductos(subproductos.filter((_, j) => j !== i)) }}
                  sx={{ position: 'absolute', top: 2, right: 2, p: 0.3 }}>
                  <Delete fontSize="inherit" />
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Paper variant="outlined"
        onClick={() => { setShowSubForm(true); setSubEditIdx(-1); setSubNombre(''); setSubCantidad('') }}
        sx={{ py: 2.5, px: 1, borderRadius: 2, textAlign: 'center', cursor: 'pointer', mb: 2, borderStyle: 'dashed', transition: '0.15s', '&:hover': { borderColor: 'primary.light', bgcolor: 'action.hover' } }}>
        <Typography variant="h4" sx={{ mb: 0.3 }}>➕</Typography>
        <Typography variant="body2" fontWeight={600}>Agregar subproducto</Typography>
        <Typography variant="caption" color="text.secondary" display="block">Componente necesario para la fabricación</Typography>
      </Paper>

      <Collapse in={showSubForm}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {subEditIdx !== -1 ? 'Editar Subproducto' : 'Nuevo Subproducto'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Subproducto</InputLabel>
                <Select value={subNombre} label="Subproducto" onChange={(e) => setSubNombre(e.target.value)}>
                  {subProductosList.map((sp) => (
                    <MenuItem key={sp.nombre} value={sp.nombre}>{sp.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Cantidad" type="number" value={subCantidad}
                onChange={(e) => setSubCantidad(e.target.value)} />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button variant="contained" size="small" startIcon={<Check />} disabled={!subNombre || !subCantidad}
              onClick={() => {
                if (subEditIdx !== -1) {
                  const aux = [...subproductos]; aux[subEditIdx] = { nombre: subNombre, cantidad: subCantidad }; setSubproductos(aux)
                } else {
                  setSubproductos([...subproductos, { nombre: subNombre, cantidad: subCantidad }])
                }
                setShowSubForm(false); setSubEditIdx(-1); setSubNombre(''); setSubCantidad('')
              }}>
              {subEditIdx !== -1 ? 'Guardar' : 'Agregar'}
            </Button>
            <Button variant="outlined" size="small" startIcon={<Close />}
              onClick={() => { setShowSubForm(false); setSubEditIdx(-1); setSubNombre(''); setSubCantidad('') }}>
              Cancelar
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </Box>,

    // STEP 5 — Matrices
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Matrices / Noyos</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Moldes, matrices y noyos utilizados en la producción.
      </Typography>
      {matrices.length > 0 && (
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {matrices.map((m, i) => (
            <Grid item xs={6} sm={4} md={3} key={i}>
              <Paper variant="outlined"
                onClick={() => { setMatEditIdx(i); setMatNombre(m.nombre); setMatUbicacion(m.ubicacion || 'Taller'); setShowMatForm(true) }}
                sx={{ py: 2, px: 1.5, borderRadius: 2, textAlign: 'center', cursor: 'pointer', transition: '0.15s', '&:hover': { borderColor: 'primary.light' }, position: 'relative' }}>
                <Typography variant="h3" sx={{ mb: 0.3 }}>🔧</Typography>
                <Typography variant="body2" fontWeight={600}>{m.nombre}</Typography>
                <Typography variant="caption" color="text.disabled" display="block">{m.ubicacion || '—'}</Typography>
                <IconButton size="small" color="error"
                  onClick={(e) => { e.stopPropagation(); setMatrices(matrices.filter((_, j) => j !== i)) }}
                  sx={{ position: 'absolute', top: 2, right: 2, p: 0.3 }}>
                  <Delete fontSize="inherit" />
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Paper variant="outlined"
        onClick={() => { setShowMatForm(true); setMatEditIdx(-1); setMatNombre(''); setMatUbicacion('Taller') }}
        sx={{ py: 2.5, px: 1, borderRadius: 2, textAlign: 'center', cursor: 'pointer', mb: 2, borderStyle: 'dashed', transition: '0.15s', '&:hover': { borderColor: 'primary.light', bgcolor: 'action.hover' } }}>
        <Typography variant="h4" sx={{ mb: 0.3 }}>➕</Typography>
        <Typography variant="body2" fontWeight={600}>Agregar matriz / noyo</Typography>
        <Typography variant="caption" color="text.secondary" display="block">Molde o matriz utilizado en la producción</Typography>
      </Paper>

      <Collapse in={showMatForm}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {matEditIdx !== -1 ? 'Editar Matriz' : 'Nueva Matriz'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Nombre" value={matNombre} onChange={(e) => setMatNombre(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Ubicación</InputLabel>
                <Select value={matUbicacion} label="Ubicación" onChange={(e) => setMatUbicacion(e.target.value)}>
                  <MenuItem value="Taller">Taller</MenuItem>
                  <MenuItem value="Depósito">Depósito</MenuItem>
                  <MenuItem value="Proveedor">Proveedor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button variant="contained" size="small" startIcon={<Check />} disabled={!matNombre}
              onClick={() => {
                if (matEditIdx !== -1) {
                  const aux = [...matrices]; aux[matEditIdx] = { nombre: matNombre, ubicacion: matUbicacion }; setMatrices(aux)
                } else {
                  setMatrices([...matrices, { nombre: matNombre, ubicacion: matUbicacion }])
                }
                setShowMatForm(false); setMatEditIdx(-1); setMatNombre(''); setMatUbicacion('Taller')
              }}>
              {matEditIdx !== -1 ? 'Guardar' : 'Agregar'}
            </Button>
            <Button variant="outlined" size="small" startIcon={<Close />}
              onClick={() => { setShowMatForm(false); setMatEditIdx(-1); setMatNombre(''); setMatUbicacion('Taller') }}>
              Cancelar
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </Box>,

    // STEP 5 — Confirmar
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Confirmar producto</Typography>
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={4} md={3}>
          <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center', borderColor: 'divider' }}>
            <Typography variant="h4" sx={{ mb: 0.3 }}>📦</Typography>
            <Typography variant="body2" fontWeight={600}>{nombre}</Typography>
            <Typography variant="caption" color="text.secondary" display="block">Nombre</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center', borderColor: 'divider' }}>
            <Typography variant="h4" sx={{ mb: 0.3 }}>💰</Typography>
            <Typography variant="body2" fontWeight={600}>$ {formatMoney(precio)}</Typography>
            <Typography variant="caption" color="text.secondary" display="block">Precio</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center', borderColor: 'divider' }}>
            <Typography variant="h4" sx={{ mb: 0.3 }}>📊</Typography>
            <Typography variant="body2" fontWeight={600}>{cantidad}</Typography>
            <Typography variant="caption" color="text.secondary" display="block">Stock</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center', borderColor: 'divider' }}>
            <Typography variant="h4" sx={{ mb: 0.3 }}>{isSubproducto ? '🧩' : '📦'}</Typography>
            <Typography variant="body2" fontWeight={600}>{isSubproducto ? 'Subproducto' : 'Final'}</Typography>
            <Typography variant="caption" color="text.secondary" display="block">Tipo</Typography>
          </Paper>
        </Grid>
        {categoria && (
          <Grid item xs={6} sm={4} md={3}>
            <Paper variant="outlined" sx={{ py: 2, px: 1, borderRadius: 2, textAlign: 'center', borderColor: 'divider' }}>
              <Typography variant="h4" sx={{ mb: 0.3 }}>📋</Typography>
              <Typography variant="body2" fontWeight={600}>{categoria}</Typography>
              <Typography variant="caption" color="text.secondary" display="block">Categoría</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {Object.keys(variantes).length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Variantes ({Object.keys(variantes).length})</Typography>
          <Grid container spacing={1}>
            {Object.entries(variantes).map(([key, v]) => (
              <Grid item xs={4} sm={3} md={2} key={key}>
                <Paper variant="outlined" sx={{ py: 1.5, px: 0.5, borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ mb: 0.2 }}>🎨</Typography>
                  <Typography variant="caption" fontWeight={600} display="block">{key}</Typography>
                  <Typography variant="caption" color="primary.main" fontWeight={700}>${v.precio ? formatMoney(v.precio) : '—'}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {cadena.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Cadena de producción ({cadena.length} pasos)</Typography>
          <Grid container spacing={1}>
            {cadena.map((p, i) => (
              <Grid item xs={4} sm={3} md={2} key={i}>
                <Paper variant="outlined" sx={{ py: 1.5, px: 0.5, borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ mb: 0.2 }}>⚙️</Typography>
                  <Typography variant="caption" fontWeight={600} display="block">{p.proceso}</Typography>
                  <Typography variant="caption" color="text.disabled">{p.isProcesoPropio ? 'Propio' : p.proveedor}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {subproductos.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Subproductos ({subproductos.length})</Typography>
          <Grid container spacing={1}>
            {subproductos.map((sp, i) => (
              <Grid item xs={4} sm={3} md={2} key={i}>
                <Paper variant="outlined" sx={{ py: 1.5, px: 0.5, borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ mb: 0.2 }}>🧩</Typography>
                  <Typography variant="caption" fontWeight={600} display="block">{sp.nombre}</Typography>
                  <Typography variant="caption" color="primary.main" fontWeight={700}>x{sp.cantidad}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {matrices.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Matrices / Noyos ({matrices.length})</Typography>
          <Grid container spacing={1}>
            {matrices.map((m, i) => (
              <Grid item xs={4} sm={3} md={2} key={i}>
                <Paper variant="outlined" sx={{ py: 1.5, px: 0.5, borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ mb: 0.2 }}>🔧</Typography>
                  <Typography variant="caption" fontWeight={600} display="block">{m.nombre}</Typography>
                  <Typography variant="caption" color="text.disabled">{m.ubicacion}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {cadena.length === 0 && subproductos.length === 0 && matrices.length === 0 && Object.keys(variantes).length === 0 && (
        <Paper variant="outlined" sx={{ py: 3, px: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography color="text.secondary" variant="body2">Solo se guardará la información básica.</Typography>
        </Paper>
      )}
    </Box>,
  ]

  return (
    <Layout history={props.history} page={isEdit ? 'Editar Producto' : 'Nuevo Producto'} user={props.user?.uid} blockGoBack={true}>
      <BaseWizard
        stepLabels={['Info', 'Variantes', 'Producción', 'Subproductos', 'Matrices', 'Confirmar']}
        steps={steps}
        activeStep={activeStep}
        onNext={(step) => setActiveStep(step !== undefined ? step : (s) => s + 1)}
        onBack={() => setActiveStep((s) => s - 1)}
        onFinish={guardar}
        disabled={!nombre}
        finishLabel={isEdit ? 'Guardar Cambios' : 'Crear Producto'}
        showJumpToLast={isEdit}
      />
      {isEdit && (
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, mb: 2 }}>
          <Button variant="text" color="error" size="small" onClick={() => {
            if (window.confirm('¿Eliminar producto?')) {
              setLoading(true)
              const nombreBuscado = checkSearchProducto(props.history.location.search)
              const entryDel = Object.entries(props.productos || {}).find(([k, p]) => k === nombreBuscado || p.nombre === nombreBuscado || p.id === nombreBuscado)
              removeData(props.user.uid, `productos/${entryDel ? entryDel[0] : nombreBuscado}`)
                .then(() => { setSnack('Producto eliminado'); setTimeout(() => props.history.replace('/Productos'), 1500) })
                .catch(() => setLoading(false))
            }
          }} sx={{ opacity: 0.4, '&:hover': { opacity: 1 } }}>
            Eliminar producto
          </Button>
        </Box>
      )}
      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity={snack.includes('Error') ? 'error' : 'success'}>{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(NuevoProducto)
