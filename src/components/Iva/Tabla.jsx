import React, {useState,useEffect} from 'react'
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Button} from '@material-ui/core'
import { formatMoney , getActualMonth } from '../../utilities'
import {content} from '../../Pages/styles/styles'
import {Link} from 'react-router-dom'

export const Tabla = ({data,tipo}) =>{
    const classes = content()
    return(
        <TableContainer component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.titleDetallesCard}>Fecha</TableCell>
                        {tipo=='ventas'?
                            <TableCell className={classes.titleDetallesCard}>Cliente</TableCell>
                            :
                            <TableCell className={classes.titleDetallesCard}>Proveedor</TableCell>
                        }
                        <TableCell className={classes.titleDetallesCard}>Iva</TableCell>
                        <TableCell className={classes.titleDetallesCard}>Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?
                        data.map((keyPedido)=>(
                            <TableRow>
                                <TableCell>{keyPedido.fecha}</TableCell>
                                {tipo=='ventas'?
                                    <TableCell>
                                        <Link
                                            style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                            to={{
                                            pathname:'/cliente',
                                            search:keyPedido.cliente,
                                            props:{
                                                searchPedido:keyPedido.idPedido
                                            }
                                        }}>
                                                {keyPedido.cliente}
                                        </Link>    
                                    </TableCell>
                                    :
                                    keyPedido.consumoFacturado?
                                        <TableCell>{keyPedido.titulo}</TableCell>
                                        :
                                        <TableCell>
                                            <Link
                                                style={{color:'#fff',textDecoration:'none',cursor:'pointer'}}
                                                to={{
                                                pathname:'/proveedor',
                                                search:keyPedido.proveedor,
                                                props:{
                                                    searchEntrega:keyPedido.idEntrega
                                                }
                                            }}>
                                                    {keyPedido.proveedor}
                                            </Link>    
                                        </TableCell>
                                }
                                {keyPedido.consumoFacturado?
                                    <TableCell className={classes.titleDetallesCard}>${formatMoney(keyPedido.totalIva)}</TableCell>
                                    :
                                    keyPedido.metodoDePago.facturacion?
                                        <TableCell className={classes.titleDetallesCard}>${formatMoney(keyPedido.total-(keyPedido.total/1.21))}</TableCell>
                                        :
                                        <TableCell className={classes.titleDetallesCard}>-</TableCell>

                                }
                                <TableCell>${formatMoney(keyPedido.total)}</TableCell>
                            </TableRow>
                        ))
                        :
                        null
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}