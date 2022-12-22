import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Grid,Paper,FormControl,Select,Input,MenuItem,List,ListItem,ListItemText, Typography,IconButton} from '@material-ui/core'
import {EditOutlined} from '@material-ui/icons'
import {formatMoney} from '../../../utilities'
import {content} from '../../../Pages/styles/styles'
import { Autocomplete } from '@material-ui/lab'

export const DialogNuevoProducto = ({open,setOpen,productos,setproductos,edit,editIndex,seteditIndex,productosList,total,settotal}) =>{
    const classes = content()
    const [producto,setproducto]=useState(undefined)
    const [cantidad,setcantidad]=useState(undefined)
    const [precio,setprecio]=useState('')
    const [editarPrecio,seteditarPrecio]=useState(false)
    
    // FUNCTIONS
    const resetTextFields = () =>{
        setproducto(undefined)
        setcantidad(undefined)
        setprecio(undefined)
    }
    const agregarProducto = () =>{
        let aux = productos
        aux.push({
            producto:producto,
            cantidad:cantidad,
            precio:precio,
            total:precio*cantidad
        })
        setproductos(aux)
        settotal(total+(cantidad*precio))
    }
    const actualizarTotal=()=>{
        let nuevoTotal = total
        if(productos[editIndex].precio!=precio){
            console.log(nuevoTotal)
            nuevoTotal-=productos[editIndex].cantidad*productos[editIndex].precio
            nuevoTotal+=productos[editIndex].cantidad*precio
            console.log(nuevoTotal)
        }
        if(productos[editIndex].cantidad>cantidad){
            console.log(nuevoTotal)
            nuevoTotal-=(productos[editIndex].cantidad-cantidad)*precio
            console.log(nuevoTotal)
        }
        else if(productos[editIndex].cantidad<cantidad){
            console.log(nuevoTotal)
            nuevoTotal+=(cantidad-productos[editIndex].cantidad)*precio
            console.log(nuevoTotal)
        }
        console.log(nuevoTotal)
        settotal(nuevoTotal)
    }
    const editarProducto = () =>{
        let aux = productos
        actualizarTotal()
        aux[editIndex]={
            producto:producto,
            cantidad:cantidad,
            precio:precio,
            total:precio*cantidad
        }
        setproductos(aux)
    }

    useEffect(()=>{
        if(edit){
            setproducto(productos[editIndex].producto)
            setcantidad(productos[editIndex].cantidad)
            setprecio(productos[editIndex].precio)
        }
    },[edit])
    return(
        <Dialog open={open} maxWidth='md'>
            <DialogTitle>
                {edit?
                    'Editar Producto Elegido'
                    :
                    'Elige un producto'
                }
            </DialogTitle>
            <DialogContent>
                <Grid container direction='column' alignItems='center'>
                    <Grid item>
                        <Autocomplete
                            freeSolo
                            value={producto}
                            options={Object.keys(productosList)}
                            getOptionLabel={(option) => productosList[option].nombre}
                            onChange={(e)=>{
                                setproducto(e.target.value) 
                            }}
                            onSelect={(e)=>{
                                setproducto(e.target.value) 
                            }}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Producto" variant="outlined" />}
                        />
                    </Grid>
                    {producto&&
                        <Grid container item xs={12} justify='center' spacing={3}>
                            <Grid item>
                                <TextField
                                    label='Precio'
                                    type='number'
                                    value={precio}
                                    onChange={e=>{
                                        setprecio(e.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label='Cantidad'
                                    type='number'
                                    value={cantidad}
                                    onChange={e=>{
                                        setcantidad(e.target.value)
                                    }}
                                />
                            </Grid>
                        </Grid>
                    }
                    <Grid container item xs={12} justify='center'>
                        <Grid item>
                            <List>
                                <Paper className={classes.titleDetallesCard} elevation={3}>
                                    <ListItem>
                                            <ListItemText primary={'Total'} secondary={`$ ${cantidad*precio?formatMoney(cantidad*precio):'-'}`}/>
                                    </ListItem>
                                </Paper>
                            </List>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={()=>{
                        if(edit){
                            seteditIndex(-1)
                        }
                        resetTextFields()
                        seteditarPrecio(false)
                        setOpen(false)
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    disabled={!producto||!cantidad||!precio}
                    onClick={()=>{
                        if(edit){
                            editarProducto()
                            seteditIndex(-1)
                        }
                        else{
                            agregarProducto()
                        }
                        resetTextFields()
                        seteditarPrecio(false)
                        setOpen(false)
                    }}
                >
                    {edit?
                        'Editar'
                        :
                        'Agregar'
                    }
                </Button>
            </DialogActions>
        </Dialog>
    )
}