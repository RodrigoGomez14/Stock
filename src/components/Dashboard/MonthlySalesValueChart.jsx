import React from 'react'
import { Card, CardHeader, CardContent } from '@mui/material'
import ApexCharts from 'react-apexcharts'
import { formatMoney, getActualMonthDetailed } from '../../utilities'

const MonthlySalesValueChart = (props) => {
    const { sortedVentas } = props
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    const series = [
        {
        name: 'Ventas',
        data: Array.from({ length: daysInMonth }, () => 0),
        },
    ];
    let auxData=[
        Array.from({ length: daysInMonth }, () => 0)
    ]     

    if(sortedVentas){
        for (const [year, data] of sortedVentas) {
            for (const [month, dataMonth] of Object.entries(data.months)) {
                if(year == currentYear){
                    if(month-1==currentMonth){
                        let auxSales= 0
                        dataMonth.ventas.map((venta,i)=>{
                            auxSales +=1
                            const day = dataMonth.ventas[i].fecha.split('/')[0]-1
                            auxData[0][day] = (auxData[0][day])+parseFloat(dataMonth.ventas[i].total?dataMonth.ventas[i].total:0)
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
        tooltip:{
            y:{
                formatter: val=> `$ ${formatMoney(val)}`
            }
        }
    };

    let totalMonth = 0
    let auxBalance =  Array.from({ length: daysInMonth }, () => 0)
    auxData[0].map((val,i)=>{
        auxBalance[i]+=val
        totalMonth+=val
    })
    auxBalance.map((val,i)=>{
        if(i==0){
            series[0].data[0] = val
        }
        else{
            series[0].data[i]= series[0].data[i-1] + (val?val:0)
        }
    })

    return (
        <Card>
            <CardHeader
                title={`$ ${formatMoney(totalMonth)}`}
                subheader={`Ventas - ${getActualMonthDetailed()}`}
            />
            <CardContent>
                <ApexCharts options={options} series={series} type='area' width={250} height={100} />
            </CardContent>
        </Card>)
}

export default MonthlySalesValueChart
