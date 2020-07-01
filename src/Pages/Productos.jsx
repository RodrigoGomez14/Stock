import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,DialogActions,Typography,TextField,Backdrop,Grid,CircularProgress,IconButton,Link as LinkComponent,Snackbar,Dialog,DialogTitle,DialogContent,Button} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {MoreVert,AddOutlined} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {CardProducto} from '../components/Productos/CardProducto'
import {database} from 'firebase'


const useStyles=makeStyles(theme=>({
    table:{
        marginTop:theme.spacing(1)
    },
    success:{
        marginLeft:theme.spacing(1),
        borderColor:theme.palette.success.main
    },
    danger:{
        marginLeft:theme.spacing(1),
        borderColor:theme.palette.danger.main
    },
    iconSuccess:{
        color:theme.palette.success.main,
    },
    iconDanger:{
        color:theme.palette.danger.main,
    },
    paperCliente:{
    },
    card:{
        minHeight:'180px',
        maxHeight:'300px'
    },
    link:{
        outline:'none',
        textDecoration:'none'
    },
    displayNone:{
        display:'none'
    },
    display:{
        display:'block'
    },
    container:{
        paddingTop:theme.spacing(1),
        paddingBottom:theme.spacing(1)
    },
    containerClientes:{
        height:'calc( 100vh - 128px )',
        overflow:'scroll'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}))
const Productos=(props)=>{
    const classes = useStyles()
    const [search,setSearch]=useState('')
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const [openDialog,setOpenDialog]=useState(false)

    const eliminarProducto = (key) =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('productos').child(key).remove()
        .then(()=>{
            setshowSnackbar('El producto se eliminó correctamente')
            setLoading(false)
        })
        .catch(()=>{
            setLoading(false)
        })
    }

    return(
        <Layout history={props.history} page="Productos" user={props.user.uid}>
            <Grid container justify='center' alignItems='center' className={classes.container}>
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
                <Grid container justify='center' alignItems='center' className={classes.container} >
                    {props.productos?
                        <Grid container item xs={12} sm={10} md={9} lg={8} spacing={2} alignItems='center'>
                            {Object.keys(props.productos).map(key=>(
                                <CardProducto 
                                    search={search} 
                                    precio={props.productos[key].precio} 
                                    cantidad={props.productos[key].cantidad}
                                    colores={props.productos[key].colores}
                                    name={key}
                                    eliminarProducto={()=>{eliminarProducto(key)}}
                                />
                            ))}
                        </Grid>
                        :
                        <Typography variant='h5'>
                            Aun no hay ningun producto ingresado
                        </Typography>
                    }
                </Grid>
            </Grid>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar open={Boolean(showSnackbar)} autoHideDuration={2000} onClose={()=>{setshowSnackbar('')}}>
                <Alert onClose={()=>{setshowSnackbar('')}} severity="success" variant='filled'>
                    {showSnackbar}
                </Alert>
            </Snackbar>
        </Layout>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        productos:state.productos
    }
}
export default connect(mapStateToProps,null)(Productos)