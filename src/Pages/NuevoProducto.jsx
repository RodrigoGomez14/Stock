import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,ListItem,Card,Button,StepContent,Backdrop,StepLabel,Grid,Step,Stepper,Link as LinkComponent,Snackbar,CircularProgress,Typography} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import {Redirect} from 'react-router-dom'
import {Step as StepComponent} from '../components/Nuevo-Producto/Step'
import {database} from 'firebase'

const useStyles=makeStyles(theme=>({
    root:{
        height:'100%',
        width:'100%',
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-start',
        backgroundColor:theme.palette.type==='dark'?theme.palette.secondary.main:theme.palette.primary.dark,
        borderRadius:'0',
        overflow:'auto',
    },
    table:{
        marginTop:theme.spacing(1)
    },
    success:{
        marginLeft:theme.spacing(1),
        borderColor:theme.palette.success.main
    },
    danger:{
        marginLeft:theme.spacing(1),
        borderColor:theme.palette.danger.main
    },
    iconSuccess:{
        color:theme.palette.success.main,
    },
    iconDanger:{
        color:theme.palette.danger.main,
    },
    paperCliente:{
    },
    cardContent:{
        padding:0,
        height:'100%',
        textAlign:'center',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-around',
    },
    card:{
        height:'150px',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'

    },
    link:{
        outline:'none',
        textDecoration:'none'
    },
    displayNone:{
        display:'none'
    },
    display:{
        display:'block'
    },
    paper:{
        marginTop:theme.spacing(1),
        marginBottom:theme.spacing(2),
        padding:theme.spacing(2),
        display:'flex',
        flexDirection:'column',
    },
    input:{
        marginTop:theme.spacing(1)
    },
    stepper:{
        backgroundColor:'transparent'
    },
    textAlignCenter:{
        textAlign:'center'
    },
    margin:{
        marginTop:theme.spacing(1),
        marginBottom:theme.spacing(1),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    flex:{
        flex:1,
        display:'flex',
        justifyContent:'flex-end'
    },
    button:{
        marginLeft:theme.spacing(2)
    },
    paperTotal:{
        padding:theme.spacing(1),
        marginBottom:theme.spacing(1)
    }
}))

function getSteps() {
    return ['Detalles', 'Producto Compuesto' , 'Cadena De Produccion' ];
  }
  
  
  const NuevoProducto=(props)=>{
    const classes = useStyles()
    const [nombre,setnombre]=useState('')
    const [precio,setprecio]=useState(0)
    const [cantidad,setcantidad]=useState(0)
    const [cadenaDeProduccion,setcadenaDeProduccion]=useState([])
    const [composicion,setcomposicion]=useState([])

    const [activeStep, setActiveStep] = useState(0);
    const [showSnackbar, setshowSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const steps = getSteps();

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
                    
                break;
            case 1:
                break;
            default:
                break;
        }
    }
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
            setshowSnackbar('El producto se agregó correctamente')
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
    return(
        <Layout history={props.history} page={props.history.location.props?'Editar Producto':'Nuevo Producto'} user={props.user.uid} blockGoBack={true}>
            <Stepper orientation='vertical' activeStep={activeStep} className={classes.stepper}>
                {steps.map((label,index)=>(
                    <Step>
                        <StepLabel>
                            {label}
                        </StepLabel>
                        <StepContent>
                            {getStepContent(index)}
                            <div className={classes.margin}>
                                <Button
                                    disabled={activeStep===0}
                                    onClick={handleBack}
                                >
                                    Volver
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={setDisabled(activeStep)}
                                    onClick={activeStep === steps.length - 1 ? guardarProducto : handleNext}
                                >
                                    {activeStep === steps.length - 1 ? `${props.history.location.props?'Guardar Edicion':'Guardar Producto'}` : 'Siguiente'}
                                </Button>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            <Backdrop className={classes.backdrop} open={loading}>
                {Boolean(showSnackbar)?
                    <Snackbar open={Boolean(showSnackbar)} autoHideDuration={2000} onClose={()=>{setshowSnackbar(undefined)}}>
                        <Alert onClose={()=>{setshowSnackbar(undefined)}} severity="success" variant='filled'>
                            {showSnackbar}
                        </Alert>
                    </Snackbar>
                    :
                    <CircularProgress color="inherit" />
                }
            </Backdrop>
        </Layout>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        productos:state.productos
    }
}
export default connect(mapStateToProps,null)(NuevoProducto)