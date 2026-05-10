import React, { useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import { Grid, Button,Select,Input,Chip,MenuItem,Paper,InputAdornment, TextField,Tab,Tabs,AppBar,Typography,Box,Switch,FormControlLabel } from '@mui/material'
import { Autocomplete } from '@mui/material'
import {AddOutlined,AttachMoney} from '@mui/icons-material'
import {content} from '../../Pages/styles/styles'

export const Step = ({tipoDeDato,nuevaCuenta,setNuevaCuenta}) =>{

    const renderStep = () =>{
        switch (tipoDeDato) {
            case 'Informacion': 
                return(
                    <Grid container>
                        <Grid container item xs={12} justify='center'>
                            <Typography variant='h6'>
                                Ingresar el nombre de la nueva cuenta Bancaria
                            </Typography>
                        </Grid>
                        <Grid item xs={12} justify='center'>
                            <TextField
                                value={nuevaCuenta}
                                onChange={e=>{
                                    setNuevaCuenta(e.target.value)
                                }}
                                label='Nombre'
                            />
                            </Grid>
                    </Grid>
                )
        }
    }

    return( renderStep() )
}
