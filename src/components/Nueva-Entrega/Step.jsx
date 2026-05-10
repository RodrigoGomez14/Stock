import React, { useState } from 'react'
import {Grid, Button,TextField,Select,Input,Chip,MenuItem,Paper,FormControl, Typography,Card,CardContent,CardActions,Collapse,List,ListItem,ListItemText} from '@mui/material'
import {Productos} from './Productos'
import { Autocomplete } from '@mui/material'
import {DialogEliminarElemento} from './Dialogs/DialogEliminarElemento'
import {AddOutlined} from '@mui/icons-material'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'




export const Step = ({datos,setDatos,tipoDeDato,proveedoresList,productosList,total,settotal}) =>{
    const classes = content()
    const [showDialog,setshowDialog]=useState(false)
    const [editIndex,seteditIndex]=useState(-1)
    const [showDialogDelete,setshowDialogDelete]=useState(false)
    const [deleteIndex,setdeleteIndex]=useState(undefined)

    const [productoForm, setProductoForm] = useState(undefined)
    const [cantidadForm, setCantidadForm] = useState(undefined)
    const [precioForm, setPrecioForm] = useState('')

    React.useEffect(() => {
        if (editIndex !== -1 && showDialog) {
            setProductoForm(datos[editIndex].producto)
            setCantidadForm(datos[editIndex].cantidad)
            setPrecioForm(datos[editIndex].precio)
        }
    }, [editIndex, showDialog])

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
                        <Collapse in={showDialog}>
                            <Paper elevation={3} style={{ padding: 16, marginTop: 16, width: '100%' }}>
                                <Grid container direction='column' alignItems='center' spacing={3}>
                                    <Grid item>
                                        <Typography variant='h6'>
                                            {editIndex !== -1 ? 'Editar Producto Elegido' : 'Elige un producto'}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Autocomplete
                                            freeSolo
                                            value={productoForm}
                                            options={getProductos()}
                                            getOptionLabel={(option) => option.nombre}
                                            onChange={(e)=>{
                                                setProductoForm(e.target.value) 
                                            }}
                                            onSelect={(e)=>{
                                                setProductoForm(e.target.value) 
                                            }}
                                            style={{ width: 300 }}
                                            renderInput={(params) => <TextField {...params} label="Producto" variant="outlined" />}
                                        />
                                    </Grid>
                                    {productoForm&&
                                        <Grid container item xs={12} justify='center' spacing={3}>
                                            <Grid item>
                                                <TextField
                                                    label='Precio'
                                                    type='number'
                                                    value={precioForm}
                                                    onChange={e=>{
                                                        setPrecioForm(e.target.value)
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    label='Cantidad'
                                                    type='number'
                                                    value={cantidadForm}
                                                    onChange={e=>{
                                                        setCantidadForm(e.target.value)
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    }
                                    <Grid container item xs={12} justify='center'>
                                        <Paper className={classes.totalProductoNuevoPedido} elevation={3}>
                                            <List>
                                                <ListItem>
                                                        <ListItemText primary={'Total'} secondary={`$ ${cantidadForm*precioForm?formatMoney(cantidadForm*precioForm):'-'}`}/>
                                                </ListItem>
                                            </List>
                                        </Paper>
                                    </Grid>
                                    <Grid item>
                                        <Button onClick={()=>{
                                            if(editIndex !== -1) seteditIndex(-1)
                                            setProductoForm(undefined)
                                            setCantidadForm(undefined)
                                            setPrecioForm(undefined)
                                            setshowDialog(false)
                                        }}>Cancelar</Button>
                                        <Button
                                            disabled={!productoForm||!cantidadForm||!precioForm}
                                            onClick={()=>{
                                                if(editIndex !== -1){
                                                    let aux = datos
                                                    let nuevoTotal = total
                                                    if(datos[editIndex].precio != precioForm){
                                                        nuevoTotal -= datos[editIndex].cantidad * datos[editIndex].precio
                                                        nuevoTotal += datos[editIndex].cantidad * precioForm
                                                    }
                                                    if(datos[editIndex].cantidad > cantidadForm){
                                                        nuevoTotal -= (datos[editIndex].cantidad - cantidadForm) * precioForm
                                                    } else if(datos[editIndex].cantidad < cantidadForm){
                                                        nuevoTotal += (cantidadForm - datos[editIndex].cantidad) * precioForm
                                                    }
                                                    settotal(nuevoTotal)
                                                    aux[editIndex]={
                                                        producto:productoForm,
                                                        cantidad:cantidadForm,
                                                        precio:precioForm,
                                                        total:precioForm*cantidadForm
                                                    }
                                                    setDatos(aux)
                                                    seteditIndex(-1)
                                                } else {
                                                    let aux = datos
                                                    aux.push({
                                                        producto:productoForm,
                                                        cantidad:cantidadForm,
                                                        precio:precioForm,
                                                        total:precioForm*cantidadForm
                                                    })
                                                    setDatos(aux)
                                                    settotal(total+(cantidadForm*precioForm))
                                                }
                                                setProductoForm(undefined)
                                                setCantidadForm(undefined)
                                                setPrecioForm(undefined)
                                                setshowDialog(false)
                                            }}
                                        >
                                            {editIndex !== -1 ? 'Editar' : 'Agregar'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Collapse>
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
                            
                                <TextField
                                    fullWidth
                                    label='Fecha del pedido'
                                    type='date'
                                    InputLabelProps={{ shrink: true }}
                                    value={datos}
                                    onChange={e=>{
                                        setDatos(e.target.value)
                                    }}
                                />

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
