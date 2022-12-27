import React,{useState} from 'react'
import {Grid,Card,CardHeader,CardContent,Collapse,Stepper,Step,StepLabel,IconButton,List,ListItemText,ListItem} from '@material-ui/core'
import {ExpandMore,ExpandLess} from '@material-ui/icons'
import {Alert} from '@material-ui/lab'
import {content} from '../../Pages/styles/styles'
import { formatMoney } from '../../utilities'


export const Cadena = ({cadena}) =>{
    const classes = content()
    
    const [expanded,setExpanded] = useState(false)
    const [expandedStep,setExpandedStep] = useState(false)

    //STEPPER NAVIGATION
    const getStep = () =>{
        let index = 0
        cadena.procesos.map((proceso,i)=>{
            if(proceso.fechaDeEntrega){
                index=i+1
            }
        })
        return index
    }

    return(
        <Grid container item xs={12}>
            <Card className={classes.cardCadena}>
                <CardHeader 
                    title={cadena.producto} subheader={cadena.cantidad} className={classes.cardHeaderCadena}
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
                        <Stepper activeStep={getStep()} alternativeLabel>
                            {cadena.procesos.map((proceso) => (
                                <Step key={proceso.proceso}>
                                    <StepLabel>
                                        <Grid container xs={12}>
                                            <Grid container item xs={12} justify='center'>
                                                <Card className={classes.cardCadenaStep}>
                                                    <CardHeader 
                                                        title={proceso.proceso} subheader={proceso.cantidad} className={proceso.fechaDeEntrega?classes.cardHeaderCadenaStepGreen:classes.cardHeaderCadenaStep}
                                                        action={
                                                            <IconButton onClick={()=>{setExpandedStep(!expandedStep)}}>
                                                                {expandedStep?
                                                                    <ExpandLess/>
                                                                    :
                                                                    <ExpandMore/>
                                                                }
                                                            </IconButton>
                                                        }    
                                                    />
                                                    <Collapse in={expandedStep} timeout='auto' unmountOnExit>
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
                                                                            <ListItemText primary={proceso.fechaDeInicio} secondary='Fecha de Inicio'/>
                                                                        </ListItem>
                                                                        <ListItem>
                                                                            <ListItemText primary={`$ ${formatMoney(proceso.precio)}`} secondary='Precio Acordado'/>
                                                                        </ListItem>
                                                                        <ListItem>
                                                                            <ListItemText primary={proceso.proveedor} secondary='Proveedor Asociado'/>
                                                                        </ListItem>
                                                                    </List>

                                                                </Grid>
                                                            </Grid>
                                                        </CardContent>
                                                    </Collapse>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </CardContent>
                </Collapse>
            </Card>
        </Grid>
    )
}