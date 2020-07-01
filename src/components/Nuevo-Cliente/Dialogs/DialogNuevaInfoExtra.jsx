import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Grid,makeStyles} from '@material-ui/core'

const useStyles = makeStyles(theme=>({
    input:{
        marginBottom:theme.spacing(1),
        textAlign:'center'
    }
}))

export const DialogNuevaInfoExtra = ({open,setOpen,infoExtra,setinfoExtra,edit,editIndex,seteditIndex}) =>{
    const classes = useStyles()
    const [nuevaInfo,setnuevaInfo]=useState(undefined)
    
    const resetTextFields = () =>{
        setnuevaInfo('')
    }
    const agregarInfoExtra = () =>{
        let aux = infoExtra
        aux.push(nuevaInfo)
        setinfoExtra(aux)
    }

    const editarInfoExtra = () =>{
        let aux = infoExtra
        aux[editIndex]=nuevaInfo
        setinfoExtra(aux)
    }
    useEffect(()=>{
        if(edit){
            setnuevaInfo(infoExtra[editIndex])
        }
    },[edit])
    return(
        <Dialog open={open}>
            <DialogTitle>
                {edit?
                    'Editar Info Extra'
                    :
                    'Agregar Info Extra'
                }
            </DialogTitle>
            <DialogContent>
                <Grid container direction='column'>
                    <Grid item className={classes.input}>
                        <TextField
                            autoFocus
                            color='primary'
                            label='Nueva Info'
                            value={nuevaInfo}
                            onChange={e=>{setnuevaInfo(e.target.value)}}
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
                    disabled={ nuevaInfo ?false:true}
                    onClick={()=>{
                        if(edit){
                            editarInfoExtra()
                            seteditIndex(-1)
                        }
                        else{
                            agregarInfoExtra()
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