import React, {useState,useEffect} from 'react'
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper} from '@material-ui/core'
import { formatMoney } from '../../utilities'

export const Tabla = ({data,ventas}) =>{
    const [total, setTotal]= useState(0)
    const [iva, setIva]= useState(0)
    const calcularTotal =() =>{
        let i =0
        Object.keys(data).map(item=>{
            i+=data[item].total
        })
        setTotal(i)
    }
    const calcularIva =() =>{
        let i =0
        Object.keys(data).map(item=>{
            i+=data[item].iva
        })
        setIva(i)
    }
    useEffect(()=>{
        if(data){
            calcularTotal()
            calcularIva()
        }
    },)
    return(
        <TableContainer component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Fecha</TableCell>
                        {ventas?
                        <TableCell>Id Compra</TableCell>
                        :
                        <TableCell>Categoria</TableCell>
                        }
                        <TableCell>Iva</TableCell>
                        <TableCell>Total</TableCell>
                    </TableRow>
                    <TableRow key='0'>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>${formatMoney(iva)}</TableCell>
                        <TableCell>${formatMoney(total)}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?
                        Object.keys(data).reverse().map((row)=>(
                            <TableRow key={data[row].id}>
                                <TableCell>{data[row].fecha}</TableCell>
                                {ventas?
                                <TableCell>Id compra</TableCell>
                                :
                                <TableCell>{data[row].categoria}</TableCell>
                                }
                                <TableCell>${formatMoney(data[row].iva)}</TableCell>
                                <TableCell>${formatMoney(data[row].total)}</TableCell>
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