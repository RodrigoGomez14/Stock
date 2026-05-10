import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Backdrop, CircularProgress,
  Snackbar, Card, CardContent, Paper, Tabs, Tab
} from '@mui/material'
import { Alert } from '@mui/material'
import { CarouselCotizaciones } from '../components/Carousel-Cotizaciones/CarouselCotizaciones'
import { formatMoney, filtrarCotizaciones } from '../utilities'
import SalesChart from '../components/Dashboard/SalesChart'
import IvaChart from '../components/Dashboard/IvaChart'
import ProductsChart from '../components/Dashboard/ProductsChart'
import ProductsValueChart from '../components/Dashboard/ProductsValueChart'
import MonthlySalesChart from '../components/Dashboard/MonthlySalesChart'
import MonthlySalesValueChart from '../components/Dashboard/MonthlySalesValueChart'
import MonthlyPurchasesChart from '../components/Dashboard/MonthlyPurchasesChart'
import MonthlyIvaChart from '../components/Dashboard/MonthlyIvaChart'
import MonthlyBalanceChart from '../components/Dashboard/MonthlyBalanceChart'
import DonutProductsChart from '../components/Dashboard/DonutProductsChart'
import DonutClientsChart from '../components/Dashboard/DonutClientsChart'
import UnitsChart from '../components/Dashboard/UnitsChart'
import TabPanel from '../components/Dashboard/TabPanel'

const Inicio = (props) => {
  const [loading, setLoading] = useState(true)
  const [sortedCompras, setSortedCompras] = useState(undefined)
  const [sortedVentas, setSortedVentas] = useState(undefined)
  const [value, setValue] = useState(0)
  const [sortedProductos, setSortedProductos] = useState(undefined)
  const [sortedClientes, setSortedClientes] = useState(undefined)
  const [showSnackbar, setshowSnackbar] = useState('')

  const handleChange = (event, newValue) => setValue(newValue)

  const filtrarCompras = () => {
    if (!props.compras) return
    const years = {}
    Object.keys(props.compras).forEach((key) => {
      const { fecha, total } = props.compras[key]
      const [day, month, year] = fecha.split('/')
      if (!years[year]) {
        years[year] = { total: 0, months: {} }
      }
      if (!years[year].months[month]) {
        years[year].months[month] = { total: 0, compras: [] }
      }
      years[year].months[month].compras.push(props.compras[key])
      years[year].months[month].total += parseFloat(total || 0)
      years[year].total += parseFloat(total || 0)
    })
    return Object.entries(years).sort(([a], [b]) => b - a)
  }

  const filtrarVentas = () => {
    if (!props.ventas) return
    const years = {}
    Object.keys(props.ventas).forEach((key) => {
      const { fecha, total } = props.ventas[key]
      const [day, month, year] = fecha.split('/')
      if (!years[year]) {
        years[year] = { total: 0, months: {} }
      }
      if (!years[year].months[month]) {
        years[year].months[month] = { total: 0, ventas: [] }
      }
      years[year].months[month].ventas.push(props.ventas[key])
      years[year].months[month].total += parseFloat(total || 0)
      years[year].total += parseFloat(total || 0)
    })
    return Object.entries(years).sort(([a], [b]) => b - a)
  }

  const filtrarProductos = (ventas) => {
    if (!ventas) return
    const currentYear = new Date().getFullYear().toString()
    const data = []
    ventas.filter(([year]) => year === currentYear).forEach(([_, yearData]) => {
      Object.values(yearData.months).forEach((m) => {
        ;(m.ventas || []).forEach((v) => {
          ;(v.articulos || []).forEach((art) => {
            const idx = data.findIndex((d) => d.producto === art.producto)
            const factor = v.metodoDePago?.facturacion ? 1.21 : 1
            if (idx === -1) {
              data.push({
                producto: art.producto,
                cantidad: parseInt(art.cantidad) || 0,
                total: art.total ? parseFloat(art.total) / factor : 0,
              })
            } else {
              data[idx].cantidad += parseInt(art.cantidad) || 0
              data[idx].total += art.total ? parseFloat(art.total) / factor : 0
            }
          })
        })
      })
    })
    return data
  }

  const filtrarClientes = (ventas) => {
    if (!ventas) return
    const currentYear = new Date().getFullYear().toString()
    const data = []
    ventas.filter(([year]) => year === currentYear).forEach(([_, yearData]) => {
      Object.values(yearData.months).forEach((m) => {
        ;(m.ventas || []).forEach((v) => {
          if (!v.cliente) return
          const idx = data.findIndex((d) => d.nombre === v.cliente)
          const factor = v.metodoDePago?.facturacion ? 1.21 : 1
          if (idx === -1) {
            data.push({ nombre: v.cliente, total: parseFloat(v.total || 0) / factor })
          } else {
            data[idx].total += parseFloat(v.total || 0) / factor
          }
        })
      })
    })
    return data
  }

  useEffect(() => {
    setLoading(true)
    const auxSortedCompras = filtrarCompras()
    const auxSortedVentas = filtrarVentas()
    const auxSortedProductos = filtrarProductos(auxSortedVentas)
    const auxSortedClientes = filtrarClientes(auxSortedVentas)
    setSortedCompras(auxSortedCompras)
    setSortedVentas(auxSortedVentas)
    setSortedProductos(auxSortedProductos)
    setSortedClientes(auxSortedClientes)
    setLoading(false)
  }, [props.compras, props.ventas])

  return (
    <Layout history={props.history} page="Inicio" user={props.user?.uid}>
      <Box sx={{ p: 2, maxWidth: 1400, mx: 'auto' }}>
        <CarouselCotizaciones dolares={props.tipoDeCambio && filtrarCotizaciones(props.tipoDeCambio)} />
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {!loading && props.ventas ? (
            <>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <MonthlySalesValueChart sortedVentas={sortedVentas} />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <MonthlyPurchasesChart sortedCompras={sortedCompras} />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <MonthlyIvaChart sortedVentas={sortedVentas} sortedCompras={sortedCompras} />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <MonthlyBalanceChart sortedVentas={sortedVentas} sortedCompras={sortedCompras} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <SalesChart sortedCompras={sortedCompras} sortedVentas={sortedVentas} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ProductsValueChart sortedVentas={sortedVentas} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ProductsChart sortedVentas={sortedVentas} />
              </Grid>
              <Grid item xs={12}>
                <IvaChart sortedCompras={sortedCompras} sortedVentas={sortedVentas} />
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <Tabs value={value} onChange={handleChange} sx={{ bgcolor: 'background.paper' }}>
                    <Tab label="Valor" />
                    <Tab label="Cantidad" />
                  </Tabs>
                  <CardContent>
                    <TabPanel value={value} index={0}>
                      <DonutProductsChart sortedProductos={sortedProductos} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <UnitsChart sortedProductos={sortedProductos} />
                    </TabPanel>
                  </CardContent>
                </Card>
              </Grid>
            </>
          ) : !loading ? (
            <Grid item xs={12} sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary">
                No hay datos para mostrar. Comenzá creando tu primer cliente y venta.
              </Typography>
            </Grid>
          ) : null}
        </Grid>
      </Box>
      <Backdrop open={loading} sx={{ zIndex: (t) => t.zIndex.drawer + 1, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={!!showSnackbar} autoHideDuration={2000} onClose={() => setshowSnackbar('')}>
        <Alert severity="success" variant="filled">{showSnackbar}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(Inicio)
