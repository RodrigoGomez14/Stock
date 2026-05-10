import React,{useState,useEffect} from 'react'
import { withStore } from '../context/AppContext'
import {Layout} from './Layout'
import {content} from './styles/styles'
import {Paper,Grid,Typography,Backdrop,CircularProgress,Snackbar,Card,CardHeader,CardContent,AppBar,Tabs,Tab} from '@mui/material'
import {CarouselCotizaciones} from '../components/Carousel-Cotizaciones/CarouselCotizaciones'
import {Alert} from '@mui/material'
import Home from '../images/Home.png'
import {formatMoney,getActualMonthDetailed,filtrarCotizaciones} from '../utilities'
import SalesChart from '../components/Dashboard/SalesChart'
import IvaChart from '../components/Dashboard/IvaChart'
import ProductsChart from '../components/Dashboard/ProductsChart'
import ProductsValueChart from '../components/Dashboard/ProductsValueChart'
import MonthlySalesChart from '../components/Dashboard/MonthlySalesChart'
import MonthlySalesValueChart from '../components/Dashboard/MonthlySalesValueChart'
import MonthlyPurchasesChart from '../components/Dashboard/MonthlyPurchasesChart'
import MonthlyIvaChart from '../components/Dashboard/MonthlyIvaChart'
import MonthlyBalanceChart from '../components/Dashboard/MonthlyBalanceChart'
import DonutProductsChart from '../components/Dashboard/DonutProductsChart'
import DonutClientsChart from '../components/Dashboard/DonutClientsChart'
import UnitsChart from '../components/Dashboard/UnitsChart'
import TabPanel from '../components/Dashboard/TabPanel'

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
    const [cotizaciones,setCotizaciones] = useState(undefined)
    const [valueTabProductos,setValueTabProductos]=useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // FILTERS 
    const filtrarCompras = () =>{
        const yearsCompras = {};
        if(props.compras){
            Object.keys(props.compras).reverse().forEach((compra) => {
                const year = props.compras[compra].fecha.split('/')[2];
                const month = props.compras[compra].fecha.split('/')[1];
            
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

                yearsCompras[year].months[month].compras.push(props.compras[compra]);
            
                yearsCompras[year].months[month].total += parseFloat(props.compras[compra].total?props.compras[compra].total:0);
                yearsCompras[year].total += parseFloat(props.compras[compra].total?props.compras[compra].total:0);
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
            
                yearsVentas[year].months[month].ventas.push(props.ventas[venta]);
                yearsVentas[year].months[month].total += parseFloat(props.ventas[venta].total?props.ventas[venta].total:0);
                yearsVentas[year].total += parseFloat(props.ventas[venta].total?props.ventas[venta].total:0);
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
                            const index = data.findIndex((d) => d.producto === yearData.months[month].ventas[i].articulos[v].producto);
                            if (index === -1) {
                                if(yearData.months[month].ventas[i].metodoDePago.facturacion){
                                    data.push({ producto: yearData.months[month].ventas[i].articulos[v].producto, cantidad: parseInt(yearData.months[month].ventas[i].articulos[v].cantidad),total:(yearData.months[month].ventas[i].articulos[v].total?yearData.months[month].ventas[i].articulos[v].total/1.21:0) });
                                }
                                else{
                                    data.push({ producto: yearData.months[month].ventas[i].articulos[v].producto, cantidad: parseInt(yearData.months[month].ventas[i].articulos[v].cantidad),total:yearData.months[month].ventas[i].articulos[v].total?yearData.months[month].ventas[i].articulos[v].total:0 });
                                }
                            } else {
                                if(yearData.months[month].ventas[i].metodoDePago.facturacion){
                                    data[index].cantidad += parseInt(yearData.months[month].ventas[i].articulos[v].cantidad);
                                    data[index].total += (yearData.months[month].ventas[i].articulos[v].total?yearData.months[month].ventas[i].articulos[v].total/1.21:0);
                                }
                                else{
                                    data[index].cantidad += parseInt(yearData.months[month].ventas[i].articulos[v].cantidad);
                                    data[index].total += yearData.months[month].ventas[i].articulos[v].total?yearData.months[month].ventas[i].articulos[v].total:0;
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
                            const index = data.findIndex((d) => d.nombre === yearData.months[month].ventas[i].cliente);
                            if (index === -1) {
                                if(yearData.months[month].ventas[i].metodoDePago.facturacion){
                                    data.push({ nombre: yearData.months[month].ventas[i].cliente,total:(yearData.months[month].ventas[i].total/1.21) });
                                }
                                else{
                                    data.push({ nombre: yearData.months[month].ventas[i].cliente,total:yearData.months[month].ventas[i].total });
                                }
                            } 
                            else {
                                if(yearData.months[month].ventas[i].metodoDePago.facturacion){
                                    data[index].total += (yearData.months[month].ventas[i].total/1.21);
                                }
                                else{
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
                                        <MonthlySalesValueChart sortedVentas={sortedVentas} />
                                    </Paper>
                                </Grid>
                                <Grid item>
                                    <Paper>
                                        <MonthlyPurchasesChart sortedCompras={sortedCompras} />
                                    </Paper>
                                </Grid>
                                <Grid item>
                                    <Paper>
                                        <MonthlyIvaChart sortedVentas={sortedVentas} sortedCompras={sortedCompras} classes={classes} />
                                    </Paper>
                                </Grid>
                                <Grid item>
                                    <Paper>
                                        <MonthlyBalanceChart sortedVentas={sortedVentas} sortedCompras={sortedCompras} classes={classes} />
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Grid container xs={12} justify='center' spacing={3}>
                                <Grid container item xs={12} md={8} justify='center'>
                                    <Paper>
                                        <SalesChart sortedCompras={sortedCompras} sortedVentas={sortedVentas} />
                                    </Paper>
                                </Grid>
                                <Grid container item xs={12} md={6} justify='center'>
                                    <Paper>
                                        <ProductsValueChart sortedVentas={sortedVentas} />
                                    </Paper>
                                </Grid>
                                <Grid container item xs={12} md={6} justify='center'>
                                    <Paper>
                                        <ProductsChart sortedVentas={sortedVentas} />
                                    </Paper>
                                </Grid>
                                <Grid container item xs={12} md={6} justify='center'>
                                    <Paper>
                                        <IvaChart sortedCompras={sortedCompras} sortedVentas={sortedVentas} />
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
                                                            <DonutProductsChart sortedProductos={sortedProductos} />
                                                        </Paper>
                                                    </Grid>
                                                </Grid>
                                            </TabPanel>
                                            <TabPanel value={value}  index={1}>
                                                <Grid container spacing={3}>
                                                    <Grid item>
                                                        <Paper>
                                                            <UnitsChart sortedProductos={sortedProductos} />
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

export default withStore(Inicio)
