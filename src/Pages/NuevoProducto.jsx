import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import { Backdrop, Snackbar, CircularProgress, Typography, Grid, Chip } from '@mui/material'
import { Alert } from '@mui/material'
import { BaseWizard } from '../components/BaseWizard'
import { database } from '../services'
import { checkSearchProducto, getProductosList, getSubproductosList, getAllProductosList } from '../utilities'
import { Step as StepComponent } from '../components/Nuevo-Producto/Step'
import { Subproductos } from '../components/Nuevo-Producto/Subproductos'
import { Matrices } from '../components/Nuevo-Producto/Matrices'
import { DialogAgregarProceso } from '../components/Nuevo-Producto/Dialogs/DialogAgregarProceso'
import { DialogNuevaMatriz } from '../components/Nuevo-Producto/Dialogs/DialogNuevaMatriz'
import { DialogNuevoSubproducto } from '../components/Nuevo-Producto/Dialogs/DialogNuevoSubproducto'
import { DialogEliminarElemento } from '../components/Nuevo-Producto/Dialogs/DialogEliminarElemento'

const NuevoProducto = (props) => {
  const [isSubproducto, setIsSubproducto] = useState(false)
  const [nombre, setnombre] = useState('')
  const [precio, setprecio] = useState(0)
  const [cantidad, setcantidad] = useState(0)
  const [cadenaDeProduccion, setcadenaDeProduccion] = useState([])
  const [subproductos, setSubproductosState] = useState([])
  const [matrices, setMatrices] = useState([])
  const [activeStep, setActiveStep] = useState(0)
  const [showSnackbar, setshowSnackbar] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDialog, setshowDialog] = useState(undefined)
  const [editIndex, seteditIndex] = useState(undefined)
  const [deleteIndex, setdeleteIndex] = useState(undefined)
  const [openDialog, setopenDialog] = useState(false)

  useEffect(() => {
    if (props.history.location.search) {
      const nombre = checkSearchProducto(props.history.location.search)
      const prod = props.productos[nombre]
      if (prod) {
        setnombre(prod.nombre || '')
        setprecio(prod.precio || 0)
        setcantidad(prod.cantidad || 0)
        setcadenaDeProduccion(prod.cadenaDeProduccion || [])
        setSubproductosState(prod.subproductos || [])
        setMatrices(prod.matrices || {})
        setIsSubproducto(!!prod.isSubproducto)
      }
    }
  }, [])

  const guardarProducto = async () => {
    setLoading(true)
    const aux = {
      nombre, precio, cantidad, isSubproducto,
      cadenaDeProduccion, subproductos, matrices,
    }
    try {
      if (props.history.location.search) {
        const oldName = props.history.location.search.slice(1)
        await database().ref().child(props.user.uid).child('productos').child(oldName).remove()
        await database().ref().child(props.user.uid).child('productos').update({ [nombre]: aux })
      } else {
        await database().ref().child(props.user.uid).child('productos').update({ [nombre]: aux })
      }
      setshowSnackbar(props.history.location.search ? 'Producto editado!' : 'Producto creado!')
      setTimeout(() => props.history.replace('/Productos'), 2000)
    } catch { setLoading(false) }
  }

  const steps = [
    <StepComponent
      tipoDeDato="Detalles"
      nombre={nombre} setnombre={setnombre}
      precio={precio} setprecio={setprecio}
      cantidad={cantidad} setcantidad={setcantidad}
      isSubproducto={isSubproducto} setIsSubproducto={setIsSubproducto}
    />,
    <StepComponent
      tipoDeDato="Cadena de Producción"
      cadenaDeProduccion={cadenaDeProduccion} setcadenaDeProduccion={setcadenaDeProduccion}
      subproductos={getSubproductosList(props.productos)}
      allProductos={getAllProductosList(props.productos)}
    />,
    <Subproductos
      subproductos={subproductos}
      seteditIndex={seteditIndex}
      showDialog={setshowDialog}
      openDialogDelete={setopenDialog}
    />,
    <Matrices
      matrices={matrices}
      seteditIndexMatriz={seteditIndex}
      showDialog={setshowDialog}
      openDialogDelete={setopenDialog}
    />,
  ]

  const getDisabled = (step) => {
    switch (step) {
      case 0: return !nombre
      default: return false
    }
  }

  return (
    <Layout history={props.history} page={props.history.location.search ? 'Editar Producto' : 'Nuevo Producto'} user={props.user.uid} blockGoBack={true}>
      <BaseWizard
        steps={steps}
        activeStep={activeStep}
        onNext={() => setActiveStep(s => s + 1)}
        onBack={() => setActiveStep(s => s - 1)}
        onFinish={guardarProducto}
        disabled={getDisabled(activeStep)}
        finishLabel={props.history.location.search ? 'Guardar Edición' : 'Crear Producto'}
      />

      <DialogAgregarProceso open={showDialog === 'proceso'} setOpen={() => setshowDialog(undefined)} datos={cadenaDeProduccion} setDatos={setcadenaDeProduccion} productos={getProductosList(props.productos)} subproductos={getSubproductosList(props.productos)} />
      <DialogNuevaMatriz open={showDialog === 'matriz'} setOpen={() => setshowDialog(undefined)} datos={matrices} setDatos={setMatrices} />
      <DialogNuevoSubproducto open={showDialog === 'subproducto'} setOpen={() => setshowDialog(undefined)} datos={subproductos} setDatos={setSubproductosState} edit={editIndex !== undefined} editIndex={editIndex} seteditIndex={seteditIndex} />
      <DialogEliminarElemento open={openDialog} setopen={setopenDialog} datos={showDialog === 'subproducto' ? subproductos : cadenaDeProduccion} setDatos={showDialog === 'subproducto' ? setSubproductosState : setcadenaDeProduccion} index={deleteIndex} setdeleteIndex={setdeleteIndex} />

      <Backdrop open={loading} sx={{ zIndex: t => t.zIndex.drawer + 1, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={!!showSnackbar} autoHideDuration={2000} onClose={() => setshowSnackbar('')}>
        <Alert severity="success" variant="filled">{showSnackbar}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(NuevoProducto)
