import React,{useState} from 'react'
import {Grid,Card,CardHeader,TableRow,TableHead,TableCell,TableBody,List,ListItem,ListItemText,makeStyles,Paper,IconButton,Menu,MenuItem,Dialog,DialogTitle,DialogContent,DialogActions,Button,Typography} from '@material-ui/core'
import {MoreVert} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {CardPedido} from './CardPedido'
import {content} from '../../Pages/styles/styles'

{/* COMPONENT */}
export const ListaDePedidos = ({pedidos,eliminarPedido}) =>{
    const classes = content()
    const [articulos,setArticulos]=useState(undefined)
    const [metodoDePago,setMetodoDePago]=useState(undefined)

    // CONTENT
    return(
        <Grid container justify='center' alignItems='center' spacing={3}>
        {pedidos?
                <>
                    <Grid container item xs={12} justify='center'>
                        <Typography variant='h4'>
                            Lista de Pedidos
                        </Typography>
                    </Grid>

                    {/* LIST */}
                    <Grid container item xs={12} justify='center' spacing= {3}>
                        {Object.keys(pedidos).reverse().map(pedido=>(
                            <CardPedido
                                pedido={pedidos[pedido]}
                                id={pedido}
                                
                            />
                        ))}
                    </Grid>
                </>
                :
                <Grid container item xs={12} justify='center'>
                    <Typography className={classes.textWhite} variant='h6'>
                        El cliente no hizo ningun pedido
                    </Typography>
                </Grid>
            }
        </Grid>
    )
}