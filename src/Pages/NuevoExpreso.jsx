import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Chip,Paper,ListItem,Card,Button,StepContent,Backdrop,StepLabel,Grid,Step,Stepper,Link as LinkComponent,Snackbar,CircularProgress} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import {Step as StepComponent} from '../components/Nuevo-Cliente/Step'
import {FormDetalles} from '../components/Nuevo-Cliente/FormDetalles'
import { ContactMail, LocalShipping, Mail, PeopleAlt, Phone, Room } from '@material-ui/icons';
import {checkSearch} from '../utilities'
import {database} from 'firebase'
import {content} from './styles/styles'

const NuevoExpreso=(props)=>{
    const classes = content()
    const [nombre,setnombre]=useState(undefined)
    const [dni,setdni]=useState(undefined)
    const [cuit,setcuit]=useState(undefined)
    const [mails,setmails]=useState([])
    const [direcciones,setdirecciones]=useState([])  
    const [telefonos,settelefonos]=useState([])
    const [infoExtra,setinfoExtra]=useState([])
    const [activeStep, setActiveStep] = useState(0);
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const steps = getSteps();

    // STEPPER NAVIGATION
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
    function getSteps() {
        return ['Detalles', 'Direcciones', 'Telefonos','Mails','Informacion Extra'];
    }
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

    //FUNCTIONS
    const guardarDatos = () =>{
        setLoading(true)
        let aux={[nombre]:{
            datos:{
                nombre:nombre,
                dni:dni?dni:null,
                cuit:cuit?cuit:null,
                direcciones:direcciones?direcciones:null,
                telefonos:telefonos?telefonos:null,
                mails:mails?mails:null,
                infoExtra:infoExtra?infoExtra:null,
            },
        }}
        if(props.history.location.search){
            let newAux = props.expresos[checkSearch(props.history.location.search)]
            newAux['datos']=aux[nombre].datos
            console.log(newAux)
            // COPIA PEDIDOS E HISTORIAL
            database().ref().child(props.user.uid).child('expresos').child(props.history.location.search.slice(1)).remove()
            .then(()=>{
                database().ref().child(props.user.uid).child('expresos').child(nombre).update(newAux)
                .then(()=>{
                    setshowSnackbar(props.history.location.search?'El Expreso Se Edito Correctamente!':'El Expreso Se Agrego Correctamente!')
                        setTimeout(() => {
                            setLoading(false)
                            props.history.replace(`/Expreso?${nombre}`)
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
            database().ref().child(props.user.uid).child('expresos').update(aux)
                .then(()=>{
                    setshowSnackbar(props.history.location.search?'El Expreso Se Edito Correctamente!':'El Expreso Se Agrego Correctamente!')
                    setTimeout(() => {
                        props.history.replace(`/Expreso?${nombre}`)
                    }, 2000);
                })
                .catch(()=>{
                    setLoading(false)
                })
        }
        }

    // VALIDACION EDITAR EXPRESO
    useEffect(()=>{
        if(props.history.location.search){
            const {nombre,dni,cuit,mails,direcciones,telefonos,infoExtra} = props.expresos[checkSearch(props.history.location.search)].datos
            nombre&&setnombre(nombre)
            dni&&setdni(dni)
            cuit&&setcuit(cuit)
            mails&&setmails(mails)
            direcciones&&setdirecciones(direcciones)
            telefonos&&settelefonos(telefonos)
            infoExtra&&setinfoExtra(infoExtra)
        }
    },[])
    return(
        <Layout history={props.history} page={props.history.location.search?'Editar Expreso':'Nuevo Expreso'} user={props.user.uid} blockGoBack={true}>
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
                                                {activeStep === steps.length - 1 ? `${props.history.location.search?'Guardar Edicion':'Guardar Expreso'}` : 'Siguiente'}
                                            </Button>
                                        </Grid>
                                        {activeStep !== steps.length -1?
                                            <Grid item>
                                                <Button
                                                    variant="outlined"
                                                    color="light"
                                                    disabled={!nombre}
                                                    onClick={()=>{setActiveStep(steps.length)}}
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

                {/* PREVIEW */}
                {activeStep === steps.length && (
                    <Grid container justify='center'>
                        <Paper elevation={6}>
                            <Button  onClick={handleBack}>
                                Atras     
                            </Button>
                            <Button variant='contained'  onClick={guardarDatos} className={classes.button}>
                                {props.history.location.search?'Guardar Edicion':'Guardar Expreso'}     
                            </Button>
                        </Paper>
                    </Grid>
                )}

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
        expresos:state.expresos,
    }
}
export default connect(mapStateToProps,null)(NuevoExpreso)