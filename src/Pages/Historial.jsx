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
    link:{
        color:theme.palette.primary.contrastText,
        marginBottom:theme.spacing(1),
        textDecoration:'none'
    },
    dangerText:{
        color:theme.palette.danger.main,
        textShadow:'1px 1px black'

    }
}))
const Historial=(props)=>{
    const classes = useStyles()
    const [cliente,setCliente]= useState(props.clientes[props.history.location.search.slice(1)].pagos)
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDialogConfirmDelete, setshowDialogConfirmDelete] = useState(false);
   

    const calcularTotal = (total,efectivo) =>{
        const auxEfectivo = efectivo?efectivo:0
    
        return total-auxEfectivo!=0?total-auxEfectivo:0
    }
    const aux = new Array
    if(cliente){
        cliente.map(pago=>{
            aux.push(pago)
        })
    }
    return(
            <Layout history={props.history} page={`Historial ${props.clientes[props.history.location.search.slice(1)].datos.nombre}`} user={props.user.uid}>
                <Grid container className={classes.container} justify='center' >
                    <Grid container item xs={12} justify='center'>
                        <Link 
                            className={classes.link}
                            to={{
                                pathname:'/Nuevo-Pago',
                                props:{
                                    cliente:props.clientes[props.history.location.search.slice(1)].datos.nombre
                                }
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
                                                    {aux.reverse().map(pago=>(
                                                        <TableRow> 
                                                            <TableCell>
                                                                {pago.fecha}
                                                            </TableCell>
                                                            <TableCell align='left' className={calcularTotal(pago.total,pago.efectivo)<0?classes.dangerText:null}>
                                                                $ {formatMoney(pago.total)}
                                                            </TableCell>
                                                            <TableCell align='right'>
                                                                $ {pago.efectivo?formatMoney(pago.efectivo):'-'}
                                                            </TableCell>
                                                            <TableCell align='right'>
                                                                $ {formatMoney(calcularTotal(pago.total,pago.efectivo))}
                                                            </TableCell>
                                                            <TableCell   align='right'>
                                                                {pago.cheques?
                                                                    <>
                                                                        <MenuCheques pago={pago}/>
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
                                {props.clientes[props.history.location.search.slice(1)].datos.nombre} no tiene un historial de pagos
                            </Typography>
                        }
                </Grid>
                <Backdrop className={classes.backdrop} open={loading}>
                    {showSnackbar?
                        <Snackbar open={Boolean(showSnackbar)} autoHideDuration={2000} onClose={()=>{setshowSnackbar('')}}>
                            <Alert onClose={()=>{setshowSnackbar('')}} severity="error" variant='filled'>
                                {showSnackbar}
                            </Alert>
                        </Snackbar>
                        :
                        <CircularProgress color="inherit" />
                    }
                </Backdrop>
                <DialogConfirmDelete open={showDialogConfirmDelete} setOpen={setshowDialogConfirmDelete}/>
            </Layout>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        clientes:state.clientes
    }
}
export default connect(mapStateToProps,null)(Historial)