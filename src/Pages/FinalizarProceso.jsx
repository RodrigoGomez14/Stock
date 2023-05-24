import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Grid,Paper,Chip,Card,Button,StepContent,Backdrop,StepLabel,Typography,Step,Stepper,Snackbar,CircularProgress} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import {Step as StepComponent} from '../components/Finalizar-Proceso/Step'
import {database} from 'firebase'
import {Redirect} from 'react-router-dom'
import {checkSearch, formatMoney,fechaDetallada,obtenerFecha} from '../utilities'
import {content} from './styles/styles'
import { AttachMoney, List, LocalAtm } from '@material-ui/icons';
  
  const FinalizarEntrega=(props)=>{
    const classes = content()

    const [cheques,setcheques]=useState([])
    const [total, settotal] = useState(0);

    const [chequesPersonales,setChequesPersonales]=useState([])
    const [totalChequesPersonales, setTotalChequesPersonales] = useState(0);

    const [cuentaTransferencia,setCuentaTransferencia]=useState(undefined)
    const [totalTransferencia, setTotalTransferencia] = useState(undefined);

    const [efectivo,setEfectivo]=useState(undefined)

    const [precio, setPrecio] = useState(undefined);
    const [cantidad, setCantidad] = useState(props.cadenasActivas[props.location.search.slice(1)].cantidad?props.cadenasActivas[props.location.search.slice(1)].cantidad:undefined);

    const [facturacion, setFacturacion] = useState(props.location.props.facturacion?props.location.props.facturacion:null);
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
                tipoDeDato='Detalles'
                precio={precio}      
                cantidad={cantidad}      
                setPrecio={setPrecio}      
                setCantidad={setCantidad}
                setEfectivo={setEfectivo}    
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
                tipoDeDato='Metodo De Pago'
                efectivo={efectivo}
                setEfectivo={setEfectivo}
                cheques={cheques}
                setcheques={setcheques}
                addCheque={addCheque}
                total={total}
                settotal={settotal}
                chequesList={props.cheques}
                  />
            );
        case 3:
            return (
                    <StepComponent 
                        tipoDeDato='Cheques Personales'
                        chequesPersonales={chequesPersonales}
                        setChequesPersonales={setChequesPersonales}
                        totalChequesPersonales={totalChequesPersonales}
                        setTotalChequesPersonales={setTotalChequesPersonales}
                        cliente={props.cadenasActivas[props.location.search.slice(1)].procesos[checkStepProceso(props.history.location.search.slice(1))].proveedor}
                        addCheque={addCheque}
                        chequesList={props.cheques}
                        tipo='Proveedor'
                    />
          );
        }
    }
    function getSteps() {
        return ['Detalles',"Transferencia",'Metodo De Pago','Cheques Personales'];
    }
    function getStepLabel(label,index) {
        switch (index) {
            case 0:
                return (
                    <StepLabel>
                        <Chip 
                            avatar={<List/>} 
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
                            avatar={<AttachMoney />} 
                            className={activeStep==index?classes.iconLabelSelected:null}
                            label={label} 
                            variant='default'
                            onClick={()=>{setActiveStep(index)}}
                        />
                    </StepLabel>
                );
            case 3:
                return (
                    <StepLabel>
                        <Chip 
                            avatar={<AttachMoney />} 
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
    const checkStepProceso = (id) =>{
        let aux = props.cadenasActivas[id].procesos
        let index = 0
        aux.map((proceso,i)=>{
            if(proceso.fechaDeInicio){
                index = i
            }
        })
        return index
    }
    const finalizarProceso = async () =>{
        const id = props.history.location.search.slice(1)
        const step = checkStepProceso(id)
        const cadena = props.cadenasActivas[id].procesos

        setLoading(true)
        
        // ACTUALIZA CADA CHEQUE EN DB
        let chequesList = actualizarCheques(cadena[step].proveedor)
        
        // AGREGA CADA CHEQUE PERSONAL A LA LISTA 
        let chequesPersonalesList = agregarChequesPersonales()

        // FUNCIONES DE ESTRUCTURA
        const calcularDeudaActualizada = () =>{
            return props.proveedores[cadena[step].proveedor].datos.deuda + parseFloat(calcularAdeudado())
        }
        const calcularPagado = () =>{
            return total + totalChequesPersonales +(efectivo?parseFloat(efectivo):0) +(totalTransferencia?parseFloat(totalTransferencia):0)
        }     
        const calcularAdeudado = () =>{
            return precio - (total + totalChequesPersonales + (efectivo?parseFloat(efectivo):0) + (totalTransferencia?parseFloat(totalTransferencia):0))
        }        
        // ESTRUCTURA DE LA ENTREGA
        let aux={
                fecha:obtenerFecha(),
                proveedor:cadena[step].proveedor,
                articulos:[{
                    cantidad:cantidad,
                    precio:precio/cantidad,
                    producto:props.cadenasActivas[id].producto,
                    total:precio
                }],
                metodoDePago:{
                    facturacion:facturacion,
                    efectivo:efectivo?efectivo:null,
                    cuentaTransferencia:cuentaTransferencia?cuentaTransferencia:null,
                    totalTransferencia:totalTransferencia?totalTransferencia:null,
                    cheques:chequesList,
                    chequesPersonales:chequesPersonalesList,
                    totalChequesPersonales:totalChequesPersonales,
                    fecha:obtenerFecha(),
                    total:precio,
                    deudaPasada:props.proveedores[cadena[step].proveedor].datos.deuda,
                    deudaActualizada:calcularDeudaActualizada(),
                    pagado:calcularPagado(),
                    adeudado:calcularAdeudado()
                },
                metodoDeEnvio:'Particular',
                total:precio,
            }
        
        // ACTUALIZA LA DEUDA DEL PROVEEDOR
        actualizarDeuda(aux.total, aux.metodoDePago.pagado,cadena[step].proveedor)
       
        if(props.location.props.facturacion){
            aux.articulos = actualizarPrecios(aux.articulos)
        }


        // AGREGA LA ENTREGA A DB PARA OBTENER ID
        let idLink = database().ref().child(props.user.uid).child('proveedores').child(cadena[step].proveedor).child('entregas').push()
        
        // AGREGA LA FACTURA A LISTA DE COMPRAS
        agregarAListaDeCompras(aux,idLink.key)

        // MODELA Y AGREGA EL PAGO AL HISTORIAL
        agregarPagoAlHistorial(aux.metodoDePago,idLink.key,cadena[step].proveedor)
        
        // MODELA Y AGREGA LA TRANSFERENCIA A LOS MOVIMIENTOS BANCARIOS
        if(aux.metodoDePago.cuentaTransferencia){
            guardarTransferenciaBancaria(aux.metodoDePago.cuentaTransferencia,aux.metodoDePago.totalTransferencia)
        }

        // FEEDBACK DEL PROCESO
        setshowSnackbar('El Proceso Finalizo Correctamente')

        // ACTUALIZA LA CADENA DE PRODUCCION ACTIVA
        actualizarCadenaDeProduccion(id,step,aux.total,cantidad,idLink.key)

        // AUMENTAR PRDODUCTOS
        if(step==cadena.length-1){
            await aumentarProducto(id)
            await descontarSubproductos(id)
        }
        // ACTUALIZA DB ENVIANDO TODA LA INFO
        idLink.update(aux)
            .then(()=>{
                setTimeout(() => {
                    props.history.replace('/Cadenas-De-Produccion')
                    if(step==cadena.length-1){
                        database().ref().child(props.user.uid).child('cadenasActivas').child(id).remove()
                    }
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
    const aumentarProducto = async id =>{
        const producto = props.cadenasActivas[id].producto

        // AUMENTA LA CANTIDAD DE PRODUCTOS
        const nuevaCantidad = parseInt(props.productos[producto].cantidad)+parseInt(cantidad)
        await database().ref().child(props.user.uid).child('productos').child(producto).update({cantidad:nuevaCantidad})
        await database().ref().child(props.user.uid).child('productos').child(producto).child('historialDeStock').push({cantidad:nuevaCantidad,fecha:obtenerFecha()})
        
    }
    const descontarSubproductos = async id =>{
        const subproductos = props.productos[props.cadenasActivas[id].producto].subproductos

        // DESCUENTA LA CANTIDAD DE PRODUCTOS
        if(subproductos){
            subproductos.map(async subproducto=>{
                const nuevaCantidad = parseInt(props.productos[subproducto.nombre].cantidad)-(cantidad*subproducto.cantidad)
                await database().ref().child(props.user.uid).child('productos').child(subproducto.nombre).update({cantidad:nuevaCantidad})
                await database().ref().child(props.user.uid).child('productos').child(subproducto.nombre).child('historialDeStock').push({cantidad:nuevaCantidad,fecha:obtenerFecha()})
            })
        }
    }
    const actualizarCheques =(id) =>{
        let chequesList= []
        if(cheques.length){
            // RECORRE LA LISTA DE CHEQUES 
            cheques.map(cheque=>{
                // ACTUALIZA EL CHEQUE EN DB
                database().ref().child(props.user.uid).child('cheques').child(cheque).update({
                    destinatario:id,
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
    const actualizarDeuda = (totalPedido,totalRecibido,id) =>{
        const deudaPasada = props.proveedores[id].datos.deuda
        if(totalPedido>totalRecibido){
            database().ref().child(props.user.uid).child('proveedores').child(id).child('datos').update({deuda:(deudaPasada)+(totalPedido-totalRecibido)})
        }
        else{
            database().ref().child(props.user.uid).child('proveedores').child(id).child('datos').update({deuda:(deudaPasada)-(totalRecibido-totalPedido)})
        }
    }
    const agregarPagoAlHistorial = (pago,idLink,id) =>{
        let aux= {...pago,idEntrega:idLink}
        database().ref().child(props.user.uid).child('proveedores').child(id).child('pagos').push(aux)
    }
    const agregarAListaDeCompras = (entrega,idLink) =>{
        let aux=entrega
        aux['idEntrega']=idLink
        database().ref().child(props.user.uid).child('compras').push(aux)
    }
    const actualizarCadenaDeProduccion = (id,step,precio,cantidad,idEntrega) =>{
        let aux = props.cadenasActivas[id]
        aux.cantidad=cantidad
        aux.procesos[step].fechaDeEntrega=(obtenerFecha())
        aux.procesos[step].idEntrega=idEntrega
        aux.procesos[step].precio=precio
        if(step==aux.procesos.length-1){
            database().ref().child(props.user.uid).child('productos').child(aux.producto).child('historialDeCadenas').push(aux)
        }
        else{
            database().ref().child(props.user.uid).child('cadenasActivas').child(id).update(aux)
        }
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
        <Layout history={props.history} page='Finalizar Proceso' user={props.user.uid} blockGoBack={true}>
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
                                    {activeStep == 1?
                                        <Grid container item xs={12} justify='center'>
                                            <Paper elevation={3} variant='body1' className={classes.paperTotalRecibirEntrega}>
                                                <Grid item xs={12}>
                                                    <Typography variant='h6'>
                                                        Total $ {formatMoney( total + totalChequesPersonales +(efectivo?parseFloat(efectivo):0) + (totalTransferencia?parseFloat(totalTransferencia):0))} / $ {formatMoney(precio)}
                                                    </Typography>
                                                </Grid>
                                                <Grid container item xs={12} justify='center'>
                                                    <Chip label={`$ ${formatMoney( precio - ( total + totalChequesPersonales +(efectivo?parseFloat(efectivo):0) + (totalTransferencia?parseFloat(totalTransferencia):0)) )}`}/>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                        :
                                        null
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
                                                disabled={!cantidad || !precio}
                                                onClick={activeStep === steps.length - 1 ? finalizarProceso : handleNext}
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
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        productos:state.productos,
        proveedores:state.proveedores,
        cheques:state.cheques,
        cadenasActivas:state.cadenasActivas,
        cuentasBancarias:state.CuentasBancarias
    }
}
export default connect(mapStateToProps,null)(FinalizarEntrega)