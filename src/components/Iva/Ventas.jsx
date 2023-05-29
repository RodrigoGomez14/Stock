import React, {useState,useEffect} from 'react'
import {Grid,makeStyles,Paper,Card,CardHeader,Collapse,CardContent,IconButton,Typography} from '@material-ui/core'
import {Tabla} from './Tabla'
import { formatMoney,monthsList } from '../../utilities'
import { ExpandLess, ExpandMore } from '@material-ui/icons'

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
    },
    CardAnualIva:{
        backgroundColor:theme.palette.primary.dark,
        width:'100%'
    },
    CardMensualIva:{
        backgroundColor:theme.palette.primary.main,
        width:'100%'
    },
    CardContentMensual:{
        backgroundColor:theme.palette.background.default
    }
    
}))
export const Ventas = ({ventas,year}) =>{
    const classes = useStyles()
    const [expanded, setExpanded] = useState(false);

    return(
        <Grid container xs={12} justify='center' spacing={3}>
            <Grid container item xs={12} justify='center'>
                <Typography>Ventas</Typography>
            </Grid>
            <Grid container item xs={12} justify='center'>
                <Card className={classes.CardAnualIva}>
                    <CardHeader
                        title={`$ ${formatMoney(ventas[year][1].totalIva)}`}
                        subheader={ventas[year][0]}
                    />
                </Card>
            </Grid>
            <Grid container item xs={12} justify='center' spacing={3}>
                {Object.keys(ventas[year][1].months).reverse().map(month=>(
                    ventas[year][1].months[month].total!==0?
                        <MesDeVentas month={month} total={ventas[year][1].months[month].totalIva} ventas={ventas[year][1].months[month].ventas}/>
                        :
                        null
                ))}
            </Grid>
        </Grid>
    )
}
const MesDeVentas = ({month,total,ventas}) =>{
    const classes = useStyles()
    const [expanded, setExpanded] = useState(false);

    return(
        <Grid item xs={12}>
            <Card className={classes.CardMensualIva}>
                <CardHeader
                    className={classes.card}
                    title={`$ ${formatMoney(total)}`}
                    subheader={monthsList[month-1]}
                    action={
                        <>
                            <IconButton onClick={()=>{setExpanded(!expanded)}}>
                                {expanded?
                                    <ExpandLess/>
                                    :
                                    <ExpandMore/>
                                }
                            </IconButton>
                        </>
                    }
                />
                <Collapse in={expanded} timeout='auto' unmountOnExit>
                    <CardContent className={classes.CardContentMensual}>
                        <Tabla data={ventas} tipo='ventas'/>
                    </CardContent>
                </Collapse>
            </Card>
        </Grid>
    )
}
