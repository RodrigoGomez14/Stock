import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,Grid,List,Typography,IconButton,Backdrop,Snackbar,CircularProgress} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {EditOutlined,DeleteOutline} from '@material-ui/icons'
import {Deuda} from '../components/Cliente/Deuda'
import {ListaDePedidos} from '../components/Cliente/ListaDePedidos'
import {Detalles} from '../components/Cliente/Detalles'
import {DialogConfirmDelete} from '../components/Cliente/DialogConfirmDelete'
import {database} from 'firebase'
import {Link} from 'react-router-dom'


const useStyles=makeStyles(theme=>({
    container:{
        paddingTop:theme.spacing(1),
    },
    table:{
        marginTop:theme.spacing(1)
    },
    success:{
        marginLeft:theme.spacing(1),
        color:theme.palette.success.main,
        borderColor:theme.palette.success.main
    },
    danger:{
        marginLeft:theme.spacing(1),
        color:theme.palette.danger.main,
        borderColor:theme.palette.danger.main
    },
    grid:{
        display:'flex',
        flexDirection:'column',
        padding:theme.spacing(1),
        height:'calc(100vh - 100px)',
    },
    pedidos:{
        marginTop:theme.spacing(2)
    },
    grow:{
        flexGrow:1
    },
    textWhite:{
        color:theme.palette.primary.contrastText
    },
    pedidosContainer:{
        flexGrow:1
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
}))
const Cliente=(props)=>{
    const classes = useStyles()
    const [cliente,setCliente]= useState(props.clientes[props.history.location.search.slice(1)])
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDialogConfirmDelete, setshowDialogConfirmDelete] = useState(false);

    const eliminarCliente = () =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('clientes').child(cliente.datos.nombre).remove()
        .then(()=>{
            setshowSnackbar('El cliente ha sido eliminado!')
            setTimeout(() => {
                props.history.replace('/Clientes')
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }
    const eliminarPedido = (id) =>{
        console.log('eliminar')
        setLoading(true)
        database().ref().child(props.user.uid).child('clientes').child(cliente.datos.nombre).child('pedidos').child(id).remove()
        .then(()=>{
            setshowSnackbar('El Pedido ha sido eliminado!')
            setTimeout(() => {
                setshowSnackbar(false)
                setLoading(false)
                props.history.replace(`/Cliente${props.history.location.search}`)
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }

    useEffect(()=>{
        setCliente(props.clientes[props.history.location.search.slice(1)])
    })

    return(
        cliente?
            <Layout history={props.history} page={`${cliente.datos.nombre}`} user={props.user.uid}>
                <Grid container justify='center' className={classes.container} >
                    <Grid item xs={12} sm={11} md={4}>
                        <Grid container justify='center'>
                            <Detalles {...cliente.datos}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={8} className={classes.grid}>
                        <Grid container justify='center'>
                            <Deuda deuda={cliente.datos.deuda} id={cliente.datos.nombre}/>
                        </Grid>
                        <Grid container justify='center' alignItems='center' className={classes.pedidosContainer}>
                                {cliente.pedidos?
                                    <>
                                        <Grid item xs={12} justify='center'>
                                            <Typography className={classes.textWhite} variant='body2'>
                                                Lista de Pedidos
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} className={classes.pedidos}>
                                            <ListaDePedidos pedidos={cliente.pedidos} eliminarPedido={eliminarPedido}/>
                                        </Grid>
                                    </>
                                    :
                                    <Grid container item xs={12} justify='center'>
                                        <Typography className={classes.textWhite} variant='h6'>
                                            El cliente no hizo ningun pedido
                                        </Typography>
                                    </Grid>
                                }
                        </Grid>
                        <Grid container item xs={12} justify='space-around' alignItems='flex-end'>
                            <Link to={{
                                pathname: '/Editar-Cliente',
                                search:cliente.datos.nombre
                            }}>
                                <IconButton>
                                    <EditOutlined/>
                                </IconButton>
                            </Link>
                            <IconButton onClick={()=>{setshowDialogConfirmDelete(true)}}>
                                <DeleteOutline color='error'/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Backdrop className={classes.backdrop} open={loading}>
                    {showSnackbar?
                        <Snackbar open={Boolean(showSnackbar)} autoHideDuration={2000} onClose={()=>{setshowSnackbar('')}}>
                            <Alert onClose={()=>{setshowSnackbar('')}} severity="success" variant='filled'>
                                {showSnackbar}
                            </Alert>
                        </Snackbar>
                        :
                        <CircularProgress color="inherit" />
                    }
                </Backdrop>
                <DialogConfirmDelete open={showDialogConfirmDelete} setOpen={setshowDialogConfirmDelete} eliminarCliente={eliminarCliente}/>
            </Layout>
            :
            <>
                {props.history.replace('/Clientes')}
            </>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        clientes:state.clientes
    }
}
export default connect(mapStateToProps,null)(Cliente)