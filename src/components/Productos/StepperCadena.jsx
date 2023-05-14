import React from 'react'
import {Stepper, Step, StepLabel} from '@material-ui/core'
import {content} from '../../Pages/styles/styles'
import {Link} from 'react-router-dom'

export const StepperCadena = ({cadenaDeProduccion}) =>{
    const classes = content()

    return(
        <Stepper activeStep={-1} alternativeLabel>
            {cadenaDeProduccion.map((proceso) => (
                <Step key={proceso.proceso}>
                    <StepLabel>
                        {proceso.proceso}
                        <br/>
                        {proceso.proveedor?
                            <Link
                                className={classes.link}
                                style={{color:'#fff',textDecoration:'none'}}
                                to={{
                                    pathname:'/Proveedor',
                                    search:`${proceso.proveedor}`,
                                }}
                            >
                                    {proceso.proveedor}
                            </Link>
                            :
                            "Proceso Propio"
                        }
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    )
}