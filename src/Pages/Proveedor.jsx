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

    const [filteredEntregas,setFilteredEntregas] = useState(undefined)

    // FILTRADO DE INFORMACION 
    useEffect(()=>{
        setLoading(true)
        const years = {};
        const keyProveedor = checkSearch(props.location.search)
        if(props.proveedores[keyProveedor].entregas){
            Object.keys(props.proveedores[keyProveedor].entregas).reverse().forEach((entrega) => {
                const year = props.proveedores[keyProveedor].entregas[entrega].fecha.split('/')[2];
                const month = props.proveedores[keyProveedor].entregas[entrega].fecha.split('/')[1];
            
                // Si aún no tenemos el año en el objeto "years", lo agregamos
                if (!years[year]) {
                years[year] = { total: 0, months: {} };
                }
            
                // Si aún no tenemos el mes en el objeto "months", lo agregamos
                if (!years[year].months[month]) {
                years[year].months[month] = { total: 0, entregas: [] };
                }
            
                // Agregamos la compra al objeto "compras" del mes correspondiente
                years[year].months[month].entregas.push(props.proveedores[keyProveedor].entregas[entrega]);
            
                // Actualizamos el total del mes y del año
                years[year].months[month].total += parseInt(props.proveedores[keyProveedor].entregas[entrega].total, 10);
                years[year].total += parseInt(props.proveedores[keyProveedor].entregas[entrega].total, 10);
            });
    
            const sortedEntregas = Object.entries(years).sort(([year1], [year2]) => year2 - year1);
            setFilteredEntregas(sortedEntregas)
        }
        setTimeout(() => {
            setLoading(false)
        }, 500);
    },[props.proveedores])

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
                        <ListaDePedidos pedidos={filteredEntregas} eliminarPedido={eliminarPedido} searchPedido={searchEntrega} tipo='entrega'/>
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