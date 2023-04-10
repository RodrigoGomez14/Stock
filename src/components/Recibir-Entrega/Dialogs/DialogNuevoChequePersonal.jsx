import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Grid,makeStyles,FormControl,Select,Input,MenuItem,List,ListItem,ListItemText, Typography,IconButton} from '@material-ui/core'
import {EditOutlined} from '@material-ui/icons'
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardTimePicker,KeyboardDatePicker,} from '@material-ui/pickers';
import {content} from '../../../Pages/styles/styles'

export const DialogNuevoChequePersonal = ({open,setOpen,listaCheques,setListaCheques,listaChequesPersonales,setListaChequesPersonales,totalChequesPersonales,setTotalChequesPersonales,edit,editIndex,seteditIndex,cliente}) =>{
    const classes = content()
    const [numero,setnumero]=useState(undefined)
    const [vencimiento,setvencimiento]=useState(undefined)
    const [valor,setvalor]=useState(undefined)
    const [editarPrecio,seteditarPrecio]=useState(false)
    
    
    // FUNCTIONS
    const resetTextFields = () =>{
        setnumero('')
        setvencimiento(undefined)
        setvalor('')
    }
    const agregarCheque = () =>{
        let aux = listaChequesPersonales
        aux.push({
            destinatario:cliente,
            numero:numero,
            vencimiento:vencimiento.toLocaleDateString(),
            valor:valor
        })
        setTotalChequesPersonales(parseFloat(totalChequesPersonales)+parseFloat(valor))
        setListaChequesPersonales(aux)
    }
    const editarCheque = () =>{
        let aux = listaChequesPersonales
        let nuevoTotal = parseFloat(totalChequesPersonales) - parseFloat(aux[editIndex].valor) + parseFloat(valor)
        const auxVencimiento = vencimiento === (convertirVencimiento(listaChequesPersonales[editIndex].vencimiento)) ? convertirVencimiento(vencimiento):vencimiento.toLocaleDateString()
        setTotalChequesPersonales(nuevoTotal)
        aux[editIndex]={
            destinatario:cliente,
            numero:numero,
            vencimiento:auxVencimiento,
            valor:valor
        }
        setListaChequesPersonales(aux)
    }
    const convertirVencimiento= (vencimiento)=>{
        return `${vencimiento.slice(vencimiento.indexOf('/')+1,vencimiento.lastIndexOf('/'))}/${vencimiento.slice(0,vencimiento.indexOf('/'))}${vencimiento.slice(vencimiento.lastIndexOf('/'))}`
    }
    
    // FILL FOR EDIT
    useEffect(()=>{
        if(edit){
            setnumero(listaChequesPersonales[editIndex].numero)
            setvencimiento(convertirVencimiento(listaChequesPersonales[editIndex].vencimiento))
            setvalor(listaChequesPersonales[editIndex].valor)
        }
    },[edit])

    // CONTENT
    return(
        <Dialog open={open} maxWidth='md'>
            <DialogTitle>
                {edit?
                    'Editar Cheque'
                    :
                    'Ingresa los datos del cheque'
                }
            </DialogTitle>
            <DialogContent>
                <Grid container direction='column' alignItems='center' spacing={2}>
                    <Grid item>
                        <TextField
                            fullWidth
                            label='Numero'
                            type='number'
                            value={numero}
                            onChange={e=>{
                                setnumero(e.target.value)
                            }}
                        />
                    </Grid>
                    <Grid item>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} noValidate>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            label="Fecha de Vencimiento"
                            value={vencimiento}
                            onChange={fecha=>{
                                setvencimiento(fecha)
                            }}
                        />
                    </MuiPickersUtilsProvider   >
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            label='Valor'
                            type='number'
                            value={valor}
                            onChange={e=>{
                                setvalor(e.target.value)
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={()=>{
                        if(edit){
                            seteditIndex(-1)
                        }
                        seteditarPrecio(false)
                        resetTextFields()
                        setOpen(false)
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    disabled={!numero||!vencimiento||!valor}
                    onClick={()=>{
                        if(edit){
                            editarCheque()
                            seteditIndex(-1)
                        }
                        else{
                            agregarCheque()
                        }
                        seteditarPrecio(false)
                        resetTextFields()
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