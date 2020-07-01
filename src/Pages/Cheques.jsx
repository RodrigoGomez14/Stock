import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,DialogActions,Typography,TextField,Backdrop,Grid,CircularProgress,IconButton,Link as LinkComponent,Snackbar,TableContainer,Table,TableCell,TableRow,TableHead,TableBody,Paper,Menu,MenuItem} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {PersonAdd} from '@material-ui/icons'
import {MoreVert,DeleteOutlineOutlined} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {CardPedido} from '../components/Pedidos/CardPedido'
import {database} from 'firebase'
import {formatMoney,obtenerFecha} from '../utilities'
import {DialogEntregarCheque} from '../components/Cheques/DialogEntregarCheque'

const useStyles=makeStyles(theme=>({
    success:{
        marginLeft:theme.spacing(1),
        borderColor:theme.palette.success.main
    },
    danger:{
        marginLeft:theme.spacing(1),
        borderColor:theme.palette.danger.main
    },
    iconSuccess:{
        color:theme.palette.success.main,
    },
    iconDanger:{
        color:theme.palette.danger.main,
    },
    paperCliente:{
    },
    card:{
        minHeight:'180px',
        maxHeight:'300px'
    },
    link:{
        color:theme.palette.primary.contrastText,
        textDecoration:'none'
    },
    displayNone:{
        display:'none'
    },
    display:{
        display:'block'
    },
    container:{
        paddingTop:theme.spacing(1),
        paddingBottom:theme.spacing(1)
    },
    containerClientes:{
        height:'calc( 100vh - 128px )',
        overflow:'scroll'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    displayNone:{
        display:'none'
    },
    dangerText:{
        color:theme.palette.danger.main,
        textShadow:'1px 1px black'
    }
}))

const MenuCheque = ({guardarChequeRebotado,guardarEntregaDeCheque,disabledBaja,disabledEntrega,id}) =>{
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialogEntregarCheque, setopenDialogEntregarCheque] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return(
        <>  
            <DialogEntregarCheque open={openDialogEntregarCheque} setOpen={setopenDialogEntregarCheque} guardarEntregaDeCheque={guardarEntregaDeCheque} id={id}/>
            <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVert/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >  
                <MenuItem disabled={disabledBaja} onClick={()=>{guardarChequeRebotado()}}>Dar de baja</MenuItem>
                <MenuItem disabled={disabledEntrega}onClick={()=>{setopenDialogEntregarCheque(true)}}>Entregar Cheque</MenuItem>
            </Menu>
        </>
    )
}

