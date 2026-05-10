import React from 'react'
import { Grid,Paper,Checkbox,TableContainer,Table,TableCell,TableRow,TableHead,TableBody } from '@mui/material'
import {content} from '../../Pages/styles/styles'
import { formatMoney } from '../../utilities'

export const ChequesSelection = ({chequesList,cheques,addCheque}) =>{
    const classes = content()
    return (
        <Grid container item xs={12}>
            <TableContainer component={Paper} style={{maxHeight:'300px'}}>
                    <Table style={{width:'100%'}} aria-label="simple table" size='small' stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.titleDetallesCard} padding='checkbox'></TableCell>
                                <TableCell className={classes.titleDetallesCard} align='left'>Nombre</TableCell>
                                <TableCell className={classes.titleDetallesCard} align='right'>Valor</TableCell>
                                <TableCell className={classes.titleDetallesCard} align="right">Banco</TableCell>
                                <TableCell className={classes.titleDetallesCard} align="right">Numero</TableCell>
                                <TableCell className={classes.titleDetallesCard} align="right">Vencimiento</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {chequesList?
                            Object.keys(chequesList).reverse().map((cheque,i)=>(
                                !chequesList[cheque].dadoDeBaja && !chequesList[cheque].destinatario?
                                    <TableRow key={i} onClick={()=>{addCheque(cheque)}} style={{cursor:'pointer'}}>
                                            <TableCell>
                                                <Checkbox
                                                    color='primary'
                                                    checked={cheques.indexOf(cheque) !== -1}
                                                />
                                            </TableCell>
                                            <TableCell align='left'>{chequesList[cheque].nombre}</TableCell>
                                            <TableCell align="right">$ {formatMoney(chequesList[cheque].valor)}</TableCell>
                                            <TableCell align="right">{chequesList[cheque].banco}</TableCell>
                                            <TableCell align="right">{chequesList[cheque].numero}</TableCell>
                                            <TableCell align="right">{chequesList[cheque].vencimiento}</TableCell>
                                    </TableRow>
                                    :
                                    null
                            ))
                            :
                            null
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
        </Grid>
    )
}
