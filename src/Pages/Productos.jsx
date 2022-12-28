import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Paper,Typography,TextField,Backdrop,Grid,CircularProgress,IconButton,Snackbar} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {AddOutlined} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {CardProducto} from '../components/Productos/CardProducto'
import {database} from 'firebase'
import {content} from './styles/styles'
import {getProductosList,getSubproductosList,obtenerFecha} from '../utilities'
import firebase from 'firebase'

// COMPONENT
const Productos=(props)=>{
    const classes = content()
    const [search,setSearch]=useState(props.location.search.slice(1)?props.location.search.slice(1):'')
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const [openDialog,setOpenDialog]=useState(false)

    //FUNCTIONS
    const eliminarProducto = (key) =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('productos').child(key).remove()
        .then(()=>{
            setshowSnackbar('El producto se eliminó correctamente')
            setTimeout(() => {
                setLoading(false)
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }
    const iniciarCadena = (nombre) =>{
        setLoading(true)
        let aux = []
        aux.producto = nombre
        aux.fechaDeInicio = obtenerFecha()
        aux['procesos'] = []
        props.productos[nombre].cadenaDeProduccion.map(proceso=>{
            aux['procesos'].push(proceso)
            aux['procesos'][0].fechaDeInicio = obtenerFecha()
        })
        setLoading(true)
        firebase.database().ref().child(props.user.uid).child('cadenasActivas').push(aux)
        .then(()=>{
            setshowSnackbar('La cadena se inicio correctamente!!')
            setTimeout(() => {
                props.history.replace('/Cadenas-De-Produccion')
                setLoading(false)
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }
    return(
        <Layout history={props.history} page="Productos" user={props.user.uid}>
            <Paper className={classes.content}>
                <Grid container spacing={4}>

                    {/* SEARCH BAR */}
                    <Grid container item xs={12} justify='center' alignItems='center'>
                        <Grid container item xs={12} justify='center'>
                            <Typography variant='h5'>
                                Productos
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Link to={{
                                pathname:'/Nuevo-Producto'
                            }}>
                                <IconButton>
                                    <AddOutlined/>
                                </IconButton>
                            </Link>
                        </Grid>
                        <Grid item>
                            <TextField
                                value={search}
                                onChange={e=>{
                                    setSearch(e.target.value)
                                }}
                                disabled={!props.productos}
                                label='Buscar Producto'
                            />
                        </Grid>
                    </Grid>

                    {/* PRODUCT LIST */}
                    <Grid container item xs={12} justify='center' alignItems='center' spacing={2} >
                        {getProductosList(props.productos)?
                            (getProductosList(props.productos).map(producto=>(
                                <CardProducto 
                                    search={search} 
                                    precio={producto.precio} 
                                    cadenaDeProduccion={producto.cadenaDeProduccion} 
                                    isSubproducto={false}
                                    cantidad={producto.cantidad}
                                    subproductos={producto.subproductos?producto.subproductos:null}
                                    name={producto.nombre}
                                    eliminarProducto={()=>{eliminarProducto(producto.nombre)}}
                                    iniciarCadena={(i)=>{iniciarCadena(i)}}
                                    historialDeProduccion={producto.historialDeCadenas}
                                />)))
                            :
                            <Typography variant='h5'>
                                Aun no hay ningun producto ingresado
                            </Typography>
                        }
                    </Grid>

                    {/* SUBPRODUCT LIST */}
                    <Grid container item xs={12} justify='center' alignItems='center'>
                        <Grid container item xs={12} justify='center'>
                            <Typography variant='h5'>
                                Subproductos
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} justify='center' alignItems='center' spacing={2} >
                        {getSubproductosList(props.productos)?
                            (getSubproductosList(props.productos).map(subproducto=>(
                                <CardProducto 
                                    search={search}
                                    precio={subproducto.precio} 
                                    cadenaDeProduccion={subproducto.cadenaDeProduccion} 
                                    cantidad={subproducto.cantidad}
                                    name={subproducto.nombre}
                                    subproductos={subproducto.subproductos?subproducto.subproductos:null}
                                    eliminarProducto={()=>{eliminarProducto(subproducto.nombre)}}
                                    isSubproducto={true}
                                    iniciarCadena={(i)=>{iniciarCadena(i)}}
                                    historialDeProduccion={subproducto.historialDeCadenas}

                                />)))
                            :
                            <Typography variant='h5'>
                                Aun no hay ningun Subproducto ingresado
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

//REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        productos:state.productos,
    }
}
export default connect(mapStateToProps,null)(Productos)