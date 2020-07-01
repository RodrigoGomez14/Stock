import React, { useState } from 'react'
import {Grid, Button,makeStyles,Select,Input,Chip,MenuItem,Paper,FormControl, TextField,Tab,Tabs,AppBar,Typography,Box,Switch,FormControlLabel} from '@material-ui/core'
import {AddOutlined} from '@material-ui/icons'
import {DialogNuevoCheque} from './Dialogs/DialogNuevoCheque'
import {DialogEliminarCheque} from './Dialogs/DialogEliminarCheque'
import {Cheques} from './Cheques'
const useStyles = makeStyles(theme=>({
    textAlignCenter:{
        textAlign:'center'
    },
    button:{
        marginTop:theme.spacing(1),
        marginBottom:theme.spacing(1),
    },
    containerDirecciones:{
        maxWidth:'calc(100vw - 60px)',
        flexWrap:'nowrap',
        overflowX:'scroll',
        marginBottom:theme.spacing(2),
        marginTop:theme.spacing(2),
    },
    container:{
        marginBottom:theme.spacing(1)
    },
    paper:{
        padding:theme.spacing(1),
        margin:theme.spacing(1),
    },
    chip: {
        margin: 2,
    },
}))

export const Step = ({datos,setdatos,total,settotal,tipoDeDato,cliente}) =>{
    const classes = useStyles()
    const [showDialog,setshowDialog]=useState(false)
    const [editIndex,seteditIndex]=useState(-1)
    const [showDialogDelete,setshowDialogDelete]=useState(false)
    const [deleteIndex,setdeleteIndex]=useState(undefined)

    const openDialogDelete = (index) =>{
        setdeleteIndex(index)
        setshowDialogDelete(true)
    }
    const renderStep = () =>{
        switch (tipoDeDato) {
            case 'Efectivo': 
                return(
                    <Grid container justify='center' alignItems='center' direction='column'>
                        <Grid item xs={12}>
                            <Typography variant='h6'>
                                Ingrese la cantidad
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                autoFocus
                                value={datos}
                                type='number'
                                onChange={e=>{
                                    setdatos(e.target.value)
                                }}
                            />
                        </Grid>
                    </Grid>
                )
            case 'Cheques':
                return(
                    <Grid container>
                        <DialogNuevoCheque 
                            open={showDialog} 
                            setOpen={setshowDialog} 
                            datos={datos} 
                            setdatos={setdatos} 
                            edit={editIndex!=-1} 
                            editIndex={editIndex} 
                            seteditIndex={seteditIndex}
                            total={total}
                            settotal={settotal}
                            cliente={cliente}
                        />
                        <DialogEliminarCheque 
                            open={showDialogDelete} 
                            setopen={setshowDialogDelete} 
                            datos={datos} 
                            setDatos={setdatos} 
                            index={deleteIndex} 
                            setdeleteIndex={setdeleteIndex} 
                            tipoDeElemento='Cheque'
                            total={total}
                            settotal={settotal}
                        />
                        <Grid container className={classes.container} justify='center'>
                            <Button className={classes.button} variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                Agregar Cheque
                            </Button>
                        </Grid>
                        {datos.length?
                            <Grid container item xs={12} spacing={1} alignItems='center' justify='center' className={classes.containerDirecciones}>
                                <Cheques cheques={datos} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                            </Grid>
                            :
                            null
                        }
                    </Grid>
                )
        }
    }

    return( renderStep() )
}