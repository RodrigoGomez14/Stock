import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,ListItem,Card,Button,StepContent,Backdrop,StepLabel,Grid,Step,Stepper,Link as LinkComponent,Snackbar,CircularProgress,Typography} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import {Redirect} from 'react-router-dom'
import {Step as StepComponent} from '../components/Nuevo-Producto/Step'
import {database} from 'firebase'
import {content} from './styles/styles'
import {checkSearch} from '../utilities'
  
// COMPONENT  
const NuevoProducto=(props)=>{
    const classes = content()
    const [nombre,setnombre]=useState('')
    const [precio,setprecio]=useState(0)
    const [cantidad,setcantidad]=useState(0)
    const [cadenaDeProduccion,setcadenaDeProduccion]=useState([])
    const [composicion,setcomposicion]=useState([])

    const [activeStep, setActiveStep] = useState(0);
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const steps = getSteps();

    // STEPPER NAVIGATION
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
                tipoDeDato='Detalles'
                nombre={nombre}
                setnombre={setnombre}
                precio={precio}
                setprecio={setprecio}
                cantidad={cantidad}
                setcantidad={setcantidad}
                disableCantidad={props.history.location.props?true:false}
            /> 
        );
        case 1:
            return (
            <StepComponent 
                tipoDeDato='Producto Compuesto'
                listaDeProductos={obtenerListaDeProductos()}
                composicion={composicion}
                setcomposicion={setcomposicion}
            /> 
        );
        case 2:
            return (
            <StepComponent 
                tipoDeDato='Cadena De Produccion'
            /> 
        );
      }
    }
    const setDisabled=(step)=>{
        switch (step) {
            case 0:
                    if(!nombre || !precio){
                        return true
                    }
                break;
            case 1:
                break;
            default:
                break;
        }
    }
    function getSteps() {
        //return ['Detalles', 'Producto Compuesto' , 'Cadena De Produccion' ];
        return ['Detalles' ];
    }

    // FUNCTIONS
    const guardarProducto = () =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('productos').update({
            [nombre]:{
                cantidad:composicion.length?null:parseInt(cantidad),
                precio:parseFloat(precio),
                composicion:composicion,
                nombre:nombre
            }
        })
        .then(()=>{
            setshowSnackbar(props.history.location.search?'El Producto Se Edito Correctamente!':'El Producto Se Agrego Correctamente!')
            setTimeout(() => {
                setLoading(false)
                props.history.replace('/Productos')
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }
    const obtenerListaDeProductos = () =>{
        let aux = []
        if(props.productos){
            Object.keys(props.productos).map(nombre=>{
                aux.push(`${nombre}`)
            })
        }
        return aux
    }

    // FILL FOR EDIT
    useEffect(()=>{
        if(props.history.location.props){
            console.log(props.history.location.props.producto)
            const {nombre,precio,cantidad,cadenaDeProduccion,composicion} = props.productos[props.history.location.props.producto]
            nombre&&setnombre(nombre)
            precio&&setprecio(precio)
            cantidad&&setcantidad(cantidad)
            cadenaDeProduccion&&setcadenaDeProduccion(cadenaDeProduccion)
            composicion&&setcomposicion(composicion)
        }
    },[])
    return(
        <Layout history={props.history} page={props.history.location.props?'Editar Producto':'Nuevo Producto'} user={props.user.uid} blockGoBack={true}>
            <Paper className={classes.content}>
                {/* STEPPER */}
                <Stepper orientation='vertical' activeStep={activeStep} className={classes.stepper}>
                    {steps.map((label,index)=>(
                        <Step>
                            <StepLabel>
                                {label}
                            </StepLabel>
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
                                                disabled={setDisabled(activeStep)}
                                                onClick={activeStep === steps.length - 1 ? guardarProducto : handleNext}
                                            >
                                                {activeStep === steps.length - 1 ? `${props.history.location.props?'Guardar Edicion':'Guardar Producto'}` : 'Siguiente'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {/* BACKDROP & SNACKBAR */}
                <Backdrop className={classes.backdrop} open={loading}>
                    <CircularProgress color="inherit" />
                    <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={()=>{setshowSnackbar('')}}>
                        <Alert severity="success" variant='filled'>
                            {showSnackbar}
                        </Alert>
                    </Snackbar>
                </Backdrop>
            </Paper>
        </Layout>
    )
}

// REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        productos:state.productos
    }
}
export default connect(mapStateToProps,null)(NuevoProducto)