import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,ListItem,Card,Button,StepContent,Backdrop,StepLabel,Grid,Step,Stepper,Link as LinkComponent,Snackbar,CircularProgress,Typography} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import {Redirect} from 'react-router-dom'
import {Step as StepComponent} from '../components/Nuevo-Pago/Step'
import {database} from 'firebase'
import {formatMoney} from '../utilities'
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
    return ['Efectivo', 'Cheques'];
  }
  
  
  const NuevoPago=(props)=>{
    const classes = useStyles()
    const [efectivo,setefectivo]=useState(undefined)
    const [cheques,setcheques]=useState([])
    const [total,settotal]=useState(0)

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
                tipoDeDato='Efectivo'
                datos={efectivo}
                setdatos={setefectivo}
                total={total}
                settotal={settotal}
            /> 
            );
        case 1:
            return (
                <StepComponent 
                tipoDeDato='Cheques'
                datos={cheques}
                setdatos={setcheques}
                total={total}
                settotal={settotal}
                cliente={props.history.location.props.cliente}
            /> 
          );
      }
    }
    const obtenerFecha = () =>{
        let meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
        let diasSemana = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]
        var f=new Date()
        return `${diasSemana[f.getDay()]} ${f.getDate()} de ${meses[f.getMonth()]} de ${f.getFullYear()}`
    }
    const guardarCheques = () =>{
        let chequesList =[]
        if(cheques.length){
            cheques.map(cheque=>{
                chequesList.push(cheque.numero)
                let auxCheque = {
                    ingreso:obtenerFecha(),
                    nombre:cheque.nombre,
                    numero:cheque.numero,
                    vencimiento:cheque.vencimiento,
                    banco:cheque.banco,
                    valor:cheque.valor
                }
                database().ref().child(props.user.uid).child('cheques').push(auxCheque)
            })
        }
        return chequesList
    }
    const actualizarDeuda = () =>{
        let deudaActual = props.clientes[props.history.location.props.cliente].datos.deuda
        deudaActual-=total+(efectivo?parseFloat(efectivo):0)
        database().ref().child(props.user.uid).child('clientes').child(props.history.location.props.cliente).child('datos').update({deuda:deudaActual})
    }
    const guardarPago = () =>{
        setLoading(true)
        const chequesList = guardarCheques()
        actualizarDeuda()
        let aux={
            efectivo:efectivo?efectivo:null,
            cheques:chequesList.length?chequesList:null,
            fecha:efectivo||cheques?obtenerFecha():null,
            total:efectivo||cheques?total+(efectivo?parseFloat(efectivo):0):null,
            deudaPasada:props.clientes[props.history.location.props.cliente].datos.deuda,
        }
        let pagos = []
        if(props.clientes[props.history.location.props.cliente].pagos){
            pagos=props.clientes[props.history.location.props.cliente].pagos
        }
        if(aux){
            pagos.push(aux)
            database().ref().child(props.user.uid).child('clientes').child(props.history.location.props.cliente).child('pagos').update(pagos)
            .then(()=>{
                    setshowSnackbar('El pago se agregó correctamente!')
                setTimeout(() => {
                    props.history.replace(`/cliente?${props.history.location.search.slice(1)}`)
                }, 2000);
            })
            .catch(()=>{
                setLoading(false)
            })
        }
    }
    useEffect(()=>{
        
    },[])
    const setDisabled=(step)=>{
        switch (step) {
            case 0:
                    
                break;
            case 1:
                    return efectivo || cheques.length ? false : true
                break;
            default:
                break;
        }
      }
    return(
        <Layout history={props.history} page={props.history.location.search?'Editar Pago':'Nuevo Pago'} user={props.user.uid} blockGoBack={true}>
            {props.history.location.props?
                <>
                    <Stepper orientation='vertical' activeStep={activeStep} className={classes.stepper}>
                        {steps.map((label,index)=>(
                            <Step>
                                <StepLabel>
                                    {label}
                                </StepLabel>
                                <StepContent>
                                    {getStepContent(index)}
                                    <div className={classes.margin}>
                                        <Paper elevation={3} variant='body1' className={classes.paperTotal}>
                                            <Typography variant='h6'>
                                                Total $ {formatMoney(total+(efectivo?parseFloat(efectivo):0))}
                                            </Typography>
                                        </Paper>
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
                                            onClick={activeStep === steps.length - 1 ? guardarPago : handleNext}
                                        >
                                            {activeStep === steps.length - 1 ? `${props.history.location.search?'Guardar Edicion':'Guardar Pago'}` : 'Siguiente'}
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
                </>
                :
                <Redirect to='Clientes'/>
            }
        </Layout>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        clientes:state.clientes,
    }
}
export default connect(mapStateToProps,null)(NuevoPago)