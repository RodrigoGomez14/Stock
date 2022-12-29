import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {content} from './styles/styles'
import {Paper,Grid,Typography,Backdrop,CircularProgress,Snackbar,CardContent,List,ListItem,ListItemText} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {database} from 'firebase'
import Empty from '../images/Empty.png'
import {Cadena} from '../components/Cadenas-De-Produccion/Cadena'
import { obtenerFecha } from '../utilities'

//COMPONENT
const CadenasDeProduccion=(props)=>{
    const classes = content()
    const [showSnackbar, setshowSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);

    const iniciarProceso = (id,step) =>{
        setLoading(true)
        let aux= props.cadenasActivas[id].procesos
        aux[step]={...aux[step],fechaDeInicio:obtenerFecha()}
        database().ref().child(props.user.uid).child('cadenasActivas').child(id).child('procesos').update(aux)
        .then(()=>{
            setshowSnackbar('El Proceso Inicio Correctamente!')
            setTimeout(() => {
                setLoading(false)
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }

    return(
        //Layout
        <Layout history={props.history} page="Cadenas De Produccion" user={props.user.uid}>
            <Paper className={classes.content}>
                <Grid container xs={12} justify='center' spacing={2}>
                    {props.cadenasActivas?
                        Object.keys(props.cadenasActivas).map(cadena=>(
                            <Cadena cadena={props.cadenasActivas[cadena]} id={cadena} iniciarProceso={iniciarProceso}/>
                        ))
                        :
                        <Grid container xs={12} justify='center' spacing={2}>
                            <Grid item>
                                <img src={Empty} alt="" height='500px'/>
                            </Grid>
                            <Grid container item xs={12} justify='center'>
                                <Typography variant='h5'>No hay Cadenas de Produccion Activas</Typography>
                            </Grid>
                        </Grid>
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

//REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        cadenasActivas:state.cadenasActivas
    }
}
export default connect(mapStateToProps,null)(CadenasDeProduccion)