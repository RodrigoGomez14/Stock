import React, {useState,useEffect} from 'react'
import {Grid,Card,CardContent,IconButton,Typography,Chip,Button,CardHeader,Paper,Menu,MenuItem,Collapse, List,ListItem, ListItemText,Switch,FormControlLabel, CardActions} from '@material-ui/core'
import {MoreVert,AttachMoney,ExpandMore,ExpandLess} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {Alert} from '@material-ui/lab'
import {formatMoney, obtenerFecha} from '../../utilities'
import {content} from '../../Pages/styles/styles'
import {DialogAsentarInconveniente} from './Dialogs/DialogAsentarInconveniente'

export const CardEnvio = ({envio,search,asentarLlegada,asentarResolucionInconveniente,asentarInconveniente}) =>{
    const classes = content()
    const [anchorEl, setAnchorEl] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [showDialogAsentarInconveniente, setshowDialogAsentarInconveniente] = useState(false);

    //Menu More
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return(
        <Grid item xs={11} sm={8} md={6} lg={4} className={!search?null:envio.remito.search(search) == -1 ? classes.displayNone:classes.display} >
            <Card>
                <Paper elevation={3} className={envio.fechaDeLlegada?classes.cardEnvioHeaderSuccess:(envio.inconveniente?classes.cardEnvioHeaderWarning:classes.cardEnvioHeader)}>
                    <CardHeader
                        className={classes.header}
                        action={
                            <>
                                <IconButton onClick={()=>{setExpanded(!expanded)}}>
                                    {expanded?
                                        <ExpandLess className={envio.fechaDeLlegada?classes.cardEnvioHeaderIconSuccess:(envio.inconveniente?classes.cardEnvioHeaderIconWarning:null)}/>
                                        :
                                        <ExpandMore className={envio.fechaDeLlegada?classes.cardEnvioHeaderIconSuccess:(envio.inconveniente?classes.cardEnvioHeaderIconWarning:null)}/>
                                    }
                                </IconButton>
                                {!envio.fechaDeLlegada?
                                    <>
                                        <IconButton aria-label="settings" onClick={handleClick} className={envio.fechaDeLlegada?classes.cardEnvioHeaderIconSuccess:(envio.inconveniente?classes.cardEnvioHeaderIconWarning:null)}>
                                            <MoreVert/>
                                        </IconButton>
                                        <Menu
                                            id="simple-menu"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                        >
                                            {!envio.fechaDeLlegada?
                                                <MenuItem onClick={()=>{
                                                    handleClose()
                                                    asentarLlegada()
                                                }}>Asentar llegada</MenuItem>
                                                :
                                                null
                                            }
                                            {!envio.inconveniente && !envio.fechaDeLlegada ?
                                                <MenuItem 
                                                    className={classes.deleteButton}
                                                    onClick={()=>{
                                                        handleClose()
                                                        setshowDialogAsentarInconveniente(true)
                                                        //asentarInconveniente({descripcion:'Se pedieron 10 Tapas',fecha:obtenerFecha()})
                                                    }}>
                                                    Asentar Inconveniente
                                                </MenuItem>
                                                :
                                                null
                                            }
                                            {envio.inconveniente && !envio.resolucionInconveniente ?
                                                <MenuItem 
                                                    className={classes.deleteButton}
                                                    onClick={()=>{
                                                        handleClose()
                                                        asentarResolucionInconveniente({fecha:obtenerFecha()})
                                                    }}>
                                                    Inconveniente Resuelto
                                                </MenuItem>
                                                :
                                                null
                                            }
                                        </Menu>
                                    </>
                                    :
                                    null
                                }
                            </>
                        }
                        title={
                            <Grid container xs={12} justify='flex-start' spacing={3}>
                                <Grid item>
                                    <Link 
                                        style={{color:'#fff',textDecoration:'none'}}
                                        className={envio.fechaDeLlegada?classes.cardEnvioHeaderTextSuccess:(envio.inconveniente?classes.cardEnvioHeaderTextWarning:null)}
                                        to={{pathname:'/Cliente',search:`${envio.cliente}`}
                                    }>
                                        {envio.cliente}
                                    </Link>
                                </Grid>
                            </Grid>
                        }
                        subheader={
                            <Link 
                                style={{color:'#fff',textDecoration:'none'}}
                                className={envio.fechaDeLlegada?classes.cardEnvioHeaderTextSuccess:(envio.inconveniente?classes.cardEnvioHeaderTextWarning:null)}
                                to={{pathname:'/Cliente',search:`${envio.cliente}`,props:{remito:envio.id}}}>
                                Remito Nº {envio.remito}
                            </Link>
                        }
                    />
                </Paper>
                <Collapse in={expanded} timeout='auto' unmountOnExit>
                    <CardContent>
                        <Grid container xs={12} justify='center' spacing={3}>
                            {envio.fechaDeLlegada?
                                <Grid container item xs={12}>
                                    <Alert variant="filled" severity="success" className={classes.alertCheque}>
                                        El paquete llego a destino el {envio.fechaDeLlegada}
                                    </Alert>
                                </Grid>
                                :
                                null
                            }
                            {envio.resolucionInconveniente?
                                <Grid container item xs={12}>
                                    <Alert variant="filled" severity="success" className={classes.alertCheque}>
                                        El {envio.resolucionInconveniente.fecha} se resolvio el inconveniente
                                    </Alert>
                                </Grid>
                                :
                                null
                            }
                            {envio.inconveniente?
                                <Grid container item xs={12}>
                                    <Alert variant="filled" severity="warning" className={classes.alertEnvioInconveniente}>
                                        El {envio.inconveniente.fecha} {envio.inconveniente.descripcion}
                                    </Alert>
                                </Grid>
                                :
                                null
                            }
                        </Grid>
                        <List>
                            <ListItem>
                                <ListItemText primary={envio.fecha} secondary='Fecha de Salida'/>
                            </ListItem>
                        </List>
                    </CardContent>
                </Collapse>
            </Card>
            <DialogAsentarInconveniente open={showDialogAsentarInconveniente} setOpen={setshowDialogAsentarInconveniente} asentarInconveniente={asentarInconveniente}/>
        </Grid>
    )
}
