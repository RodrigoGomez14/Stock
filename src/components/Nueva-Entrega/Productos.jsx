import React from 'react'
import {Grid,Paper,List,ListItem,ListItemText,ListItemSecondaryAction,IconButton,makeStyles,TableContainer,Table,TableCell,TableRow,TableHead,TableBody} from '@material-ui/core'
import {EditOutlined,DeleteOutlineOutlined} from '@material-ui/icons'
import {formatMoney} from '../../utilities'


const useStyles = makeStyles(theme=>({
    root:{
        minWidth:'230px'
    },
    icon:{
        marginLeft:theme.spacing(1),
        marginRight:theme.spacing(1)
    }
}))
export const Productos = ({productos,seteditIndex,showDialog,openDialogDelete}) =>{
    const classes = useStyles()

    const openDialog = index =>{
        seteditIndex(index)
        showDialog()
    }
    return (
        <Grid item>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Producto</TableCell>
                            <TableCell align="right">Cantidad</TableCell>
                            <TableCell align="right">Precio Unitario</TableCell>
                            <TableCell align="right">Precio Total</TableCell>
                            <TableCell align="right" padding='checkbox'></TableCell>
                            <TableCell align="right" padding='checkbox'></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productos.map((producto,i)=>(
                            <TableRow key={producto.producto}>
                                <TableCell component="th" scope="row">
                                    {producto.producto}
                                </TableCell>
                                <TableCell align="right">{producto.cantidad}</TableCell>
                                <TableCell align="right">$ {formatMoney(producto.precio)}</TableCell>
                                <TableCell align="right">$ {formatMoney(producto.total)}</TableCell>
                                <TableCell align="right">
                                    <IconButton className={classes.icon} edge="end" aria-label="delete" onClick={()=>{openDialog(i)}}>
                                        <EditOutlined />
                                    </IconButton>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton className={classes.icon} edge="end" aria-label="delete" onClick={()=>{openDialogDelete(i)}}>
                                        <DeleteOutlineOutlined color='error'/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}