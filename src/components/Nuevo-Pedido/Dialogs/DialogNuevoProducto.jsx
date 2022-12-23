import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Grid,Paper,FormControl,Select,Input,MenuItem,List,ListItem,ListItemText, Typography,IconButton} from '@material-ui/core'
import {CheckCircle, EditOutlined} from '@material-ui/icons'
import {formatMoney} from '../../../utilities'
import {content} from '../../../Pages/styles/styles'
import { Autocomplete } from '@material-ui/lab'

export const DialogNuevoProducto = ({open,setOpen,productos,setproductos,edit,editIndex,seteditIndex,productosList,total,settotal}) =>{
    const classes = content()
    const [producto,setproducto]=useState(undefined)
    const [cantidad,setcantidad]=useState(undefined)
    const [discount,setDiscount]=useState(undefined)
    const [precio,setprecio]=useState('')
    const [editarPrecio,seteditarPrecio]=useState(false)
    
    // FUNCTIONS
    const resetTextFields = () =>{
        setproducto(undefined)
        setcantidad(undefined)
        setprecio(undefined)
        seteditarPrecio(false)
    }
    const agregarProducto = () =>{
        let aux = [...productos]
        aux.push({
            producto:producto,
            cantidad:cantidad,
            precio:precio,
            total:precio*cantidad,
            discount:discount?discount:null
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
    const obtenerPrecio =producto=>{
        if(productosList[producto]){
            return productosList[producto].precio
        }
    }
    const getDiscountPrice = (precio,porcentaje) =>{
        return precio - (porcentaje*precio/100)
    }
    const getDiscount = (precio,porcentaje) =>{
        return (porcentaje*precio/100)
    }

    // FILL FOR EDIT
    useEffect(()=>{
        if(edit){
            setproducto(productos[editIndex].producto)
            setcantidad(productos[editIndex].cantidad)
            setprecio(productos[editIndex].precio)
        }
    },[edit])

    // CONTENT
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
                <Grid container direction='column' alignItems='center' spacing={3}>
                    <Grid item>
                        <Autocomplete
                            freeSolo
                            value={producto}
                            options={Object.keys(productosList)}
                            getOptionLabel={(option) => productosList[option].nombre}
                            onChange={(e)=>{
                                setproducto(e.target.value) 
                                setprecio(obtenerPrecio(e.target.value))
                            }}
                            onSelect={(e)=>{
                                setproducto(e.target.value) 
                                setprecio(obtenerPrecio(e.target.value))
                            }}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Producto" variant="outlined" />}
                        />
                    </Grid>
                    {producto&&
                        <Grid container item xs={12} justify='center' spacing={3} >
                            <List>
                                <ListItem>
                                    <ListItemText primary={`$ ${formatMoney(precio)} c/u`} secondary={editarPrecio&&discount?`$ -${formatMoney(getDiscount(precio,discount))}`:null}/>
                                </ListItem>
                                {editarPrecio && discount?
                                    <ListItem>
                                        <ListItemText primary={`$ ${formatMoney(getDiscountPrice(precio,discount))} c/u`} secondary='Nuevo Precio'/>
                                    </ListItem>
                                    :
                                    null
                                }
                            </List>
                            <Grid item>
                                {editarPrecio?
                                    <>
                                        <TextField
                                            label='% Descuento'
                                            type='number'
                                            value={discount}
                                            onChange={e=>{
                                                setDiscount(e.target.value)
                                            }}
                                        />
                                        <IconButton
                                            disabled={!discount}
                                            onClick={e=>{
                                                setprecio(getDiscountPrice(precio,discount))
                                                seteditarPrecio(false)
                                            }}
                                        >
                                            <CheckCircle/>
                                        </IconButton>
                                    </>
                                    :
                                    <Button
                                        color='primary'
                                        variant='contained'
                                        onClick={e=>{
                                            seteditarPrecio(true)
                                        }}
                                    >
                                        Descuento de precio
                                    </Button>
                                }
                            </Grid>
                        </Grid>
                    }
                    <Grid container item xs={12} justify='center' >
                        <Grid item>
                            <TextField
                                label='Cantidad'
                                type='number'
                                disabled={!producto}
                                value={cantidad}
                                onChange={e=>{
                                    setcantidad(e.target.value)
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} justify='center'>
                        <Paper className={classes.totalProductoNuevoPedido} elevation={3}>
                            <List>
                                <ListItem>
                                        <ListItemText primary={'Total'} secondary={`$ ${cantidad*precio?formatMoney(cantidad*precio):'-'}`}/>
                                </ListItem>
                            </List>
                        </Paper>
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
                        setDiscount(undefined)
                        seteditarPrecio(false)
                        setOpen(false)
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    disabled={!producto||!cantidad}
                    onClick={()=>{
                        if(edit){
                            editarProducto()
                            seteditIndex(-1)
                        }
                        else{
                            agregarProducto()
                        }
                        resetTextFields()
                        setDiscount(undefined)
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