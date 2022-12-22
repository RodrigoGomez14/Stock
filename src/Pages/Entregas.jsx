import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Typography,Backdrop,Grid,CircularProgress,Snackbar,Paper} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {Link} from 'react-router-dom'
import {CardEntrega} from '../components/Entregas/CardEntrega'
import {database} from 'firebase'
import {content} from './styles/styles'
import Empty from '../images/Empty.png'

//COMPONENT
const Entregas=(props)=>{
    const classes = content()
    const [search,setSearch]=useState('')
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const [openDialog,setOpenDialog]=useState(false)

    //FUNCTIONS
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
            {/* CONTENT */}
            <Paper className={classes.content}>
                {/* ENTREGAS LIST */}
                <Grid container justify='center' alignItems='center' spacing={3}>
                    {props.entregas?
                        (Object.keys(props.entregas).map(key=>(
                            <>
                            <CardEntrega
                                entrega={props.entregas[key]}
                                deuda={props.proveedores[props.entregas[key].proveedor].datos.deuda}
                                id={key}
                                eliminarEntrega={()=>{eliminarEntrega(key)}}
                            />
                            </>
                        )))
                        :
                        <>
                            <Grid item>
                                <img src={Empty} alt="" height='600px'/>
                            </Grid>
                            <Grid container item xs={12} justify='center'>
                                <Typography variant='h4'>No hay Entregas Ingresadas</Typography>
                            </Grid>
                        </>
                    }
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

// REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        entregas:state.entregas,
        productos:state.productos,
        proveedores:state.proveedores
    }
}
export default connect(mapStateToProps,null)(Entregas)