import React, { useState } from 'react'
import {Grid, Button,TextField,Select,Input,Chip,MenuItem,Paper,FormControl, Typography,Card,CardContent,CardActions} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import {AddOutlined} from '@material-ui/icons'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

export const Step = ({tipoDeDato,titulo,setTitulo,total,settotal,totalIva,settotalIva}) =>{
    const classes = content()
    const [showDialog,setshowDialog]=useState(false)
    const [editIndex,seteditIndex]=useState(-1)
    const [showDialogDelete,setshowDialogDelete]=useState(false)
    const [deleteIndex,setdeleteIndex]=useState(undefined)

    const openDialogDelete = (index) =>{
        setdeleteIndex(index)
        setshowDialogDelete(true)
    }
    const renderStep = () =>{
        switch (tipoDeDato) {
            case 'Factura':
                return(
                    <Paper>
                        <Grid container item xs={12} spacing={3}>
                            <Grid container item xs={12} justify='center'>
                                <Grid item>
                                    <TextField
                                        fullWidth
                                        label='Titulo'
                                        value={titulo}
                                        onChange={e=>{
                                            setTitulo(e.target.value)
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container item xs={12} justify='center'>
                                <Grid item>
                                    <TextField
                                        fullWidth
                                        label='Total IVA'
                                        type='number'
                                        value={totalIva}
                                        onChange={e=>{
                                            settotalIva(e.target.value)
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container item xs={12} justify='center'>
                                <Grid item>
                                    <TextField
                                        fullWidth
                                        label='Total'
                                        type='number'
                                        value={total}
                                        onChange={e=>{
                                            settotal(e.target.value)
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                )
                break;
            default:
                break;
        }
    }

    return( renderStep() )
}