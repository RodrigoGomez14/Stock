import React,{useState} from 'react'
import {TableRow,TableCell,IconButton,Collapse,CardContent,Grid,List,ListItem,ListItemText,Button} from '@material-ui/core'
import {ExpandMore,ExpandLess} from '@material-ui/icons'
import {content} from '../../Pages/styles/styles'
import {Link} from 'react-router-dom'
import {formatMoney} from '../../utilities'
// COMPONENT
export const Pago=({pago,user,userType})=>{
    const classes = content()
    const [expanded,setExpanded] = useState(false)
    const [expandedDeuda,setExpandedDeuda] = useState(false)
    const [expandedMetodoDePago,setExpandedMetodoDePago] = useState(false)
    
    return(
        <TableRow>
            <TableCell>{pago.fecha}</TableCell>
            <TableCell>$ {formatMoney(pago.pagado+pago.adeudado)}</TableCell>
            <TableCell>$ {formatMoney(pago.adeudado)}</TableCell>
            <TableCell>$ {formatMoney(pago.pagado)}</TableCell>
            <TableCell>$ {formatMoney(pago.deudaPasada)}</TableCell>
            <TableCell>$ {formatMoney(pago.deudaActualizada)}</TableCell>
        </TableRow>
    )
}