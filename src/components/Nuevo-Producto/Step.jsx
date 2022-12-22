import React, { useState } from 'react'
import {Grid, Button,makeStyles,Select,Input,Chip,MenuItem,Paper,FormControl, TextField,Tab,Tabs,AppBar,Typography,Box,Switch,FormControlLabel} from '@material-ui/core'
import {AddOutlined} from '@material-ui/icons'
import {content} from '../../Pages/styles/styles'

export const Step = ({tipoDeDato,nombre,setnombre,precio,setprecio,cantidad,setcantidad,composicion,setcomposicion,listaDeProductos,disableCantidad}) =>{
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
            case 'Producto Compuesto':
                return(
                    <Paper elevation={3} className={classes.paper}>
                        <Grid container>
                            <Grid item xs={12} justify='center'>
                                <Typography variant='caption'>
                                    En caso de que el producto este compuesto a su vez por dos o mas productos. Esto quiere decir que al momento de venderlo afectara el stock de los productos que lo componen.
                                </Typography>    
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Select
                                        multiple
                                        value={composicion}
                                        onChange={e=>{setcomposicion(e.target.value)}}
                                        input={<Input className={classes.select}label='Lista de Productos' id="select-multiple-chip" />}
                                        renderValue={() => (
                                            composicion.map((value) => (
                                                <Chip key={value} label={value} className={classes.chip} />
                                            ))
                                        )}
                                        >
                                        {listaDeProductos.map(producto => (
                                            <MenuItem key={producto} value={producto}>
                                                {producto}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>
                )
            case 'Cadena De Produccion':
                return(
                    <Grid container>

                    </Grid>
                )
        }
    }

    return( renderStep() )
}