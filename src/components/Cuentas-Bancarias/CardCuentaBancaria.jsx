import React,{useState} from 'react'
import {CardHeader,Paper,ListItem,Card,CardContent,Typography,TextField,List,Grid,Chip,IconButton,Link as LinkComponent} from '@material-ui/core'
import {content} from '../../Pages/styles/styles'
// COMPONENT
const CardCuentaBancaria=({cuenta,active})=>{
    const classes = content()
    
    return(
        <Grid item>
            <Card className={active?classes.activeBankAccountCard:classes.disabledBankAccountCard}>
                <CardHeader
                    title={cuenta}
                />
            </Card>
        </Grid>
    )
}
export default CardCuentaBancaria
