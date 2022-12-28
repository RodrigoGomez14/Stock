import React, {useState} from 'react'
import {Grid,Card,CardContent,Chip,CardHeader,Collapse, List,ListItem, ListItemText,Select,Input, CardActions, Divider, IconButton} from '@material-ui/core'
import {ExpandLess,ExpandMore} from '@material-ui/icons'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

export const ProductoCardPedido = ({producto}) =>{
    const classes = content()
    const [expanded,setExpanded]=useState(false)

    const getPrecioAnterior = () =>{
        if(producto.discount){
            return (producto.precio/(1-(producto.discount/100)))
        }
        else{
            return (producto.precio/(1+(producto.increase/100)))
        }
    }
    const getPriceDiference = () =>{
        console.log(getPrecioAnterior(),producto.precio)
            return formatMoney(producto.precio-getPrecioAnterior())
    }
    
    return(
        <Grid container item xs={12}>
            <Card style={{width:'100%'}}>
                <CardHeader 
                    className={classes.titleDetallesCard}
                    title={`${producto.cantidad} - ${producto.producto}`}
                    action={
                        producto.discount || producto.increase?
                            <IconButton onClick={()=>{setExpanded(!expanded)}}>{expanded?<ExpandLess/>:<ExpandMore/>}</IconButton>
                            :
                            null
                    }
                    subheader={`$ ${formatMoney(producto.precio*producto.cantidad)} ($${formatMoney(producto.precio)} c/u)`}
                />
                {producto.discount || producto.increase?
                    <Collapse in={expanded} timeout='auto' unmountOnExit>
                        <CardContent>
                            <List>
                                <ListItem>
                                    <ListItemText primary={`$ ${(formatMoney(getPrecioAnterior()))}`} secondary={`Precio Anterior `}/>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={`$ ${getPriceDiference()}`} secondary='$ Modificado'/>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={producto.discount?`- ${producto.discount}%`:`+ ${producto.increase}%`} secondary='% modificado'/>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Collapse>
                    :
                    null
                }
            </Card>
        </Grid>
    )
}