import React, { useState,useEffect } from 'react'
import {Grid, Button,InputAdornment,Select,Input,Chip,MenuItem,Paper,FormControl, TextField,Tab,Tabs,AppBar,Typography,Box,Switch,FormControlLabel,InputLabel} from '@material-ui/core'
import {AddOutlined,AttachMoney} from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import {Cheques} from './Cheques'
import {content} from '../../Pages/styles/styles'
import { DialogElegirCheque } from './Dialogs/DialogElegirCheque'

export const Step = ({efectivo,setefectivo,cheques,setcheques,addCheque,expreso,setexpreso,remito,setremito,tipoDeDato,expresosList,total,settotal,precio,setprecio,setsumarEnvio,sumarEnvio,nombre,chequesList,tipo,cuentaTransferencia,setCuentaTransferencia,totalTransferencia,setTotalTransferencia,cuentasBancarias}) =>{
    const classes = content()
    const [showDialog,setshowDialog]=useState(false)
    const [editIndex,seteditIndex]=useState(-1)
    const [showDialogDelete,setshowDialogDelete]=useState(false)
    const [deleteIndex,setdeleteIndex]=useState(undefined)
    const [value,setValue]=useState(0)
    const [check,setcheck]=useState(false)

    const resetTextFields =() =>{
        setexpreso('')
        setremito('')
        setprecio('')
        setsumarEnvio(false)
    }

    useEffect(()=>{
        console.log(cheques)
    },[cheques])
    // RENDER
    switch (tipoDeDato) {
        case 'Efectivo': 
            return(
                <Grid container item xs={12} justify='center'>
                    <Grid container item xs={12} justify='center'>
                        <TextField
                            autoFocus   
                            style={{ width: '250px' }}
                            value={efectivo}
                            label="Monto"
                            variant='outlined'
                            type='number'
                            onChange={e=>{
                                setefectivo(e.target.value)
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
                                renderInput={(params) => <TextField {...params} label="Cuenta de Destino" variant="outlined" />}
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
            case 'Cheques': 
                return(
                    <Grid container item xs={12} spacing={1} alignItems='center' justify='center'>
                        <Cheques cheques={cheques} chequesList={chequesList} addCheque={addCheque}/>
                    </Grid>
                )
    }
    
}