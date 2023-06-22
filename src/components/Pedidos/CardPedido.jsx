import React, {useState,useEffect} from 'react'
import {Grid,Card,CardContent,IconButton,Typography,Chip,Button,CardHeader,Paper,Menu,MenuItem,Collapse, List,ListItem, ListItemText,Switch,FormControlLabel, CardActions} from '@material-ui/core'
import {MoreVert,AttachMoney,ExpandMore,ExpandLess} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {database} from 'firebase'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

export const CardPedido = ({pedido,id,deuda,setShowDialogDelete,setDeleteIndex,setUpdatePricesIndex,setShowDialogUpdatePrices,tipoDeCambio}) =>{
    const classes = content()
    const [anchorEl, setAnchorEl] = useState(null);
    const [facturacion,setFacturacion]=useState(false)
    const [confirmPriceUpdate,setConfirmPriceUpdate]=useState(false)
    const [expanded, setExpanded] = useState(false);

    //Menu More
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return(
        <Grid item xs={11} sm={8} md={6} lg={4} >
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
                                        <Link
                                            style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                            to={{
                                                pathname:'/Editar-Pedido',
                                                search:`${id}`
                                        }}>
                                            <MenuItem>Editar</MenuItem>
                                        </Link>   
                                    <MenuItem className={classes.deleteButton} onClick={()=>{
                                        setAnchorEl(null)
                                        setShowDialogDelete(true)
                                        setDeleteIndex(id)
                                    }}>
                                        Eliminar
                                    </MenuItem>
                                    {parseFloat(tipoDeCambio) != parseFloat(pedido.cotizacion.valor)?
                                        <MenuItem className={classes.deleteButton} onClick={()=>{
                                            setAnchorEl(null)
                                            setShowDialogUpdatePrices(true)
                                            setUpdatePricesIndex(id)
                                        }}>
                                            Actualizar precios
                                        </MenuItem>
                                        :
                                        null
                                    }
                                </Menu>
                            </>
                        }
                        title={
                            <Grid container xs={12} justify='flex-start' spacing={3}>
                                <Grid item>
                                    <Link 
                                        style={{color:'#fff',textDecoration:'none'}}
                                        className={classes.textWhite}
                                        to={{pathname:'/Cliente',search:`${pedido.cliente}`}
                                    }>
                                        {pedido.cliente} 
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Chip
                                        className={deuda>0?classes.cardDeudaRedCardPedido:classes.cardDeudaGreenCardPedido}
                                        icon={<AttachMoney/>}
                                        label={deuda?formatMoney(deuda):formatMoney(0)}
                                    />

                                </Grid>
                            </Grid>
                        }
                        subheader={pedido.fecha}
                    />
                </Paper>
                <Collapse in={expanded} timeout='auto' unmountOnExit>
                    <CardContent>
                        <List>
                            <ListItem>
                                <ListItemText primary={`$${pedido.cotizacion.valor}`} secondary={pedido.cotizacion.nombre}/>
                            </ListItem>
                            {pedido.productos.map(producto=>(
                                <ListItem>
                                    <ListItemText primary={`${producto.cantidad} ${producto.producto}`} secondary={`$${formatMoney(facturacion?((producto.precio + (producto.precio*0.21)) * producto.cantidad ):(producto.precio*producto.cantidad))} ($${formatMoney(facturacion?(producto.precio + (producto.precio*0.21)):producto.precio)} c/u)`}/>
                                    {producto.discount?
                                        <ListItemText 
                                            primary={<Chip
                                                className={classes.cardProductoChip}
                                                variant="default"
                                                label={`-${producto.discount}%`}
                                            />}
                                        />
                                        :
                                        null
                                    }
                                    {producto.increase?
                                        <ListItemText 
                                            primary={<Chip
                                                className={classes.cardProductoChip}
                                                variant="default"
                                                label={`+${producto.increase}%`}
                                            />}
                                        />
                                        :
                                        null
                                    }
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Collapse>
                <Paper elevation={3} className={classes.cardPedidoActions}>
                    <CardActions>
                        <Grid container justify='space-around'>
                            <Typography variant='h5'>
                                {facturacion?
                                    `$ ${formatMoney(pedido.total+pedido.total*0.21)}`
                                    :
                                    `$ ${formatMoney(pedido.total)}`
                                }
                            </Typography>
                            <FormControlLabel
                            control={
                                <Switch
                                    checked={facturacion}
                                    onChange={e=>{
                                        setFacturacion(e.target.checked)
                                    }}
                                />
                            }
                                label="Facturacion "/>
                            <Link
                                style={{color:'#fff',textDecoration:'none'}}
                                className={classes.textWhite}
                                to={{
                                    pathname:'/Enviar-Pedido',
                                    search:`${id}`,
                                    props:{
                                        total: facturacion?pedido.total+(pedido.total*0.21) : pedido.total,
                                        facturacion:facturacion,
                                        nombre:pedido.cliente
                                    }}
                            }>
                                <Button
                                    variant='outlined'
                                >
                                    Enviar Pedido 
                                </Button>
                            </Link>
                        </Grid>
                    </CardActions>
                </Paper>
            </Card>
        </Grid>
    )
}
