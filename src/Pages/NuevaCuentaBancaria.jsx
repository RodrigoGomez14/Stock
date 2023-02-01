import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Chip,Paper,ListItem,Card,Button,StepContent,Backdrop,StepLabel,Grid,Step,Stepper,Link as LinkComponent,Snackbar,CircularProgress,Typography} from '@material-ui/core'
import {AttachMoney,LocalAtm} from '@material-ui/icons'
import Alert from '@material-ui/lab/Alert';
import {Redirect} from 'react-router-dom'
import {Step as StepComponent} from '../components/Nueva-Cuenta-Bancaria/Step'
import {database} from 'firebase'
import {checkSearch, formatMoney,obtenerFecha} from '../utilities'
import {content} from './styles/styles'
  
const NuevaCuentaBancaria=(props)=>{
    const classes = content()
    const [nuevaCuenta,setNuevaCuenta]=useState(undefined)

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
                nuevaCuenta={nuevaCuenta}
                setNuevaCuenta={setNuevaCuenta}
                tipoDeDato="Informacion"
            /> 
            );
      }
    }
    function getSteps() {
        return ['Informacion'];
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
        }
    }

    // FUNCTIONS
    const agregarNuevaCuentaBancaria = async () =>{
        setLoading(true)
        const auxCuentaBancaria ={
            [nuevaCuenta]:{
                nombre:nuevaCuenta
            }
        }
        await database().ref().child(props.user.uid).child('CuentasBancarias').update(auxCuentaBancaria)
        setshowSnackbar('La cuenta Bancaria se Agrego Correctamente')
        props.history.replace('/Cuentas-Bancarias')
        setLoading(false)
    }
    return(
        <Layout history={props.history} page='Despositar Cheque' user={props.user.uid} blockGoBack={true}>
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
                                                    disabled={!nuevaCuenta}
                                                    onClick={activeStep === steps.length - 1 ? agregarNuevaCuentaBancaria : handleNext}
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
        cuentasBancarias:state.CuentasBancarias,
    }
}
export default connect(mapStateToProps,null)(NuevaCuentaBancaria)