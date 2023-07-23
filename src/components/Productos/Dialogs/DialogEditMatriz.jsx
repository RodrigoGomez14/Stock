import React from 'react'
import {Dialog,DialogTitle,DialogActions,Button,DialogContent} from '@material-ui/core'


export const DialogEditMatriz = ({showDialog,setShowDialog,modificarMatriz,tipo}) =>{   
    return(
        <Dialog open={showDialog}>
            <DialogTitle>
                Desea Regresar la Matriz?
            </DialogTitle>
            <DialogContent>
                Se Dejara asentado que la matriz ahora esta en el taller guardada
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
                        modificarMatriz()
                    }}
                >
                    Continuar
                </Button>
            </DialogActions>
        </Dialog>
    )
}