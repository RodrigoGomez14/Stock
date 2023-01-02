import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Grid,makeStyles,FormControl,InputLabel,Select,Input,MenuItem} from '@material-ui/core'

const useStyles = makeStyles(theme=>({
    input:{
        marginBottom:theme.spacing(1),
        textAlign:'center'
    }
}))

export const DialogNuevoSubproducto = ({open,setOpen,subproductos,setSubproductos,subproductosList,edit,editIndex,seteditIndex}) =>{
    const classes = useStyles()

    const [nombre,setnombre]=useState(undefined)
    const [cantidad,setCantidad]=useState(undefined)
    

    const resetTextFields = () =>{
        setnombre(undefined)
        setCantidad(undefined)
    }
    const agregarSubproducto = () =>{
        let aux = subproductos
        aux.push({
            nombre:nombre?nombre:null,
            cantidad:cantidad?cantidad:null,
        })
        setSubproductos(aux)
    }

    const editarSubproducto = () =>{
        let aux = subproductos
        aux[editIndex]={nombre:nombre,cantidad:cantidad}
        setSubproductos(aux)
    }
    useEffect(()=>{
        if(edit){
            setnombre(subproductos[editIndex].nombre)
            setCantidad(subproductos[editIndex].cantidad)
        }
    },[edit])
    return(
        <Dialog open={open}>
            <DialogTitle>
                {edit?
                    'Editar Subproducto'
                    :
                    'Agregar Nuevo Subproducto'
                }
            </DialogTitle>
            <DialogContent>
                <Grid container direction='column'>
                    <Grid item className={classes.input}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-mutiple-name-label">Subproductos</InputLabel>
                            <Select
                                value={nombre}
                                onChange={(e)=>{setnombre(e.target.value)}}
                                input={<Input />}
                            >
                                {subproductosList.map(subproducto => (
                                    <MenuItem key={subproducto.nombre} value={subproducto.nombre}>
                                        {subproducto.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item className={classes.input}>
                        <TextField
                            color='primary'
                            label='Cantidad'
                            value={cantidad}
                            onChange={e=>{setCantidad(e.target.value)}}
                        />
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
                        setOpen(false)
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    disabled={ cantidad && nombre ?false:true}
                    onClick={()=>{
                        if(edit){
                            editarSubproducto()
                            seteditIndex(-1)
                        }
                        else{
                            agregarSubproducto()
                        }
                        resetTextFields()
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