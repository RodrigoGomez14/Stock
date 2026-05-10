import React from 'react'
import {Dialog,DialogTitle,DialogActions,Button,DialogContent} from '@mui/material'


export const DialogConfirmGoBack = ({blockGoBack,setBlockGoBack,history}) =>{    
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
