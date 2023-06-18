import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Typography,TextField,Backdrop,Grid,CircularProgress,IconButton,Card,Snackbar,CardHeader,Input,TableCell,TableRow,TableHead,TableBody,Paper,Menu,MenuItem, CardContent, Button} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {PersonAdd} from '@material-ui/icons'
import {MoreVert,ArrowForward} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {CardPedido} from '../components/Pedidos/CardPedido'
import {database} from 'firebase'
import {DialogConfirmAction} from '../components/Dialogs/DialogConfirmAction'
import {formatMoney,obtenerFecha,monthsList} from '../utilities'
import {DialogEntregarCheque} from '../components/Cheques/DialogEntregarCheque'
import {content} from './styles/styles'
import { Cheque } from '../components/Cheques/Cheque'
import Empty from '../images/Empty.png'
import ApexCharts from 'react-apexcharts';

// COMPONENT
const Cheques=(props)=>{
    const classes = content()
    const [search,setSearch]=useState(props.location.search?props.location.search.slice(1):'')
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalBlanco,setTotalBlanco] = useState('')
    const [totalNegro,setTotalNegro] = useState('')
    const [sortedCheques,setSortedCheques] = useState(undefined)
    const [showDialogDelete, setShowDialogDelete] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(false);
    const [showDialogSelectGroup, setShowDialogSelectGroup] = useState(false);
    const [idGroup, setIdGroup] = useState(undefined);
    

    // FUNCTIONS 

    const guardarChequeRebotado = id =>{
        setLoading(true)

        let valor = props.cheques[id].valor
        let cliente = props.cheques[id].nombre
        let destinatario = props.cheques[id].destinatario?props.cheques[id].destinatario:undefined


        // GUARDA EL MOVIMIENTO EN LA LISTA DE PAGOS DEL CLIENTE Y DEL PROVEEDOR
        guardarPago(cliente,id,destinatario)

        // ACTUALIZA DEUDA DE CLIENTE Y PROVEEDOR 
        actualizarDeuda(valor,cliente,destinatario)

        // ACTUALIZA EL CHEQUE EN LA DB
        database().ref().child(props.user.uid).child('cheques').child(id).update({
            dadoDeBaja:true
        })
        // FEEDBACK DEL PROCESO
        .then(()=>{
            setshowSnackbar('El cheque se dio de baja correctamente!')
            setShowDialogDelete(false)
            setTimeout(() => {
                setLoading(false)
                setshowSnackbar('')
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }

    const actualizarDeuda = (valor,nombre,destinatario) =>{
        
        // CLIENTE
        const nuevaDeudaCliente = props.clientes[nombre].datos.deuda+parseFloat(valor)
        database().ref().child(props.user.uid).child('clientes').child(nombre).child('datos').update({
            deuda:nuevaDeudaCliente
        })
        // SI EL CHEQUE FUE ENTREGADO SE ACTUALIZA LA DEUDA DEL PROVEEDOR
        if(destinatario){
            const nuevaDeudaProveedor = props.proveedores[destinatario].datos.deuda+parseFloat(valor)
            database().ref().child(props.user.uid).child('proveedores').child(`${destinatario}`).child('datos').update({
                deuda:nuevaDeudaProveedor
            })  
        }

    }
    
    const guardarPago = (cliente,cheque,destinatario) =>{

        // FUNCIONES DE ESTRUCTURA
        const calcularDeudaActualizada = type =>{
            if(type == 'cliente'){
                return getDeudaPasada(type) + parseFloat(props.cheques[cheque].valor)
            }
            else if(type == 'proveedor'){
                return getDeudaPasada(type) + parseFloat(props.cheques[cheque].valor)
            }
        }
        const getDeudaPasada = type =>{
            if(type == 'cliente'){
                return props.clientes[cliente].datos.deuda
            }
            else if(type == 'proveedor'){
                return props.proveedores[destinatario].datos.deuda

            }
        }
        // ESTRUCTURA DEL PAGO
        let aux={
            deudaPasada:getDeudaPasada('cliente'),
            deudaActualizada:calcularDeudaActualizada('cliente'),
            cheques:[props.cheques[cheque].numero],
            fecha:obtenerFecha(),
            pagado:-(props.cheques[cheque].valor),
            total:-(props.cheques[cheque].valor),
        }
        // ACTUALIZA DB CLIENTE
        database().ref().child(props.user.uid).child('clientes').child(cliente).child('pagos').push(aux)
        
        // ACTUALIZA DB PROVEEDOR
        if(destinatario){
            aux.deudaPasada=getDeudaPasada('proveedor')
            aux.deudaActualizada=calcularDeudaActualizada('proveedor')
            database().ref().child(props.user.uid).child('proveedores').child(destinatario).child('pagos').push(aux)  
        }
    }
    const guardarChequeEnBlanco = (id) =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('cheques').child(id).update({
                grupo:'Blanco'
        })
        .then(()=>{
            setshowSnackbar('El cheque Se Agrego Al Grupo!')
            setShowDialogSelectGroup(false)
            setTimeout(() => {
                setLoading(false)
                setshowSnackbar('')
            }, 2000);
        })
    }
    const guardarChequeEnNegro = (id) =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('cheques').child(id).update({
                grupo:'Negro'
        })
        .then(()=>{
            setshowSnackbar('El cheque Se Agrego Al Grupo!')
            setShowDialogSelectGroup(false)
            setTimeout(() => {
                setLoading(false)
                setshowSnackbar('')
            }, 2000);
        })
    }
    const obtenerTotalGrupos = (cheques) =>{
        let auxBlanco = 0
        let auxNegro = 0
        if(cheques){
            Object.keys(cheques).map(cheque=>{
                if(!cheques[cheque].destinatario && !cheques[cheque].dadoDeBaja){
                    if(cheques[cheque].grupo){
                        if(cheques[cheque].grupo=='Blanco'){
                            auxBlanco+=parseFloat(cheques[cheque].valor)
                        }
                        else{
                            auxNegro+=parseFloat(cheques[cheque].valor)
                        }
                    }
                }
            })
        }
        setTotalBlanco(auxBlanco)
        setTotalNegro(auxNegro)
    }


    // CHARTS
    const generateChartGrupos = () => {
        // Asume que tienes los datos en dos variables: sortedCompras y sortedVentas
        let series = [totalBlanco,totalNegro]
        let labels = ['blanco','negro']
        // Define la configuración del gráfico
        const options = {
            labels:labels,
            theme:{
                mode:'dark',
                palette:'palette3'
            },
            tooltip:{
                y:{
                    formatter: val=> `$ ${formatMoney(val)}`
                }
            },
            dataLabels:{
                dropShadow: {
                    enabled: true,
                    left: 2,
                    top: 2,
                    opacity: 0.5
                },
            }
        };
    
    
        // Renderiza el gráfico
        return <ApexCharts options={options} series={series} type='donut' width={350} />;
    }

    // FILTRADO DE INFORMACION 
    const filtrarCheques = () =>{
        const months = {};
        const year = new Date().getFullYear()
            Object.keys(props.cheques).forEach((cheque) => {
                const yearOfCheque = props.cheques[cheque].vencimiento.split('/')[2]
                if(year==yearOfCheque){
                    const month = props.cheques[cheque].vencimiento.split('/')[1];
                    if (!months[month]) {
                        months[month] = { total: 0,totalDisponible:0, cheques: [] };
                    }
                    if(!props.cheques[cheque].dadoDeBaja){
                        months[month].total += parseInt(props.cheques[cheque].valor, 10);
                        if(!props.cheques[cheque].destinatario){
                            months[month].totalDisponible += parseInt(props.cheques[cheque].valor, 10);
                        }
                    }
        
                    months[month].cheques={...months[month].cheques,[`${cheque}`]:props.cheques[cheque]}
                    console.log(months[month].cheques)
                }
            });
        return months
    }

    useEffect(()=>{
        setLoading(true)
        if(props.cheques){
            const auxSortedCheques = filtrarCheques()
            setSortedCheques(auxSortedCheques)
        }

        obtenerTotalGrupos(props.cheques)
        if(props.history.location.search){
            setSearch(props.history.location.search.slice(1))
        }
        setTimeout(() => {
            setLoading(false)
        }, 500);
    },[props.cheques])

    return(
        <Layout history={props.history} page="Cheques" user={props.user.uid}>
            {/* CONTENT */}
            <Paper className={classes.content}>
                {console.log(search)}
                {/* CHEQUES TABLE */}
                <Grid container spacing={6}>
                    <Grid container item xs={12} justify='space-around'>
                        
                        {/* SEARCH BAR */}
                        
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


                        {/* NAVIGATION TO CHEQUES PERSONALES */}
                        <Grid item>
                            <Link
                                style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                to={{
                                    pathname:'/Cheques-Personales',
                            }}>
                                <Button endIcon={<ArrowForward/>}>Cheques Personales</Button>
                            </Link>  
                        </Grid>
                    </Grid>

                    {/* LIST */}
                    <Grid container justify='center' alignItems='center' spacing={3}>
                        {sortedCheques?
                            <Grid container xs={12} justify='center' spacing={3}>
                                {Object.keys(sortedCheques).reverse().map((month)=>(
                                    <>
                                        <Grid container item xs={12} justify='center'>
                                            <Card className={classes.CardMonthCheques}>
                                                <CardHeader
                                                    title={`$ ${formatMoney(sortedCheques[month].totalDisponible)} ($ ${formatMoney(sortedCheques[month].total)})`}
                                                    subheader={monthsList[month-1]}
                                                />
                                            </Card>
                                        </Grid>
                                        <Grid container item xs={12} justify='center' spacing={3}>
                                            {Object.keys(sortedCheques[month].cheques).map(cheque=>(
                                                <Cheque cheque={sortedCheques[month].cheques[cheque]} id={cheque} search={search}  setShowDialogDelete={setShowDialogDelete} setDeleteIndex={setDeleteIndex} setShowDialogSelectGroup={setShowDialogSelectGroup} setIdGroup={setIdGroup}/>    
                                            ))}
                                        </Grid>
                                    </>
                                ))}
                            </Grid>
                        :
                            <>
                                <Grid item>
                                    <img src={Empty} alt="" height='500px'/>
                                </Grid>
                                <Grid container item xs={12} justify='center'>
                                    <Typography variant='h4'>No hay Cheques Ingresados</Typography>
                                </Grid>
                            </>
                        }
                    </Grid>
                </Grid>
            </Paper>

            {/* BACKDROP & SNACKBAR */}
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
                <DialogConfirmAction showDialog={showDialogDelete} setShowDialog={setShowDialogDelete} action={()=>{guardarChequeRebotado(deleteIndex)}} tipo='dar de baja el cheque'/>
                <DialogConfirmAction showDialog={showDialogSelectGroup} setShowDialog={setShowDialogSelectGroup} action={()=>{guardarChequeEnBlanco(idGroup)}} tipo='Guardar Cheque en Blanco'/>
                <DialogConfirmAction showDialog={showDialogSelectGroup} setShowDialog={setShowDialogSelectGroup} action={()=>{guardarChequeEnNegro(idGroup)}} tipo='Guardar Cheque en Negro'/>
                <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={()=>{setshowSnackbar('')}}>
                    <Alert severity="success" variant='filled'>
                        {showSnackbar}
                    </Alert>
                </Snackbar>
            </Backdrop>
        </Layout>
    )
}
// REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        cheques:state.cheques,
        clientes:state.clientes,
        proveedores:state.proveedores
    }
}
export default connect(mapStateToProps,null)(Cheques)