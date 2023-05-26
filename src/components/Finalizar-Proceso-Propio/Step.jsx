import React, { useState,useEffect } from 'react'
import {Grid, Button,InputAdornment,Select,Input,Chip,MenuItem,Paper,FormControl, TextField,Tab,Tabs,AppBar,Typography,Box,Switch,FormControlLabel,InputLabel} from '@material-ui/core'
import {List} from '@material-ui/icons'
import {content} from '../../Pages/styles/styles'

export const Step = ({cantidad,setCantidad}) =>{
    const classes = content()
    return(
        <Grid container item xs={12} justify='center'>
            <Grid item>
                <Typography variant='h6'>
                    Cantidad Terminada
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
        </Grid>
    )
}