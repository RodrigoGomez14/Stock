import React,{useState} from 'react'
import {Grid,Card,CardHeader,TableRow,TableHead,TableCell,TableBody,List,ListItem,ListItemText,makeStyles,Paper,IconButton,Menu,MenuItem,Dialog,DialogTitle,DialogContent,DialogActions,Button,Typography} from '@material-ui/core'
import {MoreVert} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {CardEnvio} from './CardEnvio'
import {content} from '../../Pages/styles/styles'

{/* COMPONENT */}
export const ListaDeEnvios = ({envios,}) =>{
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

                    {/* LIST */}
                    <Grid container item xs={12} justify='center' spacing= {3}>
                        {Object.keys(envios).reverse().map(envio=>(
                            <CardEnvio
                                envio={envios[envio]}
                                id={envio}
                                
                            />
                        ))}
                    </Grid>
                </>
                :
                <Grid container item xs={12} justify='center'>
                    <Typography className={classes.textWhite} variant='h6'>
                        El expreso no realizo ningun envio
                    </Typography>
                </Grid>
            }
        </Grid>
    )
}