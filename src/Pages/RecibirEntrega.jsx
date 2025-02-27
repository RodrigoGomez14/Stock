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
    const [total, settotal] = useState(0);

    const [chequesPersonales,setChequesPersonales]=useState([])
    const [totalChequesPersonales, setTotalChequesPersonales] = useState(0);

    const [cuentaTransferencia,setCuentaTransferencia]=useState(undefined)
    const [totalTransferencia, setTotalTransferencia] = useState(undefined);

    const [efectivo,setefectivo]=useState(undefined)

    const [expreso,setexpreso]=useState('')
    const [remito, setremito] = useState('');

    const [sumarEnvio,setsumarEnvio]=useState(false)
    const [precio, setprecio] = useState(0);

    const [activeStep, setActiveStep] = useState(0);
    const [showSnackbar, setshowSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);

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
                  tipoDeDato='Transferencia'
                  cuentaTransferencia={cuentaTransferencia}
                  setCuentaTransferencia={setCuentaTransferencia}
                  totalTransferencia={totalTransferencia}
                  setTotalTransferencia={setTotalTransferencia}
                  cuentasBancarias={props.cuentasBancarias}
                  />
            );
            case 2:
                return (
                  <StepComponent
                      expresosList={props.expresos}
                      efectivo={efectivo}
                      setefectivo={setefectivo}
                      cheques={cheques}
                      setcheques={setcheques}
                      addCheque={addCheque}
                      chequesPersonales={chequesPersonales}
                      setChequesPersonales={setChequesPersonales}
                      tipoDeDato='Cheques'
                      total={total}
                      settotal={settotal}
                      totalChequesPersonales={totalChequesPersonales}
                      setTotalChequesPersonales={setTotalChequesPersonales}
                      nombre={props.entregas[props.history.location.search.slice(1)].proveedor}
                      chequesList={props.cheques}
                      />
                );
        }
    }
    function getSteps() {
        return ['Efectivo',"Transferencia",'Cheques'];
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
            case 2:
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
    const recibirEntrega = async () =>{
        setLoading(true)
        const id = props.history.location.search.slice(1)

        // AUMENTAR PRDODUCTOS
        aumentarProductos(props.entregas[id].productos)

        // ACTUALIZA CADA CHEQUE EN DB
        let chequesList = actualizarCheques()
        
        // AGREGA CADA CHEQUE PERSONAL A LA LISTA 
        let chequesPersonalesList = agregarChequesPersonales()

        // FUNCIONES DE ESTRUCTURA
        const calcularDeudaActualizada = () =>{
            return props.proveedores[props.entregas[id].proveedor].datos.deuda + parseFloat(calcularAdeudado())
        }
        const calcularPagado = () =>{
            return total + totalChequesPersonales +(efectivo?parseFloat(efectivo):0) + (totalTransferencia?parseFloat(totalTransferencia):0)
        }     
        const calcularAdeudado = () =>{
            return props.history.location.props.total - (total + totalChequesPersonales +(efectivo?parseFloat(efectivo):0)) +(totalTransferencia?parseFloat(totalTransferencia):0)
        }        
        const calcularTotal = () =>{
            return (total + totalChequesPersonales +(efectivo?parseFloat(efectivo):0) + (totalTransferencia?parseFloat(totalTransferencia):0) )?( (efectivo?parseFloat(efectivo):0) + (totalTransferencia?parseFloat(totalTransferencia):0) ) + total + totalChequesPersonales : null
        }       

        // ESTRUCTURA DE LA ENTREGA
        let aux={
            fecha:obtenerFecha(),
            articulos:props.entregas[id].productos,
            proveedor:props.entregas[id].proveedor,
            metodoDePago:{
                facturacion:props.location.props.facturacion?props.location.props.facturacion:null,
                efectivo:efectivo?efectivo:null,
                cuentaTransferencia:cuentaTransferencia?cuentaTransferencia:null,
                totalTransferencia:totalTransferencia?totalTransferencia:null,
                cheques:chequesList,
                chequesPersonales:chequesPersonalesList,
                totalChequesPersonales:totalChequesPersonales,
                fecha:obtenerFecha(),
                total:calcularTotal(),
                deudaPasada:props.proveedores[props.entregas[id].proveedor].datos.deuda,
                deudaActualizada:calcularDeudaActualizada(),
                pagado:calcularPagado(),
                adeudado:calcularAdeudado()
            },
            metodoDeEnvio:expreso?{expreso:expreso,remito:remito,precio:precio}:'Particular',
            total:props.history.location.props.total + (sumarEnvio?parseFloat(precio):0)
        }
        
        // ACTUALIZA LA DEUDA DEL PROVEEDOR
        actualizarDeuda(aux.total, total + totalChequesPersonales + (efectivo?parseFloat(efectivo):0) +(totalTransferencia?parseFloat(totalTransferencia):0))
       
        if(props.location.props.facturacion){
            aux.articulos = actualizarPrecios(aux.articulos)
        }


        // AGREGA LA ENTREGA A DB PARA OBTENER ID
        let idLink = database().ref().child(props.user.uid).child('proveedores').child(props.entregas[id].proveedor).child('entregas').push()
    
        // AGREGA A LISTA DE COMPRAS
        agregarAListaDeCompras(aux,idLink.key)

        // MODELA Y AGREGA EL PAGO AL HISTORIAL
        agregarPagoAlHistorial(aux.metodoDePago,idLink.key,id)
        
        // MODELA Y AGREGA LA TRANSFERENCIA A LOS MOVIMIENTOS BANCARIOS
        if(aux.metodoDePago.cuentaTransferencia){
            guardarTransferenciaBancaria(aux.metodoDePago.cuentaTransferencia,aux.metodoDePago.totalTransferencia)
        }
        
        // FEEDBACK DEL PROCESO
        setshowSnackbar('La entrega se agregó correctamente!')

        // ACTUALIZA DB ENVIANDO TODA LA INFO
        idLink.update(aux)
            .then(()=>{
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
    const actualizarPrecios = (articulos) =>{
        let aux =articulos
        aux.map(articulo=>{
            articulo.precio=articulo.precio+articulo.precio*0.21
            articulo.total = parseFloat(articulo.cantidad) * articulo.precio
        })
        return aux
    }
    const aumentarProductos = async articulos =>{
        const aux = articulos
        // RECORRE LOS ARTICULOS DEL PEDIDO
        aux.map(async (articulo)=>{
                const nuevaCantidad = parseInt(props.productos[articulo.producto].cantidad)+parseInt(articulo.cantidad)
                await database().ref().child(props.user.uid).child('productos').child(articulo.producto).update({cantidad:nuevaCantidad})
                //await database().ref().child(props.user.uid).child('productos').child(articulo.producto).child('historialDeStock').push({cantidad:nuevaCantidad,fecha:obtenerFecha()})
        })
    }
    const actualizarCheques =() =>{
        let chequesList= []
        if(cheques.length){
            // RECORRE LA LISTA DE CHEQUES 
            cheques.map(cheque=>{
                // ACTUALIZA EL CHEQUE EN DB
                database().ref().child(props.user.uid).child('cheques').child(cheque).update({
                    destinatario:props.entregas[props.history.location.search.slice(1)].proveedor,
                    egreso:obtenerFecha()
                })
                // GUARDA EL NUMERO DE CHEQUE
                chequesList.push(props.cheques[cheque].numero)
            })
        }
        // RETORNA UNA LISTA CON CADA NUMERO DE CHEQUE
        return chequesList
    }
    const agregarChequesPersonales = () =>{
        let chequesList= []
        if(chequesPersonales.length){
            // RECORRE LA LISTA DE CHEQUES 
            chequesPersonales.map(cheque=>{
                // GUARDA EL NUMERO DE CHEQUE
                chequesList.push(cheque.numero)
                // ESTRUCTURA DEL CHEQUE
                let auxCheque = {
                    egreso:obtenerFecha(),
                    destinatario:cheque.destinatario,
                    numero:cheque.numero,
                    vencimiento:cheque.vencimiento,
                    valor:cheque.valor
                }
                // GUARDA EN LA LISTA DE CHQUES CADA UNO
                database().ref().child(props.user.uid).child('chequesPersonales').push(auxCheque)
            })
        }
        // RETORNA UNA LISTA CON CADA NUMERO DE CHEQUE
        return chequesList
    }
    const actualizarDeuda = (totalPedido,totalRecibido) =>{
        const id = props.history.location.search.slice(1)
        const deudaPasada = props.proveedores[props.entregas[id].proveedor].datos.deuda
        if(totalPedido>totalRecibido){
            database().ref().child(props.user.uid).child('proveedores').child(props.entregas[id].proveedor).child('datos').update({deuda:(deudaPasada)+(totalPedido-totalRecibido)})
        }
        else{
            database().ref().child(props.user.uid).child('proveedores').child(props.entregas[id].proveedor).child('datos').update({deuda:(deudaPasada)-(totalRecibido-totalPedido)})
        }
    }
    const agregarPagoAlHistorial = (pago,idLink,idEntrega) =>{
        let aux= {...pago,idEntrega:idLink}
        database().ref().child(props.user.uid).child('proveedores').child(props.entregas[idEntrega].proveedor).child('pagos').push(aux)
    }
    const agregarAListaDeCompras = (entrega,idLink) =>{
        let aux=entrega
        aux['idEntrega']=idLink
        database().ref().child(props.user.uid).child('compras').push(aux)
    }
    const guardarTransferenciaBancaria = async (cuenta,total) =>{
        const auxDeposito ={
            fecha:obtenerFecha(),
            tipo:'transferencia',
            total:total
        }
        await database().ref().child(props.user.uid).child('CuentasBancarias').child(cuenta).child('egresos').push(auxDeposito)
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
                                                        Total $ {formatMoney( total + totalChequesPersonales + (efectivo?parseFloat(efectivo):0) + (totalTransferencia?parseFloat(totalTransferencia):0))} / $ {formatMoney( parseFloat(props.history.location.props.total) + (sumarEnvio?precio?parseFloat(precio):0:0 ) ) }
                                                    </Typography>
                                                </Grid>
                                                <Grid container item xs={12} justify='center'>
                                                    <Chip label={`$ ${formatMoney(( parseFloat(props.history.location.props.total) + (sumarEnvio?precio?parseFloat(precio):0:0 ) ) - ( total + totalChequesPersonales +(efectivo?parseFloat(efectivo):0) + (totalTransferencia?parseFloat(totalTransferencia):0)))}`}/>
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
        cuentasBancarias:state.CuentasBancarias
    }
}
export default connect(mapStateToProps,null)(RecibirEntrega)