const Cheques=(props)=>{
    const classes = useStyles()
    const [search,setSearch]=useState('')
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const [openDialog,setOpenDialog]=useState(false)

    const eliminarCheque = (id) =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('pedidos').child(id).remove()
            .then(()=>{
                setshowSnackbar('El pedido se eliminó correctamente!')
                setTimeout(() => {
                    setLoading(false)
                    setshowSnackbar('')
                }, 2000);
            })
            .catch(()=>{
                setLoading(false)
            })
    }
    useEffect(()=>{
        if(props.history.location.search){
            setSearch(props.history.location.search.slice(1))
        }
    },[])
    const guardarPago = (cliente,cheque) =>{
        let aux={
            cheques:[props.cheques[cheque].numero],
            fecha:obtenerFecha(),
            total:-(props.cheques[cheque].valor),
        }
        let pagos = []
        if(props.clientes[cliente].pagos){
            pagos=props.clientes[cliente].pagos
        }
        pagos.push(aux)
        database().ref().child(props.user.uid).child('clientes').child(cliente).update({
            pagos:pagos
        })
    }
    const actualizarDeuda = (valor,nombre,cheque) =>{
        let nuevaDeuda = props.clientes[nombre].datos.deuda
        nuevaDeuda+=parseFloat(valor)
        console.log(nuevaDeuda,nombre)
        database().ref().child(props.user.uid).child('clientes').child(nombre).child('datos').update({
            deuda:nuevaDeuda
        })
        guardarPago(nombre,cheque)
    }
    const guardarChequeRebotado = id =>{
        setLoading(true)
        actualizarDeuda(props.cheques[id].valor,props.cheques[id].nombre,id)
        database().ref().child(props.user.uid).child('cheques').child(id).update({
            dadoDeBaja:true
        })
        .then(()=>{
            setshowSnackbar('El cheque se dio de baja correctamente!')
            setTimeout(() => {
                setLoading(false)
                setshowSnackbar('')
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }
    const guardarEntregaDeCheque = (id,diaDeEnvio,destinatario) =>{
        setLoading(true)
        console.log(id,diaDeEnvio,destinatario)
        database().ref().child(props.user.uid).child('cheques').child(id).update({
            diaDeEnvio:diaDeEnvio,
            destinatario:destinatario
        })
        .then(()=>{
            setshowSnackbar('El cheque se entrego correctamente!')
            setTimeout(() => {
                setLoading(false)
                setshowSnackbar('')
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }
    return(
        <Layout history={props.history} page="Cheques" user={props.user.uid}>
            <Grid container justify='center' alignItems='center' className={classes.container} >
                <Grid item>
                    <TextField
                        value={search}
                        onChange={e=>{
                            setSearch(e.target.value)
                        }}
                        disabled={!props.cheques}
                        label='Buscar Cheque'
                    />
                </Grid>
                <Grid container justify='center' alignItems='center' className={classes.container}>
                    <Grid item xs={11} >
                        {props.cheques?
                            <Paper elevation={3}>
                                <TableContainer>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Nombre</TableCell>
                                                <TableCell>Valor</TableCell>
                                                <TableCell>Vencimiento</TableCell>
                                                <TableCell align="right">Banco</TableCell>
                                                <TableCell align="right">Numero</TableCell>
                                                <TableCell align="right">Dia de envio</TableCell>
                                                <TableCell align="right">Destinatario</TableCell>
                                                <TableCell align="right" padding='checkbox'></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.keys(props.cheques).reverse().map((key,i)=>(
                                                <>
                                                    <TableRow className={!search?null:(props.cheques[key].numero.search(search) === -1 && classes.displayNone)}>

                                                        <TableCell component="th" scope="row">
                                                            <Link
                                                                className={classes.link} 
                                                                to={{
                                                                    pathname:'/Cliente',
                                                                    search:props.cheques[key].nombre
                                                                }}
                                                            >
                                                                {props.cheques[key].nombre}
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell className={props.cheques[key].dadoDeBaja?classes.dangerText:null}>$ {formatMoney(props.cheques[key].valor)}</TableCell>
                                                        <TableCell>{props.cheques[key].vencimiento}</TableCell>
                                                        <TableCell align="right">{props.cheques[key].banco}</TableCell>
                                                        <TableCell align="right">{props.cheques[key].numero}</TableCell>
                                                        <TableCell align="right">{props.cheques[key].diaDeEnvio?props.cheques[key].diaDeEnvio:'-'}</TableCell>
                                                        <TableCell align="right">{props.cheques[key].destinatario?props.cheques[key].destinatario:'-'}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuCheque disabledBaja={props.cheques[key].dadoDeBaja} disabledEntrega={props.cheques[key].destinatario || props.cheques[key].dadoDeBaja ?true:false} guardarChequeRebotado={()=>{guardarChequeRebotado(key)}} guardarEntregaDeCheque={guardarEntregaDeCheque} id={key}/>
                                                        </TableCell>
                                                    </TableRow>
                                                </>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        :
                        <Typography variant='h5'>
                            Aun no hay ningun cheque ingresado
                        </Typography>
                    }
                    </Grid>
                </Grid>
            </Grid>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar open={Boolean(showSnackbar)} autoHideDuration={2000} onClose={()=>{setshowSnackbar('')}}>
                <Alert onClose={()=>{setshowSnackbar('')}} severity="success" variant='filled'>
                    {showSnackbar}
                </Alert>
            </Snackbar>
        </Layout>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        cheques:state.cheques,
        clientes:state.clientes
    }
}
export default connect(mapStateToProps,null)(Cheques)