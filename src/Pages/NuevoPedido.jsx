import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Paper,Chip,Button,StepContent,Backdrop,StepLabel,Grid,Step,Stepper,Link as LinkComponent,Snackbar,CircularProgress,TextField} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import Alert from '@material-ui/lab/Alert';
import {Step as StepComponent} from '../components/Nuevo-Pedido/Step'
import {database} from 'firebase'
import {content} from './styles/styles'
import { fechaDetallada, filtrarCotizaciones, getClientList, getProductosListWithPrice } from '../utilities';
import { PeopleAlt, MoveToInbox } from '@material-ui/icons';

// COMPONENT
const NuevoPedido=(props)=>{
    const classes = content()
    const [nombre,setnombre]=useState(undefined)
    const [productos,setproductos]=useState([])
    const [total,settotal]=useState(0)
    const [fecha,setfecha]=useState(undefined)
    console.log(props.dolares)
    //STEPPER STATE
    const [activeStep, setActiveStep] = useState(0);
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const steps = getSteps();


    //STEPPER NAVIGATION
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const getStepContent =(step)=> {
      switch (step) {
        case 0:
          return (
            <Grid container item xs={12} justify='center'>
                <Paper elevation={3}>
                    <Grid item xs={12} justify='center'>
                        <Autocomplete
                            freeSolo
                            value={nombre}
                            options={Object.keys(props.clientes)}
                            getOptionLabel={(option) => option}
                            onChange={(e)=>{setnombre(e.target.value)}}
                            onSelect={(e)=>{setnombre(e.target.value)}}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Destinatario" variant="outlined" />}
                        />
                    </Grid>
                </Paper>
            </Grid>
            );
        case 1:
            return (
                <StepComponent 
                tipoDeDato='Productos'
                datos={productos}
                setDatos={setproductos}
                productosList={getProductosListWithPrice(props.productos)}
                total={total}
                settotal={settotal}
                cotizacion={{nombre:props.dolares[1].casa.nombre,valor:parseFloat(props.dolares[1].casa.venta)}}
            /> 
          );
      }
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
    function getSteps() {
        return ['Elegir el Destinatario', 'Elegir Los productos'];
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

    //FUNCTIONS
    const guardarPedido = () =>{
        setLoading(true)
        let aux={
            cliente:nombre,
            productos:productos,
            cotizacion:{nombre:props.dolares[1].casa.nombre,valor:parseFloat(props.dolares[1].casa.venta)},
            total:total,
            fecha:!fecha?fechaDetallada():fecha
        }
        //Editar Pedido
        if(props.history.location.search){
            database().ref().child(props.user.uid).child('pedidos').child(props.history.location.search.slice(1)).update(aux)
            .then(()=>{
                    setshowSnackbar('El pedido se editó correctamente!')
                setTimeout(() => {
                    props.history.replace(`/Pedidos`)
                }, 2000);
            })
            .catch(()=>{
                setLoading(false)
            })
        }
        //Guardar Pedido Nuevo
        else{
            database().ref().child(props.user.uid).child('pedidos').push(aux)
            .then(()=>{
                setshowSnackbar('El pedido se agregó correctamente!')
                setTimeout(() => {
                    props.history.replace(`/Pedidos`)
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
            const {cliente,productos,total,fecha} = props.pedidos[props.history.location.search.slice(1)]
            cliente&&setnombre(cliente)
            productos&&setproductos(productos)
            total&&settotal(total)
            fecha&&setfecha(fecha)
            setActiveStep(1)
        }
    },[])

    return(
        <Layout history={props.history} page={props.history.location.search?'Editar Pedido':'Nuevo Pedido'} user={props.user.uid} blockGoBack={true}>
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
                                                disabled={setDisabled(activeStep)}
                                                onClick={activeStep==steps.length-1? guardarPedido:handleNext}
                                            >
                                                {activeStep==steps.length-1?`${props.history.location.search?'Guardar Edicion':'Guardar Pedido'}`:'Siguiente'}
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

//REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        pedidos:state.pedidos,
        productos:state.productos,
        clientes:state.clientes,
        dolares:state.dolares
    }
}
export default connect(mapStateToProps,null)(NuevoPedido)