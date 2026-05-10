import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, TextField, Autocomplete, Typography, Grid, Paper,
  Backdrop, CircularProgress, Snackbar, Button
} from '@mui/material'
import { Alert } from '@mui/material'
import { Add } from '@mui/icons-material'
import { BaseWizard } from '../components/BaseWizard'
import { database } from '../services'
import { fechaDetallada } from '../utilities'
import { Step } from '../components/Nuevo-Pedido/Step'

const NuevoPedido = (props) => {
  const [cliente, setCliente] = useState('')
  const [productos, setProductos] = useState([])
  const [total, setTotal] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const isEdit = !!props.history.location.search

  useEffect(() => {
    if (isEdit) {
      const id = props.history.location.search.slice(1)
      const p = props.pedidos?.[id]
      if (p) {
        setCliente(p.cliente || '')
        setProductos(p.articulos || [])
        setTotal(p.total || 0)
      }
    }
  }, [])

  const guardar = async () => {
    setLoading(true)
    const aux = { cliente, fecha: fechaDetallada(), articulos: productos, total }
    try {
      if (isEdit) {
        await database().ref().child(props.user.uid).child('pedidos').child(props.history.location.search.slice(1)).update(aux)
      } else {
        await database().ref().child(props.user.uid).child('pedidos').push(aux)
      }
      setSnack(isEdit ? 'Pedido editado' : 'Pedido creado')
      setTimeout(() => props.history.replace('/Pedidos'), 1500)
    } catch { setLoading(false) }
  }

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
      <Step
        nombre={cliente}
        productos={productos}
        setproductos={setProductos}
        total={total}
        settotal={setTotal}
      />
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Confirmar pedido</Typography>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography><strong>Cliente:</strong> {cliente}</Typography>
        <Typography><strong>Productos:</strong> {productos.length}</Typography>
        <Typography><strong>Total:</strong> ${total}</Typography>
      </Paper>
    </Box>,
  ]

  return (
    <Layout history={props.history} page={isEdit ? 'Editar Pedido' : 'Nuevo Pedido'} user={props.user?.uid} blockGoBack={true}>
      <BaseWizard
        stepLabels={['Cliente', 'Productos', 'Confirmar']}
        steps={steps}
        activeStep={activeStep}
        onNext={() => setActiveStep((s) => s + 1)}
        onBack={() => setActiveStep((s) => s - 1)}
        onFinish={guardar}
        disabled={!cliente}
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
