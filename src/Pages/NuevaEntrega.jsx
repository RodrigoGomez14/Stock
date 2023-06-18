import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Chip,Paper,ListItem,Card,Button,StepContent,Backdrop,StepLabel,Grid,Step,Stepper,Link as LinkComponent,Snackbar,CircularProgress} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import {Step as StepComponent} from '../components/Nueva-Entrega/Step'
import {database} from 'firebase'
import {obtenerFecha} from '../utilities'
import {content} from './styles/styles'
import {checkSearch} from '../utilities'
import { PeopleAlt, MoveToInbox } from '@material-ui/icons';


// COMPONENT
const NuevaEntrega=(props)=>{
    const classes = content()
    const [nombre,setnombre]=useState(undefined)
    const [productos,setproductos]=useState([])
    const [total,settotal]=useState(0)
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
    function getSteps() {
        return ['Elegir el Proveedor', 'Elegir Los productos'];
    }
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
    function getStepLabel(label,index) {
        switch (index) {
            case 0:
                return (
                    <StepLabel>
                        <Chip 
                            avatar={<PeopleAlt/>} 
                            label={label}  
                            onClick={()=>{if(nombre){setActiveStep(index)}}}
                            variant='default'
                            className={activeStep==index?classes.iconLabelSelected:null}
                        />
                    </StepLabel>
                );
            case 1:
                return (
                    <StepLabel>
                        <Chip 
                            avatar={<MoveToInbox/>} 
                            label={label}  
                            onClick={()=>{if(nombre){setActiveStep(index)}}}
                            variant='default'
                            className={activeStep==index?classes.iconLabelSelected:null}
                        />
                    </StepLabel>
                );
        }
    }

    // FUNCTIONS
    const guardarEntrega = () =>{
        setLoading(true)
        let aux={
            proveedor:nombre,
            productos:productos,
            total:total,
            fecha:!fecha?obtenerFecha():fecha
        }
        if(props.history.location.search){
            database().ref().child(props.user.uid).child('entregas').child(checkSearch(props.history.location.search)).update(aux)
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

    //FILL FOR EDIT
    useEffect(()=>{
        if(props.history.location.search){
            const {proveedor,productos,total,fecha} = props.entregas[props.history.location.search.slice(1)]
            proveedor&&setnombre(proveedor)
            productos&&setproductos(productos)
            total&&settotal(total)
            fecha&&setfecha(fecha)
            setActiveStep(1)
        }
    },[])
    return(
        <Layout history={props.history} page={props.history.location.search?'Editar Entrega':'Nueva Entrega'} user={props.user.uid} blockGoBack={true}>
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
                                                onClick={activeStep === steps.length - 1 ? guardarEntrega : handleNext}
                                            >
                                                {activeStep === steps.length - 1 ? `${props.history.location.search?'Guardar Edicion':'Guardar Entrega'}` : 'Siguiente'}
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
        productos:state.productos,
        proveedores:state.proveedores,
    }
}
export default connect(mapStateToProps,null)(NuevaEntrega)