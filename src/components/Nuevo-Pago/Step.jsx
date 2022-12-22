import React, { useState } from 'react'
import {Grid, Button,makeStyles,Select,Input,Chip,MenuItem,Paper,InputAdornment, TextField,Tab,Tabs,AppBar,Typography,Box,Switch,FormControlLabel} from '@material-ui/core'
import {AddOutlined,AttachMoney} from '@material-ui/icons'
import {DialogNuevoCheque} from './Dialogs/DialogNuevoCheque'
import {DialogEliminarCheque} from './Dialogs/DialogEliminarCheque'
import {Cheques} from './Cheques'
import {content} from '../../Pages/styles/styles'

export const Step = ({datos,setdatos,total,settotal,tipoDeDato,cliente}) =>{
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
            case 'Efectivo': 
                return(
                    <Grid container>
                        <Grid container item xs={12} justify='center'>
                            <Typography variant='h6'>
                                Ingrese la cantidad
                            </Typography>
                        </Grid>
                        <Grid container item xs={12} justify='center'>
                            <TextField
                                autoFocus   
                                style={{ width: '250px' }}
                                value={datos}
                                variant='outlined'
                                type='number'
                                onChange={e=>{
                                    setdatos(e.target.value)
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
                    <Grid container justify='center' spacing={3}>
                        <Grid container item xs={12} justify='center'>
                            <Button variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                Agregar Cheque
                            </Button>
                        </Grid>
                        {datos.length?
                            <Grid container item xs={12} spacing={1} alignItems='center' justify='center'>
                                <Cheques cheques={datos} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                            </Grid>
                            :
                            null
                        }

                        {/* DIALOGS */}
                        <DialogNuevoCheque 
                            open={showDialog} 
                            setOpen={setshowDialog} 
                            datos={datos} 
                            setdatos={setdatos}
                            edit={editIndex!=-1} 
                            editIndex={editIndex} 
                            seteditIndex={seteditIndex}
                            total={total}
                            settotal={settotal}
                            cliente={cliente}
                        />
                        <DialogEliminarCheque 
                            open={showDialogDelete} 
                            setopen={setshowDialogDelete} 
                            datos={datos} 
                            setDatos={setdatos} 
                            index={deleteIndex} 
                            setdeleteIndex={setdeleteIndex} 
                            tipoDeElemento='Cheque'
                            total={total}
                            settotal={settotal}
                        />
                    </Grid>
                )
        }
    }

    return( renderStep() )
}