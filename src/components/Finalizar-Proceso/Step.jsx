import React, { useState,useEffect } from 'react'
import {Grid, Button,InputAdornment,Select,Input,Chip,MenuItem,Paper,FormControl, TextField,Tab,Tabs,AppBar,Typography,Box,Switch,FormControlLabel,InputLabel} from '@material-ui/core'
import {AddOutlined,AttachMoney, List} from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import {Cheques} from '../Recibir-Entrega/Cheques'
import {content} from '../../Pages/styles/styles'

export const Step = ({tipoDeDato,precio,setPrecio,cantidad,setCantidad,efectivo,setEfectivo,cheques,setcheques,addCheque,total,settotal,chequesList,cuentaTransferencia,setCuentaTransferencia,totalTransferencia,setTotalTransferencia,cuentasBancarias}) =>{
    const classes = content()
    // RENDER
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
                            Ingrese la cantidad
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
                        <Cheques cheques={cheques} chequesList={chequesList} addCheque={addCheque}/>
                    </Grid>
                </Grid>
                )
    }
    
}