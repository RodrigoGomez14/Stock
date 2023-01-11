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
    const [sortedClientes,setSortedClientes] = useState(undefined)
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
        let purchases = []
        let dif = []
        let labelsUltimoAnio =  []

        if(sortedCompras || sortedVentas){
            const fechaActual = new Date();
            const mesActual = fechaActual.getMonth();
            const anioActual = fechaActual.getFullYear();
            let auxSales = [0,0,0,0,0,0,0,0,0,0,0,0]
            let auxPurchases = [0,0,0,0,0,0,0,0,0,0,0,0]

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
                                auxSales[month-1]+=(dataMonth.total)
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
                                auxPurchases[month-1]+=(dataMonth.total)
                            }
                    }
                }
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

            sales.map(sale=>{
                dif.push(sale)
            })
            purchases.map((purchase,i)=>{
                dif[i]-=purchase
            })

        }
        // Define la configuración del gráfico
        const options = {
            labels:labelsUltimoAnio,
            fill: {
            },
            chart:{
                
            },
            theme:{
                mode:'dark',
                palette:'palette6'
            },
            stroke: {
                curve: 'smooth'
            },
            grid: {
                row: {
                    colors: ['#c3c3c3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },
            tooltip:{
                y:{
                    formatter: val=> `$ ${formatMoney(val)}`
                }
            },
            dataLabels:{
                enabled:false
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
            type:'line',
            data:sales
        },
        {
            name:'Compras',
            type:'line',
            data:purchases
        },
        {
            name:'Balance',
            type:'area',
            data:dif
        },
        ]
        // Renderiza el gráfico

        return (
            <Card>
                <CardHeader
                    subheader='Compras & Ventas - Ultimos 12 Meses'
                />
                <CardContent>
                    <ApexCharts options={options} series={series}  height={400} width={1200} />
                </CardContent>
            </Card>
        )
    }
    const generateChartAnualIva = () => {
        // Asume que tienes los datos en dos variables: sortedCompras y sortedVentas
        const actualYear = new Date().getFullYear()

        let sales = []
        let purchases =[]
        let dif =[]
        let labelsUltimoAnio =  []

        if(sortedCompras || sortedVentas){
            const fechaActual = new Date();
            const mesActual = fechaActual.getMonth();
            const anioActual = fechaActual.getFullYear();
            let auxSales = [0,0,0,0,0,0,0,0,0,0,0,0]
            let auxPurchases = [0,0,0,0,0,0,0,0,0,0,0,0]

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
                            Object.keys(dataMonth.ventas).map(venta=>{
                                if (dataMonth.ventas[venta].metodoDePago.facturacion) {
                                    auxSales[(month-1)]+=(dataMonth.ventas[venta].total-(dataMonth.ventas[venta].total/1.21))
                                }
                            })
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
                            Object.keys(dataMonth.compras).map(compra=>{
                                if (dataMonth.compras[compra].metodoDePago.facturacion) {
                                    auxPurchases[(month-1)]+=(dataMonth.compras[compra].total-(dataMonth.compras[compra].total/1.21))
                                }        
                            })
                        }
                    }
                }
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
            sales.map(sale=>{
                dif.push(sale)
            })
            purchases.map((purchase,i)=>{
                dif[i]-=purchase
            })

        }
        // Define la configuración del gráfico
        const options = {
            labels:labelsUltimoAnio,
            fill: {
            },
            chart:{
                
            },
            theme:{
                mode:'dark',
                palette:'palette6'
            },
            stroke: {
                curve: 'smooth'
            },
            grid: {
                row: {
                    colors: ['#c3c3c3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },
            tooltip:{
                y:{
                    formatter: val=> `$ ${formatMoney(val)}`
                }
            },
            dataLabels:{
                enabled:false
            },
            yaxis:{
                labels:{
                    formatter: val => `$ ${formatMoney(val)}`,
                }
            }
        };
        const series=[
        {
            name:'Iva Ventas',
            type:'line',
            data:sales
        },
        {
            name:'Iva Compras',
            type:'line',
            data:purchases
        },
        {
            name:'Balance',
            type:'area',
            data:dif
        },
        ]
        // Renderiza el gráfico

        return (
            <Card>
                <CardHeader
                    subheader='Iva Compras & Ventas - Ultimos 12 Meses'
                />
                <CardContent>
                    <ApexCharts options={options} series={series}  height={400} width={1200} />
                </CardContent>
            </Card>
        )
    }
    const generateChartAnualProducts = () => {
        // Asume que tienes los datos en dos variables: sortedVentas
        const actualYear = new Date().getFullYear()

        let products = []
        let labelsUltimoAnio =  []

        if(sortedVentas){
            const fechaActual = new Date();
            const mesActual = fechaActual.getMonth();
            const anioActual = fechaActual.getFullYear();
            let auxProducts = []

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
                                Object.keys(dataMonth.ventas).map(venta=>{
                                    dataMonth.ventas[venta].articulos.map(articulo=>{
                                        let auxData = [0,0,0,0,0,0,0,0,0,0,0,0]
                                        const index = auxProducts.findIndex((d) => d.name === articulo.producto);
                                        if (index === -1) {
                                            // Si no lo encontramos, lo agregamos
                                            auxData[(dataMonth.ventas[venta].fecha.split('/')[1]-1)] = parseInt(articulo.cantidad)
                                            auxProducts.push({ name: articulo.producto, data:auxData});
                                        } 
                                        else {
                                            auxData=auxProducts[index].data
                                            // Si lo encontramos, sumamos la cantidad y el total
                                            if(!auxData[(dataMonth.ventas[venta].fecha.split('/')[1]-1)]){
                                                auxData[(dataMonth.ventas[venta].fecha.split('/')[1]-1)] = 0
                                            }
                                            auxData[(dataMonth.ventas[venta].fecha.split('/')[1]-1)] += parseInt(articulo.cantidad);
                                            auxProducts[index] = {...auxProducts[index],data:auxData}
                                        }

                                    })
                                })
                            }
                    }
                }
            }
            const auxMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
            const arr1Meses = auxMeses.slice(mesInicio+1);
            const arr2Meses = auxMeses.slice(0,mesInicio+1);
            arr1Meses.map(i=>{
                labelsUltimoAnio.push(i)
            })
            arr2Meses.map(i=>{
                labelsUltimoAnio.push(i)
            })

            let finalProducts = auxProducts
            finalProducts.map(product=>{
                const arr1Products = product.data.slice(mesInicio+1);
                const arr2Products = product.data.slice(0,mesInicio+1);

                let auxFinalData = []
                arr1Products.map(i=>{
                    auxFinalData.push(i)
                })
                arr2Products.map(i=>{
                    auxFinalData.push(i)
                })
                product.data = auxFinalData
            })
            console.log(auxProducts)
            products=auxProducts
        }

        const series = products
        // Define la configuración del gráfico
        const options = {
            labels:labelsUltimoAnio,
            fill: {
            },
            chart:{
                
            },
            theme:{
                mode:'dark',
                palette:'palette6'
            },
            stroke: {
                curve: 'smooth'
            },
            grid: {
                row: {
                    colors: ['#c3c3c3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },
            tooltip:{
            },
            dataLabels:{
                enabled:false
            },
            yaxis:{
            }
        };
        
        // Renderiza el gráfico

        return (
            <Card>
                <CardHeader
                    subheader='Ventas por Producto - Ultimos 12 Meses'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='line'  height={400} width={600} />
                </CardContent>
            </Card>
        )
    }
    const generateChartAnualProductsValue = () => {
        // Asume que tienes los datos en dos variables: sortedVentas
        const actualYear = new Date().getFullYear()

        let products = []
        let labelsUltimoAnio =  []

        if(sortedVentas){
            const fechaActual = new Date();
            const mesActual = fechaActual.getMonth();
            const anioActual = fechaActual.getFullYear();
            let auxProducts = []

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
                                Object.keys(dataMonth.ventas).map(venta=>{
                                    dataMonth.ventas[venta].articulos.map(articulo=>{
                                        let auxData = [0,0,0,0,0,0,0,0,0,0,0,0]
                                        const index = auxProducts.findIndex((d) => d.name === articulo.producto);
                                        if (index === -1) {
                                            // Si no lo encontramos, lo agregamos
                                            if(dataMonth.ventas[venta].metodoDePago.facturacion){
                                                auxData[(dataMonth.ventas[venta].fecha.split('/')[1]-1)] = parseInt(articulo.total/1.21)
                                                auxProducts.push({ name: articulo.producto, data:auxData});
                                            }
                                            else{
                                                auxData[(dataMonth.ventas[venta].fecha.split('/')[1]-1)] = parseInt(articulo.total/1.21)
                                                auxProducts.push({ name: articulo.producto, data:auxData});
                                            }
                                        } 
                                        else {
                                            auxData=auxProducts[index].data
                                            // Si lo encontramos, sumamos la cantidad y el total
                                            if(!auxData[(dataMonth.ventas[venta].fecha.split('/')[1]-1)]){
                                                auxData[(dataMonth.ventas[venta].fecha.split('/')[1]-1)] = 0
                                            }
                                            if(dataMonth.ventas[venta].metodoDePago.facturacion){
                                                auxData[(dataMonth.ventas[venta].fecha.split('/')[1]-1)] += parseInt(articulo.total/1.21);
                                                auxProducts[index] = {...auxProducts[index],data:auxData}
                                            }
                                            else{
                                                auxData[(dataMonth.ventas[venta].fecha.split('/')[1]-1)] += parseInt(articulo.total);
                                                auxProducts[index] = {...auxProducts[index],data:auxData}
                                            }
                                        }

                                    })
                                })
                            }
                    }
                }
            }
            const auxMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
            const arr1Meses = auxMeses.slice(mesInicio+1);
            const arr2Meses = auxMeses.slice(0,mesInicio+1);
            arr1Meses.map(i=>{
                labelsUltimoAnio.push(i)
            })
            arr2Meses.map(i=>{
                labelsUltimoAnio.push(i)
            })

            let finalProducts = auxProducts
            finalProducts.map(product=>{
                const arr1Products = product.data.slice(mesInicio+1);
                const arr2Products = product.data.slice(0,mesInicio+1);

                let auxFinalData = []
                arr1Products.map(i=>{
                    auxFinalData.push(i)
                })
                arr2Products.map(i=>{
                    auxFinalData.push(i)
                })
                product.data = auxFinalData
            })
            console.log(auxProducts)
            products=auxProducts
        }

        const series = products
        // Define la configuración del gráfico
        const options = {
            labels:labelsUltimoAnio,
            fill: {
            },
            chart:{
                
            },
            theme:{
                mode:'dark',
                palette:'palette6'
            },
            stroke: {
                curve: 'smooth'
            },
            grid: {
                row: {
                    colors: ['#c3c3c3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },
            tooltip:{
                y:{
                    formatter: val=> `$ ${formatMoney(val)}`
                }
            },
            dataLabels:{
                enabled:false
            },
            yaxis:{
                labels:{
                    formatter: val=> `$ ${formatMoney(val)}`
                }
            }
        };
        
        // Renderiza el gráfico

        return (
            <Card>
                <CardHeader
                    subheader='Ingresos por Producto - Ultimos 12 Meses'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='line'  height={400} width={600} />
                </CardContent>
            </Card>
        )
    }
    const generateChartProductsValue = () => {
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
            theme:{
                mode:'dark',
                palette:'palette2'
            },
            tooltip:{
                y:{
                    formatter: val=> `$ ${formatMoney(val)}`
                },
                fillSeriesColor:false
            },
            dataLabels:{
                dropShadow: {
                    enabled: true,
                    left: 2,
                    top: 2,
                    opacity: 0.5
                },
            },
            
            
        };
    
    
        // Renderiza el gráfico
        return (
            <Card>
                <CardHeader
                    subheader='Ingresos por Producto - Anual'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='donut'   width={450} />
                </CardContent>
            </Card>)
    }
    const generateChartClientValue = () => {
        const actualYear = new Date().getFullYear()

        const series = [];
        const labels = [];
        
        sortedClientes.map((d)=>{
            series.push(d.total)
            labels.push(d.nombre)
        })
        // Define la configuración del gráfico
        const options = {
            series:series,
            labels:labels,
            theme:{
                mode:'dark',
                palette:'palette2'
            },
            tooltip:{
                y:{
                    formatter: val=> `$ ${formatMoney(val)}`
                },
                fillSeriesColor:false
            },
            dataLabels:{
                dropShadow: {
                    enabled: true,
                    left: 2,
                    top: 2,
                    opacity: 0.5
                },
            },
            
            
        };
    
    
        // Renderiza el gráfico
        return (
            <Card>
                <CardHeader
                    subheader='Ingresos por Cliente - Anual'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='donut'   width={450} />
                </CardContent>
            </Card>)
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
            },
            tooltip:{
                fillSeriesColor:false
            }
        };
    
    
        // Renderiza el gráfico
        return (
            <Card>
                <CardHeader
                    subheader='Unidades Vendidas - Anual'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='donut'   width={450} />
                </CardContent>
            </Card>)
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
        
    
        if(sortedVentas){
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
        }
        if(sortedCompras){
            for (const [year, data] of sortedCompras) {
                // Itera sobre cada mes en el año
                for (const [month, dataMonth] of Object.entries(data.months)) {
                    if(year == currentYear){
                        if(month-1==currentMonth){
                            let auxSales= 0
                            dataMonth.compras.map((compra,i)=>{
                                auxSales +=1
                                const day = dataMonth.compras[i].fecha.split('/')[0]-1
                                series[1].data[day] = (series[1].data[day])+1
                            })
                        }
                    }
                }
            }
        }

        // Define la configuración del gráfico
        const options = {
            labels:Array.from({ length: daysInMonth }, (value, index) => (index + 1).toString()),
            theme:{
                mode:'dark',
                palette:'palette6'
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
                    subheader='Ventas & Compras - Mensual'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='area' width={200} height={100}  />
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
        
    
        if(sortedVentas){
            for (const [year, data] of sortedVentas) {
                // Itera sobre cada mes en el año
                for (const [month, dataMonth] of Object.entries(data.months)) {
                    if(year == currentYear){
                        if(month-1==currentMonth){
                            let auxSales= 0
                            dataMonth.ventas.map((venta,i)=>{
                                auxSales +=1
                                const day = dataMonth.ventas[i].fecha.split('/')[0]-1
                                series[0].data[day] = (series[0].data[day])+parseInt(dataMonth.ventas[i].total)
                                if(dataMonth.ventas[i].metodoDePago.facturacion){
                                    series[0].data[day] = (series[0].data[day])-(parseInt(dataMonth.ventas[i].total)-parseInt(dataMonth.ventas[i].total)/1.21)
                                }
                            })
                        }
                    }
                }
            }
        }

        // Define la configuración del gráfico
        const options = {
            labels:Array.from({ length: daysInMonth }, (value, index) => (index + 1).toString()),
            theme:{
                mode:'dark',
                palette:'palette6'
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
                    subheader='Ventas - Mensual'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='area' width={200} height={100} />
                </CardContent>
            </Card>)
    }
    const generateChartMonthPurchasesValue = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

        const series = [
            {
            name: 'Ventas',
            data: Array.from({ length: daysInMonth }, () => 0),
            },
        ];
        
    
        if(sortedCompras){
            for (const [year, data] of sortedCompras) {
                // Itera sobre cada mes en el año
                for (const [month, dataMonth] of Object.entries(data.months)) {
                    if(year == currentYear){
                        if(month-1==currentMonth){
                            dataMonth.compras.map((compra,i)=>{
                                const day = dataMonth.compras[i].fecha.split('/')[0]-1
                                series[0].data[day] = (series[0].data[day])+parseInt(dataMonth.compras[i].total)
                                if(dataMonth.compras[i].metodoDePago.facturacion){
                                    series[0].data[day] = (series[0].data[day])-(parseInt(dataMonth.compras[i].total)-parseInt(dataMonth.compras[i].total)/1.21)
                                }
                            })
                        }
                    }
                }
            }
        }

        // Define la configuración del gráfico
        const options = {
            labels:Array.from({ length: daysInMonth }, (value, index) => (index + 1).toString()),
            theme:{
                mode:'dark',
                palette:'palette6'
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
                    subheader='Compras - Mensual'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='area' width={200} height={100} />
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
        
    
        if(sortedVentas){
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
        }
        if(sortedCompras){
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
                                    series[1].data[day] = (series[1].data[day]) + ((parseInt(dataMonth.compras[i].total)) - (parseInt(dataMonth.compras[i].total)/1.21))
                                }
                            })
                        }
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
                mode:'dark',
                palette:'palette6'
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
                    subheader='Iva - Mensual'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='area' width={200} height={100} />
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
        if(sortedVentas){
            for (const [year, data] of sortedVentas) {
                // Itera sobre cada mes en el año
                for (const [month, dataMonth] of Object.entries(data.months)) {
                    if(year == currentYear){
                        if(month-1==currentMonth){
                            dataMonth.ventas.map((venta,i)=>{
                                const day = dataMonth.ventas[i].fecha.split('/')[0]-1
                                if(dataMonth.ventas[i].metodoDePago.facturacion){
                                    auxBalance+= (dataMonth.ventas[i].total/1.21)
                                    series[0].data[day] = (series[0].data[day])+(dataMonth.ventas[i].total/1.21)
                                }
                                else{
                                    auxBalance+= dataMonth.ventas[i].total
                                    series[0].data[day] = (series[0].data[day])+dataMonth.ventas[i].total
                                }
                            })
                        }
                    }
                }
            }
        }
        if(sortedCompras){
            for (const [year, data] of sortedCompras) {
                // Itera sobre cada mes en el año
                for (const [month, dataMonth] of Object.entries(data.months)) {
                    if(year == currentYear){
                        if(month-1==currentMonth){
                            dataMonth.compras.map((compra,i)=>{
                                const day = dataMonth.compras[i].fecha.split('/')[0]-1
                                if(dataMonth.compras[i].metodoDePago.facturacion){
                                    auxBalance-= (dataMonth.compras[i].total/1.21)
                                    series[0].data[day] = (series[0].data[day])-(dataMonth.compras[i].total/1.21)
                                }
                                else{
                                    auxBalance-= dataMonth.compras[i].total
                                    series[0].data[day] = (series[0].data[day])-dataMonth.compras[i].total
                                }
                            })
                        }
                    }
                }
            }
        }

        // Define la configuración del gráfico
        const options = {
            labels:Array.from({ length: daysInMonth }, (value, index) => (index + 1).toString()),
            theme:{
                mode:'dark',
                palette:'palette6'
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
                    subheader='Balance - Mensual'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='area' width={200} height={100} />
                </CardContent>
            </Card>)
    }
    

    // FILTERS 
    const filtrarCompras = () =>{
        const yearsCompras = {};
        if(props.compras){
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
                                if(yearData.months[month].ventas[i].metodoDePago.facturacion){
                                    data.push({ producto: yearData.months[month].ventas[i].articulos[v].producto, cantidad: parseInt(yearData.months[month].ventas[i].articulos[v].cantidad),total:(yearData.months[month].ventas[i].articulos[v].total/1.21) });
                                }
                                else{
                                    data.push({ producto: yearData.months[month].ventas[i].articulos[v].producto, cantidad: parseInt(yearData.months[month].ventas[i].articulos[v].cantidad),total:yearData.months[month].ventas[i].articulos[v].total });
                                }
                            } else {
                                if(yearData.months[month].ventas[i].metodoDePago.facturacion){
                                    data[index].cantidad += parseInt(yearData.months[month].ventas[i].articulos[v].cantidad);
                                    data[index].total += (yearData.months[month].ventas[i].articulos[v].total/1.21);
                                }
                                else{
                                    // Si lo encontramos, sumamos la cantidad y el total
                                    data[index].cantidad += parseInt(yearData.months[month].ventas[i].articulos[v].cantidad);
                                    data[index].total += yearData.months[month].ventas[i].articulos[v].total;
                                }
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
                        if(yearData.months[month].ventas[i].cliente){
                            // Verificamos si ya tenemos el producto en el array
                            const index = data.findIndex((d) => d.nombre === yearData.months[month].ventas[i].cliente);
                            if (index === -1) {
                                if(yearData.months[month].ventas[i].metodoDePago.facturacion){
                                    data.push({ nombre: yearData.months[month].ventas[i].cliente,total:(yearData.months[month].ventas[i].total/1.21) });
                                }
                                else{
                                    data.push({ nombre: yearData.months[month].ventas[i].cliente,total:yearData.months[month].ventas[i].total });
                                }
                                // Si no lo encontramos, lo agregamos
                            } 
                            else {
                                if(yearData.months[month].ventas[i].metodoDePago.facturacion){
                                    data[index].total += (yearData.months[month].ventas[i].total/1.21);
                                }
                                else{
                                    // Si lo encontramos, sumamos la cantidad y el total
                                    data[index].total += yearData.months[month].ventas[i].total;
                                }
                            }
                        }
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
        const auxSortedClientes = filtrarClientes(auxSortedVentas)
        setSortedCompras(auxSortedCompras)
        setSortedVentas(auxSortedVentas)
        setSortedProductos(auxSortedProductos)
        setSortedClientes(auxSortedClientes)

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
                                        
                                        {generateChartMonthPurchasesValue()}
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
                            <Grid container xs={12} justify='center' spacing={3}>
                                <Grid container item xs={12} md={8} justify='center'>
                                    <Paper>
                                        {generateChartAnualSales()}
                                    </Paper>
                                </Grid>
                                <Grid container item xs={12} md={6} justify='center'>
                                    <Paper>
                                        {generateChartAnualProductsValue()}
                                    </Paper>
                                </Grid>
                                <Grid container item xs={12} md={6} justify='center'>
                                    <Paper>
                                        {generateChartAnualProducts()}
                                    </Paper>
                                </Grid>
                                <Grid container item xs={12} md={6} justify='center'>
                                    <Paper>
                                        {generateChartAnualIva()}
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Grid container item xs={12} justify='center' spacing={3}>
                                <Grid item>
                                    <Card>
                                        <CardHeader
                                            title={
                                                <AppBar position="static">
                                                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                                                        <Tab label="Valor" />
                                                        <Tab label="Cantidad" />
                                                    </Tabs>
                                                </AppBar>
                                            }
                                        />
                                        <CardContent>
                                            <TabPanel value={value}  index={0}>
                                                <Grid container spacing={3}>
                                                    <Grid item>
                                                        <Paper>
                                                            {generateChartProductsValue()}
                                                        </Paper>
                                                    </Grid>
                                                </Grid>
                                            </TabPanel>
                                            <TabPanel value={value}  index={1}>
                                                <Grid container spacing={3}>
                                                    <Grid item>
                                                        <Paper>
                                                            {generateChartAnualProductsUnits()}
                                                        </Paper>
                                                    </Grid>
                                                </Grid>
                                            </TabPanel>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item>
                                    <Card>
                                        <CardHeader
                                            title={
                                                <AppBar position="static">
                                                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                                                        <Tab label="Valor" />
                                                        <Tab label="Cantidad" />
                                                    </Tabs>
                                                </AppBar>
                                            }
                                        />
                                        <CardContent>
                                            <TabPanel value={value}  index={0}>
                                                <Grid container spacing={3}>
                                                    <Grid item>
                                                        <Paper>
                                                            {generateChartClientValue()}
                                                        </Paper>
                                                    </Grid>
                                                </Grid>
                                            </TabPanel>
                                            <TabPanel value={value}  index={1}>
                                                <Grid container spacing={3}>
                                                    <Grid item>
                                                        <Paper>
                                                            {generateChartAnualProductsUnits()}
                                                        </Paper>
                                                    </Grid>
                                                </Grid>
                                            </TabPanel>
                                        </CardContent>
                                    </Card>
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
export default connect(mapStateToProps,null)(Inicio)