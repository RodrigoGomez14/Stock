import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,Grid,List,Typography,IconButton,Backdrop,Snackbar,CircularProgress} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {EditOutlined,DeleteOutline} from '@material-ui/icons'
import {Deuda} from '../components/Cliente/Deuda'
import {ListaDeEnvios} from '../components/Expreso/ListaDeEnvios'
import {Detalles} from '../components/Cliente/Detalles'
import {DialogConfirmDelete} from '../components/Cliente/DialogConfirmDelete'
import {database} from 'firebase'
import {Link} from 'react-router-dom'
import {content} from './styles/styles'
import {checkSearch} from '../utilities'

// COMPONENT
const Expreso=(props)=>{
    const classes = content()
    const [expreso,setExpreso]= useState(props.expresos[checkSearch(props.history.location.search)])
    const [showSnackbar, setshowSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDialogConfirmDelete, setshowDialogConfirmDelete] = useState(false);

    // FUNCTIONS
    const eliminarExpreso = () =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('expresos').child(expreso.datos.nombre).remove()
        .then(()=>{
            setshowSnackbar('El Expreso Se Elimino Correctamente')
            setTimeout(() => {
                props.history.replace('/Expresos')
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }
    return(
        expreso?
            <Layout history={props.history} page={`${expreso.datos.nombre}`} user={props.user.uid}>
                
                {/* CONTENT */}
                <Paper className={classes.content}>
                    <Grid container justify='center' spacing={4}>
                        <Detalles {...expreso.datos}/>
                        <ListaDeEnvios envios={expreso.envios}/>
                        <Grid item xs={12} sm={8} >
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

                </Paper>
                
                {/* BACKDROP - SNACKBAR - DIALOGS */}
                <Backdrop className={classes.backdrop} open={loading}>
                    <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={()=>{setshowSnackbar('')}}>
                        <Alert onClose={()=>{setshowSnackbar('')}} severity="success" variant='filled'>
                            {showSnackbar}
                        </Alert>
                    </Snackbar>
                </Backdrop>
                <DialogConfirmDelete open={showDialogConfirmDelete} setOpen={setshowDialogConfirmDelete} eliminarCliente={eliminarExpreso}/>
            </Layout>
            :
            <>
                {props.history.replace('/Expresos')}
            </>
    )
}

//REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        expresos:state.expresos
    }
}
export default connect(mapStateToProps,null)(Expreso)