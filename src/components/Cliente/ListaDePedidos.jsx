import React,{useState} from 'react'
import {Grid,Card,CardHeader,TableRow,TableHead,TableCell,TableBody,List,ListItem,ListItemText,makeStyles,Paper,IconButton,Menu,MenuItem,Dialog,DialogTitle,DialogContent,DialogActions,Button,Typography} from '@material-ui/core'
import {MoreVert} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {CardPedido} from './CardPedido'
import {content} from '../../Pages/styles/styles'
import Empty from '../../images/Empty.png'
import { monthsList,formatMoney } from '../../utilities'
{/* COMPONENT */}
export const ListaDePedidos = ({pedidos,searchPedido,searchRemito,tipo}) =>{
    const classes = content()
    const [articulos,setArticulos]=useState(undefined)
    const [metodoDePago,setMetodoDePago]=useState(undefined)

    // CONTENT
    return(
        <Grid container justify='center' alignItems='center' spacing={3}>
            {console.log(pedidos)}
            <Grid container item xs={12} justify='center'>
                <Typography variant='h4'>
                    Lista de Pedidos
                </Typography>
            </Grid>
        {/* LIST */}
        
        {pedidos?
            <Grid container xs={12} justify='center' spacing={3}>
                {pedidos.map((indexYear)=>(
                    <>  
                        <Grid container item xs={12} justify='center'>
                            <Card className={classes.CardMonthCheques}>
                                <CardHeader
                                    title={`$ ${formatMoney(indexYear[1].total)}`}
                                    subheader={indexYear[0]}
                                />
                            </Card>
                        </Grid>
                        <Grid container item xs={12} justify='center' spacing={3}>
                            {Object.keys(indexYear[1].months).reverse().map(month=>(
                                <>
                                    <Grid container item xs={12} justify='center'>
                                        <Grid item>
                                            <Paper>
                                                <Card>
                                                    <CardHeader
                                                        title={`$ ${formatMoney(indexYear[1].months[month].total)}`}
                                                        subheader={monthsList[month-1]}
                                                    />
                                                </Card>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                    
                                    {tipo=='pedido'?
                                        Object.keys(indexYear[1].months[month].pedidos).map((keyPedido)=>(
                                            <CardPedido
                                                searchRemito={searchRemito}
                                                searchPedido={searchPedido}
                                                pedido={indexYear[1].months[month].pedidos[keyPedido]}
                                                id={indexYear[1].months[month].pedidos[keyPedido].idPedido}
                                            />
                                        ))
                                        :
                                        Object.keys(indexYear[1].months[month].entregas).map((keyEntrega)=>(
                                            <CardPedido
                                                searchRemito={searchRemito}
                                                searchPedido={searchPedido}
                                                pedido={indexYear[1].months[month].entregas[keyEntrega]}
                                                id={indexYear[1].months[month].entregas[keyEntrega].idEntrega}
                                            />
                                        ))
                                    }
                                </>
                            ))}
                        </Grid>
                    </>
                ))}
            </Grid>
            :
            <>
                <Grid item>
                    <img src={Empty} alt="" height='600px'/>
                </Grid>
                <Grid container item xs={12} justify='center'>
                <Typography variant='h5'>El Cliente No Hizo Ningun Pedido</Typography>
                </Grid>
            </>
        }
        </Grid>
    )
}