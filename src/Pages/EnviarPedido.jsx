import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Grid,Paper,Chip,Card,Button,StepContent,Backdrop,StepLabel,Typography,Step,Stepper,Snackbar,CircularProgress} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import {Step as StepComponent} from '../components/Enviar-Pedido/Step'
import {database} from 'firebase'
import {formatMoney,obtenerFecha} from '../utilities'
import {Redirect} from 'react-router-dom'
import {content} from './styles/styles'
import { AttachMoney, LocalShipping } from '@material-ui/icons';
 
  // COMPONENT
  const EnviarPedido=(props)=>{
    const classes = content()
    
    const [cheques,setcheques]=useState([])
    const [total, settotal] = useState(0);
    const [efectivo,setefectivo]=useState(undefined)
    
    const [cuentaTransferencia,setCuentaTransferencia]=useState(undefined)
    const [totalTransferencia, setTotalTransferencia] = useState(undefined);

    const [expreso,setexpreso]=useState('')
    const [remito, setremito] = useState('');
    const [precio, setprecio] = useState(0);

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
                cuentaTransferencia={cuentaTransferencia}
                setCuentaTransferencia={setCuentaTransferencia}
                totalTransferencia={totalTransferencia}
                setTotalTransferencia={setTotalTransferencia}
                cuentasBancarias={props.cuentasBancarias}
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
    const enviarPedido = async () =>{
        setLoading(true)
        const id = props.history.location.search.slice(1)

        // DESCONTAR PRODUCTOS
        await descontarProductos(id)
        
        // AGREGA CADA CHEQUE A DB
        let chequesList = guardarCheques()
        
        // FUNCIONES DE ESTRUCTURA
        const calcularDeudaActualizada = () =>{
            return props.clientes[props.pedidos[id].cliente].datos.deuda + parseFloat(calcularAdeudado())
        }
        const calcularPagado = () =>{
            return total + (efectivo?parseFloat(efectivo):0) + (totalTransferencia?parseFloat(totalTransferencia):0)
        }     
        const calcularAdeudado = () =>{
            return props.history.location.props.total - (total + (efectivo?parseFloat(efectivo):0) + (totalTransferencia?parseFloat(totalTransferencia):0))
        }        
        const calcularTotal = () =>{
            return ((efectivo?parseFloat(efectivo):0) + total + (totalTransferencia?parseFloat(totalTransferencia):0))?((efectivo?parseFloat(efectivo):0) + total + (totalTransferencia?parseFloat(totalTransferencia):0)):null
        }        
        // ESTRUCTURA DEL PEDIDO
        let aux={
            fecha:obtenerFecha(),
            cliente:props.pedidos[id].cliente,
            articulos:props.pedidos[id].productos,
            metodoDePago:{
                facturacion:props.location.props.facturacion?props.location.props.facturacion:null,
                efectivo:efectivo?efectivo:null,
                cuentaTransferencia:cuentaTransferencia?cuentaTransferencia:null,
                totalTransferencia:totalTransferencia?totalTransferencia:null,
                cheques:chequesList,
                fecha:obtenerFecha(),
                total:calcularTotal(),
                deudaPasada:props.clientes[props.pedidos[id].cliente].datos.deuda,
                deudaActualizada: calcularDeudaActualizada(),
                pagado:calcularPagado(),
                adeudado:calcularAdeudado()
            },
            metodoDeEnvio:expreso?{expreso:expreso,remito:remito,precio:precio}:'Particular',
            total:props.history.location.props.total,
        }

        // ACTUALIZA LA DEUDA DEL CLIENTE
        actualizarDeuda(aux.total, total + (efectivo?parseFloat(efectivo):0) +(totalTransferencia?parseFloat(totalTransferencia):0) )
        
        //ACTUALIZA LOS PRECIOS PARA FACTURACION
        if(props.location.props.facturacion){
            aux.articulos = actualizarPrecios(aux.articulos)
        }

        
        //AGREGA LA VENTA AL LISTADO DE FACTURACION
        agregarAListaDeIva(aux.total)

        // AGREGA EL PEDIDO A DB PARA OBTENER ID
        let idLink = database().ref().child(props.user.uid).child('clientes').child(props.pedidos[id].cliente).child('pedidos').push()
        
        // AGREGA LA FACTURA A LISTA DE VENTAS
        agregarAListaDeVentas(aux,idLink.key)

        // MODELA Y AGREGA EL PAGO AL HISTORIAL
        agregarPagoAlHistorial(aux.metodoDePago,idLink.key,id)

        // MODELA Y AGREGA LA TRANSFERENCIA A LOS MOVIMIENTOS BANCARIOS
        if(aux.metodoDePago.cuentaTransferencia){
            guardarTransferenciaBancaria(aux.metodoDePago.cuentaTransferencia,aux.metodoDePago.totalTransferencia)
        }

        // FEEDBACK DEL PROCESO
        setshowSnackbar('El pedido se envió correctamente!')
        
        // ACTUALIZA DB ENVIANDO TODA LA INFO
        idLink.update(aux) 
            .then(()=>{
                props.history.replace('/Pedidos')
                database().ref().child(props.user.uid).child('pedidos').child(id).remove().then(()=>{
                    setTimeout(() => {
                        if(expreso){
                            database().ref().child(props.user.uid).child('expresos').child(expreso).child('envios').push({fecha:obtenerFecha(),id:idLink.key,remito:remito,cliente:props.location.props.nombre}).then(()=>{
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

    const actualizarPrecios = (articulos) =>{
        let aux =articulos
        aux.map(articulo=>{
            articulo.precio=articulo.precio+articulo.precio*0.21
            articulo.total = parseFloat(articulo.cantidad) * articulo.precio
        })
        return aux
    }
    
    const descontarProductos = async id =>{
        const articulos = props.pedidos[id].productos
        // RECORRE LOS ARTICULOS DEL PEDIDO
        articulos.map(async articulo=>{
            const nuevaCantidad = parseInt(props.productos[articulo.producto].cantidad)-parseInt(articulo.cantidad)
            await database().ref().child(props.user.uid).child('productos').child(articulo.producto).update({cantidad:nuevaCantidad})
        })
    }
    const guardarCheques =() =>{
        let chequesList= []
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
    const actualizarDeuda = (totalPedido,totalRecibido) =>{
        const id = props.history.location.search.slice(1)
        const deudaPasada = props.clientes[props.pedidos[id].cliente].datos.deuda
        if(totalPedido>totalRecibido){
            database().ref().child(props.user.uid).child('clientes').child(props.pedidos[id].cliente).child('datos').update({deuda:(deudaPasada)+(totalPedido-totalRecibido)})
        }
        else{
            database().ref().child(props.user.uid).child('clientes').child(props.pedidos[id].cliente).child('datos').update({deuda:(deudaPasada)-(totalRecibido-totalPedido)})
        }
    }
    const agregarAListaDeIva = (aux) =>{
        if(props.history.location.props.facturacion){
            database().ref().child(props.user.uid).child('iva').child('ventas').push({
                fecha:obtenerFecha(),
                iva:aux-(aux/1.21),
                total:aux
            })
        }
    }    
    const agregarAListaDeVentas = (pedido,idLink) =>{
        let aux=pedido
        aux['idPedido']=idLink
        database().ref().child(props.user.uid).child('ventas').push(aux) 
    }
    const agregarPagoAlHistorial = (pago,idLink,idPedido) =>{
        // AGREGA EL ID DEL PEDIDO AL PAGO
        let aux= {...pago,idPedido:idLink}
        database().ref().child(props.user.uid).child('clientes').child(props.pedidos[idPedido].cliente).child('pagos').push(aux)
    }
    const guardarTransferenciaBancaria = async (cuenta,total) =>{
        console.log(cuenta,total)
        const auxDeposito ={
            fecha:obtenerFecha(),
            tipo:'transferencia',
            total:total
        }
        await database().ref().child(props.user.uid).child('CuentasBancarias').child(cuenta).child('ingresos').push(auxDeposito)
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
                                                            Total $ {formatMoney( total + (efectivo?parseFloat(efectivo):0) + (totalTransferencia?parseFloat(totalTransferencia):0))} / $ {formatMoney( parseFloat(props.history.location.props.total) + (sumarEnvio?precio?parseFloat(precio):0:0 ) ) }
                                                        </Typography>
                                                    </Grid>
                                                    <Grid container item xs={12} justify='center'>
                                                        <Chip label={`$ ${formatMoney(( parseFloat(props.history.location.props.total) + (sumarEnvio?precio?parseFloat(precio):0:0 ) ) - ( total + (efectivo?parseFloat(efectivo):0) + (totalTransferencia?parseFloat(totalTransferencia):0)))}`}/>
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
                </Backdrop>
                <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={()=>{setshowSnackbar('')}}>
                    <Alert severity="success" variant='filled'>
                        {showSnackbar}
                    </Alert>
                </Snackbar>
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
        clientes:state.clientes,
        cuentasBancarias:state.CuentasBancarias
    }
}
export default connect(mapStateToProps,null)(EnviarPedido)