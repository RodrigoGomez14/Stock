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


//MENU DESPLEGABLE
const MenuCheque = ({guardarChequeRebotado,guardarEntregaDeCheque,disabledBaja,disabledEntrega,id}) =>{
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialogEntregarCheque, setopenDialogEntregarCheque] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return(
        <>  
            <DialogEntregarCheque open={openDialogEntregarCheque} setOpen={setopenDialogEntregarCheque} guardarEntregaDeCheque={guardarEntregaDeCheque} id={id}/>
            <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVert/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >  
                <MenuItem disabled={disabledBaja} onClick={()=>{guardarChequeRebotado()}}>Dar de baja</MenuItem>
                <MenuItem disabled={disabledEntrega}onClick={()=>{setopenDialogEntregarCheque(true)}}>Entregar Cheque</MenuItem>
            </Menu>
        </>
    )
}

// COMPONENT
const Cheques=(props)=>{
    const classes = content()
    const [search,setSearch]=useState('')
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const [openDialog,setOpenDialog]=useState(false)

    // FUNCTIONS 
    const eliminarCheque = (id) =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('pedidos').child(id).remove()
            .then(()=>{
                setshowSnackbar('El pedido se eliminó correctamente!')
                setTimeout(() => {
                    setLoading(false)
                    setshowSnackbar('')
                }, 2000);
            })
            .catch(()=>{
                setLoading(false)
            })
    }
    const guardarPago = (cliente,cheque) =>{
        let aux={
            cheques:[props.cheques[cheque].numero],
            fecha:obtenerFecha(),
            total:-(props.cheques[cheque].valor),
        }
        let pagos = []
        if(props.clientes[cliente].pagos){
            pagos=props.clientes[cliente].pagos
        }
        pagos.push(aux)
        database().ref().child(props.user.uid).child('clientes').child(cliente).update({
            pagos:pagos
        })
    }
    const actualizarDeuda = (valor,nombre,cheque) =>{
        let nuevaDeuda = props.clientes[nombre].datos.deuda
        nuevaDeuda+=parseFloat(valor)
        console.log(nuevaDeuda,nombre)
        database().ref().child(props.user.uid).child('clientes').child(nombre).child('datos').update({
            deuda:nuevaDeuda
        })
        guardarPago(nombre,cheque)
    }
    const guardarChequeRebotado = id =>{
        setLoading(true)
        actualizarDeuda(props.cheques[id].valor,props.cheques[id].nombre,id)
        database().ref().child(props.user.uid).child('cheques').child(id).update({
            dadoDeBaja:true
        })
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
                                <Link 
                                    to='/Nuevo-Cheque'>
                                    <IconButton>
                                        <PersonAdd/>
                                    </IconButton>
                                </Link>
                        </Grid>
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
                                <Cheque cheque={props.cheques[key]}  search={search}/>    
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
        clientes:state.clientes
    }
}
export default connect(mapStateToProps,null)(Cheques)