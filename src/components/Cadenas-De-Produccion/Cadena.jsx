import React,{useState} from 'react'
import {Grid,Card,CardHeader,CardContent,Collapse,Stepper,Step,StepLabel,IconButton,List,ListItemText,ListItem} from '@material-ui/core'
import {ExpandMore,ExpandLess} from '@material-ui/icons'
import {CardStep} from './CardStep'
import {Link} from 'react-router-dom'
import {Alert} from '@material-ui/lab'
import {content} from '../../Pages/styles/styles'
import { checkSearch } from '../../utilities'


export const Cadena = ({cadena,id,iniciarProceso,generateChartCadena}) =>{
    const classes = content()
    
    const [expanded,setExpanded] = useState(false)

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
                    title={
                        <Link 
                            style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                            to={{pathname:'/Productos',search:`${checkSearch('-'+cadena.producto)}`}
                        }>
                            {cadena.producto}
                        </Link>
                    } subheader={`${cadena.cantidad?`${cadena.cantidad} u. -`:''} ${cadena.fechaDeInicio}`} className={classes.cardHeaderCadena}
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
                        {generateChartCadena(id)}
                        <Stepper activeStep={getStep()} alternativeLabel>
                            {cadena.procesos.map((proceso,i) => (
                                <Step key={proceso.proceso}>
                                    <StepLabel>
                                        <Grid container xs={12}>
                                            <Grid container item xs={12} justify='center'>
                                                <CardStep proceso={proceso} id={id} iniciarProceso={iniciarProceso} index={i} activeStep={getStep}/>
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