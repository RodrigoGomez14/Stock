import React from 'react'
import {Grid, Paper, Typography,Card,CardContent,CardTitle,CardActions,Button, IconButton,CardHeader} from '@material-ui/core'
import {History,Add} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

export const Deuda = ({deuda,id}) =>{
    const classes= content()
    return(
        <Grid container item xs={12} justify='center'>
            <Card className={deuda>0?classes.cardDeudaRed:classes.cardDeudaGreen}>
                <CardHeader
                    title={
                        <>
                            <Typography variant="h5" component="h2">
                                Balance
                            </Typography>
                            <Typography variant="h4" component="h2">
                                $ {formatMoney(deuda>=0?deuda:-deuda)}
                            </Typography>
                        </>
                    }
                    action={
                        <>
                            <Link to={{
                                pathname:'/Historial-Cliente',
                                search:id,
                                props:{
                                    tipo:'clientes'
                                }
                            }}>
                                <IconButton size='small'>
                                    <History/>
                                </IconButton>
                            </Link>
                            <Link to={{
                                pathname:'/Nuevo-Pago-Cliente',
                                search:id,
                            }}>
                                <IconButton size='small'>
                                    <Add/>
                                </IconButton>
                            </Link>
                        </>
                    }
                />
            </Card>
        </Grid>
    )
}