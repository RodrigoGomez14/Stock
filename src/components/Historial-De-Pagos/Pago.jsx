import React,{useState} from 'react'
import {Card,CardHeader,IconButton,Collapse,CardContent,Grid,List,ListItem,ListItemText,Button} from '@material-ui/core'
import {ExpandMore,ExpandLess} from '@material-ui/icons'
import {content} from '../../Pages/styles/styles'
import {Link} from 'react-router-dom'
import {formatMoney} from '../../utilities'
// COMPONENT
export const Pago=({pago,user,userType})=>{
    const classes = content()
    const [expanded,setExpanded] = useState(false)
    const [expandedDeuda,setExpandedDeuda] = useState(false)
    const [expandedMetodoDePago,setExpandedMetodoDePago] = useState(false)
    
    return(
        <Grid container item xs={12}>
            <Card className={classes.cardCadena}>
                <CardHeader 
                    title={
                        pago.idPedido?
                            <Link 
                                style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                to={{pathname:userType=="cliente"?'/Cliente':'/Proveedor',search:pago.idPedido}
                            }>
                                {pago.fecha}
                            </Link>
                            :
                            `${pago.fecha}`
                    } subheader={``} className={classes.cardHeaderCadena}
                    action={
                        <IconButton onClick={()=>{setExpanded(!expanded)}}>
                            {expanded?
                                <ExpandLess/>
                                :
                                <ExpandMore/>
                            }
                        </IconButton>
                    }    
                />
                <Collapse in={expanded} timeout='auto' unmountOnExit>
                    <CardContent>
                        <Grid container xs={12} spacing={2}>
                            <Grid item>
                                <Card>
                                    <CardHeader 
                                        className={classes.titleDetallesCard} 
                                        title='Evolucion de la deuda'
                                        action={
                                            <IconButton onClick={()=>{setExpandedDeuda(!expandedDeuda)}}>
                                                {expandedDeuda?
                                                    <ExpandLess/>
                                                    :
                                                    <ExpandMore/>
                                                }
                                            </IconButton>
                                        }    
                                    />
                                    <Collapse in={expandedDeuda} timeout='auto' unmountOnExit>
                                        <CardContent>
                                            <List>
                                                <ListItem>
                                                    <ListItemText primary={`$ ${formatMoney(pago.deudaPasada)}`} secondary={`deuda Anterior`}/>
                                                </ListItem>
                                                {pago.pagado?
                                                    <ListItem>
                                                        <ListItemText primary={`$ ${formatMoney(pago.pagado)}`} secondary={`Pagado`}/>
                                                    </ListItem>
                                                    :
                                                    <ListItem>
                                                        <ListItemText primary={`$ ${formatMoney(pago.adeudado)}`} secondary={`adeudado`}/>
                                                    </ListItem>
                                                }
                                                <ListItem>
                                                    <ListItemText primary={`$ ${formatMoney(pago.deudaActualizada)}`} secondary={`deuda Actualizada`}/>
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Collapse>
                                </Card>
                            </Grid>
                            {(pago.efectivo || pago.cheques || pago.totalTransferencia)?
                                <Grid item>
                                    <Card>  
                                        <CardHeader 
                                            className={classes.titleDetallesCard} 
                                            title='Metodo De Pago'
                                            action={
                                                <IconButton onClick={()=>{setExpandedMetodoDePago(!expandedMetodoDePago)}}>
                                                    {expandedMetodoDePago?
                                                        <ExpandLess/>
                                                        :
                                                        <ExpandMore/>
                                                    }
                                                </IconButton>
                                            }    
                                        />
                                        <Collapse in={expandedMetodoDePago} timeout='auto' unmountOnExit>
                                            <CardContent>
                                                <List>
                                                    {pago.efectivo?
                                                        <ListItem>
                                                            <ListItemText primary={`$ ${formatMoney(pago.efectivo)}`} secondary={`Efectivo`}/>
                                                        </ListItem>
                                                        :
                                                        null
                                                    }
                                                    {pago.cheques?
                                                        <ListItem>
                                                            <ListItemText primary={`$ ${formatMoney((pago.total-(pago.totalTransferencia?parseFloat(pago.totalTransferencia):0)-(pago.efectivo?parseFloat(pago.efectivo):0)))}`} secondary={`Cheques`}/>
                                                        </ListItem>
                                                        :
                                                        null
                                                    }
                                                    {pago.totalTransferencia?
                                                        <ListItem>
                                                            <ListItemText primary={`$ ${formatMoney(pago.totalTransferencia)}`} secondary={`Transferencia - ${pago.cuentaTransferencia}`}/>
                                                        </ListItem>
                                                        :
                                                        null
                                                    }
                                                </List>
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                                :
                                null
                            }
                            <Grid item>
                                {(userType=='cliente'&&pago.idPedido) ?
                                    <Link
                                        style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                        to={{
                                        pathname:'/Cliente',
                                        search:user,
                                        props:{
                                            searchPedido:pago.idPedido
                                        }
                                    }}>
                                        <Button variant='outlined'>
                                            Ver Pedido
                                        </Button>
                                    </Link>
                                    :
                                    null
                                }
                                {(userType=='proveedor'&&pago.idEntrega)?
                                    <Link
                                        style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                        to={{
                                        pathname:'/Proveedor',
                                        search:user,
                                        props:{
                                            searchEntrega:pago.idEntrega
                                        }
                                    }}>
                                        <Button variant='outlined'>
                                            Ver Entrega
                                        </Button>
                                    </Link>
                                    :
                                    null
                                }
                            </Grid>
                        </Grid>
                    </CardContent>
                </Collapse>
            </Card>
        </Grid>
    )
}