import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,Chip,Card,Button,StepContent,Backdrop,StepLabel,Grid,Step,Stepper,Link as LinkComponent,Snackbar,CircularProgress,Typography} from '@material-ui/core'
import {List,Link as LinkIcon, AccountTree} from '@material-ui/icons'
import Alert from '@material-ui/lab/Alert';
import {Redirect} from 'react-router-dom'
import {Step as StepComponent} from '../components/Nuevo-Producto/Step'
import {database} from 'firebase'
import {content} from './styles/styles'
import {checkSearchProducto} from '../utilities'
import {getProductosList,getSubproductosList} from '../utilities'

  
// COMPONENT  
const NuevoProducto=(props)=>{
    const classes = content()
    
    const [isSubproducto,setIsSubproducto]=useState(undefined)
    
    const [nombre,setnombre]=useState('')
    const [precio,setprecio]=useState(0)
    const [cantidad,setcantidad]=useState(0)
    const [cadenaDeProduccion,setcadenaDeProduccion]=useState([])
    const [subproductos,setSubproductos]=useState([])

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
                tipoDeDato='Detalles'
                nombre={nombre}
                setnombre={setnombre}
                precio={precio}
                setprecio={setprecio}
                cantidad={cantidad}
                setcantidad={setcantidad}
                disableCantidad={props.history.location.searchx?true:false}
                isSubproducto={isSubproducto}
                setIsSubproducto={setIsSubproducto}
            /> 
        );
        case 1:
            return (
            <StepComponent 
                tipoDeDato='Cadena De Produccion'
                cadenaDeProduccion={cadenaDeProduccion}
                setcadenaDeProduccion={setcadenaDeProduccion}
                proveedoresList={props.proveedores}
            /> 
        );
        case 2:
            return (
            <StepComponent 
                tipoDeDato='Componentes'
                subproductos={subproductos}
                setSubproductos={setSubproductos}
                subproductosList={getSubproductosList(props.productos)}
            /> 
        );
      }
    }
    const setDisabled=(step)=>{
        switch (step) {
            case 0:
                if(isSubproducto){
                    if(!nombre){
                        return true
                    }
                }
                else{
                    if(!nombre || !precio){
                        return true
                    }
                }
                break;
            case 1:
                break;
            default:
                break;
        }
    }
    function getSteps() {
        return ['Detalles','Cadena De Produccion','Componentes' ];
    }

    // FUNCTIONS
    const guardarProducto = () =>{
        setLoading(true)
        let aux={[nombre]:{
            cantidad:parseInt(cantidad),
            precio:parseFloat(precio),
            nombre:nombre,
            cadenaDeProduccion:cadenaDeProduccion.length?cadenaDeProduccion:null,
            isSubproducto:isSubproducto?isSubproducto:null,
            subproductos:subproductos
        }}
        if(props.history.location.search){
            let newAux = props.productos[checkSearchProducto(props.history.location.search)]
            if(newAux.historialDeCadenas){
                aux[nombre]['historialDeCadenas']=newAux.historialDeCadenas
            }
            
            // COPIA PEDIDOS E HISTORIAL
            database().ref().child(props.user.uid).child('productos').child(props.history.location.search.slice(1)).remove()
            .then(()=>{
                database().ref().child(props.user.uid).child('productos').update(aux)
                .then(()=>{
                    setshowSnackbar(props.history.location.search?'El Producto Se Edito Correctamente!':'El Producto Se Agrego Correctamente!')
                        setTimeout(() => {
                            setLoading(false)
                            props.history.replace('/Productos')
                        }, 2000);
                })
                .catch(()=>{
                    setLoading(false)
                })
            })
            .catch(()=>{
                setLoading(false)
            })
        }
        else{
            database().ref().child(props.user.uid).child('productos').update(aux)
                .then(()=>{
                    setshowSnackbar(props.history.location.search?'El Producto Se Edito Correctamente!':'El Producto Se Agrego Correctamente!')
                    setTimeout(() => {
                        props.history.replace('/Productos')
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
                            avatar={<List/>} 
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
                            avatar={<LinkIcon/>} 
                            label={label}  
                            onClick={()=>{if(nombre){setActiveStep(index)}}}
                            variant='default'
                            className={activeStep==index?classes.iconLabelSelected:null}
                        />
                    </StepLabel>
                );
            case 2:
                return (
                    <StepLabel>
                        <Chip 
                            avatar={<AccountTree/>} 
                            label={label}  
                            onClick={()=>{if(nombre){setActiveStep(index)}}}
                            variant='default'
                            className={activeStep==index?classes.iconLabelSelected:null}
                        />
                    </StepLabel>
                );
        }
    }

    // FILL FOR EDIT
    useEffect(()=>{
        if(props.history.location.search){
            const {nombre,precio,cantidad,cadenaDeProduccion,subproductos,isSubproducto} = props.productos[checkSearchProducto(props.history.location.search)]
            nombre&&setnombre(nombre)
            precio&&setprecio(precio)
            cantidad&&setcantidad(cantidad)
            cadenaDeProduccion&&setcadenaDeProduccion(cadenaDeProduccion)
            isSubproducto&&setIsSubproducto(isSubproducto)
            subproductos&&setSubproductos(subproductos)
        }
    },[])
    return(
        <Layout history={props.history} page={props.history.location.search?'Editar Producto':'Nuevo Producto'} user={props.user.uid} blockGoBack={true}>
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
                                                onClick={activeStep === steps.length - 1 ? guardarProducto : handleNext}
                                            >
                                                {activeStep === steps.length - 1 ? `${props.history.location.search?'Guardar Edicion':'Guardar Producto'}` : 'Siguiente'}
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
        productos:state.productos,
        proveedores:state.proveedores,
    }
}
export default connect(mapStateToProps,null)(NuevoProducto)