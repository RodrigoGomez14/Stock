import React from 'react'
import {Stepper, Step, StepLabel,Grid,List,ListItem,ListItemText,ListItemSecondaryAction,IconButton,Paper, Card, CardHeader} from '@material-ui/core'
import {Edit,Delete} from '@material-ui/icons'
import {content} from '../../Pages/styles/styles'

export const StepperNuevoProducto = ({cadenaDeProduccion,seteditIndex,setshowDialog,setshowDialogDelete,setdeleteIndex}) =>{
    const classes = content()

    return(
        <Stepper activeStep={-1} alternativeLabel>
            {cadenaDeProduccion.map((proceso,i) => (
                <Step key={proceso.proceso}>
                    <StepLabel>
                        <Grid container xs={12} justify='center'>
                            <Grid container item xs={12} justify='center'>
                                <Card className={classes.cardHeaderStep}>
                                    <CardHeader 
                                        title={proceso.proceso}
                                        subheader={proceso.proveedor?proceso.proveedor:null}
                                        action={
                                            <>
                                                <IconButton onClick={()=>{
                                                    seteditIndex(i)
                                                    setshowDialog(true)
                                                }}>
                                                    <Edit/>
                                                </IconButton>
                                                <IconButton onClick={()=>{
                                                    setdeleteIndex(i)
                                                    setshowDialogDelete(true)
                                                }}>
                                                    <Delete/>
                                                </IconButton>
                                            </>
                                        }
                                        />
                                </Card>
                            </Grid>
                        </Grid>
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    )
}