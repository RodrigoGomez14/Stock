import React from 'react'
import {Grid,Paper,List,ListItem,ListItemText,ListItemSecondaryAction,IconButton,makeStyles,TableContainer,Table,TableCell,TableRow,TableHead,TableBody} from '@material-ui/core'
import {EditOutlined,DeleteOutlineOutlined} from '@material-ui/icons'

const useStyles = makeStyles(theme=>({
    root:{
        minWidth:'230px'
    },
    icon:{
        marginLeft:theme.spacing(1),
        marginRight:theme.spacing(1)
    }
}))
export const Cheques = ({cheques,seteditIndex,showDialog,openDialogDelete}) =>{
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
                            <TableCell>Nombre</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell align="right">Banco</TableCell>
                            <TableCell align="right">Numero</TableCell>
                            <TableCell align="right">Vencimiento</TableCell>
                            <TableCell align="right" padding='checkbox'></TableCell>
                            <TableCell align="right" padding='checkbox'></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cheques.map((cheque,i)=>(
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    {cheque.nombre}
                                </TableCell>
                                <TableCell align="right">$ {cheque.valor}</TableCell>
                                <TableCell align="right">{cheque.banco}</TableCell>
                                <TableCell align="right">{cheque.numero}</TableCell>
                                <TableCell align="right">{cheque.vencimiento}</TableCell>
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