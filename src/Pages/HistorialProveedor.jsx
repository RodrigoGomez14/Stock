import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,Grid,List,Typography,IconButton,Backdrop,Snackbar,CircularProgress,Table,TableHead,TableRow,TableCell,TableBody,TableContainer,Button,Menu,MenuItem,Divider} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {MenuCheques} from '../components/Historial/MenuCheques'
import {EditOutlined,ArrowDropDown, AddOutlined} from '@material-ui/icons'
import {Deuda} from '../components/Cliente/Deuda'
import {ListaDePedidos} from '../components/Cliente/ListaDePedidos'
import {Detalles} from '../components/Cliente/Detalles'
import {DialogConfirmDelete} from '../components/Cliente/DialogConfirmDelete'
import {database} from 'firebase'
import {Link} from 'react-router-dom'
import {formatMoney} from '../utilities'
import {content} from './styles/styles'
import {checkSearch} from '../utilities'

// COMPONENT
const HistorialProveedor=(props)=>{
    const classes = content()
    const [proveedor,setProveedor]= useState(props.proveedores[checkSearch(props.history.location.search)].pagos)
   

    const calcularTotal = (total,efectivo) =>{
        const auxEfectivo = efectivo?efectivo:0
    
        return total-auxEfectivo!=0?total-auxEfectivo:0
    }

    return(
        <Layout history={props.history} page={`Historial ${props.proveedores[checkSearch(props.history.location.search)].datos.nombre}`} user={props.user.uid}>
            {/* CONTENT */}
            <Paper className={classes.content}>
                <Grid container xs={12} justify='center' spacing={3}>
                    <Grid container item xs={12} justify='center'>
                        <Link 
                            style={{color:'#fff',textDecoration:'none'}}
                            to={{
                                pathname:'/Nuevo-Pago-Proveedor',
                                props:{
                                    proveedor:props.proveedores[checkSearch(props.history.location.search)].datos.nombre
                                },
                                search:`${props.proveedores[checkSearch(props.history.location.search)].datos.nombre}`
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
                        {proveedor? 
                            <Grid item xs={11}>
                                <Paper elevation={3}>
                                    <TableContainer component={Paper}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className={classes.titleDetallesCard}>
                                                        Fecha
                                                    </TableCell>
                                                    <TableCell className={classes.titleDetallesCard} align='left'>
                                                        Efectivo
                                                    </TableCell>
                                                    <TableCell className={classes.titleDetallesCard} align='right'>
                                                        Cheques
                                                    </TableCell>
                                                    <TableCell className={classes.titleDetallesCard} align='right'>
                                                        Deuda Pasado
                                                    </TableCell>
                                                    <TableCell className={classes.titleDetallesCard}   align='right'>
                                                        Deuda Actualizada
                                                    </TableCell>
                                                    <TableCell className={classes.titleDetallesCard}   align='right'>
                                                        Entrega
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                    {Object.keys(proveedor).reverse().map(pago=>(
                                                        <TableRow> 
                                                            <TableCell>
                                                                {proveedor[pago].fecha}
                                                            </TableCell>
                                                            <TableCell align='left'>
                                                               $ {proveedor[pago].efectivo?formatMoney(proveedor[pago].efectivo):'-'}
                                                            </TableCell>
                                                            <TableCell align='right'>
                                                                $ {formatMoney(calcularTotal(proveedor[pago].total,proveedor[pago].efectivo))}
                                                                {proveedor[pago].cheques?
                                                                    <>
                                                                        <MenuCheques pago={proveedor[pago]}/>
                                                                    </>
                                                                    :
                                                                    null
                                                                }                                                            
                                                            </TableCell>
                                                            <TableCell align='right'>
                                                                $ {formatMoney(proveedor[pago].deudaPasada)}
                                                            </TableCell>
                                                            <TableCell align='right'>
                                                                $ {formatMoney(proveedor[pago].deudaActualizada)}
                                                            </TableCell>
                                                            <TableCell align='right'>
                                                                {proveedor[pago].idEntrega?
                                                                    <Link
                                                                        style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                                                        to={{
                                                                        pathname:'/Proveedor',
                                                                        search:props.history.location.search,
                                                                        props:{
                                                                            searchEntrega:proveedor[pago].idEntrega
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
                            <Typography variant='h6'>
                                {props.proveedores[checkSearch(props.history.location.search)].datos.nombre} no tiene un historial de pagos
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
        proveedores:state.proveedores
    }
}
export default connect(mapStateToProps,null)(HistorialProveedor)