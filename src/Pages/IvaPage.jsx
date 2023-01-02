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

const IvaPage=(props)=>{
    const classes = content()
    const [loading,setLoading]=useState(false)
    const [showSnackbar,setshowSnackbar]=useState(false)
    const [totalCompras, setTotalCompras]= useState(0)
    const [totalVentas, setTotalVentas]= useState(0)
    const [ivaCompras, setIvaCompras]= useState(0)
    const [ivaVentas, setIvaVentas]= useState(0)

    //FUNCTIONS
    const agregarCompra = () =>{
        let aux={
            fecha:'13/11/2022',
            categoria:'Super',
            iva:2100,
            total:10000
        }
        setLoading(true)
        database().ref().child(props.user.uid).child('compras').push(aux)
            .then(()=>{
                setshowSnackbar('La Compra Se Agrego Correctamente!')
                setTimeout(() => {
                    setLoading(false)
                }, 2000);
            })
            .catch(()=>{
                setLoading(false)
            })
    }

    const calcularTotalVentas =() =>{
        let i =0
        let actualMonth = getActualMonth() 

        Object.keys(props.ventas).map(venta=>{
            console.log(getActualMonth(props.ventas[venta].fecha))
            console.log(actualMonth)
            if(getActualMonth(props.ventas[venta].fecha) == actualMonth){
                i += props.ventas[venta].total
            }
        })
        setTotalVentas(i)
    }

    const calcularTotal =(type) =>{
        let i =0
        if(props.iva[type]){
            Object.keys(props.iva[type]).map(item=>{
                i+=props.iva[type][item].total
            })
            if(type==='compras'){
                setTotalCompras(i)
            }
            else{
                setTotalVentas(i)
            }
        }
    }
    const calcularIva =(type) =>{
        let i =0
        if(props.iva[type]){
            Object.keys(props.iva[type]).map(item=>{
                i+=props.iva[type][item].iva
            })
            if(type==='compras'){
                setIvaCompras(i)
            }
            else{
                setIvaVentas(i)
            }
        }
    }

    //
    useEffect(()=>{
        calcularTotalVentas()
    },)

    return(
        <Layout history={props.history} page="Iva" user={props.user.uid}>
            {/* TABLE */}
            <Paper className={classes.content}>
                <Grid container justify='center' className={classes.container}>
                    <Grid item xs={12}>
                        <Typography align='center' variant='h2' className={ivaCompras-ivaVentas>=0? classes.positive:classes.negative}>$ {formatMoney(totalVentas)}</Typography>
                    </Grid>
                    <Grid item xs={12} justify='center'>
                        <Button startIcon={<Add/>} onClick={()=>{agregarCompra()}}>
                            Agregar Compra
                        </Button>
                    </Grid>
                    <Grid container justify='space-around'>
                        <Grid item xs={10} sm={8} md={5} className={classes.gridTable}>
                        </Grid>
                        <Grid item xs={10} sm={8} md={5} className={classes.gridTable}>
                            <Ventas data={props.ventas} totalVentas={totalVentas}/>
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
export default connect(mapStateToProps,null)(IvaPage)