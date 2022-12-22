import React, {useState,useEffect} from 'react'
import {Grid,Card,CardContent,IconButton,Typography,Chip,Button,CardHeader,Paper,Menu,MenuItem,CardActions, List,ListItem, ListItemText,Collapse} from '@material-ui/core'
import {MoreVert,AttachMoney,ExpandMore, ExpandLess} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

export const CardEntrega = ({entrega,id,eliminarEntrega,deuda}) =>{
    const classes = content()
    const [anchorEl, setAnchorEl] = useState(null);
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
                            {entrega.productos.map(producto=>(
                                <ListItem>
                                    <ListItemText primary={producto.producto} secondary={producto.cantidad}/>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Collapse>
                <Paper elevation={3} className={classes.cardPedidoActions}>
                    <CardActions>
                        <Grid container justify='space-around'>
                            <Typography variant='h5'>
                                $ {formatMoney(entrega.total)}
                            </Typography>
                            <Link
                                style={{color:'#fff',textDecoration:'none'}}
                                className={classes.textWhite}
                                to={{pathname:'/Recibir-Entrega',search:`${id}`,props:{total:entrega.total}}
                            }>
                                <Button
                                    variant='outlined'
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
