import React, { useState } from 'react'
import {Grid, Button,makeStyles,Select,Input,TextField,Paper,FormControl, Typography,List,ListItem,ListItemText} from '@material-ui/core'
import {Productos} from './Productos'
import {DialogNuevoProducto} from './Dialogs/DialogNuevoProducto'
import {DialogEliminarElemento} from './Dialogs/DialogEliminarElemento'
import {AddOutlined} from '@material-ui/icons'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

export const Step = ({datos,setDatos,tipoDeDato,productosList,total,settotal,fecha,cotizaciones,cotizacion}) =>{
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
            case 'Productos':
                return(
                    <Grid container item xs={12} justify='center' spacing={3}>
                        <Grid container item xs={12} justify='center' >
                            <Grid container spacing={3} >
                                <Grid container item xs={12} justify='center' >
                                    <Paper elevation={3}>
                                        <List>
                                            <ListItem>
                                                <ListItemText primary={cotizacion.valor} secondary={cotizacion.nombre} />
                                            </ListItem>
                                        </List>
                                    </Paper>
                                </Grid>
                                <Grid container item xs={12} justify='center' >
                                    <Button variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                        Agregar Producto
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Productos productos={datos} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                        {datos.length?
                            <Grid container item xs={12} justify='center'>
                                <Grid item justify='center'>
                                    <Paper elevation={3} className={classes.cardTotalPedidoSuccess}>
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
                        {console.log(cotizacion)}
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
                            cotizacion={cotizacion}
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