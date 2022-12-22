import React from 'react'
import {Dialog,DialogTitle,DialogActions,DialogContent,Button,Typography} from '@material-ui/core'


export const DialogConfirmDelete = ({open,setOpen,eliminarCliente}) =>{
    return(
        <Dialog open={open} maxWidth='md' fullWidth={true}>
            <DialogTitle>
                Desea eliminar el cliente?
            </DialogTitle>
            <DialogContent dividers>
                <Typography gutterBottom>
                    Se eliminara de forma permanente toda la informacion, listado de pedidos, deuda e historial de pago. 
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button 
                    autoFocus
                    onClick={()=>{
                        setOpen(false)
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    color='error'
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