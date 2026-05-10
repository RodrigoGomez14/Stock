import React from 'react'
import { Grid,Paper,TableContainer,Table,TableCell,TableRow,TableHead,TableBody,IconButton } from '@mui/material'
import {EditOutlined,DeleteOutlineOutlined} from '@mui/icons-material'
import {content} from '../../Pages/styles/styles'

export const ChequesPersonalesList = ({cheques,seteditIndex,showDialog,openDialogDelete}) =>{
    const classes = content()

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
                            <TableCell className={classes.titleDetallesCard}>Valor</TableCell>
                            <TableCell className={classes.titleDetallesCard} align="right">Numero</TableCell>
                            <TableCell className={classes.titleDetallesCard} align="right">Vencimiento</TableCell>
                            <TableCell className={classes.titleDetallesCard} align="right" padding='checkbox'></TableCell>
                            <TableCell className={classes.titleDetallesCard} align="right" padding='checkbox'></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cheques.map((cheque,i)=>(
                            <TableRow key={i}>
                                <TableCell align="right">$ {cheque.valor}</TableCell>
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
