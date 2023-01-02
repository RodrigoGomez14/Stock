import React,{useState} from 'react'
import {connect} from 'react-redux'
import {Layout} from './Layout'
import {makeStyles,Paper,Button,Tab,Typography,TextField,Grid,AppBar,Box,Tabs,Link as LinkComponent} from '@material-ui/core'
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
    const [search,setSearch]=useState('')
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

    useEffect(()=>{
        let aux = 0
        if(props.clientes){
            Object.values(props.clientes).map(cliente=>{
                aux += cliente.datos.deuda
            })
            setTotalClientes(aux)
            aux=0
        }
        if(props.proveedores){
            Object.values(props.proveedores).map(proveedor=>{
                aux += proveedor.datos.deuda
            })
            setTotalProveedores(aux)
        }
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