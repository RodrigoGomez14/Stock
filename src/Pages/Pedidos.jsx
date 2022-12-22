import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Typography,Backdrop,Grid,CircularProgress,Snackbar,Paper} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {CardPedido} from '../components/Pedidos/CardPedido'
import {database} from 'firebase'
import {content} from './styles/styles'
import Empty from '../images/Empty.png'
// COMPONENT
const Pedidos=(props)=>{
    const classes = content()
    const [search,setSearch]=useState('')
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const [openDialog,setOpenDialog]=useState(false)

    // FUNTIONS
    const eliminarPedido = (id) =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('pedidos').child(id).remove()
            .then(()=>{
                setshowSnackbar('El pedido se eliminó correctamente!')
                setTimeout(() => {
                    setLoading(false)
                }, 2000);
            })
            .catch(()=>{
                setLoading(false)
            })
    }

    return(
        <Layout history={props.history} page="Pedidos" user={props.user.uid}>
            {/* CONTENT */}
            <Paper className={classes.content}>
                {/* PEDIDOS LIST */}
                <Grid container justify='center' alignItems='center' spacing={3}>
                    {props.pedidos?
                        (Object.keys(props.pedidos).map(key=>(
                            <CardPedido
                                pedido={props.pedidos[key]}
                                deuda={props.clientes[props.pedidos[key].cliente].datos.deuda}
                                id={key}
                                eliminarPedido={()=>{eliminarPedido(key)}}
                            />
                        )))
                        :
                        <>
                            <Grid item>
                                <img src={Empty} alt="" height='600px'/>
                            </Grid>
                            <Grid container item xs={12} justify='center'>
                                <Typography variant='h4'>No hay Pedidos Ingresados</Typography>
                            </Grid>
                        </>
                    }
                </Grid>

                {/* BACKDROP & SNACKBAR */}
                <Backdrop className={classes.backdrop} open={loading}>
                    <CircularProgress color="inherit" />
                    <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={()=>{setshowSnackbar('')}}>
                        <Alert severity="success" variant='filled'>
                            {showSnackbar}
                        </Alert>
                    </Snackbar>
                </Backdrop>
            </Paper>
        </Layout>
    )
}

// REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        pedidos:state.pedidos,
        productos:state.productos,
        clientes:state.clientes
    }
}
export default connect(mapStateToProps,null)(Pedidos)