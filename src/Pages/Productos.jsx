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

// COMPONENT
const Productos=(props)=>{
    const classes = content()
    const [search,setSearch]=useState('')
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

                    {/* PRODUCT LIST */}
                    <Grid container item xs={12} justify='center' alignItems='center' spacing={2} >
                        {props.productos?
                            (Object.keys(props.productos).map(key=>(
                                <CardProducto 
                                    search={search} 
                                    precio={props.productos[key].precio} 
                                    cantidad={props.productos[key].cantidad}
                                    subproductos={props.productos[key].subproductos}
                                    name={key}
                                    eliminarProducto={()=>{eliminarProducto(key)}}
                                />)))
                            :
                            <Typography variant='h5'>
                                Aun no hay ningun producto ingresado
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
        productos:state.productos
    }
}
export default connect(mapStateToProps,null)(Productos)