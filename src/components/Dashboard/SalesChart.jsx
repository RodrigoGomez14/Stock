import React from 'react'
import { Card, CardHeader, CardContent } from '@mui/material'
import ApexCharts from 'react-apexcharts'
import { formatMoney } from '../../utilities'

const SalesChart = (props) => {
    const { sortedCompras, sortedVentas } = props
    let sales = []
    let purchases = []
    let dif = []
    let labelsUltimoAnio =  []

    if(sortedCompras || sortedVentas){
        const fechaActual = new Date();
        const mesActual = fechaActual.getMonth();
        const anioActual = fechaActual.getFullYear();
        
        let auxSales = [0,0,0,0,0,0,0,0,0,0,0,0]
        let auxPurchases = [0,0,0,0,0,0,0,0,0,0,0,0]

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
                            auxSales[month-1]+=(dataMonth.total)
                        }
                }
            }
        }

        if(sortedCompras){
            for (const [year, data] of sortedCompras) {
                for (const [month, dataMonth] of Object.entries(data.months)) {
                        const auxFecha = new Date();
                        auxFecha.setFullYear(year, month - 1, 1);
                        if(auxFecha>=initialDate && auxFecha<=fechaActual){
                            auxPurchases[month-1]+=(dataMonth.total)
                        }
                }
            }
        }

        const auxMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        const arr1Meses = auxMeses.slice(mesInicio+1);
        const arr2Meses = auxMeses.slice(0,mesInicio+1);

        
        const arr1Sales = auxSales.slice(mesInicio+1);
        const arr2Sales = auxSales.slice(0,mesInicio+1);

        const arr1Purchases = auxPurchases.slice(mesInicio+1);
        const arr2Purchases = auxPurchases.slice(0,mesInicio+1);
        
        
        arr1Meses.map(i=>{
            labelsUltimoAnio.push(i)
        })
        arr2Meses.map(i=>{
            labelsUltimoAnio.push(i)
        })
        
        arr1Sales.map(i=>{
            sales.push(i)
        })
        arr2Sales.map(i=>{
            sales.push(i)
        })

        arr1Purchases.map(i=>{
            purchases.push(i)
        })
        arr2Purchases.map(i=>{
            purchases.push(i)
        })

        sales.map(sale=>{
            dif.push(sale)
        })
        purchases.map((purchase,i)=>{
            dif[i]-=purchase
        })

    }
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
                formatter: val => `$ ${formatMoney(val)}`,
            }
        }
    };
    const series=[
    {
        name:'Ventas',
        type:'line',
        data:sales
    },
    {
        name:'Compras',
        type:'line',
        data:purchases
    },
    {
        name:'Balance',
        type:'area',
        data:dif
    },
    ]

    return (
        <Card>
            <CardHeader
                subheader='Compras & Ventas - Ultimos 12 Meses'
            />
            <CardContent>
                <ApexCharts options={options} series={series}  height={400} width={1200} />
            </CardContent>
        </Card>
    )
}

export default SalesChart
