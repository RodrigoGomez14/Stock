import React,{useState} from 'react'
import {Dialog,DialogTitle,DialogActions,DialogContent,Button,TextField} from '@material-ui/core'
import { obtenerFecha } from '../../../utilities'


export const DialogAsentarInconveniente = ({open,setOpen,asentarInconveniente}) =>{
    const [descripcion,setDescripcion] = useState(undefined)

    return(
        <Dialog open={open} maxWidth='md' fullWidth={true}>
            <DialogTitle>
                Ingresar Inconveniente
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    id="standard-full-width"
                    label="Descripcion"
                    style={{ margin: 8 }}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={descripcion}
                    onChange={(e)=>{setDescripcion(e.target.value)}}
                />
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
                    disabled={!descripcion}
                    onClick={()=>{
                        setOpen(false)
                        asentarInconveniente({descripcion:descripcion,fecha:obtenerFecha()})
                    }}
                >
                    Asentar
                </Button>
            </DialogActions>
        </Dialog>
    )
}