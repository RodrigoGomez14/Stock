import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Chip,Paper,ListItem,Card,Button,StepContent,Backdrop,StepLabel,Grid,Step,Stepper,Link as LinkComponent,Snackbar,CircularProgress,Typography} from '@material-ui/core'
import {AttachMoney,LocalAtm} from '@material-ui/icons'
import Alert from '@material-ui/lab/Alert';
import {Redirect} from 'react-router-dom'
import {Step as StepComponent} from '../components/Nuevo-Pago/Step'
import {database} from 'firebase'
import {checkSearch, formatMoney,fechaDetallada} from '../utilities'
import {content} from './styles/styles'
  
const NuevoPagoCliente=(props)=>{
    const classes = content()
    const [efectivo,setefectivo]=useState(undefined)
    const [cheques,setcheques]=useState([])
    const [total,settotal]=useState(0)

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
                cliente={checkSearch(props.history.location.search)}
            /> 
          );
      }
    }
    function getSteps() {
        return ['Efectivo', 'Cheques'];
    }
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

    // FUNCTIONS
    const guardarCheques = () =>{
        let chequesList =[]
        if(cheques.length){
            cheques.map(cheque=>{
                chequesList.push(cheque.numero)
                let auxCheque = {
                    ingreso:fechaDetallada(),
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
        let deudaActual = props.clientes[checkSearch(props.history.location.search)].datos.deuda
        deudaActual-=total+(efectivo?parseFloat(efectivo):0)
        database().ref().child(props.user.uid).child('clientes').child(checkSearch(props.history.location.search)).child('datos').update({deuda:deudaActual})
    }
    const guardarPago = () =>{
        setLoading(true)
        const chequesList = guardarCheques()
        actualizarDeuda()
        let aux={
            efectivo:efectivo?efectivo:null,
            cheques:chequesList.length?chequesList:null,
            fecha:efectivo||cheques?fechaDetallada():null,
            total:efectivo||cheques?total+(efectivo?parseFloat(efectivo):0):null,
            deudaPasada:props.clientes[checkSearch(props.history.location.search)].datos.deuda,
        }
        let pagos = []
        if(props.clientes[checkSearch(props.history.location.search)].pagos){
            pagos=props.clientes[checkSearch(props.history.location.search)].pagos
        }
        if(aux){
            pagos.push(aux)
            database().ref().child(props.user.uid).child('clientes').child(checkSearch(props.history.location.search)).child('pagos').update(pagos)
            .then(()=>{
                    setshowSnackbar('El pago se agregó correctamente!')
                setTimeout(() => {
                    props.history.replace(`/Historial-Cliente?${checkSearch(props.history.location.search)}`)
                }, 2000);
            })
            .catch(()=>{
                setLoading(false)
            })
        }
    }
    function getStepLabel(label,index) {
        switch (index) {
            case 0:
                return (
                    <StepLabel>
                        <Chip 
                            avatar={<AttachMoney/>} 
                            label={label}  
                            onClick={()=>{setActiveStep(index)}}
                            variant='default'
                            className={activeStep==index?classes.iconLabelSelected:null}
                        />
                    </StepLabel>
                );
            case 1:
                return (
                    <StepLabel>
                        <Chip 
                            avatar={<LocalAtm />} 
                            className={activeStep==index?classes.iconLabelSelected:null}
                            label={label} 
                            variant='default'
                            onClick={()=>{setActiveStep(index)}}
                        />
                    </StepLabel>
                );
        }
    }
    return(
        <Layout history={props.history} page={props.history.location.search?'Editar Pago':'Nuevo Pago'} user={props.user.uid} blockGoBack={true}>
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
                                            <Paper elevation={3} variant='body1' className={classes.paperTotalRecibirEntrega}>
                                                <Grid item xs={12}>
                                                    <Typography variant='h6'>
                                                        Total $ {formatMoney( total + (efectivo?parseFloat(efectivo):0)) }
                                                    </Typography>
                                                </Grid>
                                            </Paper>
                                        </Grid>
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
                                                    onClick={activeStep === steps.length - 1 ? guardarPago : handleNext}
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
        clientes:state.clientes,
    }
}
export default connect(mapStateToProps,null)(NuevoPagoCliente)