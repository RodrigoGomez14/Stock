import React, { useState } from 'react'
import {Grid, Button,makeStyles,Select,Input,Chip,MenuItem,Paper,FormControl} from '@material-ui/core'
import {Telefonos} from './Telefonos'
import {Direccion} from './Direccion'
import {InfoExtra} from './InfoExtra'
import { Mails } from './Mails'
import {AddOutlined} from '@material-ui/icons'
import { DialogNuevaDireccion } from './Dialogs/DialogNuevaDireccion'
import { DialogNuevoTelefono } from './Dialogs/DialogNuevoTelefono'
import { DialogNuevaInfoExtra } from './Dialogs/DialogNuevaInfoExtra'
import { DialogNuevoMail } from './Dialogs/DialogNuevoMail'
import { DialogEliminarElemento } from './Dialogs/DialogEliminarElemento'
const useStyles = makeStyles(theme=>({
    textAlignCenter:{
        textAlign:'center'
    },
    button:{
        marginTop:theme.spacing(1),
        marginBottom:theme.spacing(1),
    },
    containerDirecciones:{
        maxWidth:'calc(100vw - 60px)',
        flexWrap:'nowrap',
        overflowX:'scroll',
        marginBottom:theme.spacing(2)
    },
    container:{
        marginBottom:theme.spacing(1)
    },
    paper:{
        padding:theme.spacing(1),
        margin:theme.spacing(1),
    },
    chip: {
        margin: 2,
    },
    select:{
        '& .MuiSelect-selectMenu':{
            whiteSpace:'pre-wrap'
        }
    }
}))

export const Step = ({datos,setDatos,tipoDeDato,Expresos}) =>{
    const classes = useStyles()
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
            case 'Direcciones':
                return(
                    <Paper elevation={3} className={classes.paper} >
                        <DialogNuevaDireccion open={showDialog} setOpen={setshowDialog} direcciones={datos} setdirecciones={setDatos} edit={editIndex!=-1} editIndex={editIndex} seteditIndex={seteditIndex}/>
                        <DialogEliminarElemento open={showDialogDelete} setopen={setshowDialogDelete} datos={datos} setDatos={setDatos} index={deleteIndex} setdeleteIndex={setdeleteIndex} tipoDeElemento='Direccion'/>
                        <Grid container className={classes.container} justify='center'>
                            <Button className={classes.button} variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                Agregar Direccion
                            </Button>
                        </Grid>
                        {datos.length?
                            <Grid container item xs={12} spacing={1} alignItems='center' justify='center' className={classes.containerDirecciones}>
                                <Direccion direcciones={datos} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                            </Grid>
                            :
                            null
                        }
                    </Paper>
                )
                break;
            case 'Telefonos':
                return(
                    <Paper elevation={3} className={classes.paper} >
                        <DialogNuevoTelefono open={showDialog} setOpen={setshowDialog} telefonos={datos} settelefonos={setDatos} edit={editIndex!=-1} editIndex={editIndex} seteditIndex={seteditIndex}/>
                        <DialogEliminarElemento open={showDialogDelete} setopen={setshowDialogDelete} datos={datos} setDatos={setDatos} index={deleteIndex} setdeleteIndex={setdeleteIndex} tipoDeElemento='Telefono'/>
                        <Grid container className={classes.container} justify='center'>
                            <Button className={classes.button} variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                Agregar Telefono
                            </Button>
                        </Grid>
                        {datos.length?
                            <Grid container item xs={12} spacing={1} alignItems='center' justify='center' className={classes.containerDirecciones}>
                                <Telefonos telefonos={datos} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                            </Grid>
                            :
                            null
                        }
                    </Paper>
                )
                break;
            case 'Info Extra':
                return(
                    <Paper elevation={3} className={classes.paper} >
                        <DialogNuevaInfoExtra open={showDialog} setOpen={setshowDialog} infoExtra={datos} setinfoExtra={setDatos} edit={editIndex!=-1} editIndex={editIndex} seteditIndex={seteditIndex}/>
                        <DialogEliminarElemento open={showDialogDelete} setopen={setshowDialogDelete} datos={datos} setDatos={setDatos} index={deleteIndex} setdeleteIndex={setdeleteIndex} tipoDeElemento='Info Extra'/>
                        <Grid container className={classes.container} justify='center'>
                            <Button className={classes.button} variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                Agregar Informacion Extra
                            </Button>
                        </Grid>
                        {datos.length?
                            <Grid container item xs={12} spacing={1} alignItems='center' justify='center' className={classes.containerDirecciones}>
                                <InfoExtra infoExtra={datos} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                            </Grid>
                            :
                            null
                        }
                    </Paper>
                )
            break;
            case 'Mails':
                return(
                    <Paper elevation={3} className={classes.paper} >
                        <DialogNuevoMail open={showDialog} setOpen={setshowDialog} mails={datos} setmails={setDatos} edit={editIndex!=-1} editIndex={editIndex} seteditIndex={seteditIndex}/>
                        <DialogEliminarElemento open={showDialogDelete} setopen={setshowDialogDelete} datos={datos} setDatos={setDatos} index={deleteIndex} setdeleteIndex={setdeleteIndex} tipoDeElemento='Mail'/>
                        <Grid container className={classes.container} justify='center'>
                            <Button className={classes.button} variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                Agregar Mail
                            </Button>
                        </Grid>
                        {datos.length?
                            <Grid container item xs={12} spacing={1} alignItems='center' justify='center' className={classes.containerDirecciones}>
                                <Mails mails={datos} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                            </Grid>
                            :
                            null
                        }
                    </Paper>
                )
            break;
            case 'Expresos':
                return(
                    <Paper elevation={3} className={classes.paper} >
                        <Grid container justify='center' className={classes.containerDirecciones}>
                            <Grid item xs={10} justify='center'>
                                <FormControl fullWidth>
                                    <Select
                                        multiple
                                        value={datos}
                                        onChange={e=>{setDatos(e.target.value)}}
                                        input={<Input className={classes.select}label='Lista de Expresos' id="select-multiple-chip" />}
                                        renderValue={() => (
                                              datos.map((value) => (
                                                <Chip key={value} label={value} className={classes.chip} />
                                              ))
                                          )}
                                        >
                                        {Object.keys(Expresos).map(expreso => (
                                            <MenuItem key={Expresos[expreso].datos.nombre} value={Expresos[expreso].datos.nombre}>
                                                {Expresos[expreso].datos.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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