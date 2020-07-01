import React from 'react'
import {Grid, Paper, Typography, makeStyles,Card,CardContent,CardTitle,CardActions,Button} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {formatMoney} from '../../utilities'
const useStyles = makeStyles(theme=>({
    card:{
        height:'150px',
        width:'300px',
    },
    success:{
        backgroundColor:theme.palette.success.main
    },
    danger:{
        backgroundColor:theme.palette.danger.main
    },
    flex:{
        flex:1
    }
}))
export const Deuda = ({deuda,id}) =>{
    const classes= useStyles()
    return(
        <Grid item>
            <Card className={classes.card,deuda>0?classes.danger:classes.success}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Balance
                    </Typography>
                    <Typography variant="h4" component="h2">
                        $ {formatMoney(deuda)}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Link to={{
                        pathname:'/Historial',
                        search:id,
                        props:{
                            tipo:'clientes'
                        }
                    }}>
                        <Button size='small'>
                            Ver historial de pagos
                        </Button>
                    </Link>
                </CardActions>
            </Card>
        </Grid>
    )
}