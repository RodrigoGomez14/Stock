import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,ListItem,Card,Button,StepContent,Backdrop,StepLabel,Grid,Step,Stepper,Link as LinkComponent,Snackbar,CircularProgress} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import {Step as StepComponent} from '../components/Nueva-Entrega/Step'
import {database} from 'firebase'
import {obtenerFecha} from '../utilities'
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
    }
}))

function getSteps() {
    return ['Elegir el Proveedor', 'Elegir Los productos'];
  }
  
  
  const NuevaEntrega=(props)=>{
    const classes = useStyles()
    const [nombre,setnombre]=useState('')
    const [productos,setproductos]=useState([])
    const [total,settotal]=useState(0)
    const [fecha,setfecha]=useState(undefined)

    const [activeStep, setActiveStep] = useState(0);
    const [showSnackbar, setshowSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const steps = getSteps();

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
                tipoDeDato='Destinatario'
                datos={nombre}
                setDatos={setnombre}
                proveedoresList={props.proveedores}
            /> 
            );
        case 1:
            return (
                <StepComponent 
                tipoDeDato='Productos'
                datos={productos}
                setDatos={setproductos}
                productosList={props.productos}
                total={total}
                settotal={settotal}
            /> 
          );
      }
    }

    const guardarEntrega = () =>{
        setLoading(true)
        let aux={
            proveedor:nombre,
            productos:productos,
            total:total,
            fecha:!fecha?obtenerFecha():fecha
        }
        if(props.history.location.search){
            database().ref().child(props.user.uid).child('entregas').child(props.history.location.search.slice(1)).update(aux)
            .then(()=>{
                    setshowSnackbar('La entrega se editó correctamente!')
                setTimeout(() => {
                    props.history.replace(`/Entregas`)
                }, 2000);
            })
            .catch(()=>{
                setLoading(false)
            })
        }
        else{
            database().ref().child(props.user.uid).child('entregas').push(aux)
            .then(()=>{
                setshowSnackbar('La entrega se agregó correctamente!')
                setTimeout(() => {
                    props.history.replace(`/Entregas`)
                }, 2000);
            })
            .catch(()=>{
                setLoading(false)
            })
        }
    }

    useEffect(()=>{
        if(props.history.location.search){
            const {proveedor,productos,total,fecha} = props.entregas[props.history.location.search.slice(1)]
            proveedor&&setnombre(proveedor)
            productos&&setproductos(productos)
            total&&settotal(total)
            fecha&&setfecha(fecha)
        }
    },[])

    const setDisabled=(step)=>{
        switch (step) {
            case 0:
                    return !nombre
                break;
            case 1:
                    return productos.length? false : true
                break;
            default:
                break;
        }
    }
    return(
        <Layout history={props.history} page={props.history.location.search?'Editar Entrega':'Nueva Entrega'} user={props.user.uid} blockGoBack={true}>
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
                                    onClick={activeStep === steps.length - 1 ? guardarEntrega : handleNext}
                                >
                                    {activeStep === steps.length - 1 ? `${props.history.location.search?'Guardar Edicion':'Guardar Entrega'}` : 'Siguiente'}
                                </Button>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Grid container justify='center'>
                    <Paper elevation={6}>
                        <Button  onClick={handleBack}>
                            Atras     
                        </Button>
                        <Button variant='contained'  onClick={guardarEntrega} className={classes.button}>
                            {props.history.location.search?'Guardar Edicion':'Guardar Pedido'}     
                        </Button>
                    </Paper>
                </Grid>
            )}
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
        entregas:state.entregas,
        productos:state.productos,
        proveedores:state.proveedores,
    }
}
export default connect(mapStateToProps,null)(NuevaEntrega)