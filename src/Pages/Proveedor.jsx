import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,Grid,List,Typography,IconButton,Backdrop,Snackbar,CircularProgress} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {EditOutlined,DeleteOutline} from '@material-ui/icons'
import {Deuda} from '../components/Proveedor/Deuda'
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
const Proveedor=(props)=>{
    const classes = useStyles()
    const [proveedor,setProveedor]= useState(props.proveedores[props.history.location.search.slice(1)])
    const [showSnackbar, setshowSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDialogConfirmDelete, setshowDialogConfirmDelete] = useState(false);

    const eliminarProveedor = () =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('proveedores').child(proveedor.datos.nombre).remove()
        .then(()=>{
            setshowSnackbar(true)
            setTimeout(() => {
                props.history.replace('/Proveedores')
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }

    const eliminarPedido = (id) =>{
        setLoading(true)
        database().ref(`${props.user.uid}/proveedores/${proveedor.datos.nombre}/pedidos/${id}`).remove()
        .then(()=>{
            setshowSnackbar(true)
            setTimeout(() => {
                setshowSnackbar(false)
                setLoading(false)
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }
    return(
        proveedor?
            <Layout history={props.history} page={`${proveedor.datos.nombre}`} user={props.user.uid}>
                <Grid container justify={{xs:'left',sm:'center'}} alignItems='center' className={classes.container} >
                    <Grid item xs={4}>
                        <Grid container>
                            <Detalles {...proveedor.datos}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={8} className={classes.grid}>
                        <Grid container justify='center'>
                            <Deuda deuda={proveedor.datos.deuda} id={proveedor.datos.nombre}/>
                        </Grid>
                        <Grid container justify='center' alignItems='center' className={classes.pedidosContainer}>
                            <Grid item xs={12} justify='center'>
                                <Typography className={classes.textWhite} variant='body2'>
                                    Lista de Entregas
                                </Typography>
                            </Grid>
                                {proveedor.entregas?
                                    <Grid item xs={12} className={classes.pedidos}>
                                        <ListaDePedidos pedidos={proveedor.entregas} eliminarPedido={eliminarPedido}/>
                                    </Grid>
                                    :
                                    <Grid item xs={12} justify='center'>
                                        <Typography className={classes.textWhite} variant='h6'>
                                            El proveedor no hizo ninguna entrega
                                        </Typography>
                                    </Grid>
                                }
                        </Grid>
                        <Grid container justify='space-around'>
                            <Link to={{
                                pathname: '/Editar-Proveedor',
                                search:proveedor.datos.nombre
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
                        <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={()=>{setshowSnackbar(false)}}>
                            <Alert onClose={()=>{setshowSnackbar(false)}} severity="error" variant='filled'>
                                El Proveedor ha sido eliminado!
                            </Alert>
                        </Snackbar>
                        :
                        <CircularProgress color="inherit" />
                    }
                </Backdrop>
                <DialogConfirmDelete open={showDialogConfirmDelete} setOpen={setshowDialogConfirmDelete} eliminarCliente={eliminarProveedor}/>
            </Layout>
            :
            <>
                {props.history.replace('/Proveedores')}
            </>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        proveedores:state.proveedores
    }
}
export default connect(mapStateToProps,null)(Proveedor)