import React from 'react'
import { makeStyles } from 'tss-react/mui'
import { Grid,Paper,TextField } from '@mui/material'
import {DialogNuevaDireccion} from '../Nuevo-Cliente/Dialogs/DialogNuevaDireccion'
import {AddOutlined} from '@mui/icons-material'
import {content} from '../../Pages/styles/styles'

export const FormDetalles = ({nombre,setnombre,dni,setdni,cuit,setcuit})=>{
    const classes = content()
    return(
        <Grid container item xs={12} justify='center'>
            <Grid item direction='column' spacing={3}>
                <Grid item>
                    <TextField
                        autoFocus
                        label='Nombre'
                        value={nombre}
                        onChange={e=>{
                            setnombre(e.target.value)
                        }}
                        />
                </Grid>
                <Grid item>
                    <TextField
                        value={dni}
                        onChange={e=>{
                            setdni(e.target.value)
                        }}
                        label='DNI'
                    />
                </Grid>
                <Grid item>
                    <TextField
                        value={cuit}
                        onChange={e=>{
                            setcuit(e.target.value)
                        }}
                        label='CUIT'
                    />
                </Grid>
            </Grid>

        </Grid>
    )
}
