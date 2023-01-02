import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Grid,makeStyles} from '@material-ui/core'

const useStyles = makeStyles(theme=>({
    input:{
        marginBottom:theme.spacing(1),
        textAlign:'center'
    }
}))

export const DialogEliminarElemento = ({open,setopen,datos,setDatos,index,setdeleteIndex,tipoDeElemento}) =>{
    const classes = useStyles()
    
    const eliminarElemento = () =>{
        let aux = datos
        aux.splice(index,1)
        setDatos(aux)
    }
    return(
        <Dialog open={open}>
            <DialogTitle>
                Desea Eliminar El {tipoDeElemento}?
            </DialogTitle>
            <DialogActions>
                <Button 
                    onClick={()=>{
                        setopen(false)
                        setdeleteIndex(undefined)
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    color='error'
                    onClick={()=>{
                        eliminarElemento()
                        setopen(false)
                        setdeleteIndex(undefined)
                    }}
                >
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    )
}