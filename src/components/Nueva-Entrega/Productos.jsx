import React from 'react'
import {Grid,Paper,Typography,ListItem,ListItemText,ListItemSecondaryAction,IconButton,makeStyles,TableContainer,Table,TableCell,TableRow,TableHead,TableBody} from '@material-ui/core'
import {EditOutlined,DeleteOutlineOutlined} from '@material-ui/icons'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'
import Empty from '../../images/Empty.png'
export const Productos = ({productos,seteditIndex,showDialog,openDialogDelete}) =>{
    const classes = content()

    const openDialog = index =>{
        seteditIndex(index)
        showDialog()
    }
    return (
        productos.length?
            <Grid container item xs={12} md={8} alignItems='center' justify='center'>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.titleDetallesCard} align="right">Producto</TableCell>
                                <TableCell className={classes.titleDetallesCard} align="right">Cantidad</TableCell>
                                <TableCell className={classes.titleDetallesCard} align="right">Precio Unitario</TableCell>
                                <TableCell className={classes.titleDetallesCard} align="right">Precio Total</TableCell>
                                <TableCell className={classes.titleDetallesCard} align="right" padding='checkbox'></TableCell>
                                <TableCell className={classes.titleDetallesCard} align="right" padding='checkbox'></TableCell>
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
        :
        <Grid container xs={12} justify='center' spacing={2}>
            <Grid container item xs={12} justify='center'>
                <Typography variant='h5'>No Hay Productos Seleccionados</Typography>
            </Grid>
            <Grid item>
                <img src={Empty} alt="" height='300px'/>
            </Grid>
        </Grid>
    )
}