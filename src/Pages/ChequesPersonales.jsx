import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Typography,TextField,Backdrop,Grid,CircularProgress,IconButton,Card,Snackbar,CardHeader,Input,TableCell,TableRow,TableHead,TableBody,Paper,Menu,MenuItem, CardContent} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {PersonAdd} from '@material-ui/icons'
import {MoreVert,DeleteOutlineOutlined} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {CardPedido} from '../components/Pedidos/CardPedido'
import {database} from 'firebase'
import {formatMoney,obtenerFecha,monthsList} from '../utilities'
import {DialogEntregarCheque} from '../components/Cheques/DialogEntregarCheque'
import {content} from './styles/styles'
import { Cheque } from '../components/Cheques/ChequePersonal'
import Empty from '../images/Empty.png'
import ApexCharts from 'react-apexcharts';

// COMPONENT
const ChequesPersonales=(props)=>{
    const classes = content()
    const [search,setSearch]=useState(props.location.search?props.location.search.slice(1):'')
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalBlanco,setTotalBlanco] = useState('')
    const [totalNegro,setTotalNegro] = useState('')
    const [sortedCheques,setSortedCheques] = useState(undefined)

    // FUNCTIONS 

    const guardarChequeRebotado = id =>{
        setLoading(true)

        let valor = props.cheques[id].valor
        let proveedor = props.cheques[id].destinatario


        // GUARDA EL MOVIMIENTO EN LA LISTA DE PAGOS DEL PROVEEDOR
        guardarPago(proveedor,id)

        // ACTUALIZA DEUDA DE PROVEEDOR 
        actualizarDeuda(valor,proveedor)

        // ACTUALIZA EL CHEQUE EN LA DB
        database().ref().child(props.user.uid).child('chequesPersonales').child(id).update({
            dadoDeBaja:true
        })
        // FEEDBACK DEL PROCESO
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
    const asentarAcreditacion = id =>{
        setLoading(true)

        let fecha = 

        // ACTUALIZA EL CHEQUE EN LA DB
        database().ref().child(props.user.uid).child('chequesPersonales').child(id).update({
            acreditado:true,
            fechaAcreditacion:obtenerFecha()
        })
        // FEEDBACK DEL PROCESO
        .then(()=>{
            setshowSnackbar('El cheque se acredito!')
            setTimeout(() => {
                setLoading(false)
                setshowSnackbar('')
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }

    const actualizarDeuda = (valor,proveedor) =>{
            const nuevaDeudaProveedor = props.proveedores[proveedor].datos.deuda+parseFloat(valor)
            database().ref().child(props.user.uid).child('proveedores').child(`${proveedor}`).child('datos').update({
                deuda:nuevaDeudaProveedor
            })
    }
    
    const guardarPago = (proveedor,cheque) =>{

        // FUNCIONES DE ESTRUCTURA
        const calcularDeudaActualizada = () =>{
                return getDeudaPasada() + parseFloat(props.cheques[cheque].valor)
        }
        const getDeudaPasada = () =>{
                return props.proveedores[proveedor].datos.deuda
        }
        // ESTRUCTURA DEL PAGO
        let aux={
            deudaPasada:getDeudaPasada(),
            deudaActualizada:calcularDeudaActualizada(),
            totalChequesPersonales:-(props.cheques[cheque].valor),
            chequesPersonales:[props.cheques[cheque].numero],
            fecha:obtenerFecha(),
            pagado:-(props.cheques[cheque].valor),
            total:-(props.cheques[cheque].valor),
        }
        // ACTUALIZA DB PROVEEDOR
        database().ref().child(props.user.uid).child('proveedores').child(proveedor).child('pagos').push(aux)
        
    }
    const guardarChequeEnGrupo = (id,grupo) =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('cheques').child(id).update({
                grupo:grupo
        })
        .then(()=>{
            setshowSnackbar('El cheque Se Agrego Al Grupo!')
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
        <Layout history={props.history} page="Cheques Personales" user={props.user.uid}>
            {/* CONTENT */}
            <Paper className={classes.content}>
                {/* CHEQUES TABLE */}
                <Grid container justify='center' alignItems='center' spacing={6}>
                    {/* props.cheques?
                        <Grid container item xs={12} justify='space-around'>
                            <Grid item>
                                <Card>
                                    <CardHeader title='Grupos de Cheques'/>
                                    <CardContent>
                                        {generateChartGrupos()}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        :
                        null
                    */}
                    {/* SEARCH BAR */}
                    <Grid container item xs={12} justify='center' alignItems='center' >
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
                                                    title={`$ ${formatMoney(sortedCheques[month].total)}`}
                                                    subheader={monthsList[month-1]}
                                                />
                                            </Card>
                                        </Grid>
                                        <Grid container item xs={12} justify='center' spacing={3}>
                                            {Object.keys(sortedCheques[month].cheques).map(cheque=>(
                                                <Cheque cheque={sortedCheques[month].cheques[cheque]} id={cheque} search={search} guardarChequeRebotado={guardarChequeRebotado} asentarAcreditacion={asentarAcreditacion} guardarChequeEnGrupo={guardarChequeEnGrupo} />    
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
        cheques:state.chequesPersonales,
        clientes:state.clientes,
        proveedores:state.proveedores
    }
}
export default connect(mapStateToProps,null)(ChequesPersonales)