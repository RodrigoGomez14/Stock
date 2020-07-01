import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Grid,makeStyles} from '@material-ui/core'

const useStyles = makeStyles(theme=>({
    input:{
        marginBottom:theme.spacing(1),
        textAlign:'center'
    }
}))
export const DialogNuevaDireccion = ({open,setOpen,direcciones,setdirecciones,edit,editIndex,seteditIndex}) =>{
    const classes = useStyles()
    const [calleYnumero,setcalleYnumero]=useState(undefined)
    const [ciudad,setciudad]=useState(undefined)
    const [provincia,setprovincia]=useState(undefined)
    const [cp,setcp]=useState(undefined)
    

    const resetTextFields = () =>{
        setcalleYnumero('')
        setciudad('')
        setprovincia('')
        setcp('')
    }
    const agregarDireccion = () =>{
        let aux = direcciones
        aux.push({
            calleYnumero:calleYnumero?calleYnumero:null,
            ciudad:ciudad?ciudad:null,
            provincia:provincia?provincia:null,
            cp:cp?cp:null
        })
        setdirecciones(aux)
    }
    const editarDireccion = () =>{
        let aux = direcciones
        aux[editIndex]={
            calleYnumero:calleYnumero,
            ciudad:ciudad,
            provincia:provincia,
            cp:cp
        }
        setdirecciones(aux)
    }

    useEffect(()=>{
        if(edit){
            setcalleYnumero(direcciones[editIndex].calleYnumero)
            setciudad(direcciones[editIndex].ciudad)
            setprovincia(direcciones[editIndex].provincia)
            setcp(direcciones[editIndex].cp)
        }
    },[edit])

    return(
        <Dialog open={open}>
            <DialogTitle>
                {edit?
                    'Editar Direccion'
                    :
                    'Agregar Nueva Direccion'
                }
            </DialogTitle>
            <DialogContent>
                <Grid container direction='column'>
                    <Grid item className={classes.input}>
                        <TextField
                            autoFocus
                            label='Calle y Nro'
                            value={calleYnumero}
                            onChange={e=>{
                                setcalleYnumero(e.target.value)
                            }}
                        />
                    </Grid>
                    <Grid item className={classes.input}>
                        <TextField
                            label='Ciudad'
                            value={ciudad}
                            onChange={e=>{
                                setciudad(e.target.value)
                            }}
                        />
                    </Grid>
                    <Grid item className={classes.input}>
                        <TextField
                            label='C.P.'
                            value={cp}
                            onChange={e=>{
                                setcp(e.target.value)
                            }}
                        />
                    </Grid>
                    <Grid item className={classes.input}>
                        <TextField
                            label='Provincia'
                            value={provincia}
                            onChange={e=>{
                                setprovincia(e.target.value)
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
                        resetTextFields()
                        setOpen(false)
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={()=>{
                        if(edit){
                            editarDireccion()
                            seteditIndex(-1)
                        }
                        else{
                            agregarDireccion()
                        }
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