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
                <Grid container xs={12} justify='center' >
                    <Grid container item xs={12} justify='center'>
                        <Link 
                            className={classes.link}
                            to={{
                                pathname:'/Nuevo-Pago-Cliente',
                                props:{
                                    cliente:props.clientes[checkSearch(props.history.location.search)].datos.nombre
                                },
                                search:`${props.clientes[checkSearch(props.history.location.search)].datos.nombre}`
                            }
                        }>
                            <Button 
                                variant='outlined'
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
                                                    <TableCell>
                                                        Fecha
                                                    </TableCell>
                                                    <TableCell align='left'>
                                                        Total
                                                    </TableCell>
                                                    <TableCell align='right'>
                                                        Efectivo
                                                    </TableCell>
                                                    <TableCell align='right'>
                                                        Cheques
                                                    </TableCell>
                                                    <TableCell   align='right'>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                    {Object.keys(cliente).reverse().map(pago=>(
                                                        <TableRow> 
                                                            <TableCell>
                                                                {cliente[pago].fecha}
                                                            </TableCell>
                                                            <TableCell align='left' className={calcularTotal(cliente[pago].total,cliente[pago].efectivo)<0?classes.dangerText:null}>
                                                                $ {formatMoney(cliente[pago].total)}
                                                            </TableCell>
                                                            <TableCell align='right'>
                                                                $ {cliente[pago].efectivo?formatMoney(cliente[pago].efectivo):'-'}
                                                            </TableCell>
                                                            <TableCell align='right'>
                                                                $ {formatMoney(calcularTotal(cliente[pago].total,cliente[pago].efectivo))}
                                                            </TableCell>
                                                            <TableCell   align='right'>
                                                                {cliente[pago].cheques?
                                                                    <>
                                                                        <MenuCheques pago={cliente[pago]}/>
                                                                    </>
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
                            <Typography variant='h6'>
                                {props.clientes[checkSearch(props.history.location.search)].datos.nombre} no tiene un historial de pagos
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
        clientes:state.clientes
    }
}
export default connect(mapStateToProps,null)(HistorialCliente)