import React,{useState} from 'react'
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


const useStyles=makeStyles(theme=>({
    container:{
        paddingTop:theme.spacing(1),
    },
    table:{
        marginTop:theme.spacing(1)
    },
    success:{
        marginLeft:theme.spacing(1),
        color:theme.palette.success.main,
        borderColor:theme.palette.success.main
    },
    danger:{
        marginLeft:theme.spacing(1),
        color:theme.palette.danger.main,
        borderColor:theme.palette.danger.main
    },
    grid:{
        display:'flex',
        flexDirection:'column',
        padding:theme.spacing(1),
        height:'calc(100vh - 100px)',
    },
    pedidos:{
        marginTop:theme.spacing(2)
    },
    grow:{
        flexGrow:1
    },
    textWhite:{
        color:theme.palette.primary.contrastText
    },
    pedidosContainer:{
        flexGrow:1
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}))
const Expreso=(props)=>{
    const classes = useStyles()
    const [expreso,setExpreso]= useState(props.expresos[props.history.location.search.slice(1)])
    const [showSnackbar, setshowSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDialogConfirmDelete, setshowDialogConfirmDelete] = useState(false);

    const eliminarExpreso = () =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('expresos').child(expreso.datos.nombre).remove()
        .then(()=>{
            setshowSnackbar(true)
            setTimeout(() => {
                props.history.replace('/Expresos')
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }
    console.log(props.expresos)
    console.log(props.history.location.search.slice(1))
    return(
        expreso?
            <Layout history={props.history} page={`${expreso.datos.nombre}`} user={props.user.uid}>
                <Grid container justify={{xs:'left',sm:'center'}} alignItems='flex-end' className={classes.container} >
                    <Grid item xs={12} sm={8} md={4}>
                        <Grid container>
                            <Detalles {...expreso.datos}/>
                        </Grid>
                    </Grid>
                    <Grid item sm={4} md={8} container justify='space-around'>
                        <Link to={{
                            pathname: '/Editar-Expreso',
                            search:expreso.datos.nombre
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
                <Backdrop className={classes.backdrop} open={loading}>
                    {showSnackbar?
                        <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={()=>{setshowSnackbar(false)}}>
                            <Alert onClose={()=>{setshowSnackbar(false)}} severity="error" variant='filled'>
                                El expreso ha sido eliminado!
                            </Alert>
                        </Snackbar>
                        :
                        <CircularProgress color="inherit" />
                    }
                </Backdrop>
                <DialogConfirmDelete open={showDialogConfirmDelete} setOpen={setshowDialogConfirmDelete} eliminarCliente={eliminarExpreso}/>
            </Layout>
            :
            <>
                {props.history.replace('/Expresos')}
            </>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        expresos:state.expresos
    }
}
export default connect(mapStateToProps,null)(Expreso)