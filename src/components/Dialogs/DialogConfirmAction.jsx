import React from 'react'
import {Dialog,DialogTitle,DialogActions,Button,DialogContent} from '@material-ui/core'


export const DialogConfirmAction = ({showDialog,setShowDialog,action,tipo}) =>{   
    return(
        <Dialog open={showDialog}>
            <DialogTitle>
                Desea {tipo}?
            </DialogTitle>
            <DialogContent>
                Si continua se perderan los datos ingresados
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={()=>{
                        setShowDialog(false)
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    color='primary'
                    onClick={()=>{
                        action()
                    }}
                >
                    Continuar
                </Button>
            </DialogActions>
        </Dialog>
    )
}