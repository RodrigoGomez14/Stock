import React from 'react'
import {Grid, Paper, Typography, makeStyles,Card,CardContent,CardTitle,CardActions,Button} from '@material-ui/core'
import {AttachMoney} from '@material-ui/icons'
import {Link} from 'react-router-dom'


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
            <Card className={classes.card,deuda?classes.success:classes.danger}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Balance
                    </Typography>
                    <div className={classes.flex}>
                        <Typography variant="h4" component="h2">
                            $ {deuda}
                        </Typography>
                    </div>
                    <Link to={{
                        pathname:'/Historial',
                        search:id,
                        props:{
                            tipo:'proveedores'
                        }
                    }}>
                        <Button size='small'>
                            Ver historial de pagos
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </Grid>
    )
}