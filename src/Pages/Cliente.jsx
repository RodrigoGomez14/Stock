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
import {content} from './styles/styles'
import {checkSearch} from '../utilities'

// COMPONENT
const Cliente=(props)=>{
    const classes = content()
    const [cliente,setCliente]= useState(props.clientes[checkSearch(props.history.location.search)])
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDialogConfirmDelete, setshowDialogConfirmDelete] = useState(false);
    const [searchPedido, setSearchPedido] = useState(props.location.props?props.location.props.searchPedido:'');


    // FUNCTIONS
    const eliminarCliente = () =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('clientes').child(cliente.datos.nombre).remove()
        .then(()=>{
            setshowSnackbar('El cliente ha sido eliminado!')
            setTimeout(() => {
                setLoading(false)
                props.history.replace('/Clientes')
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }
    const eliminarPedido = (id) =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('clientes').child(cliente.datos.nombre).child('pedidos').child(id).remove()
        .then(()=>{
            setshowSnackbar('El Pedido ha sido eliminado!')
            setTimeout(() => {
                setLoading(false)
                props.history.replace(`/Cliente?${props.history.location.search}`)
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }

    return(
        cliente?
            <Layout history={props.history} page={`${cliente.datos.nombre}`} user={props.user.uid}>
                {/* CONTENT */}
                <Paper className={classes.content}>
                    <Grid container justify='center' spacing={4}>
                        <Detalles {...cliente.datos}/>
                        <Deuda deuda={cliente.datos.deuda} id={cliente.datos.nombre}/>
                        <ListaDePedidos pedidos={cliente.pedidos} eliminarPedido={eliminarPedido} searchPedido={searchPedido}/>
                        <Grid item xs={12} sm={8}>
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

                {/* DIALOGS */}
                <DialogConfirmDelete open={showDialogConfirmDelete} setOpen={setshowDialogConfirmDelete} eliminarCliente={eliminarCliente}/>
            </Layout>
            :
            <>
                {props.history.replace('/Clientes')}
            </>
    )
}

// REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        clientes:state.clientes,
        photosList:state.photosList
    }
}
export default connect(mapStateToProps,null)(Cliente)