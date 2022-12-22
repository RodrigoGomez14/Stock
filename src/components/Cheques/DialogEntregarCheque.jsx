import React,{useState,useEffect} from 'react'
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Grid,makeStyles,FormControl,Select,Input,MenuItem,List,ListItem,ListItemText, Typography,IconButton} from '@material-ui/core'
import {EditOutlined} from '@material-ui/icons'
import DateFnsUtils from '@date-io/date-fns';
import {obtenerFecha} from '../../utilities'
const useStyles = makeStyles(theme=>({
    input:{
        marginBottom:theme.spacing(1),
        textAlign:'center'
    }
}))
export const DialogEntregarCheque = ({open,setOpen,guardarEntregaDeCheque,id}) =>{
    const classes = useStyles()
    const [nombre,setnombre]=useState(undefined)
    
    const resetTextFields = () =>{
        setnombre('')
    }
    const entregarCheque = () =>{
        guardarEntregaDeCheque(id,obtenerFecha(),nombre)
    }
    return(
        <Dialog open={open} maxWidth='md' fullWidth={true}>
            <DialogTitle>
                Entregar Cheque
            </DialogTitle>
            <DialogContent>
                <Grid container direction='column'>
                    <Grid item className={classes.input}>
                        <TextField
                            fullWidth
                            label='Nombre'
                            value={nombre}
                            onChange={e=>{
                                setnombre(e.target.value)
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={()=>{
                        resetTextFields()
                        setOpen(false)
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    disabled={!nombre}
                    onClick={()=>{
                        entregarCheque()
                        resetTextFields()
                        setOpen(false)
                    }}
                >
                    Entregar
                </Button>
            </DialogActions>
        </Dialog>
    )
}