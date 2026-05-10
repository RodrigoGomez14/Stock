import React, { useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import { Grid, Button,Select,Input,Typography,MenuItem,InputLabel,FormControl } from '@mui/material'
import { Autocomplete } from '@mui/material'
import {Telefonos} from '../Nuevo-Cliente/Telefonos'
import {Direccion} from '../Nuevo-Cliente/Direccion'
import {InfoExtra} from '../Nuevo-Cliente/InfoExtra'
import { Mails } from '../Nuevo-Cliente/Mails'
import {AddOutlined} from '@mui/icons-material'
import { DialogNuevaDireccion } from '../Nuevo-Cliente/Dialogs/DialogNuevaDireccion'
import { DialogNuevoTelefono } from '../Nuevo-Cliente/Dialogs/DialogNuevoTelefono'
import { DialogNuevaInfoExtra } from '../Nuevo-Cliente/Dialogs/DialogNuevaInfoExtra'
import { DialogNuevoMail } from '../Nuevo-Cliente/Dialogs/DialogNuevoMail'
import { DialogEliminarElemento } from '../Nuevo-Cliente/Dialogs/DialogEliminarElemento'
import Empty from '../../images/Empty.png'

export const Step = ({datos,setDatos,tipoDeDato,Expresos}) =>{
    const [showDialog,setshowDialog]=useState(false)
    const [editIndex,seteditIndex]=useState(-1)
    const [showDialogDelete,setshowDialogDelete]=useState(false)
    const [deleteIndex,setdeleteIndex]=useState(undefined)

    const openDialogDelete = (index) =>{
        setdeleteIndex(index)
        setshowDialogDelete(true)
    }
    const handleChange = e =>{
        console.log(e.target.value)
        setDatos(e.target.value)
    }
    
    const renderStep = () =>{
        switch (tipoDeDato) {
            case 'Direcciones':
                return(
                    <Grid container item xs={12} justify='center' spacing={3}>
                        <Grid container item xs={12} justify='center'>
                            <Button variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                Agregar Direccion
                            </Button>
                        </Grid>
                        {datos.length?
                            <Grid container item xs={12} justify='center' >
                                <Direccion direcciones={datos} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                            </Grid>
                            :
                            <Grid container xs={12} justify='center' spacing={2}>
                                <Grid container item xs={12} justify='center'>
                                    <Typography variant='h5'>No Hay Direcciones Guardadas</Typography>
                                </Grid>
                                <Grid item>
                                    <img src={Empty} alt="" height='200px'/>
                                </Grid>
                            </Grid>
                        }

                        {/* DIALOGS */}
                        <DialogNuevaDireccion open={showDialog} setOpen={setshowDialog} direcciones={datos} setdirecciones={setDatos} edit={editIndex!=-1} editIndex={editIndex} seteditIndex={seteditIndex}/>
                        <DialogEliminarElemento open={showDialogDelete} setopen={setshowDialogDelete} datos={datos} setDatos={setDatos} index={deleteIndex} setdeleteIndex={setdeleteIndex} tipoDeElemento='Direccion'/>
                    </Grid>
                )
                break;
            case 'Telefonos':
                return(
                    <Grid container item xs={12} justify='center' spacing={3}>
                        <Grid container item xs={12} justify='center' >
                            <Button variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                Agregar Telefono
                            </Button>
                        </Grid>
                        {datos.length?
                            <Grid container item xs={12} justify='center' >
                                <Telefonos telefonos={datos} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                            </Grid>
                            :
                            <Grid container xs={12} justify='center' spacing={2}>
                                <Grid container item xs={12} justify='center'>
                                    <Typography variant='h5'>No Hay Telefonos Guardadas</Typography>
                                </Grid>
                                <Grid item>
                                    <img src={Empty} alt="" height='200px'/>
                                </Grid>
                            </Grid>
                        }
                        <DialogNuevoTelefono open={showDialog} setOpen={setshowDialog} telefonos={datos} settelefonos={setDatos} edit={editIndex!=-1} editIndex={editIndex} seteditIndex={seteditIndex}/>
                        <DialogEliminarElemento open={showDialogDelete} setopen={setshowDialogDelete} datos={datos} setDatos={setDatos} index={deleteIndex} setdeleteIndex={setdeleteIndex} tipoDeElemento='Telefono'/>
                    </Grid>
                )
                break;
            case 'Info Extra':
                return(
                    <Grid container item xs={12} justify='center' spacing={3}>
                        <Grid container item xs={12} justify='center' >
                            <Button variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                Agregar Informacion Extra
                            </Button>
                        </Grid>
                        {datos.length?
                            <Grid container item xs={12} justify='center' >
                                <InfoExtra infoExtra={datos} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                            </Grid>
                            :
                            <Grid container xs={12} justify='center' spacing={2}>
                                <Grid container item xs={12} justify='center'>
                                    <Typography variant='h5'>No Hay Informacion Extra Guardadas</Typography>
                                </Grid>
                                <Grid item>
                                    <img src={Empty} alt="" height='200px'/>
                                </Grid>
                            </Grid>
                        }
                        <DialogNuevaInfoExtra open={showDialog} setOpen={setshowDialog} infoExtra={datos} setinfoExtra={setDatos} edit={editIndex!=-1} editIndex={editIndex} seteditIndex={seteditIndex}/>
                        <DialogEliminarElemento open={showDialogDelete} setopen={setshowDialogDelete} datos={datos} setDatos={setDatos} index={deleteIndex} setdeleteIndex={setdeleteIndex} tipoDeElemento='Info Extra'/>
                    </Grid>
                )
            break;
            case 'Mails':
                return(
                    <Grid container item xs={12} justify='center' spacing={3}>
                        <Grid container item xs={12} justify='center' >
                            <Button variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                Agregar Mail
                            </Button>
                        </Grid>
                        {datos.length?
                            <Grid container item xs={12} justify='center' >
                                <Mails mails={datos} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                            </Grid>
                            :
                            <Grid container xs={12} justify='center' spacing={2}>
                                <Grid container item xs={12} justify='center'>
                                    <Typography variant='h5'>No Hay E-Mails Guardadas</Typography>
                                </Grid>
                                <Grid item>
                                    <img src={Empty} alt="" height='200px'/>
                                </Grid>
                            </Grid>
                        }
                        <DialogNuevoMail open={showDialog} setOpen={setshowDialog} mails={datos} setmails={setDatos} edit={editIndex!=-1} editIndex={editIndex} seteditIndex={seteditIndex}/>
                        <DialogEliminarElemento open={showDialogDelete} setopen={setshowDialogDelete} datos={datos} setDatos={setDatos} index={deleteIndex} setdeleteIndex={setdeleteIndex} tipoDeElemento='Mail'/>
                    </Grid>
                )
            break;
            case 'Expresos':
                return(
                    <Grid container item xs={12} sm={10} md={8} justify='center'>     
                        <FormControl fullWidth>
                        <InputLabel id="demo-mutiple-name-label">Expresos</InputLabel>
                            <Select
                            multiple
                            value={datos}
                            onChange={handleChange}
                            input={<Input />}
                            >
                            {Expresos?
                                Object.keys(Expresos).map(expreso => (
                                    <MenuItem key={Expresos[expreso].datos.nombre} value={Expresos[expreso].datos.nombre}>
                                        {Expresos[expreso].datos.nombre}
                                    </MenuItem>
                                ))
                                :
                                null
                            }
                            </Select>
                            {console.log(datos)}
                        </FormControl>
                    </Grid>
                )
            break;
            default:
                break;
        }
    }

    return( renderStep() )
}
