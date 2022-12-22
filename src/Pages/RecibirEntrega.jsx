import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Grid,Paper,Chip,Card,Button,StepContent,Backdrop,StepLabel,Typography,Step,Stepper,Snackbar,CircularProgress} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import {Step as StepComponent} from '../components/Recibir-Entrega/Step'
import {database} from 'firebase'
import {formatMoney} from '../utilities'
import {Redirect} from 'react-router-dom'
import {obtenerFecha} from '../utilities'
import {content} from './styles/styles'
import { AttachMoney, LocalAtm } from '@material-ui/icons';
  
  const RecibirEntrega=(props)=>{
    const classes = content()
    const [cheques,setcheques]=useState([])
    const [efectivo,setefectivo]=useState(undefined)
    const [expreso,setexpreso]=useState('')
    const [remito, setremito] = useState('');
    const [precio, setprecio] = useState(0);
    const [total, settotal] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const [showSnackbar, setshowSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sumarEnvio,setsumarEnvio]=useState(false)
    const steps = getSteps();

    //STEPPER NAVIGATION 
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
                expresosList={props.expresos}
                efectivo={efectivo}
                setefectivo={setefectivo}
                cheques={cheques}
                setcheques={setcheques}
                addCheque={addCheque}
                tipoDeDato='Efectivo'
                total={total}
                settotal={settotal}
                nombre={props.entregas[props.history.location.search.slice(1)].proveedor}
                chequesList={props.cheques}
                />
          );
          case 1:
            return (
              <StepComponent
                  expresosList={props.expresos}
                  efectivo={efectivo}
                  setefectivo={setefectivo}
                  cheques={cheques}
                  setcheques={setcheques}
                  addCheque={addCheque}
                  tipoDeDato='Cheques'
                  total={total}
                  settotal={settotal}
                  nombre={props.entregas[props.history.location.search.slice(1)].proveedor}
                  chequesList={props.cheques}
                  />
            );
        }
    }
    function getSteps() {
        return ['Efectivo','Cheques'];
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

    //FUNCTIONS
    const guardarCheques =() =>{
        let chequesList= []
        console.log(cheques)
        if(cheques.length){
            cheques.map(cheque=>{
                chequesList.push(cheque.numero)
                let auxCheque = {
                    ingreso:obtenerFecha(),
                    nombre:cheque.nombre,
                    numero:cheque.numero,
                    vencimiento:cheque.vencimiento,
                    banco:cheque.banco,
                    valor:cheque.valor,
                    diaDeEnvio:cheque.diaDeEnvio,
                    destinatario:cheque.destinatario
                }
                database().ref().child(props.user.uid).child('cheques').push(auxCheque)
            })
        }
        return chequesList
    }
    const recibirEntrega = async () =>{
        setLoading(true)
        const id = props.history.location.search.slice(1)
        await aumentarProductos(id)
        let chequesList = guardarCheques()
        let aux={
            fecha:obtenerFecha(),
            articulos:props.entregas[id].productos,
            metodoDePago:{
                efectivo:efectivo?efectivo:null,
                cheques:chequesList,
                fecha:(efectivo||total?obtenerFecha():null),
                total:((efectivo?parseFloat(efectivo):0)+total)?((efectivo?parseFloat(efectivo):0)+total):null,
                deudaPasada:props.proveedores[props.entregas[id].proveedor].datos.deuda,
            },
            metodoDeEnvio:expreso?{expreso:expreso,remito:remito,precio:precio}:'Particular',
            total:props.history.location.props.total + (sumarEnvio?parseFloat(precio):0)
        }
        actualizarDeuda(aux.total, total + (efectivo?parseFloat(efectivo):0) )
        agregarPagoAlHistorial(aux.metodoDePago)
        database().ref().child(props.user.uid).child('proveedores').child(props.entregas[id].proveedor).child('entregas').push(aux)
            .then(()=>{
                setshowSnackbar('La entrega se agregó correctamente!')
                setTimeout(() => {
                    props.history.replace('/Entregas')
                    database().ref().child(props.user.uid).child('entregas').child(id).remove().then(()=>{
                    })
                    .catch(()=>{
                        setLoading(false)
                        setshowSnackbar('')
                     })
                }, 2000);
            })
            .catch(()=>{
                setLoading(false)
            })
    }
    const aumentarProductos = async pedido =>{
        const articulos = props.entregas[pedido].productos
        articulos.map(async articulo=>{
            if(props.productos[articulo.producto].cadenaDeProduccion){
                //props.productos[articulo.producto].cadenaDeProduccion.map(async (producto,i)=>{
                    //if(producto)
                    //const nuevaCantidad = props.productos[producto].cantidad-articulo.cantidad
                    //await database().ref().child(props.user.uid).child('productos').child(producto).update({cantidad:nuevaCantidad})
                //})
            }
            else{
                console.log(props.productos[articulo.producto].cantidad,articulo.cantidad)
                const nuevaCantidad = parseInt(props.productos[articulo.producto].cantidad)+parseInt(articulo.cantidad)
                await database().ref().child(props.user.uid).child('productos').child(articulo.producto).update({cantidad:nuevaCantidad})
            }
        })
    }
    const actualizarDeuda = (totalPedido,totalRecibido) =>{
        const id = props.history.location.search.slice(1)
        if(totalPedido>totalRecibido){
            database().ref().child(props.user.uid).child('proveedores').child(props.entregas[id].proveedor).child('datos').update({deuda:(props.proveedores[props.entregas[id].proveedor].datos.deuda)+(totalPedido-totalRecibido)})
        }
        else{
            database().ref().child(props.user.uid).child('proveedores').child(props.entregas[id].proveedor).child('datos').update({deuda:(props.proveedores[props.entregas[id].proveedor].datos.deuda)-(totalRecibido-totalPedido)})
        }
    }
    const agregarPagoAlHistorial = pago =>{
        const id = props.history.location.search.slice(1)
        if((efectivo?parseFloat(efectivo):0)+total){
            database().ref().child(props.user.uid).child('proveedores').child(props.entregas[id].proveedor).child('pagos').push(pago)
        }
    }
    const addCheque = key =>{
        const index = cheques.indexOf(key)
        let aux = [...cheques]
        if(index !== -1){
            aux.splice(index,1)
            settotal(parseFloat(total)-parseFloat(props.cheques[key].valor))
        }
        else{
            aux.push(key)
            settotal(parseFloat(total)+parseFloat(props.cheques[key].valor))
        }
        setcheques(aux)
    }

    return(
        props.history.location.props?
            <Layout history={props.history} page='Recibir Entrega' user={props.user.uid} blockGoBack={true}>
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
                                                        Total $ {formatMoney( total + (efectivo?parseFloat(efectivo):0))} / $ {formatMoney( parseFloat(props.history.location.props.total) + (sumarEnvio?precio?parseFloat(precio):0:0 ) ) }
                                                    </Typography>
                                                </Grid>
                                                <Grid container item xs={12} justify='center'>
                                                    <Chip label={`$ ${formatMoney(( parseFloat(props.history.location.props.total) + (sumarEnvio?precio?parseFloat(precio):0:0 ) ) - ( total + (efectivo?parseFloat(efectivo):0)))}`}/>
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
                                                    onClick={activeStep === steps.length - 1 ? recibirEntrega : handleNext}
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
            :
            <Redirect to='/Entregas'/>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        expresos:state.expresos,
        entregas:state.entregas,
        productos:state.productos,
        proveedores:state.proveedores,
        cheques:state.cheques,
    }
}
export default connect(mapStateToProps,null)(RecibirEntrega)