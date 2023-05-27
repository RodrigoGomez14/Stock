import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Grid,Paper,Chip,Card,Button,StepContent,Backdrop,StepLabel,Typography,Step,Stepper,Snackbar,CircularProgress} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import {Step as StepComponent} from '../components/Finalizar-Proceso-Propio/Step'
import {database} from 'firebase'
import {Redirect} from 'react-router-dom'
import {checkSearch, formatMoney,fechaDetallada,obtenerFecha} from '../utilities'
import {content} from './styles/styles'
import { AttachMoney, List, LocalAtm } from '@material-ui/icons';
  
  const FinalizarProcesoPropio=(props)=>{
    const classes = content()

    const [cantidad, setCantidad] = useState(props.cadenasActivas[props.location.search.slice(1)].cantidad?props.cadenasActivas[props.location.search.slice(1)].cantidad:undefined);

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
                proveedor:'Tota',
                metodoDePago:{
                    facturacion:false
                }
            }
        
        // AGREGA LA ENTREGA A DB PARA OBTENER ID
        let idLink = database().ref().child(props.user.uid).child('proveedores').child('Tota').child('entregas').push()
        
        // AGREGA LA FACTURA A LISTA DE COMPRAS
        agregarAListaDeCompras(aux,idLink.key)


        // FEEDBACK DEL PROCESO
        setshowSnackbar('El Proceso Finalizo Correctamente')

        // ACTUALIZA LA CADENA DE PRODUCCION ACTIVA
        actualizarCadenaDeProduccion(id,step,cantidad,idLink.key)

        // AUMENTAR PRDODUCTOS
        if(step==cadena.length-1){
            await aumentarProducto(id)
            await descontarSubproductos(id)
        }
        // ACTUALIZA DB ENVIANDO TODA LA INFO
        idLink.update(aux)
            .then(()=>{
                setTimeout(() => {
                    props.history.replace('/Cadenas-De-Produccion')
                    if(step==cadena.length-1){
                        database().ref().child(props.user.uid).child('cadenasActivas').child(id).remove()
                    }
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
        await database().ref().child(props.user.uid).child('productos').child(producto).update({cantidad:nuevaCantidad})
        await database().ref().child(props.user.uid).child('productos').child(producto).child('historialDeStock').push({cantidad:nuevaCantidad,fecha:obtenerFecha()})
        
    }
    const descontarSubproductos = async id =>{
        const subproductos = props.productos[props.cadenasActivas[id].producto].subproductos

        // DESCUENTA LA CANTIDAD DE PRODUCTOS
        if(subproductos){
            subproductos.map(async subproducto=>{
                const nuevaCantidad = parseInt(props.productos[subproducto.nombre].cantidad)-(cantidad*subproducto.cantidad)
                await database().ref().child(props.user.uid).child('productos').child(subproducto.nombre).update({cantidad:nuevaCantidad})
                //await database().ref().child(props.user.uid).child('productos').child(subproducto.nombre).child('historialDeStock').push({cantidad:nuevaCantidad,fecha:obtenerFecha()})
            })
        }
    }
    const agregarAListaDeCompras = (entrega,idLink) =>{
        let aux=entrega
        aux['idEntrega']=idLink
        database().ref().child(props.user.uid).child('compras').push(aux)
    }
    const actualizarCadenaDeProduccion = (id,step,cantidad,idEntrega) =>{
        let aux = props.cadenasActivas[id]
        aux.cantidad=cantidad
        aux.procesos[step].fechaDeEntrega=(obtenerFecha())
        aux.procesos[step].idEntrega=idEntrega
        if(step==aux.procesos.length-1){
            database().ref().child(props.user.uid).child('productos').child(aux.producto).child('historialDeCadenas').push(aux)
        }
        else{
            database().ref().child(props.user.uid).child('cadenasActivas').child(id).update(aux)
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
const mapStateToProps = state =>{
    return{
        user:state.user,
        productos:state.productos,
        proveedores:state.proveedores,
        cadenasActivas:state.cadenasActivas,
    }
}
export default connect(mapStateToProps,null)(FinalizarProcesoPropio)