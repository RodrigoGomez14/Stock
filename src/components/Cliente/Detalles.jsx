import React from 'react'
import {List,Paper,ListItem,ListItemText,makeStyles,Typography,Divider,Grid} from '@material-ui/core'
import {Link} from 'react-router-dom'
import { Search } from '@material-ui/icons'
const useStyles = makeStyles(theme=>({
    divider:{
        width:'100%'
    },
    detalles:{
        height:'calc(100vh - 100px)',
        backgroundColor:'transparent',
        overflowY:'scroll',
        padding:theme.spacing(1)
    },
    paper:{
        marginBottom:theme.spacing(1)
    },
    textWhite:{
        color:theme.palette.primary.contrastText
    },
    link:{
        outline:'none',
        textDecoration:'none',
        cursor:'pointer'
    },
}))
export const Detalles = ({dni,cuit,direcciones,telefonos,mails,infoExtra,expresos}) =>{
    const classes = useStyles()
    return(
        <Grid item xs={12}>
            <div className={classes.detalles}>
                    {dni || cuit ?
                        <Paper elevation={6} className={classes.paper}>
                            <List>
                                {dni&&
                                    <>
                                        <ListItem>
                                            <ListItemText primary='DNI' secondary={dni?dni:'-'}/>
                                        </ListItem>
                                        <Divider />
                                    </>
                                }
                                {cuit &&
                                    <ListItem>
                                        <ListItemText primary='CUIT' secondary={cuit?cuit:'-'}/>
                                    </ListItem>
                                }
                            </List>
                        </Paper>
                        :
                        null
                    }
                    {direcciones &&
                        <Paper elevation={6} className={classes.paper}>
                            <List>
                                <ListItem>
                                    <ListItemText primary={'Direcciones'}/>
                                </ListItem>
                                {direcciones.map(direccion=>(
                                    <>
                                        <Divider />
                                        <ListItem>
                                            <ListItemText secondary={`${direccion.calleYnumero}, ${direccion.ciudad}, ${direccion.provincia}, ${direccion.cp}`}/>
                                        </ListItem>
                                    </>
                                ))}
                            </List>
                        </Paper>
                    }
                    {telefonos &&
                        <Paper elevation={6} className={classes.paper}>
                            <List>
                                <ListItem>
                                    <ListItemText primary={'Telefonos'}/>
                                </ListItem>
                                {telefonos.map(telefono=>(
                                    <>
                                        <Divider />
                                        <ListItem>
                                            <ListItemText primary={telefono.numero} secondary={telefono.nombre?telefono.nombre:'-'}/>
                                        </ListItem>
                                    </>
                                ))}
                            </List>
                        </Paper>
                    }
                    {mails&&
                        <Paper elevation={6} className={classes.paper}>
                            <List>
                                <ListItem>
                                    <ListItemText primary={'Mails'}/>
                                </ListItem>
                                {mails.map(mail=>(
                                    <>
                                        <Divider />
                                        <ListItem>
                                            <ListItemText primary={mail.mail} secondary={mail.nombre?mail.nombre:'-'}/>
                                        </ListItem>
                                    </>
                                ))}
                            </List>
                        </Paper>
                    }
                    {expresos &&
                        <Paper elevation={6} className={classes.paper}>
                            <List>
                                <ListItem>
                                    <ListItemText primary={'Expresos'}/>
                                </ListItem>
                                {expresos.map(expreso=>(
                                    <>
                                        <Divider />
                                        <ListItem>
                                            <Link 
                                                className={classes.link}
                                                to={{
                                                pathname:'/Expreso',
                                                search:`${expreso}`
                                            }}>
                                                <ListItemText secondary={expreso}/>
                                            </Link>
                                        </ListItem>
                                    </>
                                ))}
                            </List>
                        </Paper>
                    }
                    {infoExtra &&
                        <Paper elevation={6} className={classes.paper}>
                            <List>
                                <ListItem>
                                    <ListItemText primary={'Info Extra'}/>
                                </ListItem>
                                {infoExtra.map((info,i)=>(
                                    <>
                                        <Divider />
                                        <ListItem>
                                            <ListItemText primary={i+1} secondary={info}/>
                                        </ListItem>
                                    </>
                                ))}
                            </List>
                        </Paper>
                    }
                    {!dni && !cuit && !direcciones && !telefonos && !mails && !infoExtra && !expresos?
                        <Grid container item xs={12} justify='center'>
                            <Typography variant='h6' className={classes.textWhite}>
                                No hay informacion del cliente
                            </Typography>
                        </Grid>
                        :
                        null
                    }
            </div>
        </Grid>
    )
}