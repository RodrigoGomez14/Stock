import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Grid,makeStyles,FormControl,Select,Input,MenuItem,List,ListItem,ListItemText, Typography,IconButton} from '@material-ui/core'
import {EditOutlined} from '@material-ui/icons'
import {formatMoney} from '../../../utilities'
const useStyles = makeStyles(theme=>({
    input:{
        marginBottom:theme.spacing(1),
        textAlign:'center'
    }
}))
export const DialogNuevoProducto = ({open,setOpen,productos,setproductos,edit,editIndex,seteditIndex,productosList,total,settotal}) =>{
    const classes = useStyles()
    const [producto,setproducto]=useState(undefined)
    const [cantidad,setcantidad]=useState(undefined)
    const [precio,setprecio]=useState(undefined)
    const [editarPrecio,seteditarPrecio]=useState(false)
    
    

    const resetTextFields = () =>{
        setproducto('')
        setcantidad('')
        setprecio('')
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
        <Dialog open={open}>
            <DialogTitle>
                {edit?
                    'Editar Producto Elegido'
                    :
                    'Elige un producto'
                }
            </DialogTitle>
            <DialogContent>
                <Grid container direction='column'>
                    <Grid item className={classes.input}>
                        <FormControl fullWidth>
                            <Select
                                value={producto}
                                onChange={e=>{
                                    setproducto(e.target.value)
                                }}
                                input={<Input autoFocus className={classes.select}label='Lista de Productos' id="select-multiple-chip" />}
                                >
                                {Object.keys(productosList).map(producto => (
                                    <MenuItem key={productosList[producto].nombre} value={productosList[producto].nombre}>
                                        {productosList[producto].nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item className={classes.input}>
                        {producto&&
                            <>
                                <Typography variant='body1'>
                                    $ {formatMoney(precio)} c/u
                                </Typography>
                                <TextField
                                    label='Precio'
                                    type='number'
                                    value={precio}
                                    onChange={e=>{
                                        setprecio(e.target.value)
                                    }}
                                />
                            </>
                        }
                    </Grid>
                    <Grid item className={classes.input}>
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
                <List>
                    <ListItem>
                            <ListItemText primary={'Total'} secondary={`$ ${cantidad*precio?formatMoney(cantidad*precio):'-'}`}/>
                    </ListItem>
                </List>
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