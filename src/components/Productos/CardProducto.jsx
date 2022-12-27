import React, {useState,useEffect} from 'react'
import {Grid,Card,CardContent,IconButton,ListSubheader,Chip,CardHeader,Collapse,Menu,MenuItem,Divider,ExpansionPanel,ExpansionPanelSummary,ExpansionPanelDetails,Paper,List,ListItem,ListItemText} from '@material-ui/core'
import {MoreVert,ExpandMore,ExpandLess} from '@material-ui/icons'
import {formatMoney, obtenerFecha} from '../../utilities'
import {Link} from 'react-router-dom'
import {content} from '../..//Pages/styles/styles'
import { StepperNuevoProducto } from '../Nuevo-Producto/StepperNuevoProducto'
import firebase from 'firebase'

export const CardProducto = ({precio,cantidad,search,name,eliminarProducto,subproductos,cadenaDeProduccion,useruid,isSubproducto}) =>{
    const classes = content()
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading,setLoading] = useState(false)
    const [expanded, setExpanded] = useState(false);
    const [showSnackbar, setshowSnackbar] = useState('');


    // MENU DESPLEGABLE
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const iniciarCadena = () =>{
        setLoading(true)
        let aux = []
        aux.producto = name
        aux.fechaDeInicio = obtenerFecha()
        aux['procesos'] = []
        cadenaDeProduccion.map(proceso=>{
            aux['procesos'].push(proceso)
            aux['procesos'][0].fechaDeInicio = obtenerFecha()
        })
        setLoading(true)
        firebase.database().ref().child(useruid).child('cadenasActivas').push(aux)
        .then(()=>{
            setshowSnackbar('La cadena se inicio correctamente!!')
            setTimeout(() => {
                setLoading(false)
            }, 2000);
        })
        .catch(()=>{
            setLoading(false)
        })
    }
    // CONTENT
    return(
        <Grid item xs={8} sm={6} md={4} lg={3} className={!search?null:name.toLowerCase().search(search.toLowerCase()) == -1 ? classes.displayNone:classes.display}>
                <Card>
                    <CardHeader
                        className={classes.cardCliente}
                        action={
                            <>
                                {subproductos || cadenaDeProduccion ?
                                    <IconButton onClick={()=>{setExpanded(!expanded)}}>
                                        {expanded?
                                            <ExpandLess/>
                                            :
                                            <ExpandMore/>
                                        }
                                    </IconButton>
                                    :
                                    null
                                }
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
                                        className={classes.link}
                                        style={{color:'#fff',textDecoration:'none'}}
                                        to={{
                                            pathname:'/Editar-Producto',
                                            search:`${name}`,
                                        }}
                                    >
                                        <MenuItem>Editar</MenuItem>
                                    </Link>
                                    {cadenaDeProduccion?
                                        <MenuItem
                                            onClick={()=>{iniciarCadena()}}
                                        >Iniciar Cadena de produccion</MenuItem>
                                        :
                                        null
                                    }
                                    <MenuItem onClick={()=>{
                                        setAnchorEl(null)
                                        eliminarProducto()
                                    }}>Eliminar</MenuItem>
                                </Menu>
                            </>
                        }
                        title={[name,<Chip color='inherit' label={cantidad} style={{marginLeft:'8px'}}/>]}
                        subheader={!isSubproducto?`$ ${formatMoney(precio)} c/u`:null}

                    />
                    <Collapse in={expanded} timeout='auto' unmountOnExit>
                        <CardContent>
                            <Grid container xs={12} justify='flex-start' spacing={3}>
                                {subproductos?
                                    <Grid container item xs={12}>
                                        <Grid item xs={12}>
                                            <List>
                                                <Divider/>
                                                <ListSubheader>
                                                    Subproductos
                                                </ListSubheader>
                                                <Divider/>
                                                {subproductos.map(subproducto=>(
                                                    <>
                                                        <ListItem>
                                                            <ListItemText primary={subproducto}
                                                            />
                                                        </ListItem> 
                                                    </>
                                                ))}
                                            </List>
                                        </Grid>
                                    </Grid>
                                    :
                                    null
                                }
                                {cadenaDeProduccion?
                                    <Grid container xs={12}>
                                        <Grid item xs={12}>
                                            <List>
                                                <Divider/>
                                                <ListSubheader>
                                                    Cadena de Produccion
                                                </ListSubheader>
                                                <Divider/>
                                            </List>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StepperNuevoProducto cadenaDeProduccion={cadenaDeProduccion}/>
                                        </Grid>
                                    </Grid>
                                    :
                                    null
                                }
                                </Grid>
                        </CardContent>
                    </Collapse>
                </Card>
        </Grid>
    )
}
