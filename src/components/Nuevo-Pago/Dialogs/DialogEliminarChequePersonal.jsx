import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Grid,makeStyles} from '@material-ui/core'

const useStyles = makeStyles(theme=>({
    input:{
        marginBottom:theme.spacing(1),
        textAlign:'center'
    }
}))

export const DialogEliminarChequePersonal = ({open,setopen,datos,setDatos,index,setdeleteIndex,tipoDeElemento,total,settotal}) =>{
    const classes = useStyles()
    
    const eliminarCheque = () =>{
        settotal(parseInt(total)-datos[index].valor)
        let aux = datos
        console.log(aux)
        aux.splice(index,1)
        setDatos(aux)
    }
    return(
        <Dialog open={open}>
            <DialogTitle>
                Desea Eliminar {tipoDeElemento}?
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
                        eliminarCheque()
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