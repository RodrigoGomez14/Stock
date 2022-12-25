import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {FormControl,InputLabel,Typography,TextField,Backdrop,Grid,CircularProgress,IconButton,Link as LinkComponent,Snackbar,Select,Input,TableCell,TableRow,TableHead,TableBody,Paper,Menu,MenuItem} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {PersonAdd} from '@material-ui/icons'
import {MoreVert,DeleteOutlineOutlined} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {CardPedido} from '../components/Pedidos/CardPedido'
import {database} from 'firebase'
import {formatMoney,obtenerFecha} from '../utilities'
import {DialogEntregarCheque} from '../components/Cheques/DialogEntregarCheque'
import {content} from './styles/styles'
import { Cheque } from '../components/Cheques/Cheque'


// COMPONENT
const Cheques=(props)=>{
    const classes = content()
    const [search,setSearch]=useState(props.location.search?props.location.search.slice(1):'')
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const [openDialog,setOpenDialog]=useState(false)

    // FUNCTIONS 

    const guardarChequeRebotado = id =>{
        setLoading(true)

        let valor = props.cheques[id].valor
        let cliente = props.cheques[id].nombre
        let destinatario = props.cheques[id].destinatario?props.cheques[id].destinatario:undefined


        // GUARDA EL MOVIMIENTO EN LA LISTA DE PAGOS DEL CLIENTE Y DEL PROVEEDOR
        guardarPago(cliente,id,destinatario)

        // ACTUALIZA DEUDA DE CLIENTE Y PROVEEDOR 
        actualizarDeuda(valor,cliente,destinatario)

        // ACTUALIZA EL CHEQUE EN LA DB
        database().ref().child(props.user.uid).child('cheques').child(id).update({
            dadoDeBaja:true
        })
        // FEEDBACK DEL PROCESO
        .then(()=>{
            setshowSnackbar('El cheque se dio de baja correctamente!')
            setTimeout(() => {
                setLoading(false)
                setshowSnackbar('')
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }

    const actualizarDeuda = (valor,nombre,destinatario) =>{
        
        // CLIENTE
        const nuevaDeudaCliente = props.clientes[nombre].datos.deuda+parseFloat(valor)
        database().ref().child(props.user.uid).child('clientes').child(nombre).child('datos').update({
            deuda:nuevaDeudaCliente
        })
        // SI EL CHEQUE FUE ENTREGADO SE ACTUALIZA LA DEUDA DEL PROVEEDOR
        if(destinatario){
            const nuevaDeudaProveedor = props.proveedores[destinatario].datos.deuda+parseFloat(valor)
            database().ref().child(props.user.uid).child('proveedores').child(`${destinatario}`).child('datos').update({
                deuda:nuevaDeudaProveedor
            })  
        }

    }
    
    const guardarPago = (cliente,cheque,destinatario) =>{

        // FUNCIONES DE ESTRUCTURA
        const calcularDeudaActualizada = type =>{
            if(type == 'cliente'){
                return getDeudaPasada(type) + parseFloat(props.cheques[cheque].valor)
            }
            else if(type == 'proveedor'){
                return getDeudaPasada(type) + parseFloat(props.cheques[cheque].valor)
            }
        }
        const getDeudaPasada = type =>{
            if(type == 'cliente'){
                return props.clientes[cliente].datos.deuda
            }
            else if(type == 'proveedor'){
                return props.proveedores[destinatario].datos.deuda

            }
        }
        // ESTRUCTURA DEL PAGO
        let aux={
            deudaPasada:getDeudaPasada('cliente'),
            deudaActualizada:calcularDeudaActualizada('cliente'),
            cheques:[props.cheques[cheque].numero],
            fecha:obtenerFecha(),
            total:-(props.cheques[cheque].valor),
        }
        // ACTUALIZA DB CLIENTE
        database().ref().child(props.user.uid).child('clientes').child(cliente).child('pagos').push(aux)
        
        // ACTUALIZA DB PROVEEDOR
        if(destinatario){
            aux.deudaPasada=getDeudaPasada('proveedor')
            aux.deudaActualizada=calcularDeudaActualizada('proveedor')
            database().ref().child(props.user.uid).child('proveedores').child(destinatario).child('pagos').push(aux)  
        }
    }
    
    const guardarEntregaDeCheque = (id,diaDeEnvio,destinatario) =>{
        setLoading(true)
        console.log(id,diaDeEnvio,destinatario) 
        database().ref().child(props.user.uid).child('cheques').child(id).update({
            diaDeEnvio:diaDeEnvio,
            destinatario:destinatario
        })
        .then(()=>{
            setshowSnackbar('El cheque se entrego correctamente!')
            setTimeout(() => {
                setLoading(false)
                setshowSnackbar('')
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }
    

    // VALIDACION DE BUSQUEDA PREVIA
    useEffect(()=>{
        if(props.history.location.search){
            setSearch(props.history.location.search.slice(1))
        }
    },[])

    return(
        <Layout history={props.history} page="Cheques" user={props.user.uid}>
            {/* CONTENT */}
            <Paper className={classes.content}>
                {/* CHEQUES TABLE */}
                <Grid container justify='center' alignItems='center' spacing={3}>
                    {/* SEARCH BAR */}
                    <Grid container item xs={12} justify='center' alignItems='center' >
                        <Grid item>
                            <TextField
                                value={search}
                                onChange={e=>{
                                    setSearch(e.target.value)
                                }}
                                disabled={!props.cheques}
                                label='Buscar Cheque'
                            />
                        </Grid>
                    </Grid>
                    {/* TABLE */}
                    <Grid container justify='center' alignItems='center' spacing={3}>
                        {props.cheques?
                            Object.keys(props.cheques).reverse().map((key,i)=>(
                                <Cheque cheque={props.cheques[key]} id={key} search={search} guardarChequeRebotado={guardarChequeRebotado}/>    
                            ))
                        :
                        <Typography variant='h5'>
                            Aun no hay ningun cheque ingresado
                        </Typography>
                    }
                    </Grid>
                </Grid>
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
// REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        cheques:state.cheques,
        clientes:state.clientes,
        proveedores:state.proveedores
    }
}
export default connect(mapStateToProps,null)(Cheques)