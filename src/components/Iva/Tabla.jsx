import React, {useState,useEffect} from 'react'
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper} from '@material-ui/core'


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
        calcularTotal()
        calcularIva()
    },)
    return(
        <TableContainer component={Paper}>
            <Table>
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
                </TableHead>
                <TableBody>
                    {Object.keys(data).map((row)=>(
                        <TableRow key={data[row].id}>
                            <TableCell>{data[row].fecha}</TableCell>
                            {ventas?
                            <TableCell>Id compra</TableCell>
                            :
                            <TableCell>{data[row].categoria}</TableCell>
                            }
                            <TableCell>${data[row].iva}</TableCell>
                            <TableCell>${data[row].total}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow key='0'>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>${iva}</TableCell>
                        <TableCell>${total}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}