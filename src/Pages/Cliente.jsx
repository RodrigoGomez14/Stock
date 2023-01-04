import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,Grid,List,Typography,IconButton,Backdrop,Snackbar,CircularProgress} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {EditOutlined,DeleteOutline} from '@material-ui/icons'
import {Deuda} from '../components/Cliente/Deuda'
import {ListaDePedidos} from '../components/Cliente/ListaDePedidos'
import {Detalles} from '../components/Cliente/Detalles'
import {DialogConfirmDelete} from '../components/Cliente/DialogConfirmDelete'
import {database} from 'firebase'
import {Link} from 'react-router-dom'
import {content} from './styles/styles'
import {checkSearch} from '../utilities'
import ApexCharts from 'react-apexcharts';


// COMPONENT
const Cliente=(props)=>{
    const classes = content()
    const [cliente,setCliente]= useState(props.clientes[checkSearch(props.history.location.search)])
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading, setLoading] = useState(true);
    const [showDialogConfirmDelete, setshowDialogConfirmDelete] = useState(false);
    const [searchPedido, setSearchPedido] = useState(props.location.props?props.location.props.searchPedido:'');
    const [searchRemito, setSearchRemito] = useState(props.location.props?props.location.props.remito:'');

    const [filteredPedidos,setFilteredPedidos] = useState(undefined)


    const generateChartDeudas = () => {
        // Asume que tienes los datos en dos variables: sortedCompras y sortedVentas
        const keyCliente = checkSearch(props.location.search)
        let deudas = []
        let labels = []
        const initialMonth = new Date(Date.now());
        initialMonth.setMonth(initialMonth.getMonth() - 6);
        if(props.clientes[keyCliente].pagos){
            Object.keys(props.clientes[keyCliente].pagos).map(pago=>{
                const [day,month,year] = (props.clientes[keyCliente].pagos[pago].fecha).split('/')
                const auxFecha = new Date(0);
                auxFecha.setFullYear(year, month - 1, day);
                if(auxFecha>initialMonth){
                    deudas.push(props.clientes[keyCliente].pagos[pago].deudaActualizada)
                    labels.push(props.clientes[keyCliente].pagos[pago].fecha)
                }
            })
        }
    
        // Define la configuración del gráfico
        const options = {
            labels:labels,
            theme:{
                textColor:'#000'
            },
            chart:{
                sparkline: {
                    enabled: true
                },
            },
            tooltip:{
                theme:'dark'
            },
            stroke: {
                curve: 'smooth'
            },
        };
    
        // Define los datos a visualizar
        const series = [
            {
            name: 'Deuda',
            data: deudas,
            },
        ];
    
        // Renderiza el gráfico
        return <ApexCharts options={options} series={series} type='area' height={150}/>;
    }
    const generateChartProductos = () => {
        // Asume que tienes los datos en dos variables: sortedCompras y sortedVentas
        const keyCliente = checkSearch(props.location.search)
        let series = []
        let labels = []
        if(props.clientes[keyCliente].pedidos){
            Object.keys(props.clientes[keyCliente].pedidos).reverse().forEach((pedido) => {
                props.clientes[keyCliente].pedidos[pedido].articulos.map(articulo=>{
                    const pos = labels.indexOf(articulo.producto);
                    if (pos !== -1) {
                    series[pos] += parseInt(articulo.cantidad);
                    } else {
                    series.push(parseInt(articulo.cantidad));
                    labels.push(articulo.producto);
                    }
                })
            });
        }
        // Define la configuración del gráfico
        const options = {
            labels:labels,
            title: {
                text: 'Ventas Por Producto',
                align: 'left'
            },
            chart:{
                sparkline:{
                    enabled:true
                }
            },
            theme:{
                textColor:'#fff'
            },
            tooltip:{
                theme:'dark'
            },
        };
    
    
        // Renderiza el gráfico
        return <ApexCharts options={options} series={series} type='donut' />;
    }
    const generateChartAnualSales = () => {
        // Asume que tienes los datos en dos variables: sortedCompras y sortedVentas
        const actualYear = new Date().getFullYear()

        let sales = [0,0,0,0,0,0,0,0,0,0,0,0]
        if(filteredPedidos){
            for (const [year, data] of filteredPedidos) {
                // Itera sobre cada mes en el año
                for (const [month, dataMonth] of Object.entries(data.months)) {
                if(year == actualYear.toString()){
                    console.log(month)
                    sales[month-1]=(dataMonth.total);
                }
                }
            }
        }
        // Define la configuración del gráfico
        const options = {
            labels:['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep','Oct','Nov',"Dic"],
            title: {
                text: 'Ventas Por Mes',
                align: 'left'
            },
            theme:{
                textColor:'#fff'
            },
            tooltip:{
                theme:'dark'
            },
            grid: {
                row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.5
                },
            },
        };
        const series=[{
            name:'Ventas',
            data:sales
        }
        ]
    
        // Renderiza el gráfico
        return <ApexCharts options={options} type='bar' series={series} width={450}/>;
    }
    // FILTRADO DE INFORMACION 
    useEffect(()=>{
        const years = {};
        const keyCliente = checkSearch(props.location.search)
        if(props.clientes[keyCliente].pedidos){
            Object.keys(props.clientes[keyCliente].pedidos).reverse().forEach((pedido) => {
                const year = props.clientes[keyCliente].pedidos[pedido].fecha.split('/')[2];
                const month = props.clientes[keyCliente].pedidos[pedido].fecha.split('/')[1];
            
                // Si aún no tenemos el año en el objeto "years", lo agregamos
                if (!years[year]) {
                years[year] = { total: 0, months: {} };
                }
            
                // Si aún no tenemos el mes en el objeto "months", lo agregamos
                if (!years[year].months[month]) {
                years[year].months[month] = { total: 0, pedidos: [] };
                }
            
                // Agregamos la compra al objeto "compras" del mes correspondiente
                years[year].months[month].pedidos.push(props.clientes[keyCliente].pedidos[pedido]);
            
                // Actualizamos el total del mes y del año
                years[year].months[month].total += parseInt(props.clientes[keyCliente].pedidos[pedido].total, 10);
                years[year].total += parseInt(props.clientes[keyCliente].pedidos[pedido].total, 10);
            }); 
    
            const sortedPedidos = Object.entries(years).sort(([year1], [year2]) => year2 - year1);
    
            setFilteredPedidos(sortedPedidos)
        }
        setTimeout(() => {
            setLoading(false)
        }, 500);
    },[props.clientes])

    // FUNCTIONS
    const eliminarCliente = () =>{
        setLoading(true)
        const ref = database().ref().child(props.user.uid).child('clientes').child(cliente.datos.nombre).remove()
        .then(()=>{
            setshowSnackbar('El cliente ha sido eliminado!')
            setTimeout(() => {
                setLoading(false)
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
        props.history.replace('/Clientes')
    }
    const eliminarPedido = (id) =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('clientes').child(cliente.datos.nombre).child('pedidos').child(id).remove()
        .then(()=>{
            setshowSnackbar('El Pedido ha sido eliminado!')
            setTimeout(() => {
                setLoading(false)
                props.history.replace(`/Cliente?${props.history.location.search}`)
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }

    return(
        cliente?
            <Layout history={props.history} page={`${cliente.datos.nombre}`} user={props.user.uid}>
                {/* CONTENT */}
                <Paper className={classes.content}>
                    <Grid container justify='center' spacing={4}>
                        <Detalles {...cliente.datos}/>
                        <Grid container item xs={12} justify='center' spacing={4}>
                            <Grid item>
                                {generateChartProductos()}
                            </Grid>
                            <Grid item>
                                <Deuda deuda={cliente.datos.deuda} id={cliente.datos.nombre} generateChartDeudas={generateChartDeudas}/>
                            </Grid>
                            <Grid item>
                                {generateChartAnualSales()}
                            </Grid>
                        </Grid>
                        <ListaDePedidos pedidos={filteredPedidos} eliminarPedido={eliminarPedido} searchPedido={searchPedido} searchRemito={searchRemito} tipo='pedido'/>
                        <Grid item xs={12} sm={8}>
                            <Grid container item xs={12} justify='space-around' alignItems='flex-end'>
                                <Link to={{
                                    pathname: '/Editar-Cliente',
                                    search:cliente.datos.nombre
                                }}>
                                    <IconButton>
                                        <EditOutlined/>
                                    </IconButton>
                                </Link>
                                <IconButton onClick={()=>{setshowDialogConfirmDelete(true)}}>
                                    <DeleteOutline color='error'/>
                                </IconButton>
                            </Grid>
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

                {/* DIALOGS */}
                <DialogConfirmDelete open={showDialogConfirmDelete} setOpen={setshowDialogConfirmDelete} eliminarCliente={eliminarCliente}/>
            </Layout>
            :
            <>
                {props.history.replace('/Clientes')}
            </>
    )
}

// REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        clientes:state.clientes,
        photosList:state.photosList
    }
}
export default connect(mapStateToProps,null)(Cliente)