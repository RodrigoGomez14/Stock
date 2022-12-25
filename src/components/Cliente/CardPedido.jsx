import React, {useState,useEffect} from 'react'
import {Grid,Card,CardContent,IconButton,Typography,Chip,ListSubheader,CardHeader,Paper,Menu,MenuItem,Collapse, List,ListItem, ListItemText,Divider,ListItemSecondaryAction, CardActions} from '@material-ui/core'
import {MoreVert,AttachMoney,ExpandMore,ExpandLess} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {database} from 'firebase'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

export const CardPedido = ({pedido,id,searchPedido}) =>{
    const classes = content()
    const [anchorEl, setAnchorEl] = useState(null);
    const [facturacion,setFacturacion]=useState(false)
    const [expanded, setExpanded] = useState(false);
    const [expandedPago, setExpandedPago] = useState(false);
    const [expandedCheques, setExpandedCheques] = useState(false);

    //Menu More
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return(
        <Grid item xs={11} sm={8} md={6} lg={4} className={!searchPedido?null:id.search(searchPedido) == -1 ? classes.displayNone:classes.display}>
            <Card>
                <Paper elevation={3} className={classes.cardPedidoHeader}>
                    <CardHeader
                        className={classes.header}
                        action={
                            <>
                                <IconButton onClick={()=>{setExpanded(!expanded)}}>
                                    {expanded?
                                        <ExpandLess/>
                                        :
                                        <ExpandMore/>
                                    }
                                </IconButton>
                                <IconButton aria-label="settings" onClick={handleClick}>
                                    <MoreVert/>
                                </IconButton>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem>Editar</MenuItem>
                                    <MenuItem className={classes.deleteButton} onClick={()=>{}}>Eliminar</MenuItem>
                                </Menu>
                            </>
                        }
                        subheader={
                            <List>
                                <ListItem>
                                    <ListItemText 
                                        primary={pedido.metodoDeEnvio=="Particular"?
                                        'Envio'
                                        :
                                        <ListItemText 
                                            primary={
                                                <Link
                                                    style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                                    to={{
                                                    pathname:'/Expreso',
                                                    search:pedido.metodoDeEnvio.expreso,
                                                    props:{
                                                        remito:pedido.metodoDeEnvio.remito
                                                    }
                                                }}>
                                                    <Chip className={classes.cardProductoChip} label={pedido.metodoDeEnvio.expreso}/>
                                                </Link>
                                        }/>
                                    } 
                                    secondary={pedido.metodoDeEnvio=="Particular"?'Particular': pedido.metodoDeEnvio.remito}/>
                                </ListItem>
                            </List>
                        }
                        title={pedido.fecha}
                    />
                </Paper>
                <Collapse in={expanded} timeout='auto' unmountOnExit>
                    <CardContent>
                        <List
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                  Productos
                                </ListSubheader>
                              }
                        >
                            {pedido.articulos.map(producto=>(
                                <ListItem>
                                    <ListItemText primary={producto.producto} secondary={`${producto.cantidad} u, $ ${producto.precio}`}/>
                                    {producto.discount?
                                        <ListItemText primary={<Chip className={classes.cardProductoChip} label={`-${producto.discount}%`}/>}/>
                                        :
                                        null
                                    }
                                    {producto.increase?
                                        <ListItemText primary={<Chip className={classes.cardProductoChip} label={`+${producto.increase}%`}/>}/>
                                        :
                                        null
                                    }
                                </ListItem>
                            ))}
                        </List>
                        <List>
                            <Divider/>
                            <ListItem>
                                <ListItemText
                                    primary={<Chip
                                        className={classes.cardProductoChip}
                                        label={`$ ${formatMoney(pedido.metodoDePago.pagado)}`}
                                    />}
                                    secondary='Pagado'
                                />
                                <ListItemText
                                    primary={<Chip
                                        className={classes.cardProductoChip}
                                        label={`$ ${formatMoney(pedido.metodoDePago.adeudado)}`}
                                    />}
                                    secondary='Adeudado'
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary={<Chip
                                        className={classes.cardProductoChip}
                                        label={`$ ${formatMoney(pedido.metodoDePago.deudaPasada)}`}
                                    />}
                                    secondary='Deuda Anterior'
                                />
                                <ListItemText
                                    primary={<Chip
                                        className={classes.cardProductoChip}
                                        label={`$ ${formatMoney(pedido.metodoDePago.deudaActualizada)}`}
                                    />}
                                    secondary='Deuda Actualizada'
                                />
                            </ListItem>   
                            <Divider/>
                        </List>
                        {pedido.metodoDePago.pagado > 0?
                        <Card>
                            <CardHeader className={classes.titleDetallesCard} title='Detalles de pago' action={<IconButton onClick={()=>{setExpandedPago(!expandedPago)}}>{expandedPago?<ExpandLess/>:<ExpandMore/>}</IconButton>}/>
                            <Collapse in={expandedPago} timeout='auto' unmountOnExit>
                                <CardContent>
                                    {pedido.metodoDePago.efectivo?
                                        <List>
                                            <ListItem>
                                                <ListItemText primary={`$ ${formatMoney(pedido.metodoDePago.efectivo)}`} secondary='Efectivo'/>
                                            </ListItem>
                                        </List>
                                        :
                                        null
                                    }
                                    {pedido.metodoDePago.cheques?
                                        <Card>
                                            <CardHeader
                                            className={classes.titleDetallesCard}
                                            title={
                                                <List>
                                                    <ListItem>
                                                        <ListItemText primary={`${pedido.metodoDePago.cheques.length} ${pedido.metodoDePago.cheques.length>1?'Cheques':'Cheque'} $ ${formatMoney(pedido.metodoDePago.total-(pedido.metodoDePago.efectivo?pedido.metodoDePago.efectivo:0))}`}/>
                                                        <ListItemSecondaryAction>
                                                            <IconButton 
                                                                onClick={()=>{
                                                                    setExpandedCheques(!expandedCheques)
                                                                 }}>
                                                                    {expandedCheques?<ExpandLess/>:<ExpandMore/>}
                                                            </IconButton>                           
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                </List>
                                                }/>
                                            <Collapse in={expandedCheques} timeout='auto' unmountOnExit>
                                                <CardContent>
                                                    <List>
                                                        {pedido.metodoDePago.cheques.map(cheque=>(
                                                           <ListItem>
                                                                <ListItemText 
                                                                    primary={
                                                                        <Link
                                                                            style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                                                            to={{
                                                                            pathname:'/Cheques',
                                                                            search:cheque
                                                                        }}>
                                                                            {cheque}
                                                                        </Link>}
                                                                    />
                                                           </ListItem> 
                                                        ))}
                                                    </List>
                                                </CardContent>
                                            </Collapse>
                                        </Card>
                                        :
                                        null
                                    }
                                </CardContent>
                            </Collapse>
                        </Card>
                            :
                            null
                        }
                    </CardContent>
                </Collapse>
                <Paper elevation={3} className={classes.cardPedidoActions}>
                    <CardActions>
                        <Grid container justify='space-around'>
                            <Typography variant='h5'>
                                    {`$ ${formatMoney(pedido.total)}`}
                            </Typography>
                        </Grid>
                    </CardActions>
                </Paper>
            </Card>
        </Grid>
    )
}
