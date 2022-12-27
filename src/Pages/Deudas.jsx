import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,Button,Card,ListItem,Typography,TextField,List,Grid,Chip,Divider,Link as LinkComponent} from '@material-ui/core'
import {AttachMoney,PersonAdd} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {formatMoney} from '../utilities'
import {content} from './styles/styles'
import CardDeudaCliente from '../components/Deudas/CardDeudaCliente'
import CardDeudaProveedor from '../components/Deudas/CardDeudaProveedor'
import { useEffect } from 'react'

// COMPONENT
const Deudas=(props)=>{
    const classes = content()
    let [searchCliente,setSearchCliente]=useState('')
    let [searchProveedor,setSearchProveedor]=useState('')
    let [totalClientes,setTotalClientes]=useState(0)
    let [totalProveedores,setTotalProveedores]=useState(0)

    useEffect(()=>{
        Object.values(props.clientes).map(cliente=>{
            setTotalClientes(totalClientes + cliente.datos.deuda)
        })
        Object.values(props.proveedores).map(proveedor=>{
            setTotalProveedores(totalProveedores + proveedor.datos.deuda)
        })
    },[])
    return(
        <Layout history={props.history} page="Deudas" user={props.user.uid}>
            {/* CONTENT */}
            <Paper className={classes.content}>
                <Grid container spacing={4} >
                    {/* DEUDAS CLIENTES LIST */}
                        {props.clientes?
                            <Grid container item xs={12} justify='center' alignItems='center' spacing={3}>
                                <Grid container item xs={12} justify='center'>
                                    <Typography  variant='h5' textAlign='center'>
                                        Clientes ${formatMoney(totalClientes)}
                                    </Typography>
                                </Grid>
                                <Grid container item xs={12} justify='center'>
                                    <TextField
                                        value={searchCliente}
                                        onChange={e=>{
                                            setSearchCliente(e.target.value)
                                        }}
                                        disabled={!props.clientes}
                                        label='Buscar Cliente'
                                    />
                                </Grid>
                                <Grid container justify='center' alignItems='center' spacing={4}>
                                    {Object.keys(props.clientes).map(key=>(
                                        props.clientes[key].datos.deuda != 0 ?
                                            <CardDeudaCliente nombre={key} search={searchCliente} deuda={props.clientes[key].datos.deuda}/>
                                        :
                                        null
                                    ))}
                                </Grid>
                            </Grid>
                            :
                            <Grid container item xs={12}>
                                <Typography variant='h5'>
                                    Aun no hay ningun cliente ingresado
                                </Typography>
                            </Grid>
                        }
                    
                    {/* DEUDAS PROVEEDORES LIST */}
                    <Grid container item xs={12} justify='center' alignItems='center'>
                        {props.proveedores?
                            <Grid container item xs={12} justify='center' alignItems='center' spacing={3}>
                                <Grid container item xs={12} justify='center'>
                                    <Typography  variant='h5' textAlign='center'>
                                        Proveedores  ${formatMoney(totalProveedores)}
                                    </Typography>
                                </Grid>
                                <Grid container item xs={12} justify='center'>
                                    <TextField
                                        value={searchProveedor}
                                        onChange={e=>{
                                            setSearchProveedor(e.target.value)
                                        }}
                                        disabled={!props.proveedores}
                                        label='Buscar Proveedor'
                                    />
                                </Grid>
                                <Grid container justify='center' alignItems='center' spacing={4}>
                                    {Object.keys(props.proveedores).map(key=>(
                                        props.proveedores[key].datos.deuda != 0 ?
                                        <CardDeudaProveedor nombre={key} search={searchProveedor} deuda={props.proveedores[key].datos.deuda}/>
                                        :
                                        null
                                    ))}
                                </Grid>
                            </Grid>
                            :
                            <Grid container item xs={12}>
                                <Typography variant='h5'>
                                    Aun no hay ningun proveedor ingresado
                                </Typography>
                            </Grid>
                        }
                        
                    </Grid>
                </Grid>
            </Paper>
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