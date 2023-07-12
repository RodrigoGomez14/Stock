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
import {checkSearch} from '../utilities'
import Empty from '../images/Empty.png'
import {Pago} from '../components/Historial-De-Pagos/Pago'

// COMPONENT
const HistorialCliente=(props)=>{
    const classes = content()
    
    const [pagos,setPagos]= useState(props.clientes[checkSearch(props.history.location.search)].pagos)

    return(
        <Layout history={props.history} page={`Historial ${props.clientes[checkSearch(props.history.location.search)].datos.nombre}`} user={props.user.uid}>
            {/* CONTENT */}            
            <Paper className={classes.content}>
                <Grid container xs={12} justify='center' spacing={3}>
                    <Grid container item xs={12} justify='center'>
                        <Link 
                            className={classes.link}
                            style={{color:'#fff',textDecoration:'none'}}
                            to={{
                                pathname:'/Nuevo-Pago-Cliente',
                                props:{
                                    cliente:props.clientes[checkSearch(props.history.location.search)].datos.nombre
                                },
                                search:`${props.clientes[checkSearch(props.history.location.search)].datos.nombre}`
                            }
                        }>
                            <Button 
                                variant='contained'
                                color='primary'
                                startIcon={<AddOutlined/>}
                            >
                                Nuevo Pago
                            </Button>
                        </Link>
                    </Grid>
                    <Grid container xs={12} justify='center' spacing={2}>
                        {pagos?
                            Object.keys(pagos).reverse().map(pago=>(
                                <Pago pago={pagos[pago]} userType='cliente' user={props.clientes[checkSearch(props.history.location.search)].datos.nombre}/>
                            ))
                            :
                            <Grid container xs={12} justify='center' spacing={2}>
                                <Grid container item xs={12} justify='center'>
                                    <Typography variant='h5'>{checkSearch(props.location.search)} no tiene historial de pagos</Typography>
                                </Grid>
                                <Grid item>
                                    <img src={Empty} alt="" height='600px'/>
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </Paper>
        </Layout>
    )
}

// REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        clientes:state.clientes
    }
}
export default connect(mapStateToProps,null)(HistorialCliente)