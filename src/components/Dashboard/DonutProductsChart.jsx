import React from 'react'
import { Card, CardHeader, CardContent } from '@mui/material'
import ApexCharts from 'react-apexcharts'
import { formatMoney } from '../../utilities'

const DonutProductsChart = (props) => {
    const { sortedProductos } = props
    const actualYear = new Date().getFullYear()

    const series = [];
    const labels = [];
    
    sortedProductos.map((d)=>{
        series.push(d.total)
        labels.push(d.producto)
    })
    const options = {
        series:series,
        labels:labels,
        theme:{
            mode:'dark',
            palette:'palette2'
        },
        tooltip:{
            y:{
                formatter: val=> `$ ${formatMoney(val)}`
            },
            fillSeriesColor:false
        },
        dataLabels:{
            dropShadow: {
                enabled: true,
                left: 2,
                top: 2,
                opacity: 0.5
            },
        },
        
        
    };

    return (
        <Card>
            <CardHeader
                subheader='Ingresos por Producto - Anual'
            />
            <CardContent>
                <ApexCharts options={options} series={series} type='donut'   width={450} />
            </CardContent>
        </Card>)
}

export default DonutProductsChart
