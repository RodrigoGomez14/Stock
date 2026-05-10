import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, TextField, Autocomplete, Typography, Grid, Paper,
  Backdrop, CircularProgress, Snackbar, Button, Chip,
  Table, TableHead, TableBody, TableRow, TableCell, IconButton,
  Collapse
} from '@mui/material'
import { Alert } from '@mui/material'
import { Add, Delete, ExpandLess, ExpandMore, Check, Close } from '@mui/icons-material'
import { BaseWizard } from '../components/BaseWizard'
import { database } from '../services'
import { fechaDetallada, formatMoney } from '../utilities'

const emptyProd = { producto: '', cantidad: 1, precio: 0 }

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
        await database().ref().child(props.user.uid).child('pedidos').child(props.history.location.search.slice(1)).update(aux)
      } else {
        await database().ref().child(props.user.uid).child('pedidos').push(aux)
      }
      setSnack(isEdit ? 'Pedido editado' : 'Pedido creado')
      setTimeout(() => props.history.replace('/Pedidos'), 1500)
    } catch { setLoading(false) }
  }

  const agregarProducto = () => {
    if (!newProd.producto || !newProd.cantidad) return
    const item = { ...newProd, total: newProd.cantidad * newProd.precio }
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

  const editarProducto = (idx) => {
    const p = productos[idx]
    setNewProd({ producto: p.producto || p.nombre, cantidad: p.cantidad, precio: p.precio })
    setEditIdx(idx)
    setShowForm(true)
  }

  const eliminarProducto = (idx) => {
    const p = productos[idx]
    setTotal(t => t - p.cantidad * p.precio)
    setProductos(productos.filter((_, i) => i !== idx))
  }

  const productoTile = (p, i) => (
    <Paper key={i} variant="outlined" sx={{ p: 1.5, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body1" fontWeight={600}>{p.producto || p.nombre}</Typography>
        <Typography variant="caption" color="text.secondary">
          {p.cantidad} x $ {formatMoney(p.precio)} = $ {formatMoney(p.cantidad * p.precio)}
        </Typography>
      </Box>
      <IconButton size="small" onClick={() => editarProducto(i)}><Chip label="Editar" size="small" /></IconButton>
      <IconButton size="small" color="error" onClick={() => eliminarProducto(i)}><Delete fontSize="small" /></IconButton>
    </Paper>
  )

  const steps = [
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Seleccionar cliente</Typography>
      <Autocomplete
        freeSolo
        value={cliente}
        options={props.clientes ? Object.keys(props.clientes) : []}
        getOptionLabel={(o) => o}
        onChange={(_, v) => setCliente(v)}
        onInputChange={(_, v) => setCliente(v)}
        renderInput={(params) => <TextField {...params} label="Cliente *" fullWidth />}
      />
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Productos del pedido</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        {productos.map((p, i) => productoTile(p, i))}
      </Box>

      {productos.length > 0 && (
        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, mb: 2, textAlign: 'right' }}>
          <Typography variant="h6" fontWeight={700}>Total: $ {formatMoney(total)}</Typography>
        </Paper>
      )}

      <Collapse in={showForm}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {editIdx >= 0 ? 'Editar producto' : 'Agregar producto'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                value={newProd.producto}
                options={props.productos ? Object.keys(props.productos) : []}
                getOptionLabel={(o) => o}
                onChange={(_, v) => setNewProd(p => ({ ...p, producto: v || '' }))}
                onInputChange={(_, v) => setNewProd(p => ({ ...p, producto: v || '' }))}
                renderInput={(params) => <TextField {...params} label="Producto" fullWidth size="small" />}
              />
            </Grid>
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
            <Button variant="contained" size="small" startIcon={<Check />} onClick={agregarProducto}>
              {editIdx >= 0 ? 'Guardar' : 'Agregar'}
            </Button>
            <Button variant="outlined" size="small" startIcon={<Close />} onClick={() => { setShowForm(false); setEditIdx(-1); setNewProd({ ...emptyProd }) }}>
              Cancelar
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {!showForm && (
        <Button variant="contained" startIcon={<Add />} onClick={() => setShowForm(true)}>
          Agregar Producto
        </Button>
      )}
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Confirmar pedido</Typography>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography><strong>Cliente:</strong> {cliente}</Typography>
        <Typography><strong>Productos:</strong> {productos.length}</Typography>
        {productos.map((p, i) => (
          <Typography key={i} variant="body2" sx={{ ml: 2 }}>
            • {p.cantidad}x {p.producto || p.nombre} — $ {formatMoney(p.cantidad * p.precio)}
          </Typography>
        ))}
        <Typography sx={{ mt: 1, fontWeight: 700 }}>Total: $ {formatMoney(total)}</Typography>
      </Paper>
    </Box>,
  ]

  const getDisabled = (step) => {
    switch (step) {
      case 0: return !cliente
      case 1: return productos.length === 0
      default: return false
    }
  }

  return (
    <Layout history={props.history} page={isEdit ? 'Editar Pedido' : 'Nuevo Pedido'} user={props.user?.uid} blockGoBack={true}>
      <BaseWizard
        stepLabels={['Cliente', 'Productos', 'Confirmar']}
        steps={steps}
        activeStep={activeStep}
        onNext={() => setActiveStep((s) => s + 1)}
        onBack={() => setActiveStep((s) => s - 1)}
        onFinish={guardar}
        disabled={getDisabled(activeStep)}
        finishLabel={isEdit ? 'Guardar Cambios' : 'Crear Pedido'}
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

export default withStore(NuevoPedido)
