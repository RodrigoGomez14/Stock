import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Grid,makeStyles,FormControl,Select,Input,MenuItem,List,ListItem,ListItemText, Typography,IconButton} from '@material-ui/core'
import {Autocomplete} from '@material-ui/lab'
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardTimePicker,KeyboardDatePicker,} from '@material-ui/pickers';
import {content} from '../../../Pages/styles/styles'

export const DialogAgregarProceso = ({edit,setEdit,open,setOpen,proveedoresList,cadenaDeProduccion,setcadenaDeProduccion}) =>{
    const classes = content()
    const [nombre, setNombre] = useState(undefined)
    const [proveedor, setProveedor] = useState(undefined)
    
    // FUNCTIONS
    
    // FILL FOR EDIT
    useEffect(()=>{
        if(edit){
        }
    },[edit])

    // CONTENT
    return(
        <Dialog open={open} maxWidth='md'>
            <DialogTitle>
                {edit?
                    'Editar Proceso'
                    :
                    'Agregar Proceso'
                }
            </DialogTitle>
            <DialogContent>
                <Grid container direction='column' alignItems='center' spacing={2}>
                    <Grid item>
                        <Autocomplete
                            freeSolo
                            options={['Fundido','Mecanizado','Pintado','Ensamblado']}
                            getOptionLabel={(option) => option}
                            onSelect={(e)=>{setNombre(e.target.value)}}
                            onChange={(e)=>{setNombre(e.target.value)}}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Tipo de Proceso" variant="outlined" />}
                        />
                    </Grid>
                    <Grid item>
                        {console.log(proveedoresList)}
                        <Autocomplete
                            freeSolo
                            options={Object.keys(proveedoresList)}
                            getOptionLabel={(option) => option}
                            onSelect={(e)=>{setProveedor(e.target.value)}}
                            onChange={(e)=>{setProveedor(e.target.value)}}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Proveedor Encargado" variant="outlined" />}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={()=>{
                        if(edit){
                            setEdit(0)
                        }
                        setOpen(false)
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    disabled={!nombre || !proveedor}
                    onClick={()=>{
                        if(edit){
                            setEdit(0)
                        }
                        else{
                            let proceso = {proceso:nombre,proveedor:proveedor}
                            let aux = cadenaDeProduccion
                            aux.push(proceso)
                            console.log(aux)
                            setcadenaDeProduccion(aux)
                        }
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