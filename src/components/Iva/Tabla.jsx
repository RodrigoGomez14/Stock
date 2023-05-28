import React, {useState,useEffect} from 'react'
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper} from '@material-ui/core'
import { formatMoney , getActualMonth } from '../../utilities'
import {content} from '../../Pages/styles/styles'
export const Tabla = ({data,ventas}) =>{
    const classes = content()
    const [totalVentas, setTotalVentas]= useState(0)
    const [iva, setIva]= useState(0)

    


    const calcularIva =() =>{
        let i =0
        Object.keys(data).map(item=>{
            i+=data[item].iva
        })
        setIva(i)
    }

    useEffect(()=>{
        if(data){
        }
    },)
    return(
        <TableContainer component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.titleDetallesCard}>Fecha</TableCell>
                        {ventas?
                            <TableCell className={classes.titleDetallesCard}>Id Compra</TableCell>
                            :
                            <TableCell className={classes.titleDetallesCard}>Categoria</TableCell>
                        }
                        <TableCell className={classes.titleDetallesCard}>Iva</TableCell>
                        <TableCell className={classes.titleDetallesCard}>Total</TableCell>
                    </TableRow>
                    <TableRow key='0'>
                        <TableCell className={classes.titleDetallesCard}></TableCell>
                        <TableCell className={classes.titleDetallesCard}></TableCell>
                        <TableCell className={classes.titleDetallesCard}>${formatMoney(iva)}</TableCell>
                        <TableCell className={classes.titleDetallesCard}>${formatMoney(totalVentas)}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?
                        Object.keys(data).reverse().map((row)=>(
                            <TableRow key={data[row].id}>
                                {console.log(data[row],ventas)}
                                <TableCell>{data[row].fecha}</TableCell>
                                <TableCell>{data[row].fecha}</TableCell>
                                <TableCell>{data[row].fecha}</TableCell>
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