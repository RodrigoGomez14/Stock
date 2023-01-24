import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Card,Paper,Grid,CardHeader,CardContent,IconButton,Backdrop,Snackbar,CircularProgress} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {EditOutlined,DeleteOutline} from '@material-ui/icons'
import {Deuda} from '../components/Proveedor/Deuda'
import {ListaDePedidos} from '../components/Cliente/ListaDePedidos'
import {Detalles} from '../components/Cliente/Detalles'
import {DialogConfirmDelete} from '../components/Cliente/DialogConfirmDelete'
import {database} from 'firebase'
import {Link} from 'react-router-dom'
import {content} from './styles/styles'
import { checkSearch } from '../utilities'
import ApexCharts from 'react-apexcharts';
import {formatMoney} from '../utilities'


// COMPONENT
const Proveedor=(props)=>{
    const classes = content()
    const [proveedor,setProveedor]= useState(props.proveedores[checkSearch(props.history.location.search)])
    const [showSnackbar, setshowSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchEntrega, setSearchEntrega] = useState(props.location.props?props.location.props.searchEntrega:'');
    const [showDialogConfirmDelete, setshowDialogConfirmDelete] = useState(false);

    const dark = 'dark'


    const [filteredEntregas,setFilteredEntregas] = useState(undefined)

    const generateChartDeudas = () => {
        // Asume que tienes los datos en dos variables: sortedCompras y sortedVentas
        const keyProveedor = checkSearch(props.location.search)
        const initialMonth = new Date(Date.now());
        initialMonth.setMonth(initialMonth.getMonth() - 6);
        let deudas = []
        let labels = []
        if(props.proveedores[keyProveedor].pagos){
            Object.keys(props.proveedores[keyProveedor].pagos).map(pago=>{
                const [day,month,year] = (props.proveedores[keyProveedor].pagos[pago].fecha).split('/')
                const auxFecha = new Date(0);
                auxFecha.setFullYear(year, month - 1, day);
                if(auxFecha>initialMonth){
                    deudas.push(props.proveedores[keyProveedor].pagos[pago].deudaActualizada)
                    labels.push(props.proveedores[keyProveedor].pagos[pago].fecha)
                }
            })
            if(deudas.length==1){
                let auxdeudas= [props.proveedores[keyProveedor].datos.deuda!=0?props.proveedores[keyProveedor].datos.deuda:0,...deudas]
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
            theme:{
                palette:'palette3'
            },
            stroke: {
                curve: 'smooth'
            },
            tooltip:{
                y:{
                    formatter: val=> `$ ${formatMoney(val)}`
                },
                theme:'dark'
            }
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
        const keyProveedor = checkSearch(props.location.search)
        let series = []
        let labels = []
        if(props.proveedores[keyProveedor].entregas){
            Object.keys(props.proveedores[keyProveedor].entregas).reverse().forEach((pedido) => {
                props.proveedores[keyProveedor].entregas[pedido].articulos.map(articulo=>{
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
                    subheader='Historico de Productos'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='donut' width={350}/>
                </CardContent>
            </Card>)
    }
    const generateChartAnualSales = () => {
        // Asume que tienes los datos en dos variables: sortedCompras y sortedVentas
        const actualYear = new Date().getFullYear()

        let sales = []
        let salesUltimoAnio
        let labelsUltimoAnio =  []

        if(filteredEntregas){
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
            console.log(filteredEntregas)
            for (const [year, data] of filteredEntregas) {
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
            arr1Sales.map(i=>{
                sales.push(i)
            })
            arr2Sales.map(i=>{
                sales.push(i)
            })

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
    
        // Renderiza el gráfico
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
        setLoading(true)
        const years = {};
        const keyProveedor = checkSearch(props.location.search)
        if(props.proveedores[keyProveedor].entregas){
            Object.keys(props.proveedores[keyProveedor].entregas).reverse().forEach((entrega) => {
                const year = props.proveedores[keyProveedor].entregas[entrega].fecha.split('/')[2];
                const month = props.proveedores[keyProveedor].entregas[entrega].fecha.split('/')[1];
            
                // Si aún no tenemos el año en el objeto "years", lo agregamos
                if (!years[year]) {
                    years[year] = { total: 0, months: {
                        1:{ total: 0, entregas: [] },
                        2:{ total: 0, entregas: [] },
                        3:{ total: 0, entregas: [] },
                        4:{ total: 0, entregas: [] },
                        5:{ total: 0, entregas: [] },
                        6:{ total: 0, entregas: [] },
                        7:{ total: 0, entregas: [] },
                        8:{ total: 0, entregas: [] },
                        9:{ total: 0, entregas: [] },
                        10:{ total: 0, entregas: [] },
                        11:{ total: 0, entregas: [] },
                        12:{ total: 0, entregas: [] }
                    }}
                }
            
                // Agregamos la compra al objeto "compras" del mes correspondiente
                years[year].months[month].entregas.push(props.proveedores[keyProveedor].entregas[entrega]);
            
                // Actualizamos el total del mes y del año
                years[year].months[month].total += parseInt(props.proveedores[keyProveedor].entregas[entrega].total, 10);
                years[year].total += parseInt(props.proveedores[keyProveedor].entregas[entrega].total, 10);
            });
    
            const sortedEntregas = Object.entries(years).sort(([year1], [year2]) => year2 - year1);
            setFilteredEntregas(sortedEntregas)
        }
        setTimeout(() => {
            setLoading(false)
        }, 500);
    },[props.proveedores])

    // FUNCTIONS
    const eliminarProveedor = () =>{
        setLoading(true)
        database().ref().child(props.user.uid).child('proveedores').child(proveedor.datos.nombre).remove()
        .then(()=>{
            setshowSnackbar('El Proveedor Se Elimino Correctamente')
            setTimeout(() => {
                setLoading(false)
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
        props.history.replace('/Proveedores')
    }
    const eliminarPedido = (id) =>{
        setLoading(true)
        database().ref(`${props.user.uid}/proveedores/${proveedor.datos.nombre}/pedidos/${id}`).remove()
        .then(()=>{
            setshowSnackbar(true)
            setTimeout(() => {
                setshowSnackbar(false)
                setLoading(false)
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }
    return(
        proveedor?
            <Layout history={props.history} page={`${proveedor.datos.nombre}`} user={props.user.uid}>
                {/* CONTENT */}
                <Paper className={classes.content}>
                    <Grid container justify='center' spacing={4}>
                        <Detalles {...proveedor.datos}/>
                        {!loading && filteredEntregas?
                            <Grid container item xs={12} justify='center' spacing={4}>
                                <Grid container item xs={12}>
                                    <Deuda deuda={proveedor.datos.deuda} id={proveedor.datos.nombre} generateChartDeudas={generateChartDeudas}/>
                                </Grid>
                                <Grid item>
                                    <Paper>
                                        {generateChartProductos()}
                                    </Paper>
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
                        <ListaDePedidos pedidos={filteredEntregas} eliminarPedido={eliminarPedido} searchPedido={searchEntrega} tipo='entrega'/>
                        <Grid item xs={12} sm={8}>
                            <Grid container item xs={12} justify='space-around' alignItems='flex-end'>
                                <Link to={{
                                    pathname: '/Editar-Proveedor',
                                    search:proveedor.datos.nombre
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
                {/* BACKDROP */}
                <Backdrop className={classes.backdrop} open={loading}>
                    {showSnackbar?
                        <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={()=>{setshowSnackbar(false)}}>
                            <Alert onClose={()=>{setshowSnackbar(false)}} severity="error" variant='filled'>
                                El Proveedor ha sido eliminado!
                            </Alert>
                        </Snackbar>
                        :
                        <CircularProgress color="inherit" />
                    }
                </Backdrop>
                <DialogConfirmDelete open={showDialogConfirmDelete} setOpen={setshowDialogConfirmDelete} eliminarCliente={eliminarProveedor}/>
            </Layout>
            :
            <>
                {props.history.replace('/Proveedores')}
            </>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        proveedores:state.proveedores
    }
}
export default connect(mapStateToProps,null)(Proveedor)