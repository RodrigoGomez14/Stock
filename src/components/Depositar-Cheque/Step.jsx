import React, { useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import { Grid, Button,Select,Input,Chip,MenuItem,Paper,InputAdornment, TextField,Tab,Tabs,AppBar,Typography,Box,Switch,FormControlLabel } from '@mui/material'
import { Autocomplete } from '@mui/material'
import {AddOutlined,AttachMoney} from '@mui/icons-material'
import {content} from '../../Pages/styles/styles'

export const Step = ({tipoDeDato,destinatario,cuentasList,setDestinatario}) =>{
    const classes = content()

    const renderStep = () =>{
        switch (tipoDeDato) {
            case 'Cuenta de Destino': 
                return(
                    <Grid container>
                        {console.log((cuentasList))}
                        <Grid container item xs={12} justify='center'>
                            <Typography variant='h6'>
                                Seleccionar Cuenta Bancaria de Destino
                            </Typography>
                        </Grid>
                        <Grid item xs={12} justify='center'>
                                <Autocomplete
                                    freeSolo
                                    disabled={!cuentasList}
                                    options={cuentasList?Object.keys(cuentasList):{}}
                                    getOptionLabel={(option) => option}
                                    onSelect={(e)=>{setDestinatario(e.target.value)}}
                                    onChange={(e)=>{setDestinatario(e.target.value)}}
                                    style={{ width: 300 }}
                                    value={destinatario}
                                    renderInput={(params) => <TextField {...params} label="Destinatario" variant="outlined" />}
                                />
                            </Grid>
                    </Grid>
                )
        }
    }

    return( renderStep() )
}
