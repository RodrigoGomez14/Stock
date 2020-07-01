import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,ListItem,Card,Button,StepContent,Backdrop,StepLabel,Grid,Step,Stepper,Link as LinkComponent,Snackbar,CircularProgress} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import {Step as StepComponent} from '../components/Nuevo-Cliente/Step'
import {FormDetalles} from '../components/Nuevo-Cliente/FormDetalles'
import {Direccion} from '../components/Nuevo-Cliente/Direccion'
import BDD from '../base de datos.json'
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
    }
}))

function getSteps() {
    return ['Detalles', 'Direcciones', 'Telefonos','Mails','Expresos','Informacion Extra'];
  }
  
  
  const NuevoCliente=(props)=>{
    const classes = useStyles()
    const [nombre,setnombre]=useState(undefined)
    const [dni,setdni]=useState(undefined)
    const [cuit,setcuit]=useState(undefined)
    const [expresos,setexpresos]=useState([])
    const [mails,setmails]=useState([])
    const [direcciones,setdirecciones]=useState([])  
    const [telefonos,settelefonos]=useState([])
    const [infoExtra,setinfoExtra]=useState([])
    const [deuda,setdeuda]=useState(0)
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
                <FormDetalles
                    nombre={nombre} 
                    setnombre={setnombre}
                    dni={dni} 
                    setdni={setdni}
                    cuit={cuit} 
                    setcuit={setcuit}
                />
          );
        case 1:
          return (
            <StepComponent 
                datos={direcciones} 
                setDatos={setdirecciones}
                tipoDeDato='Direcciones'
            /> 
          );
        case 2:
          return (
            <StepComponent
                datos={telefonos} 
                setDatos={settelefonos}
                tipoDeDato='Telefonos'
            />
          );
          case 3:
              return (
                <StepComponent
                  datos={mails} 
                  setDatos={setmails}
                  tipoDeDato='Mails'
                />
            );
            case 4:
              return (
                <StepComponent
                  datos={expresos} 
                  setDatos={setexpresos}
                  Expresos={props.expresos}
                  tipoDeDato='Expresos'
                />
            );
            case 5:
                return (
                <StepComponent
                    datos={infoExtra} 
                    setDatos={setinfoExtra}
                    tipoDeDato='Info Extra'
                />
            );
      }
    }
    const guardarDatos = () =>{
        setLoading(true)
        let aux={[nombre]:{
            datos:{
                deuda:deuda,
                nombre:nombre,
                dni:dni?dni:null,
                cuit:cuit?cuit:null,
                direcciones:direcciones?direcciones:null,
                telefonos:telefonos?telefonos:null,
                mails:mails?mails:null,
                expresos:expresos?expresos:null,
                infoExtra:infoExtra?infoExtra:null,
            },
        }}
        database().ref().child(props.user.uid).child('clientes').update(aux)
            .then(()=>{
                setshowSnackbar(true)
                setTimeout(() => {
                    props.history.replace(`/Cliente?${nombre}`)
                }, 2000);
            })
            .catch(()=>{
                setLoading(false)
            })
    }
    useEffect(()=>{
        if(props.history.location.search){
            const {nombre,dni,cuit,expresos,mails,direcciones,telefonos,infoExtra,deuda} = props.clientes[props.history.location.search.slice(1)].datos
            nombre&&setnombre(nombre)
            dni&&setdni(dni)
            cuit&&setcuit(cuit)
            expresos&&setexpresos(expresos)
            mails&&setmails(mails)
            direcciones&&setdirecciones(direcciones)
            telefonos&&settelefonos(telefonos)
            infoExtra&&setinfoExtra(infoExtra)
            deuda&&setdeuda(deuda)
        }
    })
    return(
        <Layout history={props.history} page={props.history.location.search?'Editar Cliente':'Nuevo Cliente'} user={props.user.uid} blockGoBack={true}>
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
                                    disabled={!nombre}
                                    onClick={activeStep === steps.length - 1 ? guardarDatos : handleNext}
                                >
                                    {activeStep === steps.length - 1 ? `${props.history.location.search?'Guardar Edicion':'Guardar Cliente'}` : 'Siguiente'}
                                </Button>
                                {activeStep != steps.length -1?
                                    <Button
                                        variant="outlined"
                                        color="light"
                                        disabled={!nombre}
                                        onClick={()=>{setActiveStep(steps.length)}}
                                        className={classes.button}
                                    >
                                        Finalizar
                                    </Button>
                                    :
                                    null
                                }
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
                        <Button variant='contained'  onClick={guardarDatos} className={classes.button}>
                            {props.history.location.search?'Guardar Edicion':'Guardar Cliente'}     
                        </Button>
                    </Paper>
                </Grid>
            )}
            <Backdrop className={classes.backdrop} open={loading}>
                {showSnackbar?
                    <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={()=>{setshowSnackbar(false)}}>
                        <Alert onClose={()=>{setshowSnackbar(false)}} severity="success" variant='filled'>
                            {props.history.location.search?
                                'El cliente se edito correctamente!'
                                :
                                'El nuevo cliente ha sido agregado!'
                            }
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
        expresos:state.expresos,
        clientes:state.clientes,
    }
}
export default connect(mapStateToProps,null)(NuevoCliente)