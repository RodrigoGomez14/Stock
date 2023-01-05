import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Backdrop,Paper,CircularProgress,Tab,Typography,TextField,Grid,AppBar,Box,Tabs,Link as LinkComponent,Snackbar,Card,CardHeader,CardContent} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {AttachMoney,PersonAdd} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {formatMoney} from '../utilities'
import {content} from './styles/styles'
import CardDeudaCliente from '../components/Deudas/CardDeudaCliente'
import CardDeudaProveedor from '../components/Deudas/CardDeudaProveedor'
import { useEffect } from 'react'
import ApexCharts from 'react-apexcharts';


// COMPONENT
const Deudas=(props)=>{
    const classes = content()
    const [search,setSearch]=useState('')
    const [showSnackbar,setshowSnackbar]=useState('')
    const [loading,setLoading]=useState(true)
    const [totalClientes,setTotalClientes]=useState(0)
    const [totalProveedores,setTotalProveedores]=useState(0)
    const [value,setValue]=useState(0)


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
    const generateChartDeudasClientes = () => {

        let series = []
        let labels = []

        Object.keys(props.clientes).map(cliente=>{
            if(props.clientes[cliente].datos.deuda>0){
                series.push(props.clientes[cliente].datos.deuda)
                labels.push(props.clientes[cliente].datos.nombre)
            }
        })

        // Define la configuración del gráfico
        const options = {
            labels:labels,
            series:series,
            theme:{
                mode:'dark',
                palette:'palette3'
            },
            stroke: {
                curve: 'smooth'
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
        return (
            <Card>
                <CardHeader
                    subheader='Deudas por Cliente'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='donut' width={400} />
                </CardContent>
            </Card>)
    }
    const generateChartDeudasProveedores = () => {

        let series = []
        let labels = []

        Object.keys(props.proveedores).map(proveedor=>{
            if(props.proveedores[proveedor].datos.deuda>0){
                series.push(props.proveedores[proveedor].datos.deuda)
                labels.push(props.proveedores[proveedor].datos.nombre)
            }
        })

        // Define la configuración del gráfico
        const options = {
            labels:labels,
            series:series,
            theme:{
                mode:'dark',
                palette:'palette3'
            },
            stroke: {
                curve: 'smooth'
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
        return (
            <Card>
                <CardHeader
                    subheader='Deudas por Proveedor'
                />
                <CardContent>
                    <ApexCharts options={options} series={series} type='donut' width={400} />
                </CardContent>
            </Card>)
    }
    useEffect(()=>{
        let auxFilteredDeudas = 0
        if(props.clientes){
            Object.values(props.clientes).map(cliente=>{
                auxFilteredDeudas += cliente.datos.deuda
            })
            setTotalClientes(auxFilteredDeudas)
            auxFilteredDeudas=0
        }
        if(props.proveedores){
            Object.values(props.proveedores).map(proveedor=>{
                auxFilteredDeudas += proveedor.datos.deuda
            })
            setTotalProveedores(auxFilteredDeudas)
        }
        setLoading(false)
    },[])
    return(
        <Layout history={props.history} page="Deudas" user={props.user.uid}>
            {/* CONTENT */}
            <Paper className={classes.content}>
                <Grid container xs={12} spacing={4} >
                     <Grid container item xs={12} justify='center'>
                        <TextField
                            value={search}
                            onChange={e=>{
                                setSearch(e.target.value)
                            }}
                            label='Buscar'
                        />
                    </Grid>
                    <Grid container item xs={12} justify='center'>
                        <Grid item>
                            <AppBar position="static">
                                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                                    <Tab label="Clientes" />
                                    <Tab label="Proveedores" />
                                </Tabs>
                            </AppBar>
                        </Grid>
                    </Grid>
                    {/* DEUDAS CLIENTES */}
                    <TabPanel value={value}  index={0}>
                        <Grid container item xs={12} justify='center'>
                            {props.clientes?
                                <Grid container item xs={12} justify='center' alignItems='center' spacing={3}>
                                    <Grid container item xs={12} justify='center'>
                                        <Typography  variant='h5' textAlign='center'>
                                            Total ${formatMoney(totalClientes)}
                                        </Typography>
                                    </Grid>
                                    <Grid container item xs={12} justify='center'>
                                        {generateChartDeudasClientes()}
                                    </Grid>
                                    <Grid container justify='center' alignItems='center' spacing={4}>
                                        {Object.keys(props.clientes).map(key=>(
                                            props.clientes[key].datos.deuda != 0 ?
                                                <CardDeudaCliente nombre={key} search={search} deuda={props.clientes[key].datos.deuda}/>
                                            :
                                            null
                                        ))}
                                    </Grid>
                                </Grid>
                                :
                                null
                            }
                        </Grid>
                    </TabPanel>

                    {/* DEUDAS PROVEEDORES */}
                    <TabPanel value={value} style={{width:'100%'}} index={1}>
                        <Grid container item xs={12} justify='center'>
                            {props.proveedores?
                                <Grid container item xs={12} justify='center' alignItems='center' spacing={3}>
                                    <Grid container item xs={12} justify='center'>
                                        <Typography  variant='h5' textAlign='center'>
                                            Total ${formatMoney(totalProveedores)}
                                        </Typography>
                                    </Grid>
                                    <Grid container item xs={12} justify='center'>
                                        {generateChartDeudasProveedores()}
                                    </Grid>
                                    <Grid container item justify='center' alignItems='center' spacing={4}>
                                        {Object.keys(props.proveedores).map(key=>(
                                            props.proveedores[key].datos.deuda != 0 ?
                                            <CardDeudaProveedor nombre={key} search={search} deuda={props.proveedores[key].datos.deuda}/>
                                            :
                                            null
                                        ))}
                                    </Grid>
                                </Grid>
                                :
                                null
                            }
                            
                        </Grid>
                    </TabPanel>
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
        clientes:state.clientes,
        proveedores:state.proveedores,
    }
}
export default connect(mapStateToProps,null)(Deudas)