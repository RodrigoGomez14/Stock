import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Grid,Paper,ListItemSecondaryAction,Select,Input,MenuItem,List,ListItem,ListItemText, Typography,IconButton} from '@material-ui/core'
import {CancelRounded, CheckCircle, EditOutlined} from '@material-ui/icons'
import {formatMoney} from '../../../utilities'
import {content} from '../../../Pages/styles/styles'
import { Autocomplete } from '@material-ui/lab'

export const DialogNuevoProducto = ({open,setOpen,productos,setproductos,edit,editIndex,seteditIndex,productosList,total,settotal,cotizacion}) =>{
    const classes = content()
    const [producto,setproducto]=useState(undefined)
    const [cantidad,setcantidad]=useState(undefined)
    const [discount,setDiscount]=useState(undefined)
    const [increase,setIncrease]=useState(undefined)
    const [redondeo,setRedondeo]=useState(false)
    const [showPriceModifier,setShowPriceModifier]=useState(false)
    const [precio,setprecio]=useState('')
    const [editarPrecio,seteditarPrecio]=useState(false)
    
    // FUNCTIONS
    const resetTextFields = () =>{
        setproducto(undefined)
        setcantidad(undefined)
        setprecio(undefined)
        setRedondeo(false)
        seteditarPrecio(false)
    }
    const agregarProducto = () =>{
        let aux = [...productos]
        aux.push({
            producto:producto,
            cantidad:cantidad,
            precio:precio*(cotizacion.valor),
            total:precio*(cotizacion.valor)*cantidad,
            cotizacion:cotizacion,
            discount:discount?discount:null,
            increase:increase?increase:null
        })
        setproductos(aux)
        settotal(total+(cantidad*precio*(cotizacion.valor)))
    }
    const actualizarTotal=()=>{
        let nuevoTotal = total
        if(productos[editIndex].precio!=precio){
            nuevoTotal-=productos[editIndex].cantidad*productos[editIndex].precio
            nuevoTotal+=productos[editIndex].cantidad*precio
        }
        if(productos[editIndex].cantidad>cantidad){
            nuevoTotal-=(productos[editIndex].cantidad-cantidad)*precio
        }
        else if(productos[editIndex].cantidad<cantidad){
            nuevoTotal+=(cantidad-productos[editIndex].cantidad)*precio
        }
        settotal(nuevoTotal)
    }
    const editarProducto = () =>{
        let aux = productos
        actualizarTotal()
        aux[editIndex]={
            producto:producto,
            cantidad:cantidad,
            precio:precio,
            cotizacion:cotizacion,
            total:precio*cantidad,
            discount:discount?discount:null,
            increase:increase?increase:null

        }
        setproductos(aux)
    }
    const obtenerPrecio =producto=>{
        let precio 
        productosList.map(i=>{
            if(i.nombre==producto){
                console.log(i.precio)
                precio = i.precio
            }
        })
        return precio
    }
    const getDiscountPrice = (precio,porcentaje) =>{
        return precio - (porcentaje*precio/100)
    }
    const getDiscount = (precio,porcentaje) =>{
        return (porcentaje*precio/100)
    }
    const getIncreasedPrice = (precio,porcentaje) =>{
        return precio + (porcentaje*precio/100)
    }
    const getIncrease = (precio,porcentaje) =>{
        return (porcentaje*precio/100)
    }

    // FILL FOR EDIT
    useEffect(()=>{
        if(edit){
            setproducto(productos[editIndex].producto)
            setcantidad(productos[editIndex].cantidad)
            setprecio(productos[editIndex].precio)
            if(productos[editIndex].discount){
                setDiscount(productos[editIndex].discount)
            }
            if(productos[editIndex].increase){
                setIncrease(productos[editIndex].increase)
            }
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
                            options={productosList}
                            getOptionLabel={(option) => option.nombre}
                            onChange={(e)=>{
                                setproducto(e.target.value) 
                                setprecio(obtenerPrecio(e.target.value))
                            }}
                            onSelect={(e)=>{
                                setShowPriceModifier(true)
                                setproducto(e.target.value) 
                                setprecio(obtenerPrecio(e.target.value))
                            }}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Producto" variant="outlined" />}
                        />
                    </Grid>
                    {showPriceModifier?
                        <Grid container item xs={12} justify='flex-start' spacing={3} >
                            <List style={{width:'100%'}}>
                                <ListItem>
                                    <ListItemText 
                                        primary={`$ ${formatMoney(precio*(cotizacion.valor))} c/u - ($${formatMoney(precio)}usd x $${formatMoney(cotizacion.valor)}) `} 
                                        secondary={editarPrecio&&(discount||increase)?`$ ${editarPrecio=='discount'?'-':'+'}${formatMoney(editarPrecio=='discount'?getDiscount(precio*(cotizacion.valor),discount):getIncrease(precio*(cotizacion.valor),increase))}`:null}/>
                                </ListItem>
                                {editarPrecio && (discount||increase)?
                                    <ListItem>
                                        <ListItemText 
                                            primary={`$ ${formatMoney(editarPrecio=='discount'?getDiscountPrice(precio*(cotizacion.valor),discount):getIncreasedPrice(precio*(cotizacion.valor),increase))} c/u - ($${formatMoney(editarPrecio=='discount'?getDiscountPrice(precio,discount):getIncreasedPrice(precio,increase))}usd x $${formatMoney(cotizacion.valor)})`} 
                                            secondary='Nuevo Precio'
                                            />
                                    </ListItem>
                                    :
                                    null
                                }
                            </List>
                            <Grid container item xs={12}>
                                {redondeo?
                                    <Grid container item xs={12} justify='center' spacing={3}>
                                        <Grid item>
                                            <TextField
                                                label='Redondeo'
                                                type='number'
                                                value={(precio*cotizacion.valor)}
                                                onChange={e=>{
                                                    setprecio(e.target.value/cotizacion.valor)
                                                }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <IconButton
                                                onClick={e=>{
                                                    setRedondeo(false)
                                                }}
                                            >
                                                <CheckCircle/>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                    :
                                    null
                                }
                                {editarPrecio?
                                    <Grid container item xs={12} justify='center' spacing={3}>
                                        <Grid item>
                                            <TextField
                                                label={discount?'% Descuento':'% Incremento'}
                                                type='number'
                                                value={discount?discount:increase}
                                                onChange={e=>{
                                                    if(editarPrecio=='discount'){
                                                        setDiscount(e.target.value)
                                                    }
                                                    else{
                                                        setIncrease(e.target.value)
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <IconButton
                                                onClick={e=>{
                                                    seteditarPrecio(false)
                                                    setIncrease(undefined)
                                                    setDiscount(undefined)
                                                    setRedondeo(false)
                                                }}
                                            >
                                                <CancelRounded/>
                                            </IconButton>
                                            <IconButton
                                                disabled={!discount&&!increase}
                                                onClick={e=>{
                                                    if(editarPrecio=='discount'){
                                                        setprecio(getDiscountPrice(precio,discount))
                                                    }
                                                    else{
                                                        setprecio(getIncreasedPrice(precio,increase))
                                                    }
                                                    seteditarPrecio(false)
                                                    setRedondeo(false)
                                                }}
                                            >
                                                <CheckCircle/>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                    :
                                    !discount && !increase && !redondeo?
                                        <Grid container item xs={12} justify='center' spacing={3}>
                                            <Grid item>
                                                <Button
                                                    color='primary'
                                                    variant='contained'
                                                    onClick={e=>{
                                                        seteditarPrecio('discount')
                                                    }}
                                                >
                                                    Descuento de precio
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    color='primary'
                                                    variant='contained'
                                                    onClick={e=>{
                                                        seteditarPrecio('increase')
                                                    }}
                                                >
                                                    Aumento de precio
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    color='primary'
                                                    variant='contained'
                                                    onClick={e=>{
                                                        setRedondeo(true)
                                                    }}
                                                >
                                                    Redondeo
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        :
                                        null
                                }
                            </Grid>
                        </Grid>
                        :
                        null
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
                                        <ListItemText secondary={'Total'} primary={`$ ${cantidad*precio?formatMoney(cantidad*precio*(cotizacion.valor)):'-'}`}/>
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
                        setIncrease(undefined)
                        seteditarPrecio(false)
                        setShowPriceModifier(false)
                        setOpen(false)
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    disabled={(!producto||!cantidad)||editarPrecio}
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
                        setIncrease(undefined)
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