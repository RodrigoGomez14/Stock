import React, { useState } from 'react'
import {Grid, Button,Switch,InputLabel,Select,Input,MenuItem,Paper,FormControl, TextField,Tab,Tabs,AppBar,Typography,Box,FormControlLabel} from '@material-ui/core'
import {AddOutlined} from '@material-ui/icons'
import {content} from '../../Pages/styles/styles'
import { StepperNuevoProducto } from './StepperNuevoProducto'
import { DialogAgregarProceso } from './Dialogs/DialogAgregarProceso'

export const Step = ({tipoDeDato,nombre,setnombre,precio,setprecio,cantidad,setcantidad,proveedoresList,disableCantidad,cadenaDeProduccion,setcadenaDeProduccion,isSubproducto,setIsSubproducto,subproductos,setSubproductos,subproductosList}) =>{
    const classes = content()
    const [showDialog,setshowDialog]=useState(false)
    const [editIndex,seteditIndex]=useState(0)


    const renderStep = () =>{
        switch (tipoDeDato) {
            case 'Detalles': 
                return(
                    <Grid container item xs={12} direction='column' alignItems='center' spacing={3}>
                        <Grid item>
                            <FormControlLabel 
                                control={
                                    <Switch  
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
                                    <StepperNuevoProducto cadenaDeProduccion={cadenaDeProduccion}/>
                                </Grid>
                            </Grid>
                            :
                            null
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
                    </Grid>
                )
            case 'Subproductos': 
                return(
                    <Grid container item xs={12} sm={10} md={8} justify='center'>     
                        <FormControl fullWidth>
                            <InputLabel id="demo-mutiple-name-label">Subproductos</InputLabel>
                            <Select
                                multiple
                                value={subproductos}
                                onChange={(e)=>{setSubproductos(e.target.value)}}
                                input={<Input />}
                            >
                                {Object.keys(subproductosList).map(subproducto => (
                                    <MenuItem key={subproductosList[subproducto].nombre} value={subproductosList[subproducto].nombre}>
                                        {subproductosList[subproducto].nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                )
            
        }
    }

    return( renderStep() )
}