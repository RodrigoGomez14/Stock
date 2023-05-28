import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {Paper,Grid,Button,Backdrop,Snackbar,CircularProgress, Typography,Chip} from '@material-ui/core'
import {Add} from '@material-ui/icons'
import {Alert} from '@material-ui/lab'
import {Compras} from '../components/Iva/Compras'
import {Ventas} from '../components/Iva/Ventas'
import {database} from 'firebase'
import {formatMoney,getActualMonth} from '../utilities'
import {content} from './styles/styles'
import { set } from 'date-fns'

const Iva=(props)=>{
    const classes = content()
    const [loading,setLoading]=useState(false)
    const [showSnackbar,setshowSnackbar]=useState(false)
    const [sortedCompras,setSortedCompras] = useState(undefined)
    const [sortedVentas,setSortedVentas] = useState(undefined)

    //FUNCTIONS

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
            
                // Agregamos la venta al objeto "ventas" del mes correspondiente
                yearsVentas[year].months[month].ventas.push(props.ventas[venta]);
                // Actualizamos el total del mes y del año
                yearsVentas[year].months[month].total += parseFloat(props.ventas[venta].total?props.ventas[venta].total:0);
                yearsVentas[year].total += parseFloat(props.ventas[venta].total?props.ventas[venta].total:0);
            });
        
            const sortedVentas = Object.entries(yearsVentas).sort(([year1], [year2]) => year2 - year1);

            return sortedVentas
        }
    }
    
    

    useEffect(()=>{
        setLoading(true)

        const auxSortedCompras = filtrarCompras()
        const auxSortedVentas = filtrarVentas()
        setSortedCompras(auxSortedCompras)
        setSortedVentas(auxSortedVentas)

        setLoading(false)
    },[props.compras,props.ventas])


    return(
        <Layout history={props.history} page="Iva" user={props.user.uid}>

            {/* TABLE */}
            <Paper className={classes.content}>
                <Grid container justify='center' className={classes.container}>
                    <Grid container justify='space-around'>
                        <Grid item xs={10} sm={8} md={5} className={classes.gridTable}>
                            <Ventas data={sortedCompras}/>
                        </Grid>
                    </Grid>
                </Grid>

                {/* BACKDROP & SNACKBAR */}
                <Backdrop className={classes.backdrop} open={loading}>
                    <CircularProgress color="inherit" />
                    <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={()=>{setshowSnackbar('')}}>
                        <Alert severity="success" variant='filled'>
                            La compra se agrego correctamente!
                        </Alert>
                    </Snackbar>
                </Backdrop>
            </Paper>
        </Layout>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        compras:state.compras,
        ventas:state.ventas
    }
}
export default connect(mapStateToProps,null)(Iva)