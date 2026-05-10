import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, TextField, Grid, Typography, Switch, FormControlLabel, Paper,
  Backdrop, CircularProgress, Snackbar, Button, Collapse, Chip, IconButton,
  Divider, Select, MenuItem, InputLabel, FormControl
} from '@mui/material'
import { Alert } from '@mui/material'
import { Add, Check, Close, Delete, Edit } from '@mui/icons-material'
import { BaseWizard } from '../components/BaseWizard'
import { removeData, updateData } from '../services'
import { registrarMovimientoStock } from '../services/productosService'
import { checkSearchProducto } from '../utilities'
import { ImageUpload } from '../components/ImageUpload'
import { Step } from '../components/Nuevo-Producto/Step'

const NuevoProducto = (props) => {
  const [nombre, setNombre] = useState('')
  const [cantidad, setCantidad] = useState(0)
  const [isSubproducto, setIsSubproducto] = useState(false)
  const [imagen, setImagen] = useState(null)
  const [cadena, setCadena] = useState([])
  const [subproductos, setSubproductos] = useState([])
  const [matrices, setMatrices] = useState([])
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

  useEffect(() => {
    if (isEdit) {
      const p = props.productos?.[checkSearchProducto(props.history.location.search)]
      if (p) {
        setNombre(p.nombre || '')
        setCantidad(p.cantidad || 0)
        setIsSubproducto(!!p.isSubproducto)
        setImagen(p.imagen || null)
        setCadena(p.cadenaDeProduccion || [])
        setSubproductos(p.subproductos || [])
        setMatrices(p.matrices || [])
      }
    }
  }, [])

  const generarId = () => {
    if (isEdit) {
      const p = props.productos?.[checkSearchProducto(props.history.location.search)]
      return p?.id || Date.now().toString(36)
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  }

  const guardar = async () => {
    setLoading(true)
    const cantidadAnterior = isEdit ? props.productos?.[checkSearchProducto(props.history.location.search)]?.cantidad || 0 : 0
    const payload = { id: generarId(), nombre, cantidad, isSubproducto, imagen, cadenaDeProduccion: cadena, subproductos, matrices }
    try {
      if (isEdit) {
        await removeData(props.user.uid, `productos/${props.history.location.search.slice(1)}`)
      }
      await updateData(props.user.uid, 'productos', { [nombre]: payload })
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
              <TextField fullWidth label="Stock" type="number" value={cantidad} onChange={(e) => setCantidad(parseFloat(e.target.value) || 0)} />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel control={<Switch checked={isSubproducto} onChange={(e) => setIsSubproducto(e.target.checked)} />} label="Es subproducto" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>,

    // STEP 2 — Producción (via Step component)
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Cadena de producción</Typography>
      <Step tipoDeDato="Cadena de Producción" cadenaDeProduccion={cadena} setcadenaDeProduccion={setCadena}
        proveedores={props.proveedores}
        subproductos={subProductosList} allProductos={Object.values(props.productos || {})} />
    </Box>,

    // STEP 3 — Subproductos
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Subproductos asociados</Typography>
      {subproductos.map((sp, i) => (
        <Paper key={i} variant="outlined" sx={{ p: 1.5, borderRadius: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" fontWeight={600}>{sp.nombre}</Typography>
            <Typography variant="caption" color="text.secondary">Cantidad: {sp.cantidad}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={() => { setSubEditIdx(i); setSubNombre(sp.nombre); setSubCantidad(sp.cantidad); setShowSubForm(true) }}
              sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main' } }}><Edit fontSize="small" /></IconButton>
            <IconButton size="small" color="error" onClick={() => setSubproductos(subproductos.filter((_, j) => j !== i))}><Delete fontSize="small" /></IconButton>
          </Box>
        </Paper>
      ))}

      <Button variant="contained" startIcon={<Add />} onClick={() => { setShowSubForm(true); setSubEditIdx(-1); setSubNombre(''); setSubCantidad('') }} sx={{ mb: 2 }}>
        Agregar Subproducto
      </Button>

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

    // STEP 4 — Matrices
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Matrices / Noyos</Typography>
      {matrices.map((m, i) => (
        <Paper key={i} variant="outlined" sx={{ p: 1.5, borderRadius: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" fontWeight={600}>{m.nombre}</Typography>
            <Typography variant="caption" color="text.secondary">Ubicación: {m.ubicacion || '—'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={() => { setMatEditIdx(i); setMatNombre(m.nombre); setMatUbicacion(m.ubicacion || 'Taller'); setShowMatForm(true) }}
              sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main' } }}><Edit fontSize="small" /></IconButton>
            <IconButton size="small" color="error" onClick={() => setMatrices(matrices.filter((_, j) => j !== i))}><Delete fontSize="small" /></IconButton>
          </Box>
        </Paper>
      ))}

      <Button variant="contained" startIcon={<Add />} onClick={() => { setShowMatForm(true); setMatEditIdx(-1); setMatNombre(''); setMatUbicacion('Taller') }} sx={{ mb: 2 }}>
        Agregar Matriz / Noyo
      </Button>

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
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Información general</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}><Typography variant="caption" color="text.secondary">Nombre</Typography><Typography variant="body2" fontWeight={600}>{nombre}</Typography></Grid>
            <Grid item xs={3}><Typography variant="caption" color="text.secondary">Stock</Typography><Typography variant="body2" fontWeight={600}>{cantidad}</Typography></Grid>
            <Grid item xs={3}><Typography variant="caption" color="text.secondary">Tipo</Typography><Typography variant="body2" fontWeight={600}>{isSubproducto ? 'Subproducto' : 'Producto final'}</Typography></Grid>
          </Grid>
        </Box>

        {cadena.length > 0 && (
          <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Cadena de producción ({cadena.length} pasos)</Typography>
            <Grid container spacing={1}>
              {cadena.map((p, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Paper variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
                    <Typography variant="caption" fontWeight={600}>{p.proceso}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {p.isProcesoPropio ? 'Propio' : p.proveedor}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {subproductos.length > 0 && (
          <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Subproductos ({subproductos.length})</Typography>
            <Grid container spacing={1}>
              {subproductos.map((sp, i) => (
                <Grid item xs={6} sm={4} md={3} key={i}>
                  <Paper variant="outlined" sx={{ p: 1, borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="body2" fontWeight={600}>{sp.nombre}</Typography>
                    <Typography variant="caption" color="text.secondary">x{sp.cantidad}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {matrices.length > 0 && (
          <Box sx={{ px: 2.5, py: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Matrices / Noyos ({matrices.length})</Typography>
            <Grid container spacing={1}>
              {matrices.map((m, i) => (
                <Grid item xs={6} sm={4} md={3} key={i}>
                  <Paper variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight={600}>{m.nombre}</Typography>
                    <Typography variant="caption" color="text.secondary">{m.ubicacion}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {cadena.length === 0 && subproductos.length === 0 && matrices.length === 0 && (
          <Box sx={{ px: 2.5, py: 2 }}>
            <Typography color="text.secondary" variant="body2">Solo se guardará la información básica.</Typography>
          </Box>
        )}
      </Paper>
    </Box>,
  ]

  return (
    <Layout history={props.history} page={isEdit ? 'Editar Producto' : 'Nuevo Producto'} user={props.user?.uid} blockGoBack={true}>
      <BaseWizard
        stepLabels={['Info', 'Producción', 'Subproductos', 'Matrices', 'Confirmar']}
        steps={steps}
        activeStep={activeStep}
        onNext={() => setActiveStep((s) => s + 1)}
        onBack={() => setActiveStep((s) => s - 1)}
        onFinish={guardar}
        disabled={!nombre}
        finishLabel={isEdit ? 'Guardar Cambios' : 'Crear Producto'}
      />
      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(NuevoProducto)
