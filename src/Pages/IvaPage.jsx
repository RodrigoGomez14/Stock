import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Grid,Button,Backdrop,Snackbar,CircularProgress, Typography,Chip} from '@material-ui/core'
import {Add} from '@material-ui/icons'
import {Alert} from '@material-ui/lab'
import {Compras} from '../components/Iva/Compras'
import {Ventas} from '../components/Iva/Ventas'
import {database} from 'firebase'
import {formatMoney} from '../utilities'

const useStyles=makeStyles(theme=>({
    container:{
        paddingTop:theme.spacing(1),
    },
    table:{
        marginTop:theme.spacing(1)
    },
    success:{
        marginLeft:theme.spacing(1),
        color:theme.palette.success.main,
        borderColor:theme.palette.success.main
    },
    danger:{
        marginLeft:theme.spacing(1),
        color:theme.palette.danger.main,
        borderColor:theme.palette.danger.main
    },
    positive:{
        color:theme.palette.success.main
    },
    negative:{
        color:theme.palette.danger.main
    },
    grid:{
        display:'flex',
        flexDirection:'column',
        padding:theme.spacing(1),
        height:'calc(100vh - 100px)',
    },
    pedidos:{
        marginTop:theme.spacing(2)
    },
    grow:{
        flexGrow:1
    },
    textWhite:{
        color:theme.palette.primary.contrastText
    },
    pedidosContainer:{
        flexGrow:1
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    gridTable:{
        maxHeight: '70vh',
        overflow:'auto',
        marginBottom:theme.spacing(3)
    }
}))
const IvaPage=(props)=>{
    const classes = useStyles()
    const [loading,setLoading]=useState(false)
    const [showSnackbar,setshowSnackbar]=useState(false)
    const [totalCompras, setTotalCompras]= useState(0)
    const [ivaCompras, setIvaCompras]= useState(0)
    const [totalVentas, setTotalVentas]= useState(0)
    const [ivaVentas, setIvaVentas]= useState(0)
    const agregarCompra = () =>{
        let aux={
            fecha:'13/11/2022',
            categoria:'Super',
            iva:2100,
            total:10000
        }
        database().ref().child(props.user.uid).child('iva').child('compras').push(aux)
            .then(()=>{
                setshowSnackbar(true)
                setTimeout(() => {
                    setshowSnackbar(false)
                }, 2000);
            })
            .catch(()=>{
                setLoading(false)
            })
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
    useEffect(()=>{
        calcularTotal('compras')
        calcularTotal('ventas')
        calcularIva('compras')
        calcularIva('ventas')
    },)
    return(
        <Layout history={props.history} page="Iva" user={props.user.uid}>
            <Grid container justify='center' className={classes.container}>
                <Grid item xs={12}>
                    <Typography align='center' variant='h2' className={ivaCompras-ivaVentas>=0? classes.positive:classes.negative}>$ {formatMoney(ivaCompras-ivaVentas)}</Typography>
                </Grid>
                <Grid item xs={12} justify='center'>
                    <Button startIcon={<Add/>} onClick={()=>{agregarCompra()}}>
                        Agregar Compra
                    </Button>
                </Grid>
                <Grid container justify='space-around'>
                    <Grid item xs={10} sm={8} md={5} className={classes.gridTable}>
                        <Compras data={props.iva.compras}/>
                    </Grid>
                    <Grid item xs={10} sm={8} md={5} className={classes.gridTable}>
                        <Ventas data={props.iva.ventas}/>
                    </Grid>
                </Grid>
            </Grid>
            <Backdrop className={classes.backdrop} open={loading}>
                {showSnackbar?
                    <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={()=>{setshowSnackbar(false)}}>
                        <Alert onClose={()=>{setshowSnackbar(false)}} severity="success" variant='filled'>
                            La compra se agrego correctamente!
                        </Alert>
                    </Snackbar>
                    :
                    <CircularProgress color="inherit" />
                }
            </Backdrop>
        </Layout>
    )
}
const mapStateToProps = state =>{
    return{
        user:state.user,
        iva:state.iva
    }
}
export default connect(mapStateToProps,null)(IvaPage)