import React,{useState,useEffect} from 'react'
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
import {content} from './styles/styles'
import { checkSearch } from '../utilities'

// COMPONENT
const Proveedor=(props)=>{
    const classes = content()
    const [proveedor,setProveedor]= useState(props.proveedores[checkSearch(props.history.location.search)])
    const [showSnackbar, setshowSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchEntrega, setSearchEntrega] = useState(props.location.props?props.location.props.searchEntrega:'');
    const [showDialogConfirmDelete, setshowDialogConfirmDelete] = useState(false);

    // FUNCTIONS
    const eliminarProveedor = () =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('proveedores').child(proveedor.datos.nombre).remove()
        .then(()=>{
            setshowSnackbar('El Proveedor Se Elimino Correctamente')
            setTimeout(() => {
                setLoading(false)
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
        props.history.replace('/Proveedores')
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
                {/* CONTENT */}
                <Paper className={classes.content}>
                    <Grid container justify='center' spacing={4}>
                        <Detalles {...proveedor.datos}/>
                        <Deuda deuda={proveedor.datos.deuda} id={proveedor.datos.nombre}/>
                        <ListaDePedidos pedidos={proveedor.entregas} eliminarPedido={eliminarPedido} searchPedido={searchEntrega}/>
                        <Grid item xs={12} sm={8}>
                            <Grid container item xs={12} justify='space-around' alignItems='flex-end'>
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
                </Paper>
                {/* BACKDROP */}
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