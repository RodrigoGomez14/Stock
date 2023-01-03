import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {content} from './styles/styles'
import {Paper,Grid,Typography,Backdrop,CircularProgress,Snackbar} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import Home from '../images/Home.png'
import ApexCharts from 'react-apexcharts';
import {formatMoney} from '../utilities'

//COMPONENT
const Menu=(props)=>{
    const classes = content()
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading,setLoading] = useState(true)
    const [sortedCompras,setSortedCompras] = useState(undefined)
    const [sortedVentas,setSortedVentas] = useState(undefined)
    const [sortedProductos,setSortedProductos] = useState(undefined)

    const generateChartAnualSales = () => {
        // Asume que tienes los datos en dos variables: sortedCompras y sortedVentas
        const actualYear = new Date().getFullYear()

        const compras = [0,0,0,0,0,0,0,0,0,0,0,0];
        const ventas = [0,0,0,0,0,0,0,0,0,0,0,0];
    
        // Itera sobre cada año en sortedCompras y sortedVentas
        for (const [year, data] of sortedCompras) {
            // Itera sobre cada mes en el año
            for (const [month, dataMonth] of Object.entries(data.months)) {
            if(year == actualYear){
                compras[month-1]=(dataMonth.total);
            }
            }
        }
    
        for (const [year, data] of sortedVentas) {
            // Itera sobre cada mes en el año
            for (const [month, dataMonth] of Object.entries(data.months)) {
            if(year == actualYear){
                ventas[month-1]=(dataMonth.total);
            }
            }
        }
    
        // Define la configuración del gráfico
        const options = {
            labels:['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep','Oct','Nov',"Dic"],
            title: {
                text: 'Compras y Ventas Por Mes',
                align: 'left'
            },
            theme:{
                textColor:'#000'
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
        };
    
        // Define los datos a visualizar
        const series = [
            {
            name: 'Compras',
            data: compras,
            },
            {
            name: 'Ventas',
            data: ventas,
            },
        ];
    
        // Renderiza el gráfico
        return <ApexCharts options={options} series={series} type='area' height={350} width={700} />;
    }
    const generateChartAnualProductsValue = () => {
        const actualYear = new Date().getFullYear()

        const series = [];
        const labels = [];
        
        sortedProductos.map((d)=>{
            series.push(d.total)
            labels.push(d.producto)
        })
        // Define la configuración del gráfico
        const options = {
            series:series,
            labels:labels,
            title: {
                text: 'Ingresos Por Producto',
                align: 'left'
            },
            theme:{
                colors:{
                    title: '#ffffff',
                    yaxis: {
                        labels: '#ffffff'
                    }
                }
            },
            
        };
    
    
        // Renderiza el gráfico
        return (<ApexCharts options={options} series={series} type='donut'   width={500} />)
    }
    const generateChartMonthSalesUnits = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

        const series = [
            {
            name: 'Compras',
            data: Array.from({ length: daysInMonth }, () => 0),
            },
        ];
        
    

        for (const [year, data] of sortedVentas) {
            // Itera sobre cada mes en el año
            for (const [month, dataMonth] of Object.entries(data.months)) {
                if(year == currentYear){
                    if(month-1==currentMonth){
                        dataMonth.ventas.map((venta,i)=>{
                            series[0].data[dataMonth.ventas[i].fecha.split('/')[0]-1] += 1
                        })
                    }
                }
            }
        }

        // Define la configuración del gráfico
        const options = {
            labels:Array.from({ length: daysInMonth }, (value, index) => (index + 1).toString()),
            title: {
                text: 'Ventas del mes',
                align: 'left'
            },
            theme:{
                textColor:'#000'
            },
            stroke: {
                curve: 'smooth'
            },
            chart:{
                sparkline: {
                    enabled: true
                },
            },
            grid: {
                row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.5
                },
            },
        };
    
        let totalMonth = 0

        series.map(serie=>(
            totalMonth+= serie
        ))
        // Renderiza el gráfico
        return (
            <Grid container xs={12}>
                <Grid container item xs={12}>
                    <Typography>
                    Total {totalMonth}

                    </Typography>
                </Grid>
                <Grid container item xs={12}>
                    <ApexCharts options={options} series={series} width={300} />
                </Grid>
            </Grid>
        )
    }
    const generateChartAnualProductsUnits = () => {
        const actualYear = new Date().getFullYear()

        const series = [];
        const labels = [];
        
        sortedProductos.map((d)=>{
            series.push(d.cantidad)
            labels.push(d.producto)
        })
        // Define la configuración del gráfico
        const options = {
            series:series,
            labels:labels,
            title: {
                text: 'Ventas por producto',
                align: 'left'
            },
            theme:{
                colors:{
                    title: '#ffffff',
                    yaxis: {
                        labels: '#ffffff'
                    }
                }
            },
            chart: {
            },
            stroke: {
                curve: 'straight'
            }
        };
    
    
        // Renderiza el gráfico
        return (<ApexCharts options={options} series={series} type='donut'   width={500} />)
    }
    const filtrarCompras = () =>{
        const yearsCompras = {};
        if(props.ventas){
            Object.keys(props.compras).reverse().forEach((compra) => {
                const year = props.compras[compra].fecha.split('/')[2];
                const month = props.compras[compra].fecha.split('/')[1];
            
                // Si aún no tenemos el año en el objeto "years", lo agregamos
                if (!yearsCompras[year]) {
                yearsCompras[year] = { total: 0, months: {} };
                }
            
                // Si aún no tenemos el mes en el objeto "months", lo agregamos
                if (!yearsCompras[year].months[month]) {
                yearsCompras[year].months[month] = { total: 0, compras: [] };
                }
            
                // Agregamos la compra al objeto "compras" del mes correspondiente
                yearsCompras[year].months[month].compras.push(props.compras[compra]);
            
                // Actualizamos el total del mes y del año
                yearsCompras[year].months[month].total += parseInt(props.compras[compra].total, 10);
                yearsCompras[year].total += parseInt(props.compras[compra].total, 10);
            });
        
            const sortedCompras = Object.entries(yearsCompras).sort(([year1], [year2]) => year2 - year1);
            return sortedCompras
        }
    }
    const filtrarVentas = () =>{
        const yearsVentas = {};
        if(props.ventas){
            Object.keys(props.ventas).reverse().forEach((venta) => {
                const year = props.ventas[venta].fecha.split('/')[2];
                const month = props.ventas[venta].fecha.split('/')[1];
            
                // Si aún no tenemos el año en el objeto "years", lo agregamos
                if (!yearsVentas[year]) {
                yearsVentas[year] = { total: 0, months: {} };
                }
            
                // Si aún no tenemos el mes en el objeto "months", lo agregamos
                if (!yearsVentas[year].months[month]) {
                yearsVentas[year].months[month] = { total: 0, ventas: [] };
                }
            
                // Agregamos la venta al objeto "ventas" del mes correspondiente
                yearsVentas[year].months[month].ventas.push(props.ventas[venta]);
            
                // Actualizamos el total del mes y del año
                yearsVentas[year].months[month].total += parseInt(props.ventas[venta].total, 10);
                yearsVentas[year].total += parseInt(props.ventas[venta].total, 10);
            });
        
            const sortedVentas = Object.entries(yearsVentas).sort(([year1], [year2]) => year2 - year1);
        
            return sortedVentas
        }
    }
    const filtrarProductos = (ventas) =>{
        const currentYear = new Date().getFullYear();

        const data = [];
        console.log(ventas)
        if(ventas){
            ventas.filter(([year]) => year === (currentYear).toString()).forEach(([_, yearData]) => {
                Object.keys(yearData.months).map((month) => {
                    yearData.months[month].ventas.map((venta,i)=>{
                        yearData.months[month].ventas[i].articulos.map((articulo,v)=>{
                            // Verificamos si ya tenemos el producto en el array
                            const index = data.findIndex((d) => d.producto === yearData.months[month].ventas[i].articulos[v].producto);
                            if (index === -1) {
                                // Si no lo encontramos, lo agregamos
                                data.push({ producto: yearData.months[month].ventas[i].articulos[v].producto, cantidad: parseInt(yearData.months[month].ventas[i].articulos[v].cantidad),total:yearData.months[month].ventas[i].articulos[v].total });
                            } else {
                                // Si lo encontramos, sumamos la cantidad y el total
                                data[index].cantidad += parseInt(yearData.months[month].ventas[i].articulos[v].cantidad);
                                data[index].total += yearData.months[month].ventas[i].articulos[v].total;
                            }
                        })
                    })
                });
            })
            return data
        }
    }
    useEffect(()=>{
        setLoading(true)

        const auxSortedCompras = filtrarCompras()
        const auxSortedVentas = filtrarVentas()
        const auxSortedProductos = filtrarProductos(auxSortedVentas)
        setSortedCompras(auxSortedCompras)
        setSortedVentas(auxSortedVentas)
        setSortedProductos(auxSortedProductos)

        setLoading(false)
    },[props.compras,props.ventas])


    

    return(
        //Layout
        <Layout history={props.history} page="Menu" user={props.user.uid}>
            <Paper className={classes.content}>
                <Grid container item xs={12}>
                    {!loading && props.ventas?
                        <Grid container xs={12} spacing={3}>
                            <Grid container item xs={12}>
                                <Paper style={{backgroundColor:'#fff'}}>
                                    {generateChartAnualSales()}
                                </Paper>
                            </Grid>
                            <Grid container item xs={12} justify='center' spacing={3}>
                                <Grid item>
                                    <Paper style={{backgroundColor:'#fff'}}>
                                        {generateChartAnualProductsValue()}
                                    </Paper>
                                </Grid>
                                <Grid item>
                                    <Paper style={{backgroundColor:'#fff'}}>
                                        {generateChartAnualProductsUnits()}
                                    </Paper>
                                </Grid>
                                <Grid item>
                                    <Paper style={{backgroundColor:'#fff'}}>
                                        {generateChartMonthSalesUnits()}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                        :
                        null
                    }
                </Grid>
                <Grid container xs={12} justify='center' spacing={2}>
                    <Grid container item xs={12} justify='center'>
                        <Typography variant='h4'>Seccion En Construccion</Typography>
                    </Grid>
                    <Grid item>
                        <img src={Home} alt="" height='600px'/>
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

//REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        compras:state.compras,
        ventas:state.ventas,
    }
}
export default connect(mapStateToProps,null)(Menu)