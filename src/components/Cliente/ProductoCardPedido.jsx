import React, {useState} from 'react'
import {Grid,Card,CardContent,Menu,CardHeader,Collapse, List,ListItem, ListItemText,MenuItem,Input, CardActions, Divider, IconButton} from '@material-ui/core'
import {ExpandLess,ExpandMore,MoreVert} from '@material-ui/icons'
import {formatMoney} from '../../utilities'
import {content} from '../../Pages/styles/styles'

export const ProductoCardPedido = ({producto,factura}) =>{
    const classes = content()
    const [expanded,setExpanded]=useState(false)
    const [facturacion,setFacturacion] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);

    const getPrecioAnterior = () =>{
        if(producto.discount){
            if(facturacion){
                let aux = producto.precio/1.21
                console.log(aux/(1-(producto.discount/100)))
                return (aux/(1-(producto.discount/100)))
            }
            else{
                return (producto.precio/(1-(producto.discount/100)))
            }
        }
        else{
            if(facturacion){
                let aux = producto.precio/1.21
                console.log(aux/(1+(producto.increase/100)))
                return (aux/(1+(producto.increase/100)))
            }
            else{
                return (producto.precio/(1+(producto.increase/100)))
            }
        }
    }
    const getPriceDiference = () =>{
            return formatMoney(getPrecioAnterior()*(producto.discount?producto.discount:producto.increase)/100)
    }
     //Menu More
     const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return(
        <Grid container item xs={12}>
            <Card style={{width:'100%'}}>
                <CardHeader 
                    className={classes.titleDetallesCard}
                    title={`${producto.cantidad} - ${producto.producto}`}
                    action={
                        <>
                        {producto.discount || producto.increase?
                            <IconButton onClick={()=>{setExpanded(!expanded)}}>{expanded?<ExpandLess/>:<ExpandMore/>}</IconButton>
                            :
                            null
                        }
                        {factura?
                            <>
                                <IconButton aria-label="settings" onClick={handleClick}>
                                    <MoreVert/>
                                </IconButton>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={()=>{setFacturacion(!facturacion)}}>{!facturacion?'Ver Sin IVA':'Ver Con IVA'}</MenuItem>
                                </Menu>
                            </>
                            :
                            null
                        }
                        </>
                    }
                    subheader={`$ ${formatMoney((producto.precio*producto.cantidad)/(factura?(facturacion?1.21:1):1))} ($${formatMoney((producto.precio)/(factura?(facturacion?1.21:1):1))} c/u)`}
                />
                {producto.discount || producto.increase?
                    <Collapse in={expanded} timeout='auto' unmountOnExit>
                        <CardContent>
                            <List>
                                <ListItem>
                                    <ListItemText primary={`$ ${(formatMoney(getPrecioAnterior()))}`} secondary={`Precio Anterior `}/>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={`$ ${producto.discount?'-':'+'}${getPriceDiference()}`} secondary='$ Modificado'/>
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