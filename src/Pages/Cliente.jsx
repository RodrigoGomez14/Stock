import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Card,Paper,Grid,CardHeader,CardContent,IconButton,Backdrop,Snackbar,CircularProgress} from '@material-ui/core'
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
import {formatMoney} from '../utilities'


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
            if(deudas.length==1){
                let auxdeudas= [props.clientes[keyCliente].datos.deuda!=0?props.clientes[keyCliente].datos.deuda:0,...deudas]
                deudas=auxdeudas
            }
        }
    
        // Define la configuración del gráfico
        const options = {
            labels:labels,
            chart:{
                sparkline: {
                    enabled: true
                },
            },
            stroke: {
                curve: 'smooth'
            },
            tooltip:{
                y:{
                    formatter: val=> `$ ${formatMoney(val)}`
                },
                theme:'dark'
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
            chart:{
                sparkline:{
                    enabled:true
                }
            },
            theme:{
                mode:'dark'
            },
            tooltip:{
                fillSeriesColor:false
            }
        };
    
    
        // Renderiza el gráfico
        return (
            <Card>
                <CardHeader
                    subheader='Historico De Productos'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='donut' width={350} />
                </CardContent>
            </Card>)
    }
    const generateChartProductosValue = () => {
        // Asume que tienes los datos en dos variables: sortedCompras y sortedVentas
        const keyCliente = checkSearch(props.location.search)
        let series = []
        let labels = []
        if(props.clientes[keyCliente].pedidos){
            Object.keys(props.clientes[keyCliente].pedidos).reverse().forEach((pedido) => {
                props.clientes[keyCliente].pedidos[pedido].articulos.map(articulo=>{
                    const pos = labels.indexOf(articulo.producto);
                    if (pos !== -1) {
                        if(props.clientes[keyCliente].pedidos[pedido].metodoDePago.facturacion){
                            series[pos] += parseInt(articulo.total/1.21);
                        }
                        else{
                            series[pos] += parseInt(articulo.total);
                        }
                    } 
                    else {
                        if(props.clientes[keyCliente].pedidos[pedido].metodoDePago.facturacion){
                            series.push(parseInt(articulo.total/1.21));
                            labels.push(articulo.producto);
                        }
                        else{
                            series.push(parseInt(articulo.total));
                            labels.push(articulo.producto);
                        }
                    }
                })
            });
        }
        // Define la configuración del gráfico
        const options = {
            labels:labels,
            chart:{
                sparkline:{
                    enabled:true
                }
            },
            theme:{
                mode:'dark'
            },
            tooltip:{
                fillSeriesColor:false
            },
            tooltip:{
                fillSeriesColor:false,
                y:{
                    formatter: val=> `$ ${formatMoney(val)}`
                }
            },
        };
    
    
        // Renderiza el gráfico
        return (
            <Card>
                <CardHeader
                    subheader='Ingreso Historico por Producto'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='donut' width={350} />
                </CardContent>
            </Card>)
    }
    const generateChartAnualSales = () => {
        // Asume que tienes los datos en dos variables: sortedCompras y sortedVentas
        const actualYear = new Date().getFullYear()

        let sales = []
        let labelsUltimoAnio =  []

        if(filteredPedidos){
            const fechaActual = new Date();
            const mesActual = fechaActual.getMonth();
            const anioActual = fechaActual.getFullYear();
            let auxSales = []

            const mesesDesdeUltimoAnio = 12;
            let mesInicio = mesActual - mesesDesdeUltimoAnio;
            let anioInicio = anioActual;
            if (mesInicio < 0) {
                mesInicio += 12;
                anioInicio -= 1;
            }
            const initialDate = new Date(0)
            initialDate.setFullYear(anioInicio,mesInicio,1)
            console.log(filteredPedidos)
            for (const [year, data] of filteredPedidos) {
                // Itera sobre cada mes en el año
                for (const [month, dataMonth] of Object.entries(data.months)) {
                        const auxFecha = new Date(0);
                        auxFecha.setFullYear(year, month - 1, 1);
                        if(auxFecha>initialDate && auxFecha<fechaActual){
                            auxSales.push(dataMonth.total)
                        }
                }
            }
            if(auxSales.length<12){
                console.log(auxSales)
                const padding = new Array(12 - auxSales.length).fill(0);
                padding.map(i=>{
                    auxSales.push(i)
                })
            }
            const auxMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
            const arr1Meses = auxMeses.slice(mesInicio+1);
            const arr2Meses = auxMeses.slice(0,mesInicio+1);

            
            const arr1Sales = auxSales.slice(mesInicio+1);
            const arr2Sales = auxSales.slice(0,mesInicio+1);
            
            
            arr1Meses.map(i=>{
                labelsUltimoAnio.push(i)
            })
            arr2Meses.map(i=>{
                labelsUltimoAnio.push(i)
            })
            
            console.log(sales)
            arr1Sales.map(i=>{
                sales.push(i)
            })
            arr2Sales.map(i=>{
                sales.push(i)
            })
            console.log(sales)
            console.log(labelsUltimoAnio)

        }
        // Define la configuración del gráfico
        const options = {
            labels:labelsUltimoAnio,
            theme:{
                mode:'dark',
                palette:'palette2'
            },
            stroke: {
                curve: 'smooth'
            },
            grid: {
                row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.5
                },
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
                formatter: val=> `$ ${formatMoney(val)}`
            },
            yaxis:{
                labels:{
                    show:false
                }
            }
        };
        const series=[{
            name:'Compras',
            data:sales
        }
        ]
    
        return (
            <Card>
                <CardHeader
                    subheader='Ventas - Ultimos 12 Meses'
                />
                <CardContent>
                    <ApexCharts options={options} type='area' series={series} width={850} height={275}/>
                </CardContent>
            </Card>)
    }
    // FILTRADO DE INFORMACION 
    useEffect(()=>{
        const years = {};
        const keyCliente = checkSearch(props.location.search)
        if(props.clientes[keyCliente].pedidos){
            Object.keys(props.clientes[keyCliente].pedidos).reverse().forEach((pedido) => {
                const year = props.clientes[keyCliente].pedidos[pedido].fecha.split('/')[2];
                const month = props.clientes[keyCliente].pedidos[pedido].fecha.split('/')[1];
            
                if (!years[year]) {
                    years[year] = { total: 0, months: {
                        1:{ total: 0, pedidos: [] },
                        2:{ total: 0, pedidos: [] },
                        3:{ total: 0, pedidos: [] },
                        4:{ total: 0, pedidos: [] },
                        5:{ total: 0, pedidos: [] },
                        6:{ total: 0, pedidos: [] },
                        7:{ total: 0, pedidos: [] },
                        8:{ total: 0, pedidos: [] },
                        9:{ total: 0, pedidos: [] },
                        10:{ total: 0, pedidos: [] },
                        11:{ total: 0, pedidos: [] },
                        12:{ total: 0, pedidos: [] }
                    }}
                }
            
                // Agregamos la compra al objeto "compras" del mes correspondiente
                years[year].months[month].pedidos.push(props.clientes[keyCliente].pedidos[pedido]);
            
                // Actualizamos el total del mes y del año
                years[year].months[month].total += parseInt((props.clientes[keyCliente].pedidos[pedido].total?props.clientes[keyCliente].pedidos[pedido].total:0), 10);
                years[year].total += parseInt((props.clientes[keyCliente].pedidos[pedido].total?props.clientes[keyCliente].pedidos[pedido].total:0), 10);
            }); 
    
            const sortedPedidos = Object.entries(years).sort(([year1], [year2]) => year2 - year1);
            
            console.log(sortedPedidos)
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
                        {!loading && filteredPedidos?
                            <Grid container item xs={12} justify='center' spacing={4}>
                                <Grid container item xs={12}>
                                    <Deuda deuda={cliente.datos.deuda} id={cliente.datos.nombre} generateChartDeudas={generateChartDeudas}/>
                                </Grid>
                                <Grid item>
                                        {generateChartProductos()}
                                </Grid>
                                <Grid item>
                                    <Paper>
                                        {generateChartAnualSales()}
                                    </Paper>
                                </Grid>
                            </Grid>
                            :
                            null
                        }
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