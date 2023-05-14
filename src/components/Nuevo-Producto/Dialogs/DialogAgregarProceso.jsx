import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,Checkbox,FormGroup,FormControlLabel,DialogActions,FormLabel,TextField,Button,Grid,Select,FormControl,Input,MenuItem,List,ListItem,ListItemText, Typography,IconButton} from '@material-ui/core'
import {Autocomplete} from '@material-ui/lab'
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardTimePicker,KeyboardDatePicker,} from '@material-ui/pickers';
import {content} from '../../../Pages/styles/styles'

export const DialogAgregarProceso = ({edit,setEdit,open,setOpen,proveedoresList,cadenaDeProduccion,setcadenaDeProduccion}) =>{
    const classes = content()
    const [nombre, setNombre] = useState(undefined)
    const [proveedor, setProveedor] = useState(undefined)
    const [isProcesoPropio, setisProcesoPropio] = useState(false)
    const [step, setStep] = useState(0)
    
    // FUNCTIONS
    
    // FILL FOR EDIT
    useEffect(()=>{
        if(edit!=-1){
            setNombre(cadenaDeProduccion[edit].proceso)
            setProveedor(cadenaDeProduccion[edit].proveedor)
            setisProcesoPropio(cadenaDeProduccion[edit].isProcesoPropio)
        }
    },[edit])

    // CONTENT
    return(
        <Dialog open={open} maxWidth='md'>
            <DialogTitle>
                {edit!=-1?
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
                            value={nombre}
                            onSelect={(e)=>{setNombre(e.target.value)}}
                            onChange={(e)=>{setNombre(e.target.value)}}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Tipo de Proceso" variant="outlined" />}
                        />
                    </Grid>
                    <Grid item>
                        <FormControl component="fieldset">
                            <FormGroup aria-label="position" row>
                                <FormControlLabel
                                    control={<Checkbox color="primary" disabled={proveedor} checked={isProcesoPropio} onChange={()=>{setisProcesoPropio(!isProcesoPropio)}} />}
                                    label="Proceso Propio"
                                />
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        {console.log(proveedoresList)}
                        <Autocomplete
                            freeSolo
                            options={proveedoresList?Object.keys(proveedoresList):{}}
                            disabled={!proveedoresList || isProcesoPropio}
                            getOptionLabel={(option) => option}
                            value={proveedor}
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
                        if(edit!=-1){
                            setEdit(-1)
                        }
                        setOpen(false)
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    disabled={!nombre || (!proveedor && !isProcesoPropio)}
                    onClick={()=>{
                        if(edit!=-1){
                            let aux = cadenaDeProduccion
                            aux[edit]={proceso:nombre,proveedor:proveedor?proveedor:null,isProcesoPropio:isProcesoPropio}
                            setcadenaDeProduccion(aux)
                        }
                        else{
                            let proceso = {proceso:nombre,proveedor:proveedor?proveedor:null,isProcesoPropio:isProcesoPropio}
                            let aux = cadenaDeProduccion
                            aux.push(proceso)
                            setcadenaDeProduccion(aux)
                        }
                        setNombre(undefined)
                        setProveedor(undefined)
                        setisProcesoPropio(false)
                        setEdit(-1)
                        setOpen(false)
                    }}
                >
                    {edit!=-1?
                        'Editar'
                        :
                        'Agregar'
                    }
                </Button>
            </DialogActions>
        </Dialog>
    )
}