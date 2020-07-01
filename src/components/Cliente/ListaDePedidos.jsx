import React,{useState} from 'react'
import {Grid,Table,TableContainer,TableRow,TableHead,TableCell,TableBody,List,ListItem,ListItemText,makeStyles,Paper,IconButton,Menu,MenuItem,Dialog,DialogTitle,DialogContent,DialogActions,Button} from '@material-ui/core'
import {MoreVert} from '@material-ui/icons'
import {Link} from 'react-router-dom'
import {formatMoney} from '../../utilities'
const useStyles = makeStyles(theme=>({
    alignRight:{
        textAlign:'right'
    },
    lista:{
        overflowY:'scroll',
        marginTop:theme.spacing(1)
    },
    tableContainer:{
        height:'calc(100vh - 350px)'
    },
    link:{
        textDecoration:'none',
        color:theme.palette.primary.contrastText
    },
    deleteButton:{
        color:theme.palette.error.main
    },
    textAlignRight:{
        textAlign:'right'
    }
}))
const MenuPedido = ({articulos,setArticulos,metodoDePago,setMetodoDePago,pedidos,pedido,eliminarPedido}) =>{
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState(null);


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return(
        <>  
            <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVert/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >  
                <MenuItem onClick={()=>{setArticulos(pedidos[pedido].articulos)}}>Ver Articulos</MenuItem>
                {pedidos[pedido].metodoDePago &&
                    <MenuItem onClick={()=>{setMetodoDePago(pedidos[pedido].metodoDePago)}}>Ver Metodo de Pago</MenuItem>
                }
                <MenuItem disabled>Editar</MenuItem>
            </Menu>
        </>
    )
}
export const ListaDePedidos = ({pedidos,eliminarPedido}) =>{
    const classes = useStyles()
    const [articulos,setArticulos]=useState(undefined)
    const [metodoDePago,setMetodoDePago]=useState(undefined)
    const formatMoney =amount=> {
        let decimalCount = 2
        let decimal = ','
        let thousands = '.'
        try {
          decimalCount = Math.abs(decimalCount);
          decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      
          const negativeSign = amount < 0 ? "-" : "";
      
          let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
          let j = (i.length > 3) ? i.length % 3 : 0;
            
          return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } 
        catch (e) {
          console.log(e)
        }
    };
    return(
        <>  
                {articulos &&
                    <Dialog open={articulos}>
                        <DialogTitle>
                            Articulos del pedido
                        </DialogTitle>
                        <DialogContent>
                            <List>
                                {articulos.map(articulo=>(
                                    <ListItem>
                                        <ListItemText className={classes.alignRight} primary={articulo.producto} secondary={articulo.cantidad}/>
                                    </ListItem>
                                ))}
                            </List>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=>{setArticulos(undefined)}}>
                                Volver
                            </Button>
                        </DialogActions>
                    </Dialog>
                }
                {metodoDePago &&
                    <Dialog open={metodoDePago}>
                    <DialogTitle>
                        Metodo De Pago
                    </DialogTitle>
                    <DialogContent>
                        <List>
                            <ListItem>
                                <ListItemText primary='Efectivo' secondary={metodoDePago.efectivo?`$ ${formatMoney(metodoDePago.efectivo)}`:'-'}/>
                            </ListItem>
                            {console.log(metodoDePago)}
                            {metodoDePago.cheques &&
                                <>
                                    <ListItem>
                                        <ListItemText primary='Cheques'/>
                                    </ListItem>
                                    {metodoDePago.cheques.map(cheque=>(
                                        <Link to={{
                                            pathname:'/Cheques',
                                            search:cheque
                                        }}>
                                            <ListItem>
                                                <ListItemText secondary={cheque}/>
                                            </ListItem>
                                        </Link>
                                    ))}
                                </>
                            }
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>{setMetodoDePago(undefined)}}>
                            Volver
                        </Button>
                    </DialogActions>
                </Dialog>
                
            }
            <Paper elevation={3} className={classes.lista}>
                <TableContainer className={classes.tableContainer}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Fecha
                                </TableCell>
                                <TableCell align='right'>
                                    Valor
                                </TableCell>
                                <TableCell align='right'>
                                    Metodo De Envio
                                </TableCell>
                                <TableCell  padding='checkbox' align='right'>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                {Object.keys(pedidos).reverse().map(pedido=>(
                                    <TableRow> 
                                        <TableCell>
                                            {pedidos[pedido].fecha}
                                        </TableCell>
                                        <TableCell align='right'>
                                            {pedidos[pedido].total?
                                                `$ ${formatMoney(pedidos[pedido].total)}`
                                                :
                                                '$ -'
                                            }
                                        </TableCell>
                                        <TableCell align='right'>
                                            <List>
                                                {pedidos[pedido].metodoDeEnvio === 'Particular'?
                                                    <ListItem>
                                                        <ListItemText className={classes.textAlignRight} primary='Particular'/>
                                                    </ListItem>
                                                    :
                                                    <ListItem>
                                                        <ListItemText className={classes.textAlignRight} primary={<Link className={classes.link} to={{pathname:'/Expreso',search:pedidos[pedido].metodoDeEnvio.expreso}}>{pedidos[pedido].metodoDeEnvio.expreso}</Link>} secondary={`${pedidos[pedido].metodoDeEnvio.remito} / $ ${formatMoney(pedidos[pedido].metodoDeEnvio.precio)}`}/>
                                                    </ListItem>
                                                }
                                            </List>
                                        </TableCell>
                                        <TableCell padding='checkbox' align='right'>
                                            <MenuPedido articulos={articulos} setArticulos={setArticulos} metodoDePago={metodoDePago} setMetodoDePago={setMetodoDePago} pedidos={pedidos} pedido={pedido} eliminarPedido={eliminarPedido}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    )
}