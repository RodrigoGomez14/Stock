import React, { useState } from 'react'
import {Grid, Button,makeStyles,Select,Input,Chip,MenuItem,Paper,FormControl, TextField,Tab,Tabs,AppBar,Typography,Box,Switch,FormControlLabel,InputLabel} from '@material-ui/core'
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

export const Step = ({efectivo,setefectivo,cheques,setcheques,expreso,setexpreso,remito,setremito,tipoDeDato,expresosList,total,settotal,precio,setprecio,setsumarEnvio,sumarEnvio,nombre}) =>{
    const classes = useStyles()
    const [showDialog,setshowDialog]=useState(false)
    const [editIndex,seteditIndex]=useState(-1)
    const [showDialogDelete,setshowDialogDelete]=useState(false)
    const [deleteIndex,setdeleteIndex]=useState(undefined)
    const [value,setValue]=useState(0)
    const [check,setcheck]=useState(false)

    const openDialogDelete = (index) =>{
        setdeleteIndex(index)
        setshowDialogDelete(true)
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const TabPanel=(props)=>{
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
          >
            {value === index && (
              <Box p={3}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        )
    }
    
    const renderMetodoDePago = () =>{
        return(
            <>
                <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label="Efectivo" />
                        <Tab label="Cheques" />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <Grid container justify='center' alignItems='center' direction='column'>
                        <Grid item xs={12}>
                            <Typography variant='h6'>
                                Ingrese la cantidad
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                autoFocus
                                value={efectivo}
                                type='number'
                                onChange={e=>{
                                    setefectivo(e.target.value)
                                }}
                            />
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Grid container>
                        {console.log(nombre)}
                        <DialogNuevoCheque 
                            open={showDialog} 
                            setOpen={setshowDialog} 
                            datos={cheques} 
                            setdatos={setcheques}
                            edit={editIndex!=-1} 
                            editIndex={editIndex} 
                            seteditIndex={seteditIndex}
                            total={total}
                            settotal={settotal}
                            proveedor={nombre}
                        />
                        <DialogEliminarCheque 
                            open={showDialogDelete} 
                            setopen={setshowDialogDelete} 
                            datos={cheques} 
                            setDatos={setcheques} 
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
                        {cheques.length?
                            <Grid container item xs={12} spacing={1} alignItems='center' justify='center' className={classes.containerDirecciones}>
                                <Cheques cheques={cheques} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                            </Grid>
                            :
                            null
                        }
                    </Grid>
                </TabPanel>
            </>
        )
    }
    const resetTextFields =() =>{
        setexpreso('')
        setremito('')
        setprecio('')
        setsumarEnvio(false)
    }
    const renderMetodoDeEnvio = () =>(
        <Paper elevation={3} className={classes.paper} >
            <Grid container alignItems='center' direction='column' className={classes.containerDirecciones}>
                <Grid item xs={12} justify='center'>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={check}
                                onChange={e=>{
                                    resetTextFields()
                                    setcheck(e.target.checked)
                                }}
                            />
                        }
                        label="Enviado con expreso"
                    />
                </Grid>
                <Grid container justify='center'>
                    <Grid item xs={5} justify='center' direction='column'>
                        <FormControl fullWidth>
                            <InputLabel>Expreso</InputLabel>
                            <Select
                                value={expreso}
                                label='Expreso'
                                disabled={!check}
                                onChange={e=>{setexpreso(e.target.value)}}
                            >
                                {Object.keys(expresosList).map(expreso => (
                                    <MenuItem key={expresosList[expreso].datos.nombre} value={expresosList[expreso].datos.nombre}>
                                        {expresosList[expreso].datos.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField 
                            fullWidth
                            value={remito}
                            disabled={!check}
                            onChange={e=>{setremito(e.target.value)}}
                            label='Nro de remito'
                        />
                        <TextField 
                            fullWidth
                            value={precio}
                            disabled={!check}
                            type='number'
                            onChange={e=>{setprecio(e.target.value)}}
                            label='Precio del envio'
                        />
                        <FormControlLabel
                        control={
                            <Switch
                                checked={sumarEnvio}
                                disabled={!check}
                                onChange={e=>{
                                    setsumarEnvio(e.target.checked)
                                }}
                            />
                        }
                        label="Incluir valor de envio en el total "
                    />
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
    const renderStep = () =>{
        switch (tipoDeDato) {
            case 'Metodo De Pago': 
                return(
                        renderMetodoDePago()
                )
            case 'Metodo De Envio':
                return(
                    renderMetodoDeEnvio()
                )
        }
    }

    return( renderStep() )
}