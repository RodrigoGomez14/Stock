import React, { useState } from 'react'
import {Grid, Button,Switch,InputLabel,Select,Input,MenuItem,Paper,FormControl, TextField,Tab,Tabs,AppBar,Typography,Box,FormControlLabel} from '@material-ui/core'
import {AddOutlined} from '@material-ui/icons'
import {content} from '../../Pages/styles/styles'
import { StepperNuevoProducto } from './StepperNuevoProducto'
import {Subproductos} from './Subproductos'
import {DialogAgregarProceso} from './Dialogs/DialogAgregarProceso'
import {DialogEliminarElemento} from './Dialogs/DialogEliminarElemento'
import {DialogNuevoSubproducto} from './Dialogs/DialogNuevoSubproducto'
import Empty from '../../images/Empty.png'

export const Step = ({tipoDeDato,nombre,setnombre,precio,setprecio,cantidad,setcantidad,proveedoresList,disableCantidad,cadenaDeProduccion,setcadenaDeProduccion,isSubproducto,setIsSubproducto,subproductos,setSubproductos,subproductosList}) =>{
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
            case 'Detalles': 
                return(
                    <Grid container item xs={12} direction='column' alignItems='center' spacing={3}>
                        <Grid item>
                            {console.log(isSubproducto)}
                            <FormControlLabel 
                                control={
                                    <Switch
                                        checked={Boolean(isSubproducto)}
                                        value={isSubproducto}
                                        color='default'
                                        onChange={e=>{
                                            setIsSubproducto(!isSubproducto)
                                        }}
                                    />
                                } 
                                label="Subproducto" />
                        </Grid>
                        <Grid item>
                            <TextField
                                value={nombre}
                                label="Nombre"
                                onChange={e=>{
                                    setnombre(e.target.value)
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                value={precio}
                                onChange={e=>{
                                    setprecio(e.target.value)
                                }}
                                disabled={!nombre}
                                type='number'
                                label="Precio"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                value={cantidad}
                                disabled={disableCantidad}
                                onChange={e=>{
                                    setcantidad(e.target.value)
                                }}
                                type='number'
                                label="Cantidad"
                            />
                        </Grid>
                    </Grid>
                )
            case 'Cadena De Produccion':
                return(
                    <Grid container item xs={12} justify='center' spacing={3}>
                        <Grid item>
                            <Button 
                                color='primary'
                                variant='contained'
                                onClick={()=>{
                                setshowDialog(true)
                            }}>
                                Agregar Proceso
                            </Button>
                        </Grid>
                        {cadenaDeProduccion.length?
                            <Grid container item xs={12} justify='center'>
                                <Grid item xs={12}>
                                    <StepperNuevoProducto cadenaDeProduccion={cadenaDeProduccion} seteditIndex={seteditIndex} setshowDialog={setshowDialog} setshowDialogDelete={setshowDialogDelete} setdeleteIndex={setdeleteIndex}/>
                                </Grid>
                            </Grid>
                            :
                            <Grid container iterm xs={12} justify='center'>
                                <Grid item>
                                    <img src={Empty} alt="" height='300px'/>
                                </Grid>
                                <Grid container item xs={12} justify='center'>
                                    <Typography variant='h4'>No Posee Cadena de Produccion</Typography>
                                </Grid>
                            </Grid>
                        }
                        <DialogAgregarProceso
                            edit={editIndex}
                            setEdit={seteditIndex}
                            open={showDialog}
                            setOpen={setshowDialog}
                            proveedoresList={proveedoresList}
                            cadenaDeProduccion={cadenaDeProduccion}
                            setcadenaDeProduccion={setcadenaDeProduccion}
                        />
                        <DialogEliminarElemento open={showDialogDelete} setopen={setshowDialogDelete} datos={cadenaDeProduccion} setDatos={setcadenaDeProduccion} index={deleteIndex} setdeleteIndex={setdeleteIndex} tipoDeElemento='Proceso'/>
                    </Grid>
                )
            case 'Subproductos': 
                return(
                    <Grid container item xs={12} justify='center' spacing={3}>
                        <Grid container item xs={12} justify='center' >
                            <Button variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                Agregar Subproducto
                            </Button>
                        </Grid>
                        {subproductos.length?
                            <Grid container item xs={12} justify='center' >
                                <Subproductos subproductos={subproductos} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                            </Grid>
                            :
                            <Grid container xs={12} justify='center' spacing={2}>
                                <Grid container item xs={12} justify='center'>
                                    <Typography variant='h5'>No Posee Subproductos</Typography>
                                </Grid>
                                <Grid item>
                                    <img src={Empty} alt="" height='200px'/>
                                </Grid>
                            </Grid>
                        }
                        <DialogNuevoSubproducto open={showDialog} setOpen={setshowDialog} subproductos={subproductos} setSubproductos={setSubproductos} subproductosList={subproductosList} edit={editIndex!=-1} editIndex={editIndex} seteditIndex={seteditIndex}/>
                        <DialogEliminarElemento open={showDialogDelete} setopen={setshowDialogDelete} datos={subproductos} setDatos={setSubproductos} index={deleteIndex} setdeleteIndex={setdeleteIndex} tipoDeElemento='Subproducto'/>
                    </Grid>
                )
            
        }
    }

    return( renderStep() )
}