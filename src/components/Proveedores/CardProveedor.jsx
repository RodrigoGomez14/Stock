import React,{useState} from 'react'
import {Grid,Card,CardContent,CardActions,Button,Typography,Chip,CardHeader,IconButton,Menu,MenuItem} from '@material-ui/core'
import {formatMoney} from '../../utilities'
import {AttachMoney,MoreVert} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {content} from '../../Pages/styles/styles'


export const CardProveedor = ({datos,search}) =>{
    const classes = content()
    const [anchorEl, setAnchorEl] = useState(null);

    //Menu More
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return(
        <Grid item xs={8} sm={6} md={4} lg={3} style={!search?null:datos.nombre.toLowerCase().search(search.toLowerCase()) == -1 ? {display:'none'}:{}}>
            <Card className={classes.cardCliente}>
                <CardHeader
                    title={
                        <Link 
                            style={{color:'#fff',textDecoration:'none'}}
                            to={{
                                pathname:'/Proveedor',
                                search:`${datos.nombre}`
                            }}>
                                <Typography variant="h5" className={classes.titleCardCliente}>
                                    {datos.nombre}
                                </Typography>
                            </Link>
                    }
                    action={
                        <>
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
                                    to={{
                                    pathname:'/Editar-Proveedor',
                                    search:datos.nombre
                                }}>
                                    <MenuItem>Editar</MenuItem>
                                </Link>
                                <MenuItem className={classes.deleteButton} onClick={()=>{

                                }}>
                                    Eliminar
                                </MenuItem>
                            </Menu>
                        </>
                    }
                />
                <CardContent>
                        <Grid container item xs={12} justify='center'>
                            <Link 
                                style={{color:'#fff',textDecoration:'none'}}
                                to={{
                                    pathname:'/Historial-Proveedor',
                                    search:datos.nombre
                                }}>
                                <Chip
                                    className={datos.deuda>0?classes.chipCardDangerCliente:classes.chipCardSuccessCliente}
                                    variant="outlined"
                                    icon={<AttachMoney/>}
                                    label={datos.deuda?formatMoney(datos.deuda>=0?datos.deuda:-datos.deuda):formatMoney(0)}
                                />
                            </Link>
                        </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}
