import React from 'react'
import { Card, CardHeader, CardContent } from '@mui/material'
import ApexCharts from 'react-apexcharts'
import { getActualMonthDetailed } from '../../utilities'

const MonthlySalesChart = (props) => {
    const { sortedVentas, sortedCompras } = props
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    let auxConsumosFacturados = 0
    const series = [
        {
            name: 'Ventas',
            data: Array.from({ length: daysInMonth }, () => 0),
        },
        {
            name: 'Compras',
            data: Array.from({ length: daysInMonth }, () => 0),
        },
    ];
    

    if(sortedVentas){
        for (const [year, data] of sortedVentas) {
            for (const [month, dataMonth] of Object.entries(data.months)) {
                if(year == currentYear){
                    if(month-1==currentMonth){
                        let auxSales= 0
                        dataMonth.ventas.map((venta,i)=>{
                            auxSales +=1
                            const day = dataMonth.ventas[i].fecha.split('/')[0]-1
                            series[0].data[day] = (series[0].data[day])+1
                        })
                    }
                }
            }
        }
    }
    if(sortedCompras){
        for (const [year, data] of sortedCompras) {
            for (const [month, dataMonth] of Object.entries(data.months)) {
                if(year == currentYear){
                    if(month-1==currentMonth){
                        let auxSales= 0
                        dataMonth.compras.map((compra,i)=>{
                            auxSales +=1
                            const day = dataMonth.compras[i].fecha.split('/')[0]-1
                            series[1].data[day] = (series[1].data[day])+1
                            if(dataMonth.compras[i].consumoFacturado){
                                auxConsumosFacturados += 1
                            }
                        })
                    }
                }
            }
        }
    }

    const options = {
        labels:Array.from({ length: daysInMonth }, (value, index) => (index + 1).toString()),
        theme:{
            mode:'dark',
            palette:'palette6'
        },
        stroke: {
            curve: 'smooth'
        },
        chart:{
            sparkline: {
                enabled: true
            },
            
        },
        
    };

    let totalMonthSales = 0
    let totalMonthPurchases = 0

    series[0].data.map(serie=>(
        totalMonthSales = totalMonthSales + serie
    ))
    series[1].data.map(serie=>(
        totalMonthPurchases = totalMonthPurchases + serie
    ))
    return (
        <Card>
            <CardHeader
                title={`${totalMonthSales} - ${totalMonthPurchases-auxConsumosFacturados} (${auxConsumosFacturados})`}
                subheader={`Ventas & Compras - ${getActualMonthDetailed()}`}
            />
            <CardContent>
                <ApexCharts options={options} series={series} type='area' width={200} height={100}  />
            </CardContent>
        </Card>)
}

export default MonthlySalesChart
