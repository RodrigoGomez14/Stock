import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Grid,makeStyles} from '@material-ui/core'

const useStyles = makeStyles(theme=>({
    input:{
        marginBottom:theme.spacing(1),
        textAlign:'center'
    }
}))

export const DialogNuevoMail = ({open,setOpen,mails,setmails,edit,editIndex,seteditIndex}) =>{
    const classes = useStyles()
    const [nombre,setnombre]=useState(undefined)
    const [mail,setmail]=useState(undefined)
    
    const resetTextFields = () =>{
        setnombre('')
        setmail('')
    }
    const agregarMail = () =>{
        let aux = mails
        aux.push({
            nombre:nombre?nombre:null,
            mail:mail?mail:null,
        })
        setmails(aux)
    }

    const editarMail = () =>{
        let aux = mails
        aux[editIndex]={nombre:nombre,mail:mail}
        setmails(aux)
    }
    useEffect(()=>{
        if(edit){
            setnombre(mails[editIndex].nombre)
            setmail(mails[editIndex].mail)
        }
    },[edit])
    return(
        <Dialog open={open}>
            <DialogTitle>
                {edit?
                    'Editar Mail'
                    :
                    'Agregar Nuevo Mail'
                }
            </DialogTitle>
            <DialogContent>
                <Grid container direction='column'>
                    <Grid item className={classes.input}>
                        <TextField
                            autoFocus
                            color='primary'
                            label='Nombre'
                            value={nombre}
                            onChange={e=>{setnombre(e.target.value)}}
                        />
                    </Grid>
                    <Grid item className={classes.input}>
                        <TextField
                            color='primary'
                            label='Mail'
                            value={mail}
                            onChange={e=>{setmail(e.target.value)}}
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
                    disabled={ mail && nombre ?false:true}
                    onClick={()=>{
                        if(edit){
                            editarMail()
                            seteditIndex(-1)
                        }
                        else{
                            agregarMail()
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