import React from 'react'
import { Card, CardHeader, CardContent } from '@mui/material'
import ApexCharts from 'react-apexcharts'
import { formatMoney, getActualMonthDetailed } from '../../utilities'

const MonthlyBalanceChart = (props) => {
    const { sortedVentas, sortedCompras, classes } = props
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    const series = [
        {
        name: 'Balance',
        data: Array.from({ length: daysInMonth }, () => 0),
        },
    ];
    let auxData=[
        Array.from({ length: daysInMonth }, () => 0),
        Array.from({ length: daysInMonth }, () => 0)
    ]
    if(sortedVentas){
        for (const [year, data] of sortedVentas) {
            for (const [month, dataMonth] of Object.entries(data.months)) {
                if(year == currentYear){
                    if(month-1==currentMonth){
                        dataMonth.ventas.map((venta,i)=>{
                            const day = venta.fecha.split('/')[0]-1
                            if(venta.metodoDePago.facturacion){
                                auxData[0][day] = (auxData[0][day])+(venta.total?venta.total/1.21:0)
                            }
                            else{
                                auxData[0][day] = (auxData[0][day])+(venta.total?venta.total:0)
                            }
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
                        dataMonth.compras.map((compra,i)=>{
                            const day = dataMonth.compras[i].fecha.split('/')[0]-1
                            if(dataMonth.compras[i].metodoDePago.facturacion){
                                if(dataMonth.compras[i].consumoFacturado){
                                    auxData[1][day] = (auxData[1][day])+(dataMonth.compras[i].total?dataMonth.compras[i].total-dataMonth.compras[i].totalIva:0)
                                }
                                else{
                                    auxData[1][day] = (auxData[1][day])+(dataMonth.compras[i].total?dataMonth.compras[i].total/1.21:0)
                                }
                            }
                            else{
                                auxData[1][day] = (auxData[1][day])+(dataMonth.compras[i].total?dataMonth.compras[i].total:0)
                            }
                        })
                    }
                }
            }
        }
    }
    let totalMonth = 0
    let auxBalance =  Array.from({ length: daysInMonth }, () => 0)
    auxData[0].map((val,i)=>{
        auxBalance[i]+=val
        totalMonth+=val
    })
    auxData[1].map((val,i)=>{
        auxBalance[i]-=val
        totalMonth-=val
    })
    auxBalance.map((val,i)=>{
        if(i==0){
            series[0].data[0] = val
        }
        else{
            series[0].data[i]= series[0].data[i-1] + (val?val:0)
        }
    })
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
            background:'transparent',
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

    return (
        <Card className={totalMonth>0?classes.cardBgGreen:classes.cardBgRed}>
            <CardHeader
                title={`$ ${formatMoney(totalMonth)}`}
                subheader={`Balance - ${getActualMonthDetailed()}`}                />
            <CardContent>
                <ApexCharts options={options} series={series} type='area' width={250} height={100} />
            </CardContent>
        </Card>)
}

export default MonthlyBalanceChart
