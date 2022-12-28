import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Paper,Grid,Typography,Table,TableHead,TableRow,TableCell,TableBody,TableContainer,Button} from '@material-ui/core'
import {MenuCheques} from '../components/Historial/MenuCheques'
import {AddOutlined} from '@material-ui/icons'
import {DialogConfirmDelete} from '../components/Cliente/DialogConfirmDelete'
import {Link} from 'react-router-dom'
import {formatMoney} from '../utilities'
import {content} from './styles/styles'
import {Cadena} from '../components/Cadenas-De-Produccion/Cadena'
import {checkSearch,checkSearchProducto} from '../utilities'

// COMPONENT
const HistorialDeProduccion=(props)=>{
    const classes = content()
    const [historial,setHistorial]= useState(props.productos[checkSearchProducto(props.location.search)].historialDeCadenas)
   
    return(
        <Layout history={props.history} page={`Historial De Produccion ${checkSearchProducto(props.location.search)}`} user={props.user.uid}>
            {/* CONTENT */}            
            <Paper className={classes.content}>
                <Grid container xs={12} justify='center' spacing={3}>
                    {historial? 
                        <Grid container item xs={12}>
                            {Object.keys(historial).reverse().map(key=>(
                                <Cadena cadena={historial[key]} id={key}/>
                            ))}
                        </Grid>
                        :
                        <Typography variant='h6'>
                            {props.location.search} no tiene un historial de produccion
                        </Typography>
                    }
                </Grid>
            </Paper>
        </Layout>
    )
}

// REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        productos:state.productos
    }
}
export default connect(mapStateToProps,null)(HistorialDeProduccion)