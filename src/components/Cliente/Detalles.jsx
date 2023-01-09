import React from 'react'
import {List,Paper,ListItem,ListItemText,Typography,Divider,Grid, ListItemIcon} from '@material-ui/core'
import {ContactMail, LocalShipping, Mail, PeopleAlt,Phone,Room,} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {content} from '../../Pages/styles/styles'
import noData from '../../images/noData.png'

// CONTENT
export const Detalles = ({dni,cuit,direcciones,telefonos,mails,infoExtra,expresos}) =>{
    const classes = content()
    return(
        <Grid container item xs={12} className={classes.containerDetallesCliente} spacing={3} alignItems='flex-start'>
            <Grid item xs={10} md={4}>
                <Paper elevation={6} className={classes.paperCliente}>
                    <Grid container>
                        <Grid item xs={12}>
                            <List className={classes.titleDetallesCard}>
                                <ListItem>
                                    <ListItemIcon><PeopleAlt/></ListItemIcon>
                                    <ListItemText primary="Datos Personales"/>
                                </ListItem>
                            </List>
                            <Divider/>
                        </Grid>
                        <Grid item xs={12}>
                            <List>
                                {!dni && !cuit?
                                    <>
                                        <Grid container item xs={12} justify='center'>
                                            <img src={noData} alt="" height='150px'/>
                                        </Grid>
                                        <Grid container item xs={12} justify='center'>
                                            <Typography variant='overline'>
                                                No hay informacion
                                            </Typography>
                                        </Grid>
                                    </>
                                    :
                                    null
                                }
                                {dni&&
                                    <>
                                        <ListItem>
                                            <ListItemText primary='DNI' secondary={dni?dni:'-'}/>
                                        </ListItem>
                                    </>
                                }
                                {cuit &&
                                    <ListItem>
                                        <ListItemText primary='CUIT' secondary={cuit?cuit:'-'}/>
                                    </ListItem>
                                }
                            </List>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={10} md={4}>
                <Paper elevation={6} className={classes.paperCliente}>
                    <Grid container>
                        <Grid item xs={12}>
                            <List className={classes.titleDetallesCard}>
                                <ListItem>
                                    <ListItemIcon><Room/></ListItemIcon>
                                    <ListItemText primary='Direcciones'/>
                                </ListItem>
                            </List>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            {direcciones?
                                <List>
                                    {direcciones.map(direccion=>(
                                        <ListItem>
                                            <ListItemText primary={`${direccion.calleYnumero}, ${direccion.ciudad}, ${direccion.provincia}, ${direccion.cp}`}/>
                                        </ListItem>
                                    ))}
                                </List>
                                :
                                <>
                                    <Grid container item xs={12} justify='center'>
                                        <img src={noData} alt="" height='150px'/>
                                    </Grid>
                                    <Grid container item xs={12} justify='center'>
                                        <Typography variant='overline'>
                                            No hay informacion
                                        </Typography>
                                    </Grid>
                                </>
                            }
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={10} md={4}>
                <Paper elevation={6} className={classes.paperCliente}>
                    <Grid container>
                        <Grid item xs={12}>
                            <List className={classes.titleDetallesCard}>
                                <ListItem>
                                    <ListItemIcon><Phone/></ListItemIcon>
                                    <ListItemText primary='Telefonos'/>
                                </ListItem>
                            </List>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            {telefonos?
                                <List>
                                    {telefonos.map(telefono=>(
                                        <ListItem>
                                            <ListItemText primary={telefono.numero} secondary={telefono.nombre?telefono.nombre:'-'}/>
                                        </ListItem>
                                    ))}
                                </List>
                                :
                                <>
                                    <Grid container item xs={12} justify='center'>
                                        <img src={noData} alt="" height='150px'/>
                                    </Grid>
                                    <Grid container item xs={12} justify='center'>
                                        <Typography variant='overline'>
                                            No hay informacion
                                        </Typography>
                                    </Grid>
                                </>
                            }
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={10} md={4}>
                <Paper elevation={6} className={classes.paperCliente}>
                    <Grid container>
                        <Grid item xs={12}>
                            <List className={classes.titleDetallesCard}>
                                <ListItem>
                                    <ListItemIcon><Mail/></ListItemIcon>
                                    <ListItemText primary={'Mails'}/>
                                </ListItem>
                            </List>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            {mails?
                                <List>
                                    {mails.map(mail=>(
                                        <ListItem>
                                            <ListItemText primary={mail.mail} secondary={mail.nombre?mail.nombre:'-'}/>
                                        </ListItem>
                                    ))}
                                </List>
                                :
                                <>
                                    <Grid container item xs={12} justify='center'>
                                        <img src={noData} alt="" height='150px'/>
                                    </Grid>
                                    <Grid container item xs={12} justify='center'>
                                        <Typography variant='overline'>
                                            No hay informacion
                                        </Typography>
                                    </Grid>
                                </>
                            }
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={10} md={4}>
                <Paper elevation={6} className={classes.paperCliente}>
                    <Grid container>
                        <Grid item xs={12}>
                            <List className={classes.titleDetallesCard}>
                                <ListItem>
                                    <ListItemIcon><LocalShipping/></ListItemIcon>
                                    <ListItemText primary={'Expresos'}/>
                                </ListItem>
                            </List>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            {expresos?
                                <List>
                                    {expresos.map(expreso=>(
                                        <ListItem>
                                            <Link
                                                style={{color:'#fff',textDecoration:'none'}}
                                                to={{
                                                pathname:'/Expreso',
                                                search:expreso
                                            }}>
                                                <ListItemText primary={expreso}/>
                                            </Link>
                                        </ListItem>
                                    ))}
                                </List>
                                :
                                <>
                                    <Grid container item xs={12} justify='center'>
                                        <img src={noData} alt="" height='150px'/>
                                    </Grid>
                                    <Grid container item xs={12} justify='center'>
                                        <Typography variant='overline'>
                                            No hay informacion
                                        </Typography>
                                    </Grid>
                                </>
                            }
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={10} md={4}>
                <Paper elevation={6} className={classes.paperCliente}>
                    <Grid container>
                        <Grid xs={12}>
                            <List className={classes.titleDetallesCard}>
                                <ListItem>
                                    <ListItemIcon><ContactMail/></ListItemIcon>
                                    <ListItemText primary={'Info Extra'}/>
                                </ListItem>
                            </List>
                            <Divider />
                        </Grid>
                        <Grid xs={12}>
                            {infoExtra?
                                <List>
                                    {infoExtra.map((info,i)=>(
                                        <ListItem>
                                            <ListItemText primary={info}/>
                                        </ListItem>
                                    ))}
                                </List>
                                :
                                <>
                                    <Grid container item xs={12} justify='center'>
                                        <img src={noData} alt="" height='150px'/>
                                    </Grid>
                                    <Grid container item xs={12} justify='center'>
                                        <Typography variant='overline'>
                                            No hay informacion
                                        </Typography>
                                    </Grid>
                                </>
                            }
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
}