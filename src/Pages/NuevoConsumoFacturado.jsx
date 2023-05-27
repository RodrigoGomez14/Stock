import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Chip,Paper,ListItem,Card,Button,StepContent,Backdrop,StepLabel,Grid,Step,Stepper,Link as LinkComponent,Snackbar,CircularProgress} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import {Step as StepComponent} from '../components/Nuevo-Consumo-Facturado/Step'
import {database} from 'firebase'
import {obtenerFecha} from '../utilities'
import {content} from './styles/styles'
import {checkSearch} from '../utilities'
import { PeopleAlt, MoveToInbox, List } from '@material-ui/icons';


// COMPONENT
const NuevoConsumoFacturado=(props)=>{
    const classes = content()
    const [total,settotal]=useState("")
    const [totalIva,settotalIva]=useState("")
    const [titulo,setTitulo]=useState("")
    const [fecha,setfecha]=useState(undefined)

    const [activeStep, setActiveStep] = useState(0);
    const [showSnackbar, setshowSnackbar] = useState(false);
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
                    tipoDeDato='Factura'
                    titulo={titulo}
                    setTitulo={setTitulo}
                    total={total}
                    settotal={settotal}
                    totalIva={totalIva}
                    settotalIva={settotalIva}
                /> 
            );
        }
    }
    function getSteps() {
        return ['Detalles'];
    }
    const setDisabled=(step)=>{
        switch (step) {
            case 0:
                    return titulo && total && totalIva ? false : true
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
                            avatar={<List/>} 
                            label={label}
                            variant='default'
                            className={activeStep==index?classes.iconLabelSelected:null}
                        />
                    </StepLabel>
                );
        }
    }

    // FUNCTIONS
    const guardarConsumoFacturado = () =>{
        setLoading(true)
        let aux={
            fecha:!fecha?obtenerFecha():fecha,
            titulo:titulo,
            total:total,
            totalIva:totalIva,
            consumoFacturado:true,
            metodoDePago:{
                facturacion:true
            }
        }
        if(props.history.location.search){
            database().ref().child(props.user.uid).child('compras').child(checkSearch(props.history.location.search)).update(aux)
            .then(()=>{
                    setshowSnackbar('El consumo se editó correctamente!')
                setTimeout(() => {
                    props.history.replace(`/`)
                }, 2000);
            })
            .catch(()=>{
                setLoading(false)
            })
        }
        else{
            database().ref().child(props.user.uid).child('compras').push(aux)
            .then(()=>{
                setshowSnackbar('El consumo se agregó correctamente!')
                setTimeout(() => {
                    props.history.replace(`/`)
                }, 2000);
            })
            .catch(()=>{
                setLoading(false)
            })
        }
    }

    //FILL FOR EDIT
    useEffect(()=>{
        if(props.history.location.search){
            const {titulo,total,totalIva,fecha} = props.entregas[props.history.location.search.slice(1)]
            titulo&&setTitulo(titulo)
            total&&settotal(total)
            totalIva&&settotalIva(totalIva)
            fecha&&setfecha(fecha)
            setActiveStep(1)
        }
    },[])
    return(
        <Layout history={props.history} page={props.history.location.search?'Editar Consumo Facturado':'Nuevo Consumo Facturado'} user={props.user.uid} blockGoBack={true}>
            <Paper className={classes.content}>
                {/* STEPPER */}
                <Stepper orientation='vertical' activeStep={activeStep} className={classes.stepper}>
                    {steps.map((label,index)=>(
                        <Step>
                            {getStepLabel(label,index)}
                            <StepContent>
                                <Grid container item xs={12} justify='center' spacing={3}>
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
                                                onClick={activeStep === steps.length - 1 ? guardarConsumoFacturado : handleNext}
                                            >
                                                {activeStep === steps.length - 1 ? `${props.history.location.search?'Guardar Edicion':'Guardar Consumo Facturado'}` : 'Siguiente'}
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
        entregas:state.entregas,
    }
}
export default connect(mapStateToProps,null)(NuevoConsumoFacturado)