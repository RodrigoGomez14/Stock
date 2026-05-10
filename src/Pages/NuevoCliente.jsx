import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Paper, Backdrop, Snackbar, CircularProgress, TextField, Grid, Typography,
  FormControl, InputLabel, Select, MenuItem, Chip, Avatar
} from '@mui/material'
import { Alert } from '@mui/material'
import { BaseWizard } from '../components/BaseWizard'
import { database } from '../services'
import { checkSearch } from '../utilities'
import { ContactMail, LocalShipping, Mail, PeopleAlt, Phone, Room } from '@mui/icons-material'
import { Direccion } from '../components/Nuevo-Cliente/Direccion'
import { Telefonos } from '../components/Nuevo-Cliente/Telefonos'
import { Mails } from '../components/Nuevo-Cliente/Mails'
import { InfoExtra } from '../components/Nuevo-Cliente/InfoExtra'
import { DialogEliminarElemento } from '../components/Nuevo-Cliente/Dialogs/DialogEliminarElemento'
import { DialogNuevaDireccion } from '../components/Nuevo-Cliente/Dialogs/DialogNuevaDireccion'
import { DialogNuevoTelefono } from '../components/Nuevo-Cliente/Dialogs/DialogNuevoTelefono'
import { DialogNuevoMail } from '../components/Nuevo-Cliente/Dialogs/DialogNuevoMail'
import { DialogNuevaInfoExtra } from '../components/Nuevo-Cliente/Dialogs/DialogNuevaInfoExtra'

const NuevoCliente = (props) => {
  const [nombre, setnombre] = useState('')
  const [dni, setdni] = useState('')
  const [cuit, setcuit] = useState('')
  const [expresos, setexpresos] = useState([])
  const [mails, setmails] = useState([])
  const [direcciones, setdirecciones] = useState([])
  const [telefonos, settelefonos] = useState([])
  const [infoExtra, setinfoExtra] = useState([])
  const [deuda, setdeuda] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [showSnackbar, setshowSnackbar] = useState('')
  const [loading, setLoading] = useState(false)

  const [deleteIndex, setdeleteIndex] = useState(undefined)
  const [editIndex, seteditIndex] = useState(undefined)
  const [showDialog, setshowDialog] = useState(undefined)
  const [openDialog, setopenDialog] = useState(false)

  useEffect(() => {
    if (props.history.location.search) {
      const data = props.clientes[checkSearch(props.history.location.search)]
      if (data) {
        const { nombre, dni, cuit, expresos, mails, direcciones, telefonos, infoExtra, deuda } = data.datos
        setnombre(nombre || '')
        setdni(dni || '')
        setcuit(cuit || '')
        setexpresos(expresos || [])
        setmails(mails || [])
        setdirecciones(direcciones || [])
        settelefonos(telefonos || [])
        setinfoExtra(infoExtra || [])
        setdeuda(deuda || 0)
      }
    }
  }, [])

  const guardarCliente = async () => {
    setLoading(true)
    const aux = {
      datos: { nombre, dni, cuit, expresos, mails, direcciones, telefonos, infoExtra, deuda }
    }

    try {
      if (props.history.location.search) {
        const oldName = props.history.location.search.slice(1)
        await database().ref().child(props.user.uid).child('clientes').child(oldName).remove()
        await database().ref().child(props.user.uid).child('clientes').child(nombre).update(aux)
      } else {
        await database().ref().child(props.user.uid).child('clientes').update({ [nombre]: aux })
      }
      setshowSnackbar(props.history.location.search ? 'El Cliente Se Editó Correctamente!' : 'El Cliente Se Agregó Correctamente!')
      setTimeout(() => {
        props.history.replace(`/Cliente?${nombre}`)
      }, 2000)
    } catch {
      setLoading(false)
    }
  }

  const steps = [
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField fullWidth label="Nombre" value={nombre} onChange={e => setnombre(e.target.value)} />
      </Grid>
      <Grid item xs={6}>
        <TextField fullWidth label="DNI" value={dni} onChange={e => setdni(e.target.value)} />
      </Grid>
      <Grid item xs={6}>
        <TextField fullWidth label="CUIT" value={cuit} onChange={e => setcuit(e.target.value)} />
      </Grid>
    </Grid>,
    <Direccion direcciones={direcciones} seteditIndex={seteditIndex} showDialog={setshowDialog} openDialogDelete={setopenDialog} />,
    <Telefonos telefonos={telefonos} seteditIndex={seteditIndex} showDialog={setshowDialog} openDialogDelete={setopenDialog} />,
    <Mails mails={mails} seteditIndex={seteditIndex} showDialog={setshowDialog} openDialogDelete={setopenDialog} />,
    <InfoExtra infoExtra={infoExtra} seteditIndex={seteditIndex} showDialog={setshowDialog} openDialogDelete={setopenDialog} />,
  ]

  const getDisabled = (step) => {
    switch (step) {
      case 0: return !nombre
      default: return false
    }
  }

  return (
    <Layout history={props.history} page={props.history.location.search ? 'Editar Cliente' : 'Nuevo Cliente'} user={props.user.uid} blockGoBack={true}>
      <BaseWizard
        steps={steps}
        activeStep={activeStep}
        onNext={() => setActiveStep(s => s + 1)}
        onBack={() => setActiveStep(s => s - 1)}
        onFinish={guardarCliente}
        disabled={getDisabled(activeStep)}
        finishLabel={props.history.location.search ? 'Guardar Edición' : 'Guardar Cliente'}
      />

      <DialogEliminarElemento open={openDialog} setopen={setopenDialog} datos={showDialog === 'direccion' ? direcciones : showDialog === 'telefono' ? telefonos : showDialog === 'mail' ? mails : infoExtra} setDatos={showDialog === 'direccion' ? setdirecciones : showDialog === 'telefono' ? settelefonos : showDialog === 'mail' ? setmails : setinfoExtra} index={deleteIndex} setdeleteIndex={setdeleteIndex} tipoDeElemento={showDialog} />
      <DialogNuevaDireccion open={showDialog === 'direccion'} setopen={() => setshowDialog(undefined)} datos={direcciones} setDatos={setdirecciones} edit={editIndex !== undefined} editIndex={editIndex} seteditIndex={seteditIndex} />
      <DialogNuevoTelefono open={showDialog === 'telefono'} setopen={() => setshowDialog(undefined)} datos={telefonos} setDatos={settelefonos} edit={editIndex !== undefined} editIndex={editIndex} seteditIndex={seteditIndex} />
      <DialogNuevoMail open={showDialog === 'mail'} setopen={() => setshowDialog(undefined)} datos={mails} setDatos={setmails} edit={editIndex !== undefined} editIndex={editIndex} seteditIndex={seteditIndex} />
      <DialogNuevaInfoExtra open={showDialog === 'infoExtra'} setopen={() => setshowDialog(undefined)} datos={infoExtra} setDatos={setinfoExtra} edit={editIndex !== undefined} editIndex={editIndex} seteditIndex={seteditIndex} />

      <Backdrop open={loading} sx={{ zIndex: t => t.zIndex.drawer + 1, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={!!showSnackbar} autoHideDuration={2000} onClose={() => setshowSnackbar('')}>
        <Alert severity="success" variant="filled">{showSnackbar}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(NuevoCliente)
