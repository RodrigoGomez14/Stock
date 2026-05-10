import React from 'react'
import { Card, CardHeader, CardContent } from '@mui/material'
import ApexCharts from 'react-apexcharts'

const UnitsChart = (props) => {
    const { sortedProductos } = props
    const actualYear = new Date().getFullYear()

    const series = [];
    const labels = [];
    
    sortedProductos.map((d)=>{
        series.push(d.cantidad)
        labels.push(d.producto)
    })
    const options = {
        series:series,
        labels:labels,
        theme:{
            mode:'dark',
            palette:'palette2'

        },
        dataLabels:{
            dropShadow: {
                enabled: true,
                left: 2,
                top: 2,
                opacity: 0.5
            },
        },
        tooltip:{
            fillSeriesColor:false
        }
    };

    return (
        <Card>
            <CardHeader
                subheader='Unidades Vendidas - Anual'
            />
            <CardContent>
                <ApexCharts options={options} series={series} type='donut'   width={450} />
            </CardContent>
        </Card>)
}

export default UnitsChart
