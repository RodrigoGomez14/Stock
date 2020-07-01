import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,DialogActions,Typography,TextField,Backdrop,Grid,CircularProgress,IconButton,Link as LinkComponent,Snackbar,Dialog,DialogTitle,DialogContent,Button} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {MoreVert,AddOutlined} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {CardEntrega} from '../components/Entregas/CardEntrega'
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
    containerproveedores:{
        height:'calc( 100vh - 128px )',
        overflow:'scroll'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}))
const Entregas=(props)=>{
    const classes = useStyles()
    const [search,setSearch]=useState('')
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const [openDialog,setOpenDialog]=useState(false)

    const eliminarEntrega = (id) =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('entregas').child(id).remove()
            .then(()=>{
                setshowSnackbar('La entrega se eliminó correctamente!')
                setTimeout(() => {
                    setLoading(false)
                    setshowSnackbar('')
                }, 2000);
            })
            .catch(()=>{
                setLoading(false)
            })
    }

    return(
        <Layout history={props.history} page="Entregas" user={props.user.uid}>
            <Grid container justify='center' alignItems='center' className={classes.container} >
                <Grid container justify='center' alignItems='center' className={classes.container} >
                    {props.entregas?
                        <Grid item xs={12} sm={10} md={9} lg={8}>
                            <Grid container justify='space-around'  alignItems='center' spacing={1}>
                                {Object.keys(props.entregas).map(key=>(
                                    <CardEntrega
                                        entrega={props.entregas[key]}
                                        deuda={props.proveedores[props.entregas[key].proveedor].datos.deuda}
                                        id={key}
                                        eliminarEntrega={()=>{eliminarEntrega(key)}}
                                    />
                                ))}
                            </Grid>
                        </Grid>
                        :
                        <Typography variant='h5'>
                            Aun no hay ninguna entrega ingresada
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
        entregas:state.entregas,
        productos:state.productos,
        proveedores:state.proveedores
    }
}
export default connect(mapStateToProps,null)(Entregas)