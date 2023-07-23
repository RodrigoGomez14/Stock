import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Grid,makeStyles,FormControl,InputLabel,Select,Input,MenuItem} from '@material-ui/core'

const useStyles = makeStyles(theme=>({
    input:{
        marginBottom:theme.spacing(1),
        textAlign:'center'
    }
}))

export const DialogNuevaMatriz = ({open,setOpen,matrices,setMatrices,edit,editIndex,seteditIndex}) =>{
    const classes = useStyles()

    const [nombre,setnombre]=useState(undefined)
    

    const resetTextFields = () =>{
        setnombre(undefined)
    }
    const agregarMatrices = () =>{
        let aux = matrices
        aux.push({
            nombre:nombre?nombre:null,
            ubicacion:"Taller",
        })
        setMatrices(aux)
    }

    const editarMatrices = () =>{
        let aux = matrices
        aux[editIndex]={...aux[editIndex],nombre:nombre}
        setMatrices(aux)
    }
    useEffect(()=>{
        if(edit){
            setnombre(matrices[editIndex].nombre)
        }
    },[edit])
    return(
        <Dialog open={open}>
            <DialogTitle>
                {edit?
                    'Editar Matriz / Noyo'
                    :
                    'Agregar Nueva Matriz / Noyo'
                }
            </DialogTitle>
            <DialogContent>
                <Grid container direction='column'>
                    <Grid item className={classes.input}>
                        <TextField
                            color='primary'
                            label='Nombre'
                            value={nombre}
                            onChange={e=>{setnombre(e.target.value)}}
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
                    disabled={ nombre ?false:true}
                    onClick={()=>{
                        if(edit){
                            editarMatrices()
                            seteditIndex(-1)
                        }
                        else{
                            agregarMatrices()
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