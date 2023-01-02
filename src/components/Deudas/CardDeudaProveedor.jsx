import React from 'react'
import {makeStyles,CardHeader,Button,Card,CardContent,Typography,TextField,CardActions,Grid,Chip,IconButton,Link as LinkComponent} from '@material-ui/core'
import {AttachMoney,History,Add} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

// COMPONENT
const CardDeudaProveedor=({nombre,search,deuda})=>{
    const classes = content()

    return(
        <Grid item xs={8} sm={6} md={4} lg={3} className={!search?null:nombre.toLowerCase().search(search.toLowerCase()) == -1 ? classes.displayNone:classes.display}>
            <Card className={classes.cardCliente}>
                <CardHeader 
                    title={
                        <Link 
                            style={{color:"#fff",textDecoration:'none'}}
                            to={{
                            pathname:'/Proveedor',
                            search:nombre
                        }}>
                            <Typography variant="h5">
                                {nombre}
                            </Typography>
                        </Link>
                    }
                    action={
                        <>
                            <Link 
                                style={{color:"#fff",textDecoration:'none'}}
                                to={{
                                    pathname:'/Historial-Proveedor',
                                    search:nombre,
                            }}>
                                <IconButton aria-label="settings">
                                    <History/>
                                </IconButton>
                            </Link>
                            <Link 
                            style={{color:"#fff",textDecoration:'none'}}
                            to={{
                                pathname:'/Nuevo-Pago-Proveedor',
                                search:nombre,
                        }}>
                            <IconButton aria-label="settings">
                                <Add/>
                            </IconButton>
                        </Link>
                        </>
                    }
                />
                <CardContent>
                <Grid container item xs={12} justify='center'>
                    <Chip
                        className={deuda>0?classes.chipCardDangerCliente:classes.chipCardSuccessCliente}
                        variant="outlined"
                        icon={<AttachMoney/>}
                        label={formatMoney(deuda>=0?deuda:-deuda)}
                    />
                </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}
export default CardDeudaProveedor