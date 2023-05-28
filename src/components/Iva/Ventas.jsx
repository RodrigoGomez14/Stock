import React, {useState,useEffect} from 'react'
import {Grid,makeStyles,Paper,Card,CardHeader,ListItem,ListItemText} from '@material-ui/core'
import {Tabla} from './Tabla'
import { formatMoney,monthsList } from '../../utilities'

const useStyles = makeStyles(theme=>({
    card:{
        minHeight:'180px',
    },
    displayNone:{
        display:'none'
    },
    display:{
        display:'block'
    },
    header:{
        '& .MuiTypography-h5':{
            fontSize:'1.3rem'
        }
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    deleteButton:{
        color:theme.palette.error.main
    },
    paper:{
        overflow:'auto'
    }
}))
export const Ventas = ({ventas}) =>{
    const classes = useStyles()
    return(
        <Paper className={classes.paper}>
            <Grid container xs={12} justify='center' spacing={3}>
                <Grid container item xs={12} justify='center'>
                    <Card className={classes.CardMonthCheques}>
                        <CardHeader
                            title={`$ ${formatMoney(ventas[0][1].totalIva)}`}
                            subheader={ventas[0][0]}
                        />
                    </Card>
                </Grid>
                <Grid container item xs={12} justify='center' spacing={3}>
                    {Object.keys(ventas[0][1].months).reverse().map(month=>(
                        <>
                            {ventas[0][1].months[month].total!==0?
                                <Grid container item xs={12} justify='center'>
                                    <Grid item>
                                        <Paper>
                                            <Card>
                                                <CardHeader
                                                    title={`$ ${formatMoney(ventas[0][1].months[month].totalIva)}`}
                                                    subheader={monthsList[month-1]}
                                                />
                                            </Card>
                                        </Paper>
                                    </Grid>
                                    <Grid container item xs={12}>
                                        <Tabla data={ventas[0][1].months[month].ventas} tipo='ventas'/>
                                    </Grid>
                                </Grid>
                                :
                                null
                            }
                        </>
                    ))}
                </Grid>
            </Grid>
        </Paper>
    )
}
