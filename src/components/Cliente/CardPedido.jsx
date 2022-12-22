import React, {useState,useEffect} from 'react'
import {Grid,Card,CardContent,IconButton,Typography,Chip,ListSubheader,CardHeader,Paper,Menu,MenuItem,Collapse, List,ListItem, ListItemText,Switch,FormControlLabel, CardActions} from '@material-ui/core'
import {MoreVert,AttachMoney,ExpandMore,ExpandLess} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {database} from 'firebase'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

export const CardPedido = ({pedido,id}) =>{
    const classes = content()
    const [anchorEl, setAnchorEl] = useState(null);
    const [facturacion,setFacturacion]=useState(false)
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
                                    <MenuItem>Editar</MenuItem>
                                    <MenuItem className={classes.deleteButton} onClick={()=>{}}>Eliminar</MenuItem>
                                </Menu>
                            </>
                        }
                        subheader={
                            <List>
                                <ListItem>
                                    <ListItemText
                                        primary={<Chip
                                            className={classes.cardProductoChip}
                                            label={`$ ${pedido.total}`}
                                        />}
                                    />
                                </ListItem>
                                    
                            </List>
                        }
                        title={pedido.fecha}
                    />
                </Paper>
                <Collapse in={expanded} timeout='auto' unmountOnExit>
                    <CardContent>
                        <List>
                            <ListItem>
                                <ListItemText primary={pedido.metodoDeEnvio=="Particular"?'Particular':pedido.metodoDeEnvio.expreso} secondary={pedido.metodoDeEnvio=="Particular"?'Envio':pedido.metodoDeEnvio.remito}/>
                            </ListItem>
                        </List>
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
                                    <ListItemText secondary={<Chip className={classes.cardProductoChip} label='- 10%'/>}/>
                                </ListItem>
                            ))}
                        </List>
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
