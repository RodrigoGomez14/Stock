import React, { useState } from 'react'
import {Grid, Button,TextField,Select,Input,Chip,MenuItem,Paper,FormControl, Typography,Card,CardContent,CardActions} from '@material-ui/core'
import {Productos} from './Productos'
import { Autocomplete } from '@material-ui/lab'
import {DialogNuevoProducto} from './Dialogs/DialogNuevoProducto'
import {DialogEliminarElemento} from './Dialogs/DialogEliminarElemento'
import {AddOutlined} from '@material-ui/icons'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardTimePicker,KeyboardDatePicker} from '@material-ui/pickers';

export const Step = ({datos,setDatos,tipoDeDato,proveedoresList,productosList,total,settotal}) =>{
    const classes = content()
    const [showDialog,setshowDialog]=useState(false)
    const [editIndex,seteditIndex]=useState(-1)
    const [showDialogDelete,setshowDialogDelete]=useState(false)
    const [deleteIndex,setdeleteIndex]=useState(undefined)

    const openDialogDelete = (index) =>{
        setdeleteIndex(index)
        setshowDialogDelete(true)
    }
    const getProductos = () =>{
        let aux = []
        Object.values(productosList).map(producto=>{
            aux.push(producto)
            if(!producto.cadenaDeProduccion){
            }
        })
        return aux
    }
    const renderStep = () =>{
        switch (tipoDeDato) {
            case 'Destinatario':
                return(
                    <Grid container item xs={12} justify='center'>
                        <Paper elevation={3} >
                            <Grid item xs={12} justify='center'>
                                <Autocomplete
                                        freeSolo
                                        options={proveedoresList?Object.keys(proveedoresList):{}}
                                        disabled={!proveedoresList}
                                        getOptionLabel={(option) => option}
                                        onSelect={(e)=>{setDatos(e.target.value)}}
                                        onChange={(e)=>{setDatos(e.target.value)}}
                                        value={datos}
                                        style={{ width: 300 }}
                                        renderInput={(params) => <TextField {...params} label="Proveedor" variant="outlined" />}
                                    />
                            </Grid>
                        </Paper>
                    </Grid>
                )
                break;
            case 'Productos':
                return(
                    <Grid container item xs={12} justify='center' spacing={3}>
                        <Grid container item xs={12} justify="center">
                                <Button variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                    Agregar Producto
                                </Button>
                        </Grid>
                        <Productos productos={datos} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                        {datos.length?
                            <Grid container justify='center'>
                                <Grid item justify='center'>
                                    <Paper elevation={3} className={classes.cardTotalPedidoDanger}>
                                        <Typography variant='h5'>
                                            Total $ {formatMoney(total)}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                            :
                            null
                        }

                        {/* DIALOGS */}
                        <DialogNuevoProducto 
                                open={showDialog} 
                                setOpen={setshowDialog} 
                                productos={datos} 
                                setproductos={setDatos} 
                                edit={editIndex!=-1} 
                                editIndex={editIndex} 
                                seteditIndex={seteditIndex} 
                                productosList={getProductos()}
                                total={total}
                                settotal={settotal}
                            />
                            <DialogEliminarElemento 
                                open={showDialogDelete} 
                                setopen={setshowDialogDelete} 
                                datos={datos} 
                                setDatos={setDatos} 
                                index={deleteIndex} 
                                setdeleteIndex={setdeleteIndex} 
                                tipoDeElemento='Producto'
                                total={total}
                                settotal={settotal}
                            />
                    </Grid>
                )
                break;
            case 'Fecha':
                return(
                    <Grid container item xs={12} justify='center' spacing={3}>
                        <Grid container item xs={12} justify='center'>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} noValidate>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="dd/MM/yyyy"
                                    fullWidth
                                    label="Fecha del pedido"
                                    value={datos}
                                    onChange={i=>{
                                        setDatos(i)
                                    }}
                                />
                            </MuiPickersUtilsProvider   >

                        </Grid>
                    </Grid>
                )
                break;
            default:
                break;
        }
    }

    return( renderStep() )
}