import React, { useState,useEffect } from 'react'
import {Grid, Button,InputAdornment,Select,Input,Chip,MenuItem,Paper,FormControl, TextField,Tab,Tabs,AppBar,Typography,Box,Switch,FormControlLabel,InputLabel} from '@material-ui/core'
import {AddOutlined,AttachMoney, List} from '@material-ui/icons'
import {DialogEliminarCheque} from './Dialogs/DialogEliminarCheque'
import {ChequesPersonales} from './ChequesPersonales'
import {DialogNuevoChequePersonal} from './Dialogs/DialogNuevoChequePersonal'
import { Autocomplete } from '@material-ui/lab'
import {Cheques} from '../Recibir-Entrega/Cheques'
import {content} from '../../Pages/styles/styles'

export const Step = ({tipoDeDato,precio,setPrecio,cantidad,setCantidad,efectivo,setEfectivo,cheques,cliente,addCheque,total,settotal,chequesList,cuentaTransferencia,setCuentaTransferencia,totalTransferencia,setTotalTransferencia,cuentasBancarias,chequesPersonales,setChequesPersonales,totalChequesPersonales,setTotalChequesPersonales}) =>{
    const classes = content()
    const [showDialog,setshowDialog]=useState(false)
    const [editIndex,seteditIndex]=useState(-1)
    const [showDialogDelete,setshowDialogDelete]=useState(false)
    const [deleteIndex,setdeleteIndex]=useState(undefined)
    // RENDER

    const openDialogDelete = (index) =>{
        setdeleteIndex(index)
        setshowDialogDelete(true)
    }

    switch (tipoDeDato) {
        case 'Detalles': 
            return(
                <Grid container item xs={12} justify='center'>
                    <Grid item>
                        <Typography variant='h6'>
                            Cantidad Recibida
                        </Typography>
                    </Grid>
                    <Grid container item xs={12} justify='center'>
                        <TextField
                            autoFocus
                            style={{ width: '250px' }}
                            value={cantidad}
                            variant='outlined'
                            type='number'
                            onChange={e=>{
                                setCantidad(e.target.value)
                            }}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <List/>
                                </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Typography variant='h6'>
                            Precio Final
                        </Typography>
                    </Grid>
                    <Grid container item xs={12} justify='center'>
                        <TextField
                            style={{ width: '250px' }}
                            value={precio}
                            variant='outlined'
                            type='number'
                            onChange={e=>{
                                setPrecio(e.target.value)
                            }}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <AttachMoney />
                                </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
            )
            case 'Transferencia': 
                return(
                    <Grid container item xs={12} spacing={1} alignItems='center' justify='center'>
                        <Grid container item xs={12} justify='center'>
                            <Autocomplete
                                freeSolo
                                options={cuentasBancarias?Object.keys(cuentasBancarias):{}}
                                disabled={!cuentasBancarias}
                                getOptionLabel={(option) => option}
                                onSelect={(e)=>{setCuentaTransferencia(e.target.value)}}
                                onChange={(e)=>{setCuentaTransferencia(e.target.value)}}
                                value={cuentaTransferencia}
                                style={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Cuenta Bancaria" variant="outlined" />}
                            />
                        </Grid>
                        <Grid container item xs={12} justify='center'>
                            <TextField
                                autoFocus   
                                style={{ width: '250px' }}
                                value={totalTransferencia}
                                variant='outlined'
                                type='number'
                                label="Monto"
                                onChange={e=>{
                                    setTotalTransferencia(e.target.value)
                                }}
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachMoney />
                                    </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                )
            case 'Metodo De Pago': 
                return(
                <Grid container item xs={12} justify='center' spacing={3}>
                    <Grid item>
                        <Typography variant='h6'>
                            Efectivo
                        </Typography>
                    </Grid>
                    <Grid container item xs={12} justify='center'>
                        <TextField
                            autoFocus
                            style={{ width: '250px' }}
                            value={efectivo}
                            variant='outlined'
                            type='number'
                            onChange={e=>{
                                setEfectivo(e.target.value)
                            }}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <AttachMoney />
                                </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid container item xs={12} spacing={1} alignItems='center' justify='center'>
                        <Grid item>
                            <Typography variant='h6'>
                                Efectivo
                            </Typography>
                        </Grid>
                        <Cheques cheques={cheques} chequesList={chequesList} addCheque={addCheque}/>
                    </Grid>
                </Grid>
                )
                case 'Cheques Personales':
                    return(
                        <Grid container xs={12} spacing={3}>
                            <Grid container item xs={12} justify='center'>
                                <Button variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                    Agregar Cheque Personal
                                </Button>
                            </Grid>
                            {
                            chequesPersonales.length?
                                <Grid container item xs={12} spacing={1} alignItems='center' justify='center'>
                                    <ChequesPersonales cheques={chequesPersonales} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                                </Grid>
                                :
                                null
                            }
                            {/* DIALOGS */}
                            <DialogNuevoChequePersonal 
                                open={showDialog} 
                                setOpen={setshowDialog} 
                                listaChequesPersonales={chequesPersonales} 
                                setListaChequesPersonales={setChequesPersonales}
                                edit={editIndex!=-1} 
                                editIndex={editIndex} 
                                seteditIndex={seteditIndex}
                                totalChequesPersonales={totalChequesPersonales}
                                setTotalChequesPersonales={setTotalChequesPersonales}
                                cliente={cliente}
                            />
                            <DialogEliminarCheque
                                open={showDialogDelete} 
                                setopen={setshowDialogDelete} 
                                datos={chequesPersonales} 
                                setDatos={setChequesPersonales} 
                                index={deleteIndex} 
                                setdeleteIndex={setdeleteIndex} 
                                tipoDeElemento='Cheque'
                                total={totalChequesPersonales}
                                settotal={setTotalChequesPersonales}
                            />
                        </Grid>
                    )
    }
    
}