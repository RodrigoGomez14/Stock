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

// COMPONENT
const HistorialCliente=(props)=>{
    const classes = content()
    const [cliente,setCliente]= useState(props.clientes[checkSearch(props.history.location.search)].pagos)
   

    const calcularTotal = (total,efectivo) =>{
        const auxEfectivo = efectivo?efectivo:0
    
        return total-auxEfectivo!=0?total-auxEfectivo:0
    }

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
                        {cliente? 
                            <Grid item xs={11}>
                                <Paper elevation={3}>
                                    <TableContainer component={Paper}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className={classes.titleDetallesCard} align='right'>
                                                        Fecha
                                                    </TableCell>
                                                    <TableCell className={classes.titleDetallesCard} align='right'>
                                                        Efectivo
                                                    </TableCell>
                                                    <TableCell className={classes.titleDetallesCard} align='right'>
                                                        Cheques
                                                    </TableCell>
                                                    <TableCell className={classes.titleDetallesCard} align='right'>
                                                        Deuda Pasada
                                                    </TableCell>
                                                    <TableCell className={classes.titleDetallesCard} align='right'>
                                                        Deuda Actualizada
                                                    </TableCell>
                                                    <TableCell className={classes.titleDetallesCard} align='right'>
                                                        Pedido
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                    {Object.keys(cliente).reverse().map(pago=>(
                                                        <TableRow> 
                                                            <TableCell align='right'>
                                                                {cliente[pago].fecha}
                                                            </TableCell>
                                                            <TableCell align='right'>
                                                                $ {cliente[pago].efectivo?formatMoney(cliente[pago].efectivo):'-'}
                                                            </TableCell>
                                                            <TableCell align='right'>
                                                                <MenuCheques pago={cliente[pago]}/>
                                                            </TableCell>
                                                            <TableCell align='right'>
                                                                $ {formatMoney(cliente[pago].deudaPasada)}
                                                            </TableCell>
                                                            <TableCell align='right'>
                                                                $ {formatMoney(cliente[pago].deudaActualizada)}
                                                            </TableCell>
                                                            <TableCell align='right'>
                                                                {cliente[pago].idPedido?
                                                                    <Link
                                                                        style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                                                        to={{
                                                                        pathname:'/cliente',
                                                                        search:props.history.location.search,
                                                                        props:{
                                                                            searchPedido:cliente[pago].idPedido
                                                                        }
                                                                    }}>
                                                                        <Button variant='outlined'>
                                                                            Ver
                                                                        </Button>
                                                                    </Link>
                                                                    :
                                                                    '-'
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
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