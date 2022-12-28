import React,{useState} from 'react'
import {Grid,Card,CardHeader,CardContent,Collapse,CardActions,Button,ListItemIcon,StepLabel,IconButton,List,ListItemText,ListItem} from '@material-ui/core'
import {ExpandMore,ExpandLess,Edit} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {Alert} from '@material-ui/lab'
import {content} from '../../Pages/styles/styles'
import { formatMoney } from '../../utilities'


export const CardStep = ({proceso,id,activeStep,iniciarProceso,index}) =>{
    const classes = content()
    
    const [expanded,setExpanded] = useState(false)

    return(
        <Card className={classes.cardCadenaStep}>
            <CardHeader 
                title={proceso.proceso} subheader={proceso.fechaDeInicio} className={proceso.fechaDeEntrega?classes.cardHeaderCadenaStepGreen:(proceso.fechaDeInicio?classes.cardHeaderCadenaStepActive:null)}
                action={
                    <IconButton onClick={()=>{setExpanded(!expanded)}}>
                        {expanded?
                            <ExpandLess/>
                            :
                            <ExpandMore/>
                        }
                    </IconButton>
                }    
            />
            <Collapse in={expanded} timeout='auto' unmountOnExit>
                {(activeStep()==index) && !proceso.fechaDeInicio?
                    <CardActions>
                        <Grid container item xs={12} justify='center'>
                            <Grid item>
                                <Button color='primary' variant='contained' onClick={()=>{iniciarProceso(id,activeStep())}}> Iniciar Proceso</Button>
                            </Grid>
                        </Grid>
                    </CardActions>
                    :
                    null
                }
                {(activeStep()==index) && proceso.fechaDeInicio?
                    <CardActions>
                        <Grid container item xs={12} justify='center'>
                            <Grid item>
                                <Link 
                                    style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                    to={{pathname:'/Finalizar-Proceso',search:`${id}`}
                                }>
                                    <Button color='primary' variant='contained'> Finalizar Proceso</Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </CardActions>
                    :
                    null
                }
                <CardContent>
                    <Grid container xs={12}>
                        {proceso.fechaDeEntrega?
                            <Grid container item xs={12} justify='center'>
                                <Alert variant="filled" severity="success" className={classes.alertCheque}>
                                    retirado el {proceso.fechaDeEntrega}
                                </Alert>
                            </Grid>
                            :
                            null
                        }
                        <Grid container item xs={12} justify='flex-start'>
                            <List>
                                {proceso.precio?
                                    <ListItem>
                                        <ListItemText primary={`$ ${formatMoney(proceso.precio)}`} secondary='Precio Acordado'/>
                                    </ListItem>
                                    :
                                    null
                                }
                                <ListItem>
                                    <ListItemText 
                                        primary={
                                            <Link 
                                                style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                                to={{pathname:'/Proveedor',search:`${proceso.proveedor}`}
                                            }>
                                                {proceso.proveedor} 
                                            </Link>
                                        } 
                                        secondary='Proveedor Asociado'/>
                                </ListItem>
                                {proceso.idEntrega?
                                    <ListItem>
                                        <Link 
                                                style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                                to={{pathname:'/Proveedor',search:`${proceso.proveedor}`,props:{searchEntrega:`${proceso.idEntrega}`}}
                                            }>
                                            <ListItemText button primary='Ver Entrega' />
                                        </Link>
                                    </ListItem>
                                    :
                                    null
                                }
                            </List>

                        </Grid>
                    </Grid>
                </CardContent>
            </Collapse>
        </Card>
    )
}





