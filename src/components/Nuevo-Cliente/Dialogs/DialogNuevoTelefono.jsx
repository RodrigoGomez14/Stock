import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Grid,makeStyles} from '@material-ui/core'

const useStyles = makeStyles(theme=>({
    input:{
        marginBottom:theme.spacing(1),
        textAlign:'center'
    }
}))

export const DialogNuevoTelefono = ({open,setOpen,telefonos,settelefonos,edit,editIndex,seteditIndex}) =>{
    const classes = useStyles()
    const [nombre,setnombre]=useState(undefined)
    const [numero,setnumero]=useState(undefined)
    
    const resetTextFields = () =>{
        setnombre('')
        setnumero('')
    }
    const agregarTelefono = () =>{
        let aux = telefonos
        aux.push({
            nombre:nombre?nombre:null,
            numero:numero?numero:null,
        })
        settelefonos(aux)
    }

    const editarTelefono = () =>{
        let aux = telefonos
        aux[editIndex]={nombre:nombre,numero:numero}
        settelefonos(aux)
    }
    useEffect(()=>{
        if(edit){
            setnombre(telefonos[editIndex].nombre)
            setnumero(telefonos[editIndex].numero)
        }
    },[edit])
    return(
        <Dialog open={open}>
            <DialogTitle>
                {edit?
                    'Editar Telefono'
                    :
                    'Agregar Nuevo Telefono'
                }
            </DialogTitle>
            <DialogContent>
                <Grid container direction='column'>
                    <Grid item className={classes.input}>
                        <TextField
                            autoFocus
                            color='primary'
                            label='Nombre'
                            value={nombre}
                            onChange={e=>{setnombre(e.target.value)}}
                        />
                    </Grid>
                    <Grid item className={classes.input}>
                        <TextField
                            color='primary'
                            label='Numero'
                            value={numero}
                            onChange={e=>{setnumero(e.target.value)}}
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
                    disabled={ numero && nombre ?false:true}
                    onClick={()=>{
                        if(edit){
                            editarTelefono()
                            seteditIndex(-1)
                        }
                        else{
                            agregarTelefono()
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