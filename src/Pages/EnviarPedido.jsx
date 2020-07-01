import React,{useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,ListItem,Card,Button,StepContent,Backdrop,StepLabel,Typography,Step,Stepper,Snackbar,CircularProgress} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import {Step as StepComponent} from '../components/Enviar-Pedido/Step'
import {database} from 'firebase'
import {formatMoney} from '../utilities'
import {Redirect} from 'react-router-dom'
const useStyles=makeStyles(theme=>({
    root:{
        height:'100%',
        width:'100%',
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-start',
        backgroundColor:theme.palette.type==='dark'?theme.palette.secondary.main:theme.palette.primary.dark,
        borderRadius:'0',
        overflow:'auto',
    },
    table:{
        marginTop:theme.spacing(1)
    },
    success:{
        marginLeft:theme.spacing(1),
        borderColor:theme.palette.success.main
    },
    danger:{
        marginLeft:theme.spacing(1),
        borderColor:theme.palette.danger.main
    },
    iconSuccess:{
        color:theme.palette.success.main,
    },
    iconDanger:{
        color:theme.palette.danger.main,
    },
    paperCliente:{
    },
    cardContent:{
        padding:0,
        height:'100%',
        textAlign:'center',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-around',
    },
    card:{
        height:'150px',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'

    },
    link:{
        outline:'none',
        textDecoration:'none'
    },
    displayNone:{
        display:'none'
    },
    display:{
        display:'block'
    },
    paper:{
        marginTop:theme.spacing(1),
        marginBottom:theme.spacing(2),
        padding:theme.spacing(2),
        display:'flex',
        flexDirection:'column',
    },
    input:{
        marginTop:theme.spacing(1)
    },
    stepper:{
        backgroundColor:'transparent'
    },
    textAlignCenter:{
        textAlign:'center'
    },
    margin:{
        marginTop:theme.spacing(1),
        marginBottom:theme.spacing(1),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    flex:{
        flex:1,
        display:'flex',
        justifyContent:'flex-end'
    },
    button:{
        marginLeft:theme.spacing(2)
    },
    paperTotal:{
        padding:theme.spacing(1),
        marginBottom:theme.spacing(1)
    }
}))

function getSteps() {
    return ['Metodo De Pago', 'Metodo De Envio'];
  }
  
  
  const EnviarPedido=(props)=>{
    const classes = useStyles()
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
                tipoDeDato='Metodo De Pago'
                total={total}
                settotal={settotal}
                nombre={props.pedidos[props.history.location.search.slice(1)].cliente}
            />
          );
        case 1:
          return (
                <StepComponent
                    expresosList={props.expresos}
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
      }
    }
    const obtenerFecha = () =>{
        let meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
        let diasSemana = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]
        var f=new Date()
        return `${diasSemana[f.getDay()]} ${f.getDate()} de ${meses[f.getMonth()]} de ${f.getFullYear()}`
    }
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
            fecha:obtenerFecha(),
            articulos:props.pedidos[id].productos,
            metodoDePago:{
                efectivo:efectivo?efectivo:null,
                cheques:chequesList,
                fecha:(efectivo||total?obtenerFecha():null),
                total:((efectivo?parseFloat(efectivo):0)+total)?((efectivo?parseFloat(efectivo):0)+total):null,
                deudaPasada:props.clientes[props.pedidos[id].cliente].datos.deuda,
            },
            metodoDeEnvio:expreso?{expreso:expreso,remito:remito,precio:precio}:'Particular',
            total:props.history.location.props.total + (sumarEnvio?parseFloat(precio):0)
        }
        actualizarDeuda(aux.total, total + (efectivo?parseFloat(efectivo):0) )
        agregarPagoAlHistorial(aux.metodoDePago)
        database().ref().child(props.user.uid).child('clientes').child(props.pedidos[id].cliente).child('pedidos').push(aux)
            .then(()=>{
                setshowSnackbar('El pedido se agregó correctamente!')
                setTimeout(() => {
                    database().ref().child(props.user.uid).child('pedidos').child(id).remove().then(()=>{
                        props.history.replace('/Pedidos')
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
                const nuevaCantidad = props.productos[articulo.producto].cantidad-articulo.cantidad
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
    const agregarPagoAlHistorial = pago =>{
        const id = props.history.location.search.slice(1)
        if((efectivo?parseFloat(efectivo):0)+total){
            let newPagos = props.clientes[props.pedidos[id].cliente].pagos?props.clientes[props.pedidos[id].cliente].pagos:[]
            newPagos.push(pago)
            database().ref().child(props.user.uid).child('clientes').child(props.pedidos[id].cliente).child('pagos').update(newPagos)
        }
    }
    return(
        props.history.location.props?
            <Layout history={props.history} page='Enviar Pedido' user={props.user.uid} blockGoBack={true}>
                <Stepper orientation='vertical' activeStep={activeStep} className={classes.stepper}>
                    {steps.map((label,index)=>(
                        <Step>
                            <StepLabel>
                                {label}
                            </StepLabel>
                            <StepContent>
                                {getStepContent(index)}
                                <div className={classes.margin}>
                                    <Paper elevation={3} variant='body1' className={classes.paperTotal}>
                                        <Typography variant='h6'>
                                            Total $ {formatMoney( parseFloat(props.history.location.props.total) + (sumarEnvio?precio?parseFloat(precio):0:0 ) ) } / $ {formatMoney( total + (efectivo?parseFloat(efectivo):0))}
                                        </Typography>
                                    </Paper>
                                    <Button
                                        disabled={activeStep===0}
                                        onClick={handleBack}
                                    >
                                        Volver
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={activeStep === steps.length - 1 ? enviarPedido : handleNext}
                                    >
                                        {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                                    </Button>
                                </div>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                <Backdrop className={classes.backdrop} open={loading}>
                    {showSnackbar?
                        <Snackbar open={Boolean} autoHideDuration={2000} onClose={()=>{setshowSnackbar('')}}>
                            <Alert onClose={()=>{setshowSnackbar('')}} severity="success" variant='filled'>
                                {showSnackbar}
                            </Alert>
                        </Snackbar>
                        :
                        <CircularProgress color="inherit" />
                    }
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