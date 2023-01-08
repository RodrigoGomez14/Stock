import React from 'react'
import {Grid, Paper, Typography,Card,CardContent,CardTitle,CardActions,Button, IconButton,CardHeader} from '@material-ui/core'
import {History,Add} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

export const Deuda = ({deuda,id,generateChartDeudas}) =>{
    const classes= content()
    return(
        <Card className={deuda>0?classes.cardDeudaRed:classes.cardDeudaGreen}>
            <CardHeader
                title={`$ ${formatMoney(deuda>=0?deuda:-deuda)}`}
                subheader='Balance - Ultimos 6 Meses'
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
            <CardContent>
                {generateChartDeudas()}
            </CardContent>
        </Card>
    )
}