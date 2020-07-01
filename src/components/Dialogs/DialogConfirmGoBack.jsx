import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogActions,TextField,Button,DialogContent,makeStyles} from '@material-ui/core'

const useStyles = makeStyles(theme=>({
    input:{
        marginBottom:theme.spacing(1),
        textAlign:'center'
    }
}))

export const DialogConfirmGoBack = ({blockGoBack,setBlockGoBack,history}) =>{
    const classes = useStyles()
    
    const goBack = () =>{
        setBlockGoBack(false)
        history.goBack()
    }
    return(
        <Dialog open={blockGoBack}>
            <DialogTitle>
                Desea Salir?
            </DialogTitle>
            <DialogContent>
                Si continua se perderan los datos ingresados
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={()=>{
                        setBlockGoBack(false)
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    color='error'
                    onClick={()=>{
                        goBack()
                    }}
                >
                    Continuar
                </Button>
            </DialogActions>
        </Dialog>
    )
}