import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Chip,Paper,ListItem,Card,Button,StepContent,Backdrop,StepLabel,Grid,Step,Stepper,Link as LinkComponent,Snackbar,CircularProgress,Typography} from '@material-ui/core'
import {AttachMoney,LocalAtm} from '@material-ui/icons'
import Alert from '@material-ui/lab/Alert';
import {Redirect} from 'react-router-dom'
import {Step as StepComponent} from '../components/Nuevo-Pago/Step'
import {database} from 'firebase'
import {checkSearch, formatMoney,obtenerFecha} from '../utilities'
import {content} from './styles/styles'
  
const NuevoPagoCliente=(props)=>{
    const classes = content()

    const [cheques,setcheques]=useState([])
    const [total,settotal]=useState(0)
    
    const [efectivo,setefectivo]=useState(undefined)

    const [cuentaTransferencia,setCuentaTransferencia]=useState(undefined)
    const [totalTransferencia, setTotalTransferencia] = useState(undefined);

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
                tipo='Cliente'
            /> 
            );
        case 1:
            return (
                <StepComponent
                    tipoDeDato='Transferencia'
                    cuentaTransferencia={cuentaTransferencia}
                    setCuentaTransferencia={setCuentaTransferencia}
                    totalTransferencia={totalTransferencia}
                    setTotalTransferencia={setTotalTransferencia}
                    cuentasBancarias={props.cuentasBancarias}
                    />
            );
        case 2:
            return (
                <StepComponent 
                tipoDeDato='Cheques'
                datos={cheques}
                setdatos={setcheques}
                total={total}
                settotal={settotal}
                cliente={checkSearch(props.history.location.search)}
                tipo='Cliente'
            /> 
          );
      }
    }
    function getSteps() {
        return ['Efectivo','Transferencia', 'Cheques'];
    }
    const setDisabled=(step)=>{
        switch (step) {
            case 0:
                    
                break;
            case 2:
                    return efectivo || cheques.length ? false : true
                break;
            default:
                break;
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
            case 2:
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

    // FUNCTIONS
    const guardarPago = () =>{
        setLoading(true)

        // ACTUALIZA CADA CHEQUE EN DB
        const chequesList = guardarCheques()

        // FUNCIONES DE ESTRUCTURA
        const calcularDeudaActualizada = () =>{
            return (getDeudaPasada() - calcularTotal())
        }
        const calcularTotal = () =>{
            return efectivo||cheques? total + (efectivo?parseFloat(efectivo):0) + (totalTransferencia?parseFloat(totalTransferencia):0) :null
        }
        const getDeudaPasada = () =>{
            return props.clientes[checkSearch(props.history.location.search)].datos.deuda
        }
        // ESTRUCTURA DEL PAGO
        let aux={
            efectivo:efectivo?efectivo:null,
            cheques:chequesList.length?chequesList:null,
            cuentaTransferencia:cuentaTransferencia?cuentaTransferencia:null,
            totalTransferencia:totalTransferencia?totalTransferencia:null,
            fecha:obtenerFecha(),
            pagado:calcularTotal(),
            total:calcularTotal(),
            deudaPasada:getDeudaPasada(),
            deudaActualizada:calcularDeudaActualizada(),
        }

        // ACTUALIZA LA DEUDA DEL CLIENTE 
        actualizarDeuda()

        // MODELA Y AGREGA LA TRANSFERENCIA A LOS MOVIMIENTOS BANCARIOS
        if(aux.cuentaTransferencia){
            guardarTransferenciaBancaria(aux.cuentaTransferencia,aux.totalTransferencia)
        }

        // ENVIA TODO A DB
        if(aux){
            database().ref().child(props.user.uid).child('clientes').child(checkSearch(props.history.location.search)).child('pagos').push(aux)
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
    const guardarCheques = () =>{
        let chequesList =[]
        if(cheques.length){
            // RECORRE LA LISTA DE CHEQUES 
            cheques.map(cheque=>{
                // GUARDA EL NUMERO DE CHEQUE
                chequesList.push(cheque.numero)
                // ESTRUCTURA DEL CHEQUE
                let auxCheque = {
                    ingreso:obtenerFecha(),
                    nombre:cheque.nombre,
                    numero:cheque.numero,
                    vencimiento:cheque.vencimiento,
                    banco:cheque.banco,
                    valor:cheque.valor
                }
                // GUARDA EN LA LISTA DE CHQUES CADA UNO
                database().ref().child(props.user.uid).child('cheques').push(auxCheque)
            })
        }
        // RETORNA UNA LISTA CON CADA NUMERO DE CHEQUE
        return chequesList
    }
    const actualizarDeuda = () =>{
        let deudaActual = props.clientes[checkSearch(props.history.location.search)].datos.deuda
        deudaActual-=total+(efectivo?parseFloat(efectivo):0) + (totalTransferencia?parseFloat(totalTransferencia):0)
        database().ref().child(props.user.uid).child('clientes').child(checkSearch(props.history.location.search)).child('datos').update({deuda:deudaActual})
    }
    const guardarTransferenciaBancaria = async (cuenta,total) =>{
        const auxDeposito ={
            fecha:obtenerFecha(),
            tipo:'transferencia',
            total:total
        }
        await database().ref().child(props.user.uid).child('CuentasBancarias').child(cuenta).child('ingresos').push(auxDeposito)
    }
    return(
        <Layout history={props.history} page='Nuevo Pago' user={props.user.uid} blockGoBack={true}>
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
                                                        Total $ {formatMoney( total + (efectivo?parseFloat(efectivo):0) + (totalTransferencia?parseFloat(totalTransferencia):0)) }/ $ {formatMoney(props.clientes[checkSearch(props.location.search)].datos.deuda) } 
                                                    </Typography>
                                                </Grid>
                                                <Grid container item xs={12} justify='center'>
                                                    <Chip label={`$ ${formatMoney( parseFloat(props.clientes[checkSearch(props.location.search)].datos.deuda) - ( total + (efectivo?parseFloat(efectivo):0) + (totalTransferencia?parseFloat(totalTransferencia):0)) ) }`}/>
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
            </Backdrop>
            <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={()=>{setshowSnackbar('')}}>
                <Alert severity="success" variant='filled'>
                    {showSnackbar}
                </Alert>
            </Snackbar>
        </Layout>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        clientes:state.clientes,
        cuentasBancarias:state.CuentasBancarias
    }
}
export default connect(mapStateToProps,null)(NuevoPagoCliente)