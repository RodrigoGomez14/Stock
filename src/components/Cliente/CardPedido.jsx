import React, {useState,useEffect} from 'react'
import {Grid,Card,CardContent,IconButton,Typography,Chip,ListSubheader,CardHeader,Paper,Menu,MenuItem,Collapse, List,ListItem, ListItemText,Divider,ListItemSecondaryAction, CardActions} from '@material-ui/core'
import {MoreVert,AttachMoney,ExpandMore,ExpandLess} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {Alert} from '@material-ui/lab'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'
import { ProductoCardPedido } from './ProductoCardPedido'

export const CardPedido = ({pedido,id,searchPedido,searchRemito}) =>{
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

    const getClassNameSearch = () =>{
        if(searchRemito){
            return !searchRemito?null:id.search(searchRemito) == -1 ? classes.displayNone:classes.display
        }
        else{
            return !searchPedido?null:id.search(searchPedido) == -1 ? classes.displayNone:classes.display 
        }
    }

    return(
        <Grid item xs={11} sm={8} md={6} lg={4} className={getClassNameSearch()}>
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
                        title={pedido.fecha}
                        subheader={`$ ${formatMoney(pedido.total)}`}
                    />
                </Paper>
                <Collapse in={expanded} timeout='auto' unmountOnExit>
                    <CardContent>
                        <Grid container xs={12} spacing={2} >
                            {pedido.metodoDeEnvio.expreso?
                                <Grid container item xs={12}>
                                    <Grid container item xs={12}>
                                            <Alert variant="filled" severity="success" className={classes.alertCheque}>
                                        <Link
                                            style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                            to={{
                                            pathname:'/Expreso',
                                            search:pedido.metodoDeEnvio.expreso,
                                            props:{
                                                remito:pedido.metodoDeEnvio.remito
                                            }
                                        }}>
                                            Enviado con {pedido.metodoDeEnvio.expreso} Remito Nº {pedido.metodoDeEnvio.remito}
                                        </Link>
                                            </Alert>
                                    </Grid>
                                </Grid>
                                :
                                null
                            }
                                {pedido.articulos.map(producto=>(
                                    <Grid container item xs={12} spacing={2}>
                                        <ProductoCardPedido producto={producto}/>
                                    </Grid>
                                ))}
                        </Grid>
                        <List>
                            <Divider/>
                            <ListItem>
                                <ListItemText
                                    primary={`$ ${formatMoney(pedido.metodoDePago.pagado)}`}
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
                                    primary={`$ ${formatMoney(pedido.metodoDePago.deudaPasada)}`}
                                    secondary='Deuda Anterior'
                                />
                                <ListItemText
                                    primary={`$ ${formatMoney(pedido.metodoDePago.deudaActualizada)}`}
                                    secondary='Deuda Actualizada'
                                />
                            </ListItem>   
                            <Divider/>
                        </List>
                        {pedido.metodoDePago.pagado > 0?
                        <Card>
                            <CardHeader className={classes.titleDetallesCard} title='Detalles de pago'/>
                            <CardContent>
                                <List>
                                    {pedido.metodoDePago.efectivo?
                                        <ListItem>
                                            <ListItemText primary={`$ ${formatMoney(pedido.metodoDePago.efectivo)}`} secondary='Efectivo'/>
                                        </ListItem>
                                        :
                                        null
                                    }
                                    {pedido.metodoDePago.cheques?
                                    <>
                                        {pedido.metodoDePago.efectivo?<Divider/>:null}
                                        <ListItem>
                                            <ListItemText
                                                primary={`$ ${formatMoney(pedido.metodoDePago.total-(pedido.metodoDePago.efectivo?pedido.metodoDePago.efectivo:0))}`}
                                                secondary={`${pedido.metodoDePago.cheques.length} ${pedido.metodoDePago.cheques.length>1?'Cheques':'Cheque'}`}/>
                                        </ListItem>
                                        <ListItem>
                                            {pedido.metodoDePago.cheques.map(cheque=>(
                                                <ListItemText
                                                    primary={
                                                    <Link
                                                        style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                                        to={{
                                                        pathname:'/Cheques',
                                                        search:cheque}}>
                                                            N° {cheque}
                                                    </Link>
                                                    }
                                                />
                                            ))}
                                        </ListItem>
                                    </>
                                    :
                                    null
                                    }
                                </List>
                            </CardContent>
                        </Card>
                            :
                            null
                        }
                    </CardContent>
                </Collapse>
            </Card>
        </Grid>
    )
}
