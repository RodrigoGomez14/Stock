import React,{useState} from 'react'
import {Grid,Card,CardHeader,TableRow,TableHead,TableCell,TableBody,List,ListItem,ListItemText,makeStyles,Paper,IconButton,Menu,MenuItem,Dialog,DialogTitle,DialogContent,DialogActions,Button,Typography} from '@material-ui/core'
import {MoreVert} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {CardPedido} from './CardPedido'
import {content} from '../../Pages/styles/styles'
import Empty from '../../images/Empty.png'
{/* COMPONENT */}
export const ListaDePedidos = ({pedidos,searchPedido}) =>{
    const classes = content()
    const [articulos,setArticulos]=useState(undefined)
    const [metodoDePago,setMetodoDePago]=useState(undefined)

    // CONTENT
    return(
        <Grid container justify='center' alignItems='center' spacing={3}>
            <Grid container item xs={12} justify='center'>
                <Typography variant='h4'>
                    Lista de Pedidos
                </Typography>
            </Grid>
        {/* LIST */}
        {pedidos?
                <Grid container item xs={12} justify='center' spacing= {3} >
                    {Object.keys(pedidos).reverse().map(pedido=>(
                        <>
                            {console.log(searchPedido,pedido)}
                            <CardPedido
                                searchPedido={searchPedido}
                                pedido={pedidos[pedido]}
                                id={pedido}
                                
                            />
                        </>
                    ))}
                </Grid>
                :
                <Grid container xs={12} justify='center' spacing={2}>
                    <Grid item>
                        <img src={Empty} alt="" height='600px'/>
                    </Grid>
                    <Grid container item xs={12} justify='center'>
                        <Typography variant='h5'>El Cliente No Hizo Ningun Pedido</Typography>
                    </Grid>
                </Grid>
            }
        </Grid>
    )
}