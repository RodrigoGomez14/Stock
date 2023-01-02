import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Paper,Typography,TextField,Backdrop,Grid,CircularProgress,IconButton,Snackbar,Tab,Box,AppBar,Tabs} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {AddOutlined} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {CardProducto} from '../components/Productos/CardProducto'
import {database} from 'firebase'
import {content} from './styles/styles'
import {getProductosList,getSubproductosList,obtenerFecha} from '../utilities'
import firebase from 'firebase'
import Empty from '../images/Empty.png'
// COMPONENT
const Productos=(props)=>{
    const classes = content()
    const [search,setSearch]=useState(props.location.search.slice(1)?props.location.search.slice(1):'')
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const [openDialog,setOpenDialog]=useState(false)
    const [value,setValue]=useState(0)

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


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const TabPanel=(props)=>{
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            className={classes.tabPanelDeuda}
            hidden={value !== index}
          >
            {value === index && (
              <Box p={3}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        )
    }

    return(
        <Layout history={props.history} page="Productos" user={props.user.uid}>
            <Paper className={classes.content}>
                <Grid container spacing={4}>

                    {/* SEARCH BAR */}
                    <Grid container item xs={12} justify='center' alignItems='center'>
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
                    
                    <Grid container item xs={12} justify='center'>
                        <Grid item>
                            <AppBar position="static">
                                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                                    <Tab label="Productos" />
                                    <Tab label="Subproductos" />
                                </Tabs>
                            </AppBar>
                        </Grid>
                    </Grid>

                    {/* PRODUCT LIST */}
                    <TabPanel value={value}  index={0}>
                        <Grid container item xs={12} justify='center' alignItems='center' spacing={2} >
                            {getProductosList(props.productos).length>=1?
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
                                <>
                                    <Grid item>
                                        <img src={Empty} alt="" height='500px'/>
                                    </Grid>
                                    <Grid container item xs={12} justify='center'>
                                        <Typography variant='h4'>No hay Productos Ingresados</Typography>
                                    </Grid>
                                </>
                            }
                        </Grid>
                    </TabPanel>
                    {/* SUBPRODUCT LIST */}
                    <TabPanel value={value}  index={1}>
                        <Grid container item xs={12} justify='center' alignItems='center' spacing={2} >
                            {getSubproductosList(props.productos).length>=1?
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
                                <>
                                    <Grid item>
                                        <img src={Empty} alt="" height='500px'/>
                                    </Grid>
                                    <Grid container item xs={12} justify='center'>
                                        <Typography variant='h4'>No hay Subproductos Ingresados</Typography>
                                    </Grid>
                                </>
                            }
                        </Grid>
                    </TabPanel>

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