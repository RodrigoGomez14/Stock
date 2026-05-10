import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, TextField, Grid, Typography, Switch, FormControlLabel, Paper,
  Backdrop, CircularProgress, Snackbar
} from '@mui/material'
import { Alert } from '@mui/material'
import { BaseWizard } from '../components/BaseWizard'
import { removeData, updateData } from '../services'
import { checkSearchProducto } from '../utilities'
import { ImageUpload } from '../components/ImageUpload'
import { Step } from '../components/Nuevo-Producto/Step'
import { Subproductos } from '../components/Nuevo-Producto/Subproductos'
import { Matrices } from '../components/Nuevo-Producto/Matrices'

const NuevoProducto = (props) => {
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState(0)
  const [cantidad, setCantidad] = useState(0)
  const [isSubproducto, setIsSubproducto] = useState(false)
  const [imagen, setImagen] = useState(null)
  const [cadena, setCadena] = useState([])
  const [subproductos, setSubproductos] = useState([])
  const [matrices, setMatrices] = useState({})
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const isEdit = !!props.history.location.search

  useEffect(() => {
    if (isEdit) {
      const p = props.productos?.[checkSearchProducto(props.history.location.search)]
      if (p) {
        setNombre(p.nombre || '')
        setPrecio(p.precio || 0)
        setCantidad(p.cantidad || 0)
        setIsSubproducto(!!p.isSubproducto)
        setImagen(p.imagen || null)
        setCadena(p.cadenaDeProduccion || [])
        setSubproductos(p.subproductos || [])
        setMatrices(p.matrices || {})
      }
    }
  }, [])

  const guardar = async () => {
    setLoading(true)
    const payload = { nombre, cantidad, isSubproducto, imagen, cadenaDeProduccion: cadena, subproductos, matrices }
    try {
      if (isEdit) {
        await removeData(props.user.uid, `productos/${props.history.location.search.slice(1)}`)
      }
      await updateData(props.user.uid, 'productos', { [nombre]: payload })
      setSnack(isEdit ? 'Producto editado' : 'Producto creado')
      setTimeout(() => props.history.replace('/Productos'), 1500)
    } catch { setLoading(false) }
  }

  const steps = [
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
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={isSubproducto} onChange={(e) => setIsSubproducto(e.target.checked)} />}
                label="Es subproducto"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Cadena de producción</Typography>
      <Step
        tipoDeDato="Cadena de Producción"
        cadenaDeProduccion={cadena}
        setcadenaDeProduccion={setCadena}
        proveedores={props.proveedores}
        subproductos={Object.values(props.productos || {}).filter((p) => p.isSubproducto)}
        allProductos={Object.values(props.productos || {})}
      />
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Subproductos asociados</Typography>
      <Subproductos subproductos={subproductos} />
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Matrices</Typography>
      <Matrices matrices={matrices} />
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Confirmar producto</Typography>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={6}><Typography variant="caption" color="text.secondary">Nombre</Typography><Typography>{nombre}</Typography></Grid>
          <Grid item xs={6}><Typography variant="caption" color="text.secondary">Stock</Typography><Typography>{cantidad}</Typography></Grid>
          <Grid item xs={12}><Typography variant="caption" color="text.secondary">Tipo</Typography><Typography>{isSubproducto ? 'Subproducto' : 'Producto final'}</Typography></Grid>
        </Grid>
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
      <Backdrop open={loading} sx={{ zIndex: (t) => t.zIndex.drawer + 1, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success" variant="filled">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(NuevoProducto)
