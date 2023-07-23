import React, {useState,useEffect} from 'react'
import {Grid,Card,CardContent,IconButton,ListSubheader,Chip,CardHeader,Collapse,Menu,MenuItem,Divider,ExpansionPanel,ExpansionPanelSummary,Typography,Paper,List,ListItem,ListItemIcon,ListItemText} from '@material-ui/core'
import {MoreVert,ExpandMore,ExpandLess,CheckCircleOutline,Block, Send, KeyboardReturn} from '@material-ui/icons'
import {formatMoney, obtenerFecha} from '../../utilities'
import {Link} from 'react-router-dom'
import {content} from '../..//Pages/styles/styles'
import { StepperCadena } from '../Productos/StepperCadena'
import ApexCharts from 'react-apexcharts';
import { DialogConfirmAction } from '../Dialogs/DialogConfirmAction'
import { DialogEditMatriz } from './Dialogs/DialogEditMatriz'


export const CardProducto = ({precio,cantidad,search,name,historialDeStock,matrices,eliminarProducto,subproductos,cadenaDeProduccion,historialDeProduccion,isSubproducto,iniciarCadena,setDeleteIndex,setShowDialogDelete,modificarMatriz}) =>{
    const classes = content()
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading,setLoading] = useState(false)
    const [expanded, setExpanded] = useState(false);
    const [showSnackbar, setshowSnackbar] = useState('');
    const [showDialogConfirmMatriz, setShowDialogConfirmMatriz] = useState(false);
    const [nuevaUbicacion, setNuevaUbicacion] = useState("");
    const [idnexEditMatriz, setIdnexEditMatriz] = useState(-1);

    // MENU DESPLEGABLE
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const generateChartSubproductos = (subproductos) => {

        const series = []
        const labels = []
    
        subproductos.map(subproducto=>{
            series.push(parseInt(subproducto.cantidad))
            labels.push(subproducto.nombre)
        })

        // Define la configuración del gráfico
        const options = {
            series:series,
            labels:labels,
            theme:{
                mode:'dark',
                palette:'palette2'

            },
            dataLabels:{
                dropShadow: {
                    enabled: true,
                    left: 2,
                    top: 2,
                    opacity: 0.5
                },
            },
            tooltip:{
                fillSeriesColor:false
            },
            chart:{
                sparkline:{
                    enabled:true
                }
            }
            
        };
        // Renderiza el gráfico
        return (
            <>
                <Grid container xs={12}>
                    <Grid item xs={12}>
                        <List>
                            <Divider/>
                            <ListSubheader>
                                Componentes
                            </ListSubheader>
                            <Divider/>
                        </List>
                    </Grid>
                </Grid>
                <ApexCharts options={options} series={series}  type='donut' width={300} />
            </>
        )
    }

    const generateChartHistorialStock = (auxHistorial) => {
        let data = []
        let labels = []
            Object.keys(auxHistorial).map(movimiento=>{
                data.push(auxHistorial[movimiento].cantidad)
                labels.push(auxHistorial[movimiento].fecha)
            })
    
        // Define la configuración del gráfico
        const options = {
            labels:labels,
            chart:{
                sparkline: {
                    enabled: true
                },
            },
            stroke: {
                curve: 'smooth'
            },
            tooltip:{
                theme:'dark'
            },
        };
    
        // Define los datos a visualizar
        const series = [
            {
            name: 'Stock',
            data: data,
            },
        ];
        // Renderiza el gráfico
        return <ApexCharts options={options} series={series} type='area' height={100}/>;
    }


    // CONTENT
    return(
        <Grid item xs={8} sm={6} md={4} lg={3} className={!search?null:name.toLowerCase().search(search.toLowerCase()) == -1 ? classes.displayNone:classes.display}>
                <Card>
                    <CardHeader
                        className={classes.cardCliente}
                        action={
                            <>
                                {subproductos || cadenaDeProduccion || historialDeStock?
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
                                            onClick={()=>{
                                                setAnchorEl(null)
                                                iniciarCadena(name)
                                            }}>
                                                Iniciar Cadena de produccion
                                            </MenuItem>
                                        :
                                        null
                                    }
                                    {historialDeProduccion?
                                        <MenuItem>
                                                <Link
                                                    className={classes.link}
                                                    style={{color:'#fff',textDecoration:'none'}}
                                                    to={{
                                                        pathname:'/Historial-De-Produccion',
                                                        search:`${name}`,
                                                    }}
                                                >
                                                Historial de Produccion
                                                </Link>
                                            </MenuItem>
                                        :
                                        null
                                    }
                                    <MenuItem onClick={()=>{
                                        setAnchorEl(null)
                                        setShowDialogDelete(true)
                                        setDeleteIndex(name)
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
                                {matrices?
                                    <Grid container xs={12}>
                                        <Grid item xs={12}>
                                            <List>
                                                <Divider/>
                                                <ListSubheader>
                                                    Matrices & Noyos
                                                </ListSubheader>
                                                <Divider/>
                                            </List>
                                        </Grid>
                                        <Grid container item xs={12} justify='center'>
                                            <Grid item xs={12}>
                                                <List>
                                                    {matrices.map((matriz,i)=>(
                                                        <>
                                                            <ListItem>
                                                                {matriz.ubicacion!="Taller"?
                                                                    <ListItemIcon className={classes.redCheck}>
                                                                        <Block/>
                                                                    </ListItemIcon>
                                                                    :
                                                                    <ListItemIcon className={classes.greenCheck}>
                                                                        <CheckCircleOutline />
                                                                    </ListItemIcon>
                                                                }
                                                                <ListItemText 
                                                                    primary={matriz.nombre}
                                                                    secondary={
                                                                        matriz.ubicacion!="Taller"?
                                                                        <Link
                                                                            style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                                                            to={{
                                                                            pathname:'/proveedor',
                                                                            search:matriz.ubicacion,
                                                                        }}>
                                                                                {matriz.ubicacion}
                                                                        </Link>
                                                                        :
                                                                        matriz.ubicacion
                                                                    }    
                                                                />
                                                                {matriz.ubicacion!="Taller"?
                                                                    <ListItemIcon 
                                                                        className={classes.pointer}
                                                                        onClick={()=>{
                                                                            setIdnexEditMatriz(i)
                                                                            setNuevaUbicacion("Taller")
                                                                            setShowDialogConfirmMatriz(true)
                                                                        }}>
                                                                        <KeyboardReturn />
                                                                    </ListItemIcon>
                                                                    :
                                                                    <ListItemIcon 
                                                                        className={classes.pointer}
                                                                        onClick={()=>{
                                                                            setIdnexEditMatriz(i)
                                                                            setNuevaUbicacion("FBC Fundicion Horacio")
                                                                            setShowDialogConfirmMatriz(true)
                                                                        }}>
                                                                        <Send />
                                                                    </ListItemIcon>
                                                                }

                                                            </ListItem>
                                                            {i<matrices.length-1?
                                                                <Divider/>
                                                                :
                                                                null
                                                            }
                                                        </>
                                                    ))}
                                                </List>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    :
                                    null
                                }
                                {historialDeStock?
                                    <Grid container xs={12}>
                                        <Grid item xs={12}>
                                            <List>
                                                <Divider/>
                                                <ListSubheader>
                                                    Historial de Stock
                                                </ListSubheader>
                                                <Divider/>
                                            </List>
                                        </Grid>
                                        <Grid container item xs={12} justify='center'>
                                            {generateChartHistorialStock(historialDeStock)}
                                        </Grid>
                                    </Grid>
                                    :
                                    null
                                }
                                {subproductos?
                                    <Grid container item xs={12}>
                                        <Grid container item xs={12} justify='center'>
                                            {generateChartSubproductos(subproductos)}
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
                                            <StepperCadena cadenaDeProduccion={cadenaDeProduccion}/>
                                        </Grid>
                                    </Grid>
                                    :
                                    null
                                }
                                </Grid>
                        </CardContent>
                    </Collapse>
                </Card>
                <DialogEditMatriz 
                    showDialog={showDialogConfirmMatriz} 
                    setShowDialog={setShowDialogConfirmMatriz}
                    modificarMatriz={()=>{modificarMatriz(name,idnexEditMatriz,nuevaUbicacion)}}
                />
        </Grid>
    )
}
