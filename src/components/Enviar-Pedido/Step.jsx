import React, { useState } from 'react'
import {Grid, Button,InputAdornment,Select,Input,Chip,MenuItem,Paper,FormControl, TextField,Tab,Tabs,AppBar,Typography,Box,Switch,FormControlLabel,InputLabel} from '@material-ui/core'
import {AddOutlined, AttachMoney} from '@material-ui/icons'
import {Autocomplete} from '@material-ui/lab'
import {DialogNuevoCheque} from './Dialogs/DialogNuevoCheque'
import {DialogEliminarCheque} from './Dialogs/DialogEliminarCheque'
import {Cheques} from './Cheques'
import {content} from '../../Pages/styles/styles'

export const Step = ({efectivo,setefectivo,cheques,setcheques,expreso,setexpreso,remito,setremito,tipoDeDato,expresosList,total,settotal,precio,setprecio,setsumarEnvio,sumarEnvio,nombre}) =>{
    const classes = content()
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
    

    const resetTextFields =() =>{
        setexpreso('')
        setremito('')
        setprecio('')
        setsumarEnvio(false)
    }
    
    const renderStep = () =>{
        switch (tipoDeDato) {
            case 'Metodo De Pago': 
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
                            <Grid item xs={12}>
                                <TextField
                                    autoFocus   
                                    style={{ width: '250px' }}
                                    value={efectivo}
                                    variant='outlined'
                                    type='number'
                                    onChange={e=>{
                                        setefectivo(e.target.value)
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <AttachMoney />
                                          </InputAdornment>
                                        ),
                                      }}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Grid container justify='center' spacing={3}>
                            <Grid container item xs={12} justify='center'>
                                <Button variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                    Agregar Cheque
                                </Button>
                            </Grid>
                            {cheques.length?
                                <Grid container item xs={12} spacing={1} alignItems='center' justify='center'>
                                    <Cheques cheques={cheques} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                                </Grid>
                                :
                                null
                            }

                            {/* DIALOGS */}
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
                                cliente={nombre}
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
                        </Grid>
                    </TabPanel>
                    
                    </>
                )
            case 'Metodo De Envio':
                return(
                    <Grid container>
                        <Grid container item xs={12} justify='center'>
                            <FormControlLabel
                                control={
                                    <Switch
                                        color='primary'
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
                        {check &&
                            <Grid container item xs={12} direction='column' alignItems='center' spacing={3}>
                                <Grid item>
                                    <Autocomplete
                                        freeSolo
                                        options={Object.keys(expresosList)}
                                        getOptionLabel={(option) => option}
                                        onSelect={(e)=>{setexpreso(e.target.value)}}
                                        onChange={(e)=>{setexpreso(e.target.value)}}
                                        style={{ width: '250px' }}
                                        renderInput={(params) => <TextField {...params} label="Expreso" variant="outlined" />}
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField 
                                        style={{width:'250px'}}
                                        variant='outlined'
                                        value={remito}
                                        disabled={!check}
                                        onChange={e=>{setremito(e.target.value)}}
                                        label='Nro de remito'
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField 
                                        variant='outlined'
                                        style={{width:'250px'}}
                                        value={precio}
                                        disabled={!check}
                                        type='number'
                                        onChange={e=>{setprecio(e.target.value)}}
                                        label='Precio del envio'
                                    />
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                )
        }
    }

    return( renderStep() )
}