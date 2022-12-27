import React,{useState} from 'react'
import {Grid,Card,CardHeader,CardContent,Collapse,CardActions,Button,Step,StepLabel,IconButton,List,ListItemText,ListItem} from '@material-ui/core'
import {ExpandMore,ExpandLess} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {Alert} from '@material-ui/lab'
import {content} from '../../Pages/styles/styles'
import { formatMoney } from '../../utilities'


export const CardStep = ({proceso}) =>{
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
                <CardContent>
                    <Grid container xs={12}>
                        {proceso.fechaDeEntrega?
                            <Grid container item xs={12} justify='center'>
                                <Alert variant="filled" severity="success" className={classes.alertCheque}>
                                    La mercaderia fue retirada el {proceso.fechaDeEntrega}
                                </Alert>
                            </Grid>
                            :
                            null
                        }
                        <Grid container item xs={12} justify='flex-start'>
                            <List>
                                <ListItem>
                                    <ListItemText primary={`$ ${formatMoney(proceso.precio)}`} secondary='Precio Acordado'/>
                                </ListItem>
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
                            </List>

                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid container item xs={12} justify='center'>
                        <Grid item>
                            <Link
                                className={classes.link}
                                style={{color:'#fff',textDecoration:'none'}}
                                to={{
                                    pathname:'/Finalizar-Proceso',
                                }}
                            >
                                <Button variant='outlined'> Finalizar Proceso</Button>
                            </Link>
                        </Grid>
                    </Grid>
                </CardActions>
            </Collapse>
        </Card>
    )
}





