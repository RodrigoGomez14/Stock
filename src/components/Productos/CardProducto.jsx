import React, {useState,useEffect} from 'react'
import {Grid,Card,CardContent,IconButton,ListSubheader,Chip,CardHeader,Collapse,Menu,MenuItem,Divider,TableRow,TableCell,Typography,Paper,List,ListItem,ListItemIcon,ListItemText} from '@material-ui/core'
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
        <TableRow>
            <TableCell>{name}</TableCell>
            <TableCell>{cantidad}</TableCell>
            <TableCell>$ {formatMoney(precio)}</TableCell>
        </TableRow>
    )
}
