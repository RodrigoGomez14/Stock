import React, {useState,useEffect} from 'react'
import {Grid,Card,CardContent,IconButton,Typography,Chip,Button,CardHeader,Paper,Menu,MenuItem,CardActions, List,ListItem, ListItemText,Collapse,FormControlLabel,Switch, TableRow, TableContainer,Table,TableCell,TableBody,TableHead} from '@material-ui/core'
import {MoreVert,AttachMoney,ExpandMore, ExpandLess} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

export const CardEntrega = ({entrega,id,eliminarEntrega,deuda}) =>{
    const classes = content()
    const [anchorEl, setAnchorEl] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [facturacion,setFacturacion]=useState(false)

    //Menu More
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return(
        <Grid item xs={11}  >
            <Card>
                <Paper elevation={3} className={classes.cardPedidoHeader}>
                    <CardHeader
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
                                        style={{color:'#fff',textDecoration:'none'}}
                                        className={classes.link}
                                        to={{
                                        pathname:'/Editar-Entrega',
                                        search:`${id}`
                                    }}>
                                        <MenuItem>Editar</MenuItem>
                                    </Link>
                                    <MenuItem className={classes.deleteButton} onClick={()=>{
                                        setAnchorEl(null)
                                        eliminarEntrega()
                                    }}>
                                        Eliminar
                                    </MenuItem>
                                </Menu>
                            </>
                        }
                        title={
                            <Grid container xs={12} justify='flex-start' spacing={3}>
                                <Grid item>
                                    <Link
                                        style={{color:'#fff',textDecoration:'none'}}
                                        className={classes.textWhite}
                                        to={{pathname:'/Proveedor',search:`${entrega.proveedor}`}
                                    }>
                                        {entrega.proveedor} 
                                <Grid item>
                                    <Chip
                                        className={deuda>0?classes.cardDeudaRed:classes.cardDeudaGreen}
                                        variant="outlined"
                                        icon={<AttachMoney/>}
                                        label={deuda?formatMoney(deuda):formatMoney(0)}
                                    />
                                </Grid>
                                    </Link>
                                </Grid>
                            </Grid>
                            }
                        subheader={entrega.fecha}
                    />
                </Paper>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                    <List>
                            {entrega.cotizacion?
                                <ListItem>
                                    <ListItemText primary={`$${entrega.cotizacion.valor}`} secondary={entrega.cotizacion.nombre}/>
                                </ListItem>
                                :
                                null
                            }
                            <TableContainer component={Paper}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableCell>Cantidad</TableCell>
                                        <TableCell>Producto</TableCell>
                                        <TableCell>Precio Unitario</TableCell>
                                        <TableCell>Total</TableCell>
                                    </TableHead>
                                    <TableBody>
                                        {entrega.productos.map(producto=>(
                                            <TableRow>
                                                <TableCell>{producto.cantidad}</TableCell>
                                                <TableCell>{producto.producto}</TableCell>
                                                <TableCell>$ {formatMoney(facturacion?producto.precio*1.21:producto.precio)}</TableCell>
                                                <TableCell>$ {formatMoney(facturacion?(producto.precio*producto.cantidad)*1.21:(producto.precio*producto.cantidad))}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </List>
                    </CardContent>
                </Collapse>
                <Paper elevation={3} className={classes.cardPedidoActions}>
                    <CardActions>
                        <Grid container justify='space-around'>
                            <Typography variant='h5'>
                                {facturacion?
                                    `$ ${formatMoney(entrega.total*1.21)}`
                                    :
                                    `$ ${formatMoney(entrega.total)}`
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
                                to={{pathname:'/Recibir-Entrega',search:`${id}`,props:{total:facturacion?(entrega.total+entrega.total*0.21):entrega.total,facturacion:facturacion}}
                            }>
                                <Button
                                    variant='contained'
                                >
                                    Recibir Entrega 
                                </Button>
                            </Link>
                        </Grid>
                    </CardActions>
                </Paper>
            </Card>
        </Grid>
    )
}
