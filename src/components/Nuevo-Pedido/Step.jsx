import React, { useState } from 'react'
import {Grid, Button,makeStyles,Select,Input,TextField,Paper,FormControl, Typography,Card,CardContent,CardActions} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import {Productos} from './Productos'
import {DialogNuevoProducto} from './Dialogs/DialogNuevoProducto'
import {DialogEliminarElemento} from './Dialogs/DialogEliminarElemento'
import {AddOutlined} from '@material-ui/icons'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

export const Step = ({datos,setDatos,tipoDeDato,clientesList,productosList,total,settotal}) =>{
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
            case 'Destinatario':
                return(
                    <Grid container item xs={12} justify='center'>
                        <Paper elevation={3}>
                            <Grid item xs={12} justify='center'>
                                <Autocomplete
                                    freeSolo
                                    options={Object.keys(clientesList)}
                                    getOptionLabel={(option) => option}
                                    onSelect={(e)=>{setDatos(e.target.value)}}
                                    onChange={(e)=>{setDatos(e.target.value)}}
                                    style={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Destinatario" variant="outlined" />}
                                />
                            </Grid>
                        </Paper>
                    </Grid>
                )
                break;
            case 'Productos':
                return(
                    <Grid container item xs={12} justify='center' spacing={3}>
                        <Grid container item xs={12} justify='center' >
                            <Button variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                Agregar Producto
                            </Button>
                        </Grid>
                        <Productos productos={datos} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                        <Grid container item xs={12} justify='center'>
                            <Grid item justify='center'>
                                <Paper elevation={3} className={classes.cardTotalPedidoSuccess}>
                                    <Typography variant='h5'>
                                        Total $ {formatMoney(total)}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* DIALOGS */}
                        <DialogNuevoProducto 
                            open={showDialog} 
                            setOpen={setshowDialog} 
                            productos={datos} 
                            setproductos={setDatos} 
                            edit={editIndex!=-1} 
                            editIndex={editIndex} 
                            seteditIndex={seteditIndex} 
                            productosList={productosList}
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
            default:
                break;
        }
    }

    return( renderStep() )
}