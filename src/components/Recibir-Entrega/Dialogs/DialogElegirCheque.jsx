import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,DialogActions,TableContainer,Button,Grid,Paper,Table,TableHead,TableRow,TableCell,TableBody,Checkbox,ListItemText, Typography,IconButton} from '@material-ui/core'
import {Add} from '@material-ui/icons'
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardTimePicker,KeyboardDatePicker,} from '@material-ui/pickers';
import {content} from '../../../Pages/styles/styles'

export const DialogElegirCheque = ({open,setOpen,chequesList,addCheque,cheques}) =>{
    const classes = content()
    const [aux ,setAux] = useState([])


    useEffect(()=>{
        setAux(cheques)
    },[cheques])

    // CONTENT
    return(
        <Dialog open={open} maxWidth='md'>
            <DialogTitle>Elegir Cheques</DialogTitle>
            <DialogContent>
                <Grid container xs={12}>
                    {aux.map(cheque=>(
                        <>
                            <Grid item>
                                <Typography>
                                    {cheque}
                                </Typography>
                            </Grid>
                        </>
                    ))}
                </Grid>
                <Grid item>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.titleDetallesCard} padding='checkbox'></TableCell>
                                <TableCell className={classes.titleDetallesCard}>Nombre</TableCell>
                                <TableCell className={classes.titleDetallesCard}>Valor</TableCell>
                                <TableCell className={classes.titleDetallesCard} align="right">Banco</TableCell>
                                <TableCell className={classes.titleDetallesCard} align="right">Numero</TableCell>
                                <TableCell className={classes.titleDetallesCard} align="right">Vencimiento</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(chequesList).map((cheque,i)=>(
                                !chequesList[cheque].dadoDeBaja&&
                                    <TableRow>
                                            <TableCell align='center'>
                                                <IconButton onClick={()=>{addCheque(cheque)}}>
                                                    <Add/>
                                                </IconButton>
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {chequesList[cheque].nombre}
                                            </TableCell>
                                            <TableCell align="right">$ {chequesList[cheque].valor}</TableCell>
                                            <TableCell align="right">{chequesList[cheque].banco}</TableCell>
                                            <TableCell align="right">{chequesList[cheque].numero}</TableCell>
                                            <TableCell align="right">{chequesList[cheque].vencimiento}</TableCell>
                                    </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={()=>{
                        setOpen(false)
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    //disabled={!numero||!banco||!vencimiento||!valor}
                    onClick={()=>{
                        addCheque(aux)
                        setOpen(false)
                    }}
                >
                    Agregar
                </Button>
            </DialogActions>
        </Dialog>
    )
}