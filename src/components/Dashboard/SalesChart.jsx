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

const SalesChart = ({ sortedVentas, sortedCompras }) => {
  const months = last12Months()
  const labels = months.map((m) => m.label)
  const ventas = months.map((m) => {
    const yearData = sortedVentas?.find(([y]) => parseInt(y) === m.year)
    if (!yearData) return 0
    const monthData = yearData[1]?.months?.[m.month + 1]
    return monthData?.total || 0
  })
  const compras = months.map((m) => {
    const yearData = sortedCompras?.find(([y]) => parseInt(y) === m.year)
    if (!yearData) return 0
    const monthData = yearData[1]?.months?.[m.month + 1]
    return monthData?.total || 0
  })
  const balance = ventas.map((v, i) => v - compras[i])

  return (
    <ApexCharts
      height={320}
      options={{
        chart: { type: 'line', toolbar: { show: false }, background: 'transparent' },
        colors: ['#1a73e8', '#e65100', '#2e7d32'],
        labels,
        theme: { mode: 'dark' },
        stroke: { curve: 'smooth', width: [2, 2, 0] },
        fill: { opacity: [1, 1, 0.15], type: 'solid' },
        grid: { borderColor: 'rgba(255,255,255,0.05)' },
        tooltip: { y: { formatter: (v) => `$ ${formatMoney(v || 0)}` }, theme: 'dark' },
        dataLabels: { enabled: false },
        yaxis: { labels: { formatter: (v) => `$${formatMoney(v || 0)}` } },
        legend: { position: 'top', labels: { colors: '#94a3b8' } },
      }}
      series={[
        { name: 'Ventas', type: 'line', data: ventas },
        { name: 'Compras', type: 'line', data: compras },
        { name: 'Balance', type: 'area', data: balance },
      ]}
    />
  )
}

export default SalesChart
