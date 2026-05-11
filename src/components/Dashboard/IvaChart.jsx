import React from 'react'
import ApexCharts from 'react-apexcharts'
import { formatMoney } from '../../utilities'

const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const last12Months = () => {
  const result = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push({ year: d.getFullYear(), month: d.getMonth(), label: `${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}` })
  }
  return result
}

const IvaChart = ({ sortedVentas, sortedCompras }) => {
  const months = last12Months()
  const labels = months.map((m) => m.label)

  // IVA Ventas: ventas con facturacion=true → total - (total/1.21)
  const ivaVentas = months.map((m) => {
    const yearData = sortedVentas?.find(([y]) => parseInt(y) === m.year)
    if (!yearData) return 0
    const monthData = yearData[1]?.months?.[m.month + 1]
    if (!monthData?.ventas) return 0
    return monthData.ventas
      .filter((v) => v.metodoDePago?.facturacion)
      .reduce((s, v) => s + (parseFloat(v.total || 0) - parseFloat(v.total || 0) / 1.21), 0)
  })

  // IVA Compras:
  // - consumoFacturado=true → toman totalIva
  // - metodoDePago.facturacion=true y NO consumoFacturado → total - (total/1.21)
  const ivaCompras = months.map((m) => {
    const yearData = sortedCompras?.find(([y]) => parseInt(y) === m.year)
    if (!yearData) return 0
    const monthData = yearData[1]?.months?.[m.month + 1]
    if (!monthData?.compras) return 0
    return monthData.compras.reduce((s, c) => {
      if (c.consumoFacturado) return s + parseFloat(c.totalIva || 0)
      if (c.metodoDePago?.facturacion) return s + (parseFloat(c.total || 0) - parseFloat(c.total || 0) / 1.21)
      return s
    }, 0)
  })

  const balance = ivaVentas.map((v, i) => v - ivaCompras[i])

  return (
    <ApexCharts
      height={200}
      options={{
        chart: { type: 'bar', toolbar: { show: false }, background: 'transparent', sparkline: { enabled: true } },
        colors: ['#1a73e8', '#e65100', '#2e7d32'],
        labels,
        theme: { mode: 'dark' },
        plotOptions: { bar: { columnWidth: '60%', borderRadius: 2 } },
        stroke: { curve: 'smooth', width: [0, 0, 2] },
        fill: { opacity: [1, 1, 0.3] },
        tooltip: { y: { formatter: (v) => `$ ${formatMoney(v || 0)}` }, theme: 'dark' },
        dataLabels: { enabled: false },
        legend: { show: false },
        grid: { show: false },
        yaxis: { show: false },
        xaxis: { labels: { show: false } },
      }}
      series={[
        { name: 'IVA Ventas', type: 'bar', data: ivaVentas },
        { name: 'IVA Compras', type: 'bar', data: ivaCompras },
        { name: 'Balance', type: 'line', data: balance },
      ]}
    />
  )
}

export default IvaChart
