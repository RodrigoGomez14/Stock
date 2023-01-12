import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Paper,Grid,Typography,Card,CardContent,TableRow,TableCell,TableBody,TableContainer,Button} from '@material-ui/core'
import {MenuCheques} from '../components/Historial/MenuCheques'
import {AddOutlined} from '@material-ui/icons'
import {DialogConfirmDelete} from '../components/Cliente/DialogConfirmDelete'
import {Link} from 'react-router-dom'
import {formatMoney} from '../utilities'
import {content} from './styles/styles'
import {Cadena} from '../components/Historial-De-Produccion/Cadena'
import {checkSearch,checkSearchProducto} from '../utilities'
import ApexCharts from 'react-apexcharts';
import Empty from '../images/Empty.png'

// COMPONENT
const HistorialDeProduccion=(props)=>{
    const classes = content()
    const [historial,setHistorial]= useState(props.productos[checkSearchProducto(props.location.search)].historialDeCadenas)
   
    const generateChartCadena = (key) => {
        let data=[]

        historial[key].procesos.map((proceso,i)=>{
            const inicio = new Date(`${proceso.fechaDeInicio.split('/')[1]}-${proceso.fechaDeInicio.split('/')[0]}-${proceso.fechaDeInicio.split('/')[2]}`)
            const entrega = new Date(`${proceso.fechaDeEntrega.split('/')[1]}-${proceso.fechaDeEntrega.split('/')[0]}-${proceso.fechaDeEntrega.split('/')[2]}`)
            data.push({x:proceso.proceso,y:[new Date(inicio).getTime(),new Date(entrega).getTime()]})
        })

        // Define la configuración del gráfico
        const options = {
            plotOptions:{
                bar:{
                    horizontal:true
                }
            },
            xaxis:{
                type:'datetime'
            }

        };
        console.log(data)
        // Renderiza el gráfico
        return (
            <Card>
                <CardContent>
                    <ApexCharts options={options} type='rangeBar' series={[{data:data}]} width={600}/>
                </CardContent>
            </Card>)
    }
    return(
        <Layout history={props.history} page={`Historial De Produccion ${checkSearchProducto(props.location.search)}`} user={props.user.uid}>
            {/* CONTENT */}            
            <Paper className={classes.content}>
                <Grid container xs={12} justify='center'>
                    {historial? 
                        <Grid container item xs={12} spacing={3}>
                            {Object.keys(historial).reverse().map(key=>(
                                <Cadena cadena={historial[key]} id={key} generateChartCadena={generateChartCadena}/>
                            ))}
                        </Grid>
                        :
                        <Grid container xs={12} justify='center' spacing={2}>
                            <Grid container item xs={12} justify='center'>
                                <Typography variant='h5'>{checkSearchProducto(props.location.search)} no tiene historial de produccion</Typography>
                            </Grid>
                            <Grid item>
                                <img src={Empty} alt="" height='600px'/>
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </Paper>
        </Layout>
    )
}

// REDUX STATE TO PROPS
const mapStateToProps = state =>{
    return{
        user:state.user,
        productos:state.productos
    }
}
export default connect(mapStateToProps,null)(HistorialDeProduccion)