import React from 'react'
import { Card, CardHeader, CardContent } from '@mui/material'
import ApexCharts from 'react-apexcharts'
import { formatMoney } from '../../utilities'

const ProductsValueChart = (props) => {
    const { sortedVentas } = props
    const actualYear = new Date().getFullYear()

    let products = []
    let labelsUltimoAnio =  []

    if(sortedVentas){
        const fechaActual = new Date();
        const mesActual = fechaActual.getMonth();
        const anioActual = fechaActual.getFullYear();
        let auxProducts = []

        const mesesDesdeUltimoAnio = 12;
        let mesInicio = mesActual - mesesDesdeUltimoAnio;
        let anioInicio = anioActual;
        if (mesInicio < 0) {
            mesInicio += 12;
            anioInicio -= 1;
        }
        const initialDate = new Date()
        initialDate.setFullYear(anioInicio,mesInicio+1,1)
        if(sortedVentas){
            for (const [year, data] of sortedVentas) {
                for (const [month, dataMonth] of Object.entries(data.months)) {
                        const auxFecha = new Date();
                        auxFecha.setFullYear(year, month - 1, 1);
                        if(auxFecha>=initialDate && auxFecha<=fechaActual){
                            Object.keys(dataMonth.ventas).map(venta=>{
                                dataMonth.ventas[venta].articulos.map(articulo=>{
                                    let auxData = [0,0,0,0,0,0,0,0,0,0,0,0]
                                    const index = auxProducts.findIndex((d) => d.name === articulo.producto);
                                    if (index === -1) {
                                        auxData[(dataMonth.ventas[venta].fecha.split('/')[1]-1)] = parseFloat(articulo.total?articulo.total/1.21:0)
                                        auxProducts.push({ name: articulo.producto, data:auxData});
                                    } 
                                    else {
                                        auxData=auxProducts[index].data
                                        if(!auxData[(dataMonth.ventas[venta].fecha.split('/')[1]-1)]){
                                            auxData[(dataMonth.ventas[venta].fecha.split('/')[1]-1)] = 0
                                        }
                                        auxData[(dataMonth.ventas[venta].fecha.split('/')[1]-1)] += parseFloat(dataMonth.ventas[venta].metodoDePago.facturacion?(articulo.total?articulo.total/1.21:0):articulo.total?articulo.total:0);
                                        auxProducts[index] = {...auxProducts[index],data:auxData}
                                    }

                                })
                            })
                        }
                }
            }
        }
        const auxMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        const arr1Meses = auxMeses.slice(mesInicio+1);
        const arr2Meses = auxMeses.slice(0,mesInicio+1);
        arr1Meses.map(i=>{
            labelsUltimoAnio.push(i)
        })
        arr2Meses.map(i=>{
            labelsUltimoAnio.push(i)
        })

        let finalProducts = auxProducts
        finalProducts.map(product=>{
            const arr1Products = product.data.slice(mesInicio+1);
            const arr2Products = product.data.slice(0,mesInicio+1);

            let auxFinalData = []
            arr1Products.map(i=>{
                auxFinalData.push(i)
            })
            arr2Products.map(i=>{
                auxFinalData.push(i)
            })
            product.data = auxFinalData
        })
        products=auxProducts
    }

    const series = products
    const options = {
        labels:labelsUltimoAnio,
        fill: {
        },
        chart:{
            
        },
        theme:{
            mode:'dark',
            palette:'palette6'
        },
        stroke: {
            curve: 'smooth'
        },
        grid: {
            row: {
                colors: ['#c3c3c3', 'transparent'],
                opacity: 0.5
            },
        },
        tooltip:{
            y:{
                formatter: val=> `$ ${formatMoney(val)}`
            }
        },
        dataLabels:{
            enabled:false
        },
        yaxis:{
            labels:{
                formatter: val=> `$ ${formatMoney(val)}`
            }
        }
    };
    
    return (
        <Card>
            <CardHeader
                subheader='Ventas por Producto - Ultimos 12 Meses'
            />
            <CardContent>
                <ApexCharts options={options} series={series} type='line'  height={400} width={600} />
            </CardContent>
        </Card>
    )
}

export default ProductsValueChart
