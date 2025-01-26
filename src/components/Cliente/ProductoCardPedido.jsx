import React, {useState} from 'react'
import {Grid,TableRow,TableCell,Menu,CardHeader,Collapse, List,ListItem, ListItemText,MenuItem,Input, CardActions, Divider, IconButton} from '@material-ui/core'
import {ExpandLess,ExpandMore,MoreVert} from '@material-ui/icons'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

export const ProductoCardPedido = ({producto,factura}) =>{
    const classes = content()
    const [expanded,setExpanded]=useState(false)
    const [facturacion,setFacturacion] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);

    const getPrecioAnterior = () =>{
        if(producto.discount){
            if(facturacion){
                let aux = producto.precio/1.21
                console.log(aux/(1-(producto.discount/100)))
                return (aux/(1-(producto.discount/100)))
            }
            else{
                return (producto.precio/(1-(producto.discount/100)))
            }
        }
        else{
            if(facturacion){
                let aux = producto.precio/1.21
                console.log(aux/(1+(producto.increase/100)))
                return (aux/(1+(producto.increase/100)))
            }
            else{
                return (producto.precio/(1+(producto.increase/100)))
            }
        }
    }
    const getPriceDiference = () =>{
            return formatMoney(getPrecioAnterior()*(producto.discount?producto.discount:producto.increase)/100)
    }
     //Menu More
     const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return(
        <TableRow>
            <TableCell>{producto.cantidad}</TableCell>
            <TableCell>{producto.producto}</TableCell>
            <TableCell>$ {formatMoney(producto.precio)}</TableCell>
        </TableRow>
    )
}