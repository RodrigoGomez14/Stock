import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {content} from './styles/styles'
import {Paper,Grid,Typography,Backdrop,CircularProgress,Snackbar,Card,CardHeader,CardContent,Box,AppBar,Tabs,Tab} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import Home from '../images/Home.png'
import ApexCharts from 'react-apexcharts';
import {formatMoney} from '../utilities'

//COMPONENT
const Inicio=(props)=>{
    const classes = content()
    const [showSnackbar, setshowSnackbar] = useState('');
    const [loading,setLoading] = useState(true)
    const [sortedCompras,setSortedCompras] = useState(undefined)
    const [sortedVentas,setSortedVentas] = useState(undefined)
    const [value,setValue]=useState(0)
    const [sortedProductos,setSortedProductos] = useState(undefined)
    const [valueTabProductos,setValueTabProductos]=useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const TabPanel=(props)=>{
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            className={classes.tabPanelDeuda}
            hidden={value !== index}
          >
            {value === index && (
              <Box p={3}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        )
    }

    // CHARTS
    const generateChartAnualSales = () => {
        // Asume que tienes los datos en dos variables: sortedCompras y sortedVentas
        const actualYear = new Date().getFullYear()

        let sales = []
        let purchases =[]
        let labelsUltimoAnio =  []

        if(sortedCompras || sortedVentas){
            const fechaActual = new Date();
            const mesActual = fechaActual.getMonth();
            const anioActual = fechaActual.getFullYear();
            let auxSales = []
            let auxPurchases = []

            const mesesDesdeUltimoAnio = 12;
            let mesInicio = mesActual - mesesDesdeUltimoAnio;
            let anioInicio = anioActual;
            if (mesInicio < 0) {
                mesInicio += 12;
                anioInicio -= 1;
            }
            const initialDate = new Date(0)
            initialDate.setFullYear(anioInicio,mesInicio,1)
            if(sortedVentas){
                for (const [year, data] of sortedVentas) {
                    // Itera sobre cada mes en el año
                    for (const [month, dataMonth] of Object.entries(data.months)) {
                            const auxFecha = new Date(0);
                            auxFecha.setFullYear(year, month - 1, 1);
                            if(auxFecha>initialDate && auxFecha<fechaActual){
                                auxSales.push(dataMonth.total)
                            }
                    }
                }
            }
            if(sortedCompras){
                for (const [year, data] of sortedCompras) {
                    // Itera sobre cada mes en el año
                    for (const [month, dataMonth] of Object.entries(data.months)) {
                            const auxFecha = new Date(0);
                            auxFecha.setFullYear(year, month - 1, 1);
                            if(auxFecha>initialDate && auxFecha<fechaActual){
                                auxPurchases.push(dataMonth.total)
                            }
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
            if(auxPurchases.length<12){
                console.log(auxPurchases)
                const padding = new Array(12 - auxPurchases.length).fill(0);
                padding.map(i=>{
                    auxPurchases.push(i)
                })
            }
            const auxMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
            const arr1Meses = auxMeses.slice(mesInicio+1);
            const arr2Meses = auxMeses.slice(0,mesInicio+1);

            
            const arr1Sales = auxSales.slice(mesInicio+1);
            const arr2Sales = auxSales.slice(0,mesInicio+1);

            const arr1Purchases = auxPurchases.slice(mesInicio+1);
            const arr2Purchases = auxPurchases.slice(0,mesInicio+1);
            
            
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

            arr1Purchases.map(i=>{
                purchases.push(i)
            })
            arr2Purchases.map(i=>{
                purchases.push(i)
            })

        }
        // Define la configuración del gráfico
        const options = {
            labels:labelsUltimoAnio,
            title: {
                text: 'Compras y Ventas a lo largo del año',
                align: 'left',
            },
            fill: {
                colors: ['#1A73E8', 'transparent']
            },
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
                    formatter: val => `$ ${formatMoney(val)}`,
                }
            }
        };
        const series=[
        {
            name:'Ventas',
            data:sales
        },
        {
            name:'Compras',
            data:purchases
        },
        ]
        // Renderiza el gráfico
        return <ApexCharts options={options} series={series} type='area'  height={400} width={1200} />;
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
                text: 'Ingresos Por Producto Historico',
                align: 'left'
            },
            theme:{
                mode:'dark',
                palette:'palette2'
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
        return (<ApexCharts options={options} series={series} type='donut'   width={450} />)
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
                text: 'Ventas por Producto Historico',
                align: 'left'
            },
            theme:{
                mode:'dark',
                palette:'palette2'

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
        return (<ApexCharts options={options} series={series} type='donut'   width={450} />)
    }
    const generateChartMonthSalesUnits = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

        const series = [
            {
                name: 'Ventas',
                data: Array.from({ length: daysInMonth }, () => 0),
            },
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
                        let auxSales= 0
                        dataMonth.ventas.map((venta,i)=>{
                            auxSales +=1
                            const day = dataMonth.ventas[i].fecha.split('/')[0]-1
                            series[0].data[day] = (series[0].data[day])+1
                        })
                    }
                }
            }
        }
        for (const [year, data] of sortedCompras) {
            // Itera sobre cada mes en el año
            for (const [month, dataMonth] of Object.entries(data.months)) {
                if(year == currentYear){
                    if(month-1==currentMonth){
                        let auxSales= 0
                        dataMonth.compras.map((compra,i)=>{
                            auxSales +=1
                            const day = dataMonth.compras[i].fecha.split('/')[0]-1
                            series[1].data[day] = (series[0].data[day])+1
                        })
                    }
                }
            }
        }

        // Define la configuración del gráfico
        const options = {
            labels:Array.from({ length: daysInMonth }, (value, index) => (index + 1).toString()),
            theme:{
                mode:'dark'
            },
            stroke: {
                curve: 'smooth'
            },
            chart:{
                sparkline: {
                    enabled: true
                },
            },
        };
    
        let totalMonthSales = 0
        let totalMonthPurchases = 0

        series[0].data.map(serie=>(
            totalMonthSales = totalMonthSales + serie
        ))
        series[1].data.map(serie=>(
            totalMonthPurchases = totalMonthPurchases + serie
        ))
        // Renderiza el gráfico
        return (
            <Card>
                <CardHeader
                    title={`${totalMonthSales} - ${totalMonthPurchases}`}
                    subheader='Ventas - Compras en el mes'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='area' width={275} height={100}  />
                </CardContent>
            </Card>)
    }
    const generateChartMonthSalesValue = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

        const series = [
            {
            name: 'Ventas',
            data: Array.from({ length: daysInMonth }, () => 0),
            },
        ];
        
    

        for (const [year, data] of sortedVentas) {
            // Itera sobre cada mes en el año
            for (const [month, dataMonth] of Object.entries(data.months)) {
                if(year == currentYear){
                    if(month-1==currentMonth){
                        let auxSales= 0
                        dataMonth.ventas.map((venta,i)=>{
                            auxSales +=1
                            const day = dataMonth.ventas[i].fecha.split('/')[0]-1
                            series[0].data[day] = (series[0].data[day])+dataMonth.ventas[i].total
                            if(dataMonth.ventas[i].metodoDePago.facturacion){
                                series[0].data[day] = (series[0].data[day])-(dataMonth.ventas[i].total-dataMonth.ventas[i].total/1.21)
                            }
                        })
                    }
                }
            }
        }

        // Define la configuración del gráfico
        const options = {
            labels:Array.from({ length: daysInMonth }, (value, index) => (index + 1).toString()),
            theme:{
                mode:'dark'
            },
            stroke: {
                curve: 'smooth'
            },
            chart:{
                sparkline: {
                    enabled: true
                },
            },
            tooltip:{
                y:{
                    formatter: val=> `$ ${formatMoney(val)}`
                }
            }
        };
    
        let totalMonth = 0

        series[0].data.map(serie=>(
            totalMonth = totalMonth + serie
        ))
        // Renderiza el gráfico
        return (
            <Card>
                <CardHeader
                    title={`$ ${formatMoney(totalMonth)}`}
                    subheader='Ventas en el mes'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='area' width={275} height={100} />
                </CardContent>
            </Card>)
    }
    const generateChartMonthIva = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        const series = [
            {
            name: 'Iva Ventas',
            data: Array.from({ length: daysInMonth }, () => 0),
            },
            {
            name: 'Iva Compras',
            data: Array.from({ length: daysInMonth }, () => 0),
            },
        ];
        
    

        for (const [year, data] of sortedVentas) {
            // Itera sobre cada mes en el año
            for (const [month, dataMonth] of Object.entries(data.months)) {
                if(year == currentYear){
                    if(month-1==currentMonth){
                        let auxSales= 0
                        dataMonth.ventas.map((venta,i)=>{
                            auxSales +=1
                            const day = dataMonth.ventas[i].fecha.split('/')[0]-1
                            if(dataMonth.ventas[i].metodoDePago.facturacion){
                                series[0].data[day] = (series[0].data[day])+dataMonth.ventas[i].total-(dataMonth.ventas[i].total/1.21)
                            }
                        })
                    }
                }
            }
        }
        for (const [year, data] of sortedCompras) {
            // Itera sobre cada mes en el año
            for (const [month, dataMonth] of Object.entries(data.months)) {
                if(year == currentYear){
                    if(month-1==currentMonth){
                        let auxSales= 0
                        dataMonth.compras.map((venta,i)=>{
                            auxSales +=1
                            const day = dataMonth.compras[i].fecha.split('/')[0]-1
                            if(dataMonth.compras[i].metodoDePago.facturacion){
                                series[1].data[day] = (series[1].data[day]) + ((dataMonth.compras[i].total) - (dataMonth.compras[i].total/1.21))
                            }
                        })
                    }
                }
            }
        }
        let totalMonth = 0
        series[0].data.map(i=>{
            totalMonth+=i
        })
        series[1].data.map(i=>{
            totalMonth-=i
        })
        // Define la configuración del gráfico
        const options = {
            labels:Array.from({ length: daysInMonth }, (value, index) => (index + 1).toString()),
            theme:{
                mode:'dark'
            },
            stroke: {
                curve: 'smooth'
            },
            chart:{
                sparkline: {
                    enabled: true
                },
            },
            tooltip:{
                y:{
                    formatter: val=> `$ ${formatMoney(val)}`
                }
            }
        };

        // Renderiza el gráfico
        return (
            <Card>
                <CardHeader
                    title={`$ ${formatMoney(totalMonth)}`}
                    subheader='Iva del Mes'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='area' width={275} height={100} />
                </CardContent>
            </Card>)
    }
    const generateChartMonthBalance = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

        const series = [
            {
            name: 'Balance',
            data: Array.from({ length: daysInMonth }, () => 0),
            },
        ];
        
    
        let auxBalance = 0
        for (const [year, data] of sortedVentas) {
            // Itera sobre cada mes en el año
            for (const [month, dataMonth] of Object.entries(data.months)) {
                if(year == currentYear){
                    if(month-1==currentMonth){
                        dataMonth.ventas.map((venta,i)=>{
                            const day = dataMonth.ventas[i].fecha.split('/')[0]-1
                            auxBalance+= dataMonth.ventas[i].total
                            series[0].data[day] = (series[0].data[day])+dataMonth.ventas[i].total
                        })
                    }
                }
            }
        }
        for (const [year, data] of sortedCompras) {
            // Itera sobre cada mes en el año
            for (const [month, dataMonth] of Object.entries(data.months)) {
                if(year == currentYear){
                    if(month-1==currentMonth){
                        dataMonth.compras.map((venta,i)=>{
                            auxBalance-= dataMonth.compras[i].total
                            const day = dataMonth.compras[i].fecha.split('/')[0]-1
                            series[0].data[day] = (series[0].data[day])-dataMonth.compras[i].total
                        })
                    }
                }
            }
        }

        // Define la configuración del gráfico
        const options = {
            labels:Array.from({ length: daysInMonth }, (value, index) => (index + 1).toString()),
            theme:{
                mode:'dark'
            },
            stroke: {
                curve: 'smooth'
            },
            chart:{
                sparkline: {
                    enabled: true
                },
            },
            tooltip:{
                y:{
                    formatter: val=> `$ ${formatMoney(val)}`
                }
            }
        };

        // Renderiza el gráfico
        return (
            <Card>
                <CardHeader
                    title={`$ ${formatMoney(auxBalance)}`}
                    subheader='Balance Del Mes'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='area' width={275} height={100} />
                </CardContent>
            </Card>)
    }
    

    // FILTERS 
    const filtrarCompras = () =>{
        const yearsCompras = {};
        if(props.ventas){
            Object.keys(props.compras).reverse().forEach((compra) => {
                const year = props.compras[compra].fecha.split('/')[2];
                const month = props.compras[compra].fecha.split('/')[1];
            
                // Si aún no tenemos el año en el objeto "years", lo agregamos
                if (!yearsCompras[year]) {
                    yearsCompras[year] = { total: 0, months: {
                        1:{ total: 0, compras: [] },
                        2:{ total: 0, compras: [] },
                        3:{ total: 0, compras: [] },
                        4:{ total: 0, compras: [] },
                        5:{ total: 0, compras: [] },
                        6:{ total: 0, compras: [] },
                        7:{ total: 0, compras: [] },
                        8:{ total: 0, compras: [] },
                        9:{ total: 0, compras: [] },
                        10:{ total: 0, compras: [] },
                        11:{ total: 0, compras: [] },
                        12:{ total: 0, compras: [] }
                    }}
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
            
                if (!yearsVentas[year]) {
                    yearsVentas[year] = { total: 0, months: {
                        1:{ total: 0, ventas: [] },
                        2:{ total: 0, ventas: [] },
                        3:{ total: 0, ventas: [] },
                        4:{ total: 0, ventas: [] },
                        5:{ total: 0, ventas: [] },
                        6:{ total: 0, ventas: [] },
                        7:{ total: 0, ventas: [] },
                        8:{ total: 0, ventas: [] },
                        9:{ total: 0, ventas: [] },
                        10:{ total: 0, ventas: [] },
                        11:{ total: 0, ventas: [] },
                        12:{ total: 0, ventas: [] }
                    }}
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
    const filtrarClientes = (ventas) =>{
        const currentYear = new Date().getFullYear();

        const data = [];
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
        <Layout history={props.history} page="Inicio" user={props.user.uid}>
            <Paper className={classes.content}>
                <Grid container item xs={12}>
                    {!loading && props.ventas?
                        <Grid container xs={12} spacing={3} justify='center'>
                            <Grid container item xs={12} justify='center' spacing={3}>
                                <Grid item>
                                    <Paper>
                                        {generateChartMonthSalesUnits()}
                                    </Paper>
                                </Grid>
                                <Grid item>
                                    <Paper>
                                        
                                        {generateChartMonthSalesValue()}
                                    </Paper>
                                </Grid>
                                <Grid item>
                                    <Paper>
                                        {generateChartMonthIva()}
                                    </Paper>
                                </Grid>
                                <Grid item>
                                    <Paper>
                                        {generateChartMonthBalance()}
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Grid container xs={12} justify='center'>
                                <Grid container item xs={12} md={8} justify='center'>
                                    <Paper>
                                        {generateChartAnualSales()}
                                    </Paper>
                                </Grid>
                                <Grid container item xs={12} justify='center'>
                                    <Grid item>
                                        <AppBar position="static">
                                            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                                                <Tab label="Valor" />
                                                <Tab label="Cantidad" />
                                            </Tabs>
                                        </AppBar>
                                    </Grid>
                                </Grid>
                                <TabPanel value={value}  index={0}>
                                    <Grid container xs={12} md={4}item direction='column' spacing={3}>
                                        <Grid item>
                                            <Paper>
                                                {generateChartAnualProductsValue()}
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                                <TabPanel value={value}  index={1}>
                                    <Grid container xs={12} md={4}item direction='column' spacing={3}>
                                        <Grid item>
                                            <Paper>
                                                {generateChartAnualProductsUnits()}
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </TabPanel>
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
export default connect(mapStateToProps,null)(Inicio)