import React from 'react'
import {Dialog,DialogTitle,DialogActions,Button} from '@material-ui/core'


export const DialogConfirmDelete = ({open,setOpen,eliminarCliente}) =>{
    return(
        <Dialog open={open}>
            <DialogTitle>
                Desea eliminar el cliente?
            </DialogTitle>
            <DialogActions>
                <Button 
                    onClick={()=>{
                        setOpen(false)
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    variant='error'
                    onClick={()=>{
                        setOpen(false)
                        eliminarCliente()
                    }}
                >
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    )
}