import React from 'react'
import {Grid,Table,TableContainer,TableRow,TableHead,TableCell,TableBody,List,ListItem,ListItemText,makeStyles,Paper,IconButton,Menu,MenuItem,Dialog,DialogTitle,DialogContent,DialogActions,Button} from '@material-ui/core'
import {MoreVert} from '@material-ui/icons'
const useStyles = makeStyles(theme=>({
    alignRight:{
        textAlign:'right'
    },
    lista:{
        maxHeight:'calc(100vh - 100px)',
        overflowY:'scroll',
        marginTop:theme.spacing(1)
    },

    tableContainer:{
        height:'calc(100vh - 300px)'
    }
}))
export const ListaDePedidos = (pedidos) =>{
    const classes = useStyles()
    const [articulos,setArticulos]=useState(undefined)

    return(
        <Grid item xs={12} >
            {articulos &&
                <Dialog open={articulos}>
                    <DialogTitle>
                        Articulos del pedido
                    </DialogTitle>
                    <DialogContent>
                        <List>
                            {articulos.map(articulo=>(
                                <ListItem>
                                    <ListItemText className={classes.alignRight} primary={articulo.nombre} secondary={articulo.cantidad}/>
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
            <Paper elevation={3} className={classes.lista}>
                <TableContainer>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Fecha
                                </TableCell>
                                <TableCell align='left'>
                                    Valor
                                </TableCell>
                                <TableCell align='left'>
                                    Metodo De Pago
                                </TableCell>
                                <TableCell align='right'>
                                    Articulos
                                </TableCell>
                                <TableCell  padding='checkbox' align='right'>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(pedidos).map(key=>(
                                Object.keys(pedidos[key]).map(pedido=>(
                                    <TableRow> 
                                        <TableCell>
                                            {pedidos[key][pedido].fecha}
                                        </TableCell>
                                        <TableCell>
                                            {pedidos[key][pedido].valor?
                                                pedidos[key][pedido].valor
                                                :
                                                '$ -'
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {pedidos[key][pedido].metodoDePago?
                                                pedidos[key][pedido].metodoDePago
                                                :
                                                '-'
                                            }
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Button variant='text' onClick={()=>{setArticulos(pedidos[key][pedido].articulos)}}>
                                                Ver Articulos
                                            </Button>
                                        </TableCell>
                                        <TableCell padding='checkbox' align='right'>
                                            <IconButton>
                                                <MoreVert/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Grid>
    )
}