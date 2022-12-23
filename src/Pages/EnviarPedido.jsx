import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Grid,Paper,Chip,Card,Button,StepContent,Backdrop,StepLabel,Typography,Step,Stepper,Snackbar,CircularProgress} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import {Step as StepComponent} from '../components/Enviar-Pedido/Step'
import {database} from 'firebase'
import {formatMoney,fechaDetallada} from '../utilities'
import {Redirect} from 'react-router-dom'
import {content} from './styles/styles'
import { AttachMoney, LocalShipping } from '@material-ui/icons';
 
  // COMPONENT
  const EnviarPedido=(props)=>{
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

    // STEPPER NAVIGATION
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
    function getStepContent(step) {
      switch (step) {
        case 0:
        return (
                <StepComponent
                    expresosList={props.clientes[props.pedidos[props.history.location.search.slice(1)].cliente].datos.expresos}
                    tipoDeDato='Metodo De Envio'
                    precio={precio}
                    setprecio={setprecio}
                    expreso={expreso}
                    setexpreso={setexpreso}
                    remito={remito}
                    setremito={setremito}
                    sumarEnvio={sumarEnvio}
                    setsumarEnvio={setsumarEnvio}
                />
        );
        case 1:
          return (
            <StepComponent
                expresosList={props.clientes[props.pedidos[props.history.location.search.slice(1)].cliente].datos.expresos}
                efectivo={efectivo}
                setefectivo={setefectivo}
                cheques={cheques}
                setcheques={setcheques}
                tipoDeDato='Metodo De Pago'
                total={total}
                settotal={settotal}
                nombre={props.pedidos[props.history.location.search.slice(1)].cliente}
            />
          );
      }
    }
    function getSteps() {
        return ['Metodo De Envio', 'Metodo De Pago'];
    }
    function getStepLabel(label,index) {
        switch (index) {
            case 0:
                return (
                    <StepLabel>
                        <Chip 
                            avatar={<LocalShipping/>} 
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
    const guardarCheques =() =>{
        let chequesList= []
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
    const enviarPedido = async () =>{
        setLoading(true)
        const id = props.history.location.search.slice(1)
        await descontarProductos(id)
        let chequesList = guardarCheques()
        let aux={
            fecha:fechaDetallada(),
            articulos:props.pedidos[id].productos,
            metodoDePago:{
                efectivo:efectivo?efectivo:null,
                cheques:chequesList,
                fecha:(efectivo||total?fechaDetallada():null),
                total:((efectivo?parseFloat(efectivo):0)+total)?((efectivo?parseFloat(efectivo):0)+total):null,
                deudaPasada:props.clientes[props.pedidos[id].cliente].datos.deuda,
                pagado:total + (efectivo?parseFloat(efectivo):0),
                adeudado:props.history.location.props.total - (total + (efectivo?parseFloat(efectivo):0))
            },
            metodoDeEnvio:expreso?{expreso:expreso,remito:remito,precio:precio}:'Particular',
            total:props.history.location.props.total,
        }
        actualizarDeuda(aux.total, total + (efectivo?parseFloat(efectivo):0) )
        agregarAListaDeIva(aux.total)
        let idLink = database().ref().child(props.user.uid).child('clientes').child(props.pedidos[id].cliente).child('pedidos').push()
        agregarPagoAlHistorial(aux.metodoDePago,idLink.key)
        setshowSnackbar('El pedido se envió correctamente!')
        idLink.update(aux) 
            .then(()=>{
                props.history.replace('/Pedidos')
                database().ref().child(props.user.uid).child('pedidos').child(id).remove().then(()=>{
                    setTimeout(() => {
                        if(expreso){
                            database().ref().child(props.user.uid).child('expresos').child(expreso).child('envios').push({fecha:fechaDetallada(),id:idLink.key,remito:remito,cliente:props.location.props.nombre}).then(()=>{
                                setLoading(false)
                            }) 
                        }
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
    const agregarAListaDeIva = (aux) =>{
        if(props.history.location.props.facturacion){
            database().ref().child(props.user.uid).child('iva').child('ventas').push({
                fecha:fechaDetallada(),
                iva:aux-(aux/1.21),
                total:aux
            })
        }
    }
    const descontarProductos = async pedido =>{
        const id = props.history.location.search.slice(1)
        const articulos = props.pedidos[id].productos
        articulos.map(async articulo=>{
            if(props.productos[articulo.producto].composicion){
                props.productos[articulo.producto].composicion.map(async producto=>{
                    const nuevaCantidad = props.productos[producto].cantidad-articulo.cantidad
                    await database().ref().child(props.user.uid).child('productos').child(producto).update({cantidad:nuevaCantidad})
                })
            }
            else{
                const nuevaCantidad = parseInt(props.productos[articulo.producto].cantidad)-parseInt(articulo.cantidad)
                await database().ref().child(props.user.uid).child('productos').child(articulo.producto).update({cantidad:nuevaCantidad})
            }
        })
    }
    const actualizarDeuda = (totalPedido,totalRecibido) =>{
        const id = props.history.location.search.slice(1)
        if(totalPedido>totalRecibido){
            database().ref().child(props.user.uid).child('clientes').child(props.pedidos[id].cliente).child('datos').update({deuda:(props.clientes[props.pedidos[id].cliente].datos.deuda)+(totalPedido-totalRecibido)})
        }
        else{
            database().ref().child(props.user.uid).child('clientes').child(props.pedidos[id].cliente).child('datos').update({deuda:(props.clientes[props.pedidos[id].cliente].datos.deuda)-(totalRecibido-totalPedido)})
        }
    }
    const agregarPagoAlHistorial = (pago,idLink) =>{
        let aux= {...pago,idPedido:idLink}
        const id = props.history.location.search.slice(1)
        if((efectivo?parseFloat(efectivo):0)+total){
            database().ref().child(props.user.uid).child('clientes').child(props.pedidos[id].cliente).child('pagos').push(aux)
        }
    }
    return(
        props.history.location.props?
            <Layout history={props.history} page='Enviar Pedido' user={props.user.uid} blockGoBack={true}>
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
                                        {activeStep==1 &&
                                            <Grid container item xs={12} justify='center'>
                                                <Paper elevation={3} variant='body1' className={classes.paperTotalEnviarPedido}>
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
                                        }
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
                                                    onClick={activeStep === steps.length - 1 ? enviarPedido : handleNext}
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
            <Redirect to='/Pedidos'/>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        expresos:state.expresos,
        pedidos:state.pedidos,
        productos:state.productos,
        clientes:state.clientes
    }
}
export default connect(mapStateToProps,null)(EnviarPedido)