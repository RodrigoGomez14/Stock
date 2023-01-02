import React from 'react'
import {Stepper, Step, StepLabel} from '@material-ui/core'
import {content} from '../../Pages/styles/styles'

export const StepperCadena = ({cadenaDeProduccion}) =>{
    const classes = content()

    return(
        <Stepper activeStep={-1} alternativeLabel>
            {cadenaDeProduccion.map((proceso) => (
                <Step key={proceso.proceso}>
                    <StepLabel>
                        {proceso.proceso}<br/>{proceso.proveedor?proceso.proveedor:null}</StepLabel>
                </Step>
            ))}
        </Stepper>
    )
}