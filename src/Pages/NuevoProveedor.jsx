import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Avatar,Paper,Chip,Card,Button,StepContent,Backdrop,StepLabel,Grid,Step,Stepper,Link as LinkComponent,Snackbar,CircularProgress} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import {Step as StepComponent} from '../components/Nuevo-Cliente/Step'
import {FormDetalles} from '../components/Nuevo-Cliente/FormDetalles'
import {database} from 'firebase'
import {content} from './styles/styles'
import { ContactMail, LocalShipping, Mail, PeopleAlt, Phone, Room } from '@material-ui/icons';
import { checkSearch } from '../utilities';

// COMPONENT
const NuevoProveedor=(props)=>{
    const classes = content()
    const [nombre,setnombre]=useState(undefined)
    const [dni,setdni]=useState(undefined)
    const [cuit,setcuit]=useState(undefined)
    const [expresos,setexpresos]=useState([])
    const [mails,setmails]=useState([])
    const [direcciones,setdirecciones]=useState([])  
    const [telefonos,settelefonos]=useState([])
    const [infoExtra,setinfoExtra]=useState([])
    const [deuda,setdeuda]=useState(0)

    //STEPPER STATE
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
                            avatar={<Room/>} 
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
                            avatar={<Phone/>} 
                            label={label}  
                            onClick={()=>{if(nombre){setActiveStep(index)}}}
                            variant='default'
                            className={activeStep==index?classes.iconLabelSelected:null}
                        />
                    </StepLabel>
                );
            case 3:
                return (
                    <StepLabel>
                        <Chip 
                            avatar={<Mail/>} 
                            label={label}  
                            onClick={()=>{if(nombre){setActiveStep(index)}}}
                            variant='default'
                            className={activeStep==index?classes.iconLabelSelected:null}
                        />
                    </StepLabel>
                );
            case 4:
                return (
                    <StepLabel>
                        <Chip 
                            avatar={<LocalShipping/>} 
                            label={label}  
                            onClick={()=>{if(nombre){setActiveStep(index)}}}
                            variant='default'
                            className={activeStep==index?classes.iconLabelSelected:null}
                        />
                    </StepLabel>
                );
            case 5:
                return (
                    <StepLabel>
                        <Chip 
                            avatar={<ContactMail/>} 
                            label={label}  
                            onClick={()=>{if(nombre){setActiveStep(index)}}}
                            variant='default'
                            className={activeStep==index?classes.iconLabelSelected:null}
                        />
                    </StepLabel>
                );
        }
    }
    function getSteps() {
        return ['Datos personales', 'Direcciones', 'Telefonos','Mails','Expresos','Informacion Extra'];
    }

    // FUNCTIONS
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
        if(props.history.location.search){
            let newAux = props.proveedores[checkSearch(props.history.location.search)]
            newAux['datos']=aux[nombre].datos
            
            // COPIA PEDIDOS E HISTORIAL
            database().ref().child(props.user.uid).child('proveedores').child(props.history.location.search.slice(1)).remove()
            .then(()=>{
                database().ref().child(props.user.uid).child('proveedores').child(nombre).update(newAux)
                .then(()=>{
                    setshowSnackbar(props.history.location.search?'El Proveedor Se Edito Correctamente!':'El Proveedor Se Agrego Correctamente!')
                        setTimeout(() => {
                            setLoading(false)
                            props.history.replace(`/Proveedor?${nombre}`)
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
            database().ref().child(props.user.uid).child('proveedores').update(aux)
                .then(()=>{
                    setshowSnackbar(props.history.location.search?'El Proveedor Se Edito Correctamente!':'El Proveedor Se Agrego Correctamente!')
                    setTimeout(() => {
                        props.history.replace(`/Proveedor?${nombre}`)
                    }, 2000);
                })
                .catch(()=>{
                    setLoading(false)
                })
        }
    }

    // FILL FOR EDIT
    useEffect(()=>{
        if(props.history.location.search){
            const {nombre,dni,cuit,expresos,mails,direcciones,telefonos,infoExtra,deuda} = props.proveedores[checkSearch(props.history.location.search)].datos
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
    },[])
    return(
        <Layout history={props.history} page={props.history.location.search?'Editar Proveedor':'Nuevo Proveedor'} user={props.user.uid} blockGoBack={true}>
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
                                    <Grid container item xs={12} justify='center' spacing={3}>
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
                                                disabled={!nombre}
                                                onClick={activeStep === steps.length - 1 ? guardarDatos : handleNext}
                                            >
                                                {activeStep === steps.length - 1 ? `${props.history.location.search?'Guardar Edicion':'Guardar Proveedor'}` : 'Siguiente'}
                                            </Button>
                                        </Grid>
                                        {activeStep !== steps.length -1?
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="light"
                                                    disabled={!nombre}
                                                    onClick={()=>{setActiveStep(steps.length-1)}}
                                                    className={classes.button}
                                                >
                                                    Finalizar
                                                </Button>
                                            </Grid>
                                            :
                                            null
                                        }
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
                <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={()=>{setshowSnackbar(false)}}>
                    <Alert severity="success" variant='filled'>
                        {showSnackbar}
                    </Alert>
                </Snackbar>
            </Backdrop>
        </Layout>
    )
}

// REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        expresos:state.expresos,
        proveedores:state.proveedores,
    }
}
export default connect(mapStateToProps,null)(NuevoProveedor)