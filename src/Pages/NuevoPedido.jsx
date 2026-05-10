import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Backdrop, Snackbar, CircularProgress, TextField, Grid, Paper, Autocomplete, Typography
} from '@mui/material'
import { Alert } from '@mui/material'
import { BaseWizard } from '../components/BaseWizard'
import { database } from '../services'
import { checkSearch, fechaDetallada } from '../utilities'
import { Step as StepComponent } from '../components/Nuevo-Pedido/Step'

const NuevoPedido = (props) => {
  const [nombre, setnombre] = useState('')
  const [productos, setproductos] = useState([])
  const [total, settotal] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [showSnackbar, setshowSnackbar] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (props.history.location.search) {
      const id = checkSearch(props.history.location.search)
      const pedido = props.pedidos[id]
      if (pedido) {
        setnombre(pedido.cliente)
        setproductos(pedido.articulos || [])
        settotal(pedido.total || 0)
      }
    }
  }, [])

  const guardarPedido = async () => {
    setLoading(true)
    const aux = {
      cliente: nombre,
      fecha: fechaDetallada(),
      articulos: productos,
      total,
    }
    try {
      if (props.history.location.search) {
        const id = props.history.location.search.slice(1)
        await database().ref().child(props.user.uid).child('pedidos').child(id).update(aux)
      } else {
        await database().ref().child(props.user.uid).child('pedidos').push(aux)
      }
      setshowSnackbar(props.history.location.search ? 'Pedido editado!' : 'Pedido creado!')
      setTimeout(() => props.history.replace('/Pedidos'), 2000)
    } catch { setLoading(false) }
  }

  const steps = [
    <Autocomplete
      freeSolo
      value={nombre}
      options={props.clientes ? Object.keys(props.clientes) : []}
      getOptionLabel={(option) => option}
      onChange={(_, v) => setnombre(v)}
      onInputChange={(_, v) => setnombre(v)}
      renderInput={(params) => <TextField {...params} label="Cliente" fullWidth />}
    />,
    <StepComponent
      nombre={nombre}
      productos={productos}
      setproductos={setproductos}
      total={total}
      settotal={settotal}
    />,
  ]

  const getDisabled = (step) => {
    switch (step) {
      case 0: return !nombre
      case 1: return !productos.length
      default: return false
    }
  }

  return (
    <Layout history={props.history} page={props.history.location.search ? 'Editar Pedido' : 'Nuevo Pedido'} user={props.user.uid} blockGoBack={true}>
      <BaseWizard
        steps={steps}
        activeStep={activeStep}
        onNext={() => setActiveStep(s => s + 1)}
        onBack={() => setActiveStep(s => s - 1)}
        onFinish={guardarPedido}
        disabled={getDisabled(activeStep)}
        finishLabel={props.history.location.search ? 'Guardar Edición' : 'Crear Pedido'}
      />

      <Backdrop open={loading} sx={{ zIndex: t => t.zIndex.drawer + 1, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={!!showSnackbar} autoHideDuration={2000} onClose={() => setshowSnackbar('')}>
        <Alert severity="success" variant="filled">{showSnackbar}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(NuevoPedido)
