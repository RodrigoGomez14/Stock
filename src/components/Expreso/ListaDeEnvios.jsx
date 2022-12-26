import React,{useState} from 'react'
import {Grid,Card,TextField,TableRow,TableHead,TableCell,TableBody,List,ListItem,ListItemText,makeStyles,Paper,IconButton,Menu,MenuItem,Dialog,DialogTitle,DialogContent,DialogActions,Button,Typography} from '@material-ui/core'
import {Clear, MoreVert} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {CardEnvio} from './CardEnvio'
import {content} from '../../Pages/styles/styles'
import Empty from '../../images/Empty.png'

{/* COMPONENT */}
export const ListaDeEnvios = ({envios,search,setSearch,asentarLlegada}) =>{
    const classes = content()

    // CONTENT
    return(
        <Grid container justify='center' alignItems='center' spacing={3}>
        {envios?
                <>
                    <Grid container item xs={12} justify='center'>
                        <Typography variant='h4'>
                            Lista de Envios
                        </Typography>
                    </Grid>
                    <Grid container item xs={12} justify='center' alignItems='center'>
                        <Grid item>
                            <TextField
                                value={search}
                                onChange={e=>{
                                    setSearch(e.target.value)
                                }}
                                label='Remito'
                                />
                        </Grid>
                        {search?
                            <Grid item>
                                <IconButton onClick={()=>{setSearch('')}}>
                                    <Clear/>
                                </IconButton>
                            </Grid>
                            :
                            null
                        }
                    </Grid>

                    {/* LIST */}
                    <Grid container item xs={12} justify='center' spacing= {3}>
                        {Object.keys(envios).reverse().map(envio=>(
                            <CardEnvio
                                search={search}
                                envio={envios[envio]}
                                asentarLlegada={()=>{asentarLlegada(envio)}}
                            />
                        ))}
                    </Grid>
                </>
                :
                <Grid container xs={12} justify='center' spacing={2}>
                    <Grid item>
                        <img src={Empty} alt="" height='600px'/>
                    </Grid>
                    <Grid container item xs={12} justify='center'>
                        <Typography variant='h5'>El Expreso No Hizo Ningun Envio</Typography>
                    </Grid>
                </Grid>
            }
        </Grid>
    )
}