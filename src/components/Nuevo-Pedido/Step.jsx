import React, { useState } from 'react'
import {Grid, Button,makeStyles,Select,Input,Chip,MenuItem,Paper,FormControl, Typography,Card,CardContent,CardActions} from '@material-ui/core'
import {Productos} from './Productos'
import {DialogNuevoProducto} from './Dialogs/DialogNuevoProducto'
import {DialogEliminarElemento} from './Dialogs/DialogEliminarElemento'
import {AddOutlined} from '@material-ui/icons'
import {formatMoney} from '../../utilities'

const useStyles = makeStyles(theme=>({
    textAlignCenter:{
        textAlign:'center'
    },
    button:{
        marginTop:theme.spacing(1),
        marginBottom:theme.spacing(1),
    },
    containerDirecciones:{
        maxWidth:'calc(100vw - 60px)',
        flexWrap:'nowrap',
        overflowX:'scroll',
        marginBottom:theme.spacing(2),
        marginTop:theme.spacing(2),
    },
    container:{
        marginBottom:theme.spacing(1)
    },
    paper:{
        padding:theme.spacing(1),
        margin:theme.spacing(1),
    },
    chip: {
        margin: 2,
    },
}))

export const Step = ({datos,setDatos,tipoDeDato,clientesList,productosList,total,settotal}) =>{
    const classes = useStyles()
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
                    <Paper elevation={3} className={classes.paper} >
                        <Grid container justify='center' className={classes.containerDirecciones}>
                            <Grid item xs={5} justify='center'>
                                <FormControl fullWidth>
                                    <Select
                                        value={datos}
                                        onChange={e=>{setDatos(e.target.value)}}
                                        input={<Input className={classes.select}label='Lista de Clientes' id="select-multiple-chip" />}
                                        >
                                        {Object.keys(clientesList).map(cliente => (
                                            <MenuItem key={clientesList[cliente].datos.nombre} value={clientesList[cliente].datos.nombre}>
                                                {clientesList[cliente].datos.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>
                )
                break;
            case 'Productos':
                return(
                    <Paper elevation={3} className={classes.paper} >
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
                        <Grid container className={classes.container} justify='center'>
                            <Button className={classes.button} variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                Agregar Producto
                            </Button>
                        </Grid>
                        {datos.length?
                            <Grid container item xs={12} spacing={1} alignItems='center' justify='center' className={classes.containerDirecciones}>
                                <Productos productos={datos} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                            </Grid>
                            :
                            null
                        }
                        <Grid container justify='center'>
                            <Typography variant='h5'>
                                Total $ {formatMoney(total)}
                            </Typography>
                        </Grid>
                    </Paper>
                )
                break;
            default:
                break;
        }
    }

    return( renderStep() )
}