import React, { useState,useEffect } from 'react'
import {Grid, Button,InputAdornment,Select,Input,Chip,MenuItem,Paper,FormControl, TextField,Tab,Tabs,AppBar,Typography,Box,Switch,FormControlLabel,InputLabel} from '@material-ui/core'
import {AddOutlined,AttachMoney, List} from '@material-ui/icons'
import {Cheques} from '../Recibir-Entrega/Cheques'
import {content} from '../../Pages/styles/styles'

export const Step = ({tipoDeDato,precio,setPrecio,cantidad,setCantidad,efectivo,setEfectivo,cheques,setcheques,addCheque,total,settotal,chequesList}) =>{
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