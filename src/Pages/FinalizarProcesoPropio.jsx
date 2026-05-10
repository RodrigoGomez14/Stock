import React,{useState, useEffect} from 'react'
import { withStore } from '../context/AppContext'
import {Layout} from './Layout'
import {Grid,Paper,Chip,Card,Button,StepContent,Backdrop,StepLabel,Typography,Step,Stepper,Snackbar,CircularProgress} from '@mui/material'
import Alert from '@mui/material/Alert';
import {Step as StepComponent} from '../components/Finalizar-Proceso-Propio/Step'
import { pushData, updateData, removeData, setData, getPushKey } from '../services'
import { Navigate } from 'react-router-dom'
import {checkSearch, formatMoney,fechaDetallada,obtenerFecha} from '../utilities'
import {content} from './styles/styles'
import { AttachMoney, List, LocalAtm } from '@mui/icons-material';

const PROVEEDOR_PRODUCCION_PROPIA = 'Tota'

const FinalizarProcesoPropio=(props)=>{
    const classes = content()

    const [cantidad, setCantidad] = useState(props.cadenasActivas[props.history.location.search.slice(1)].cantidad?props.cadenasActivas[props.history.location.search.slice(1)].cantidad:undefined);

    const [activeStep, setActiveStep] = useState(0);
    const [showSnackbar, setshowSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);

    const steps = getSteps();

    //STEPPER NAVIGATION 
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    function getStepContent(step) {
      switch (step) {
        case 0:
          return (
            <StepComponent  
                setCantidad={setCantidad}
                cantidad={cantidad}
            />
          );
        }
    }
    function getSteps() {
        return ['Detalles'];
    }
    function getStepLabel(label,index) {
        switch (index) {
            case 0:
                return (
                    <StepLabel>
                        <Chip 
                            avatar={<List/>} 
                            label={label}  
                            onClick={()=>{setActiveStep(index)}}
                            variant='default'
                            className={activeStep==index?classes.iconLabelSelected:null}
                        />
                    </StepLabel>
                );
        }
    }


    //FUNCTIONS
    const checkStepProceso = (id) =>{
        let aux = props.cadenasActivas[id].procesos
        let index = 0
        aux.map((proceso,i)=>{
            if(proceso.fechaDeInicio){
                index = i
            }
        })
        return index
    }
    const finalizarProceso = async () =>{
        const id = props.history.location.search.slice(1)
        const step = checkStepProceso(id)
        const cadena = props.cadenasActivas[id].procesos

        setLoading(true)
            
        // ESTRUCTURA DE LA ENTREGA
        let aux={
                fecha:obtenerFecha(),
                articulos:[{
                    cantidad:cantidad,
                    producto:props.cadenasActivas[id].producto,
                }],
                proveedor:PROVEEDOR_PRODUCCION_PROPIA,
                metodoDePago:{
                    facturacion:false
                }
            }
        
        // AGREGA LA ENTREGA A DB PARA OBTENER ID
        const key = getPushKey(props.user.uid, `proveedores/${PROVEEDOR_PRODUCCION_PROPIA}/entregas`)
        
        // AGREGA LA FACTURA A LISTA DE COMPRAS
        agregarAListaDeCompras(aux,key)


        // FEEDBACK DEL PROCESO
        setshowSnackbar('El Proceso Finalizo Correctamente')

        // ACTUALIZA LA CADENA DE PRODUCCION ACTIVA
        actualizarCadenaDeProduccion(id,step,cantidad,key)

        // AUMENTAR PRDODUCTOS
        if(step==cadena.length-1){
            await aumentarProducto(id)
            await descontarSubproductos(id)
        }
        // ACTUALIZA DB ENVIANDO TODA LA INFO
        setData(props.user.uid, `proveedores/${PROVEEDOR_PRODUCCION_PROPIA}/entregas/${key}`, aux)
            .then(()=>{
                setTimeout(() => {
                    props.history.replace('/Cadenas-De-Produccion')
                }, 2000);
            })
            .catch(()=>{
                setLoading(false)
            })
    }
    const aumentarProducto = async id =>{
        const producto = props.cadenasActivas[id].producto

        // AUMENTA LA CANTIDAD DE PRODUCTOS
        const nuevaCantidad = parseInt(props.productos[producto].cantidad)+parseInt(cantidad)
        await updateData(props.user.uid, `productos/${producto}`, {cantidad:nuevaCantidad})
        await pushData(props.user.uid, `productos/${producto}/historialDeStock`, {cantidad:nuevaCantidad,fecha:obtenerFecha()})
        
    }
    const descontarSubproductos = async id =>{
        const subproductos = props.productos[props.cadenasActivas[id].producto].subproductos

        // DESCUENTA LA CANTIDAD DE PRODUCTOS
        if(subproductos){
            subproductos.map(async subproducto=>{
                const nuevaCantidad = parseInt(props.productos[subproducto.nombre].cantidad)-(cantidad*subproducto.cantidad)
                await updateData(props.user.uid, `productos/${subproducto.nombre}`, {cantidad:nuevaCantidad})
                //await pushData(props.user.uid, `productos/${subproducto.nombre}/historialDeStock`, {cantidad:nuevaCantidad,fecha:obtenerFecha()})
            })
        }
    }
    const agregarAListaDeCompras = (entrega,idLink) =>{
        let aux=entrega
        aux['idEntrega']=idLink
        pushData(props.user.uid, 'compras', aux)
    }
    const actualizarCadenaDeProduccion = (id,step,cantidad,idEntrega) =>{
        let aux = {...props.cadenasActivas[id]}
        aux.cantidad=cantidad
        aux.procesos[step].fechaDeEntrega=(obtenerFecha())
        aux.procesos[step].idEntrega=idEntrega
        if(step==aux.procesos.length-1){
            pushData(props.user.uid, `productos/${aux.producto}/historialDeCadenas`, aux)
            if(cantidad<props.cadenasActivas[id].cantidad){
                aux.cantidad=(props.cadenasActivas[id].cantidad-cantidad)
                aux.procesos[step].fechaDeInicio=null
                aux.procesos[step].fechaDeEntrega=null
                aux.procesos[step].idEntrega=null
                aux.procesos[step].precio=null
                updateData(props.user.uid, `cadenasActivas/${id}`, aux)
            }
            else{
                removeData(props.user.uid, `cadenasActivas/${id}`)
            }
        }
        else{
            updateData(props.user.uid, `cadenasActivas/${id}`, aux)
        }
    }

    return(
        <Layout history={props.history} page='Finalizar Proceso Propio' user={props.user.uid} blockGoBack={true}>
            {/* CONTENT */}
            <Paper className={classes.content}>
                {/* STEPPER */}
                <Stepper orientation='vertical' activeStep={activeStep} className={classes.stepper}>
                    {steps.map((label,index)=>(
                        <Step>
                            {getStepLabel(label,index)}
                            <StepContent>
                                <Grid container xs={12} justify='center' spacing={3}>
                                    {getStepContent(index)}
                                    <Grid container item xs={12} justify='center'>
                                        <Grid item>
                                            <Button
                                                disabled={activeStep===0}
                                                onClick={handleBack}
                                            >
                                                Volver
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                disabled={!cantidad}
                                                onClick={activeStep === steps.length - 1 ? finalizarProceso : handleNext}
                                            >
                                                {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </Paper>
            
            {/* BACKDROP & SNACKBAR */}
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
                <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={()=>{setshowSnackbar('')}}>
                    <Alert severity="success" variant='filled'>
                        {showSnackbar}
                    </Alert>
                </Snackbar>
            </Backdrop>
        </Layout>
    )
}
export default withStore(FinalizarProcesoPropio)

