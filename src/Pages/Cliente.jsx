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
    const [loading, setLoading] = useState(true);
    const [showDialogConfirmDelete, setshowDialogConfirmDelete] = useState(false);
    const [searchPedido, setSearchPedido] = useState(props.location.props?props.location.props.searchPedido:'');
    const [searchRemito, setSearchRemito] = useState(props.location.props?props.location.props.remito:'');

    const [filteredPedidos,setFilteredPedidos] = useState(undefined)

    // FILTRADO DE INFORMACION 
    useEffect(()=>{
        const years = {};
        const keyCliente = checkSearch(props.location.search)
        if(props.clientes[keyCliente].pedidos){
            Object.keys(props.clientes[keyCliente].pedidos).reverse().forEach((pedido) => {
                const year = props.clientes[keyCliente].pedidos[pedido].fecha.split('/')[2];
                const month = props.clientes[keyCliente].pedidos[pedido].fecha.split('/')[1];
            
                // Si aún no tenemos el año en el objeto "years", lo agregamos
                if (!years[year]) {
                years[year] = { total: 0, months: {} };
                }
            
                // Si aún no tenemos el mes en el objeto "months", lo agregamos
                if (!years[year].months[month]) {
                years[year].months[month] = { total: 0, pedidos: [] };
                }
            
                // Agregamos la compra al objeto "compras" del mes correspondiente
                years[year].months[month].pedidos.push(props.clientes[keyCliente].pedidos[pedido]);
            
                // Actualizamos el total del mes y del año
                years[year].months[month].total += parseInt(props.clientes[keyCliente].pedidos[pedido].total, 10);
                years[year].total += parseInt(props.clientes[keyCliente].pedidos[pedido].total, 10);
            });
    
            const sortedPedidos = Object.entries(years).sort(([year1], [year2]) => year2 - year1);
    
            setFilteredPedidos(sortedPedidos)
        }
        setTimeout(() => {
            setLoading(false)
        }, 500);
    },[props.clientes])

    // FUNCTIONS
    const eliminarCliente = () =>{
        setLoading(true)
        const ref = database().ref().child(props.user.uid).child('clientes').child(cliente.datos.nombre).remove()
        .then(()=>{
            setshowSnackbar('El cliente ha sido eliminado!')
            setTimeout(() => {
                setLoading(false)
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
        props.history.replace('/Clientes')
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
                        <ListaDePedidos pedidos={filteredPedidos} eliminarPedido={eliminarPedido} searchPedido={searchPedido} searchRemito={searchRemito} tipo='pedido'/>
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