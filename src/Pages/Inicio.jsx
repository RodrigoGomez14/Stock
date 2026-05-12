import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Card, CardContent, Paper, Chip, CircularProgress, Avatar
} from '@mui/material'
import {
  AttachMoney, ShoppingCart, People, Payment, Warning, CheckCircle,
  TrendingUp, TrendingDown, Inventory, AccountBalance, Receipt, Send
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney, obtenerFecha } from '../utilities'
import SalesChart from '../components/Dashboard/SalesChart'
import IvaChart from '../components/Dashboard/IvaChart'

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const StatCard = ({ icon, label, value, color, link, trend }) => (
  <Card component={link ? Link : 'div'} to={link} sx={{
    borderRadius: 2, textAlign: 'center', py: 2, cursor: link ? 'pointer' : 'default',
    transition: '0.2s', '&:hover': link ? { transform: 'translateY(-2px)', boxShadow: 4 } : {},
    textDecoration: 'none', color: 'inherit',
  }}>
    <CardContent sx={{ py: '8px !important' }}>
      <Avatar sx={{ width: 40, height: 40, mx: 'auto', mb: 0.5, bgcolor: `${color}.dark` }}>
        {icon}
      </Avatar>
      <Typography variant="h4" fontWeight={900} color={`${color}.main`}>{value}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      {trend !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.3, mt: 0.3 }}>
          {trend >= 0 ? <TrendingUp sx={{ fontSize: 14, color: 'success.main' }} /> : <TrendingDown sx={{ fontSize: 14, color: 'error.main' }} />}
          <Typography variant="caption" color={trend >= 0 ? 'success.main' : 'error.main'}>
            {trend >= 0 ? '+' : ''}{trend}%
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
)

const Inicio = (props) => {
  const [loading, setLoading] = useState(true)
  const [sortedVentas, setSortedVentas] = useState(undefined)
  const [sortedCompras, setSortedCompras] = useState(undefined)
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  useEffect(() => {
    // Process sales data for charts
    if (props.ventas) {
      const years = {}
      Object.values(props.ventas).forEach((v) => {
        const [d, m, y] = (v.fecha || '').split('/')
        if (!years[y]) years[y] = { total: 0, months: {} }
        if (!years[y].months[m]) years[y].months[m] = { total: 0, ventas: [] }
        years[y].months[m].ventas.push(v)
        years[y].months[m].total += parseFloat(v.total || 0)
        years[y].total += parseFloat(v.total || 0)
      })
      setSortedVentas(Object.entries(years).sort(([a], [b]) => b - a))
    }
    if (props.compras) {
      const years = {}
      Object.values(props.compras).forEach((c) => {
        const [d, m, y] = (c.fecha || '').split('/')
        if (!years[y]) years[y] = { total: 0, months: {} }
        if (!years[y].months[m]) years[y].months[m] = { total: 0, compras: [] }
        years[y].months[m].compras.push(c)
        years[y].months[m].total += parseFloat(c.total || 0)
        years[y].total += parseFloat(c.total || 0)
      })
      setSortedCompras(Object.entries(years).sort(([a], [b]) => b - a))
    }
    setLoading(false)
  }, [props.ventas, props.compras])

  const clientes = Object.entries(props.clientes || {})
  const proveedores = Object.entries(props.proveedores || {})
  const pedidos = Object.entries(props.pedidos || {})
  const productos = Object.entries(props.productos || {})
  const ventas = Object.values(props.ventas || {})
  const cadenas = Object.entries(props.cadenasActivas || {})

  // Calculate month metrics
  const ventasMes = ventas.filter((v) => {
    const [d, m, y] = (v.fecha || '').split('/')
    return parseInt(m) === currentMonth + 1 && parseInt(y) === currentYear
  })
  const totalVentasMes = ventasMes.reduce((s, v) => s + parseFloat(v.total || 0), 0)
  const ivaVentasMes = ventasMes.filter((v) => v.metodoDePago?.facturacion)
    .reduce((s, v) => s + (parseFloat(v.total || 0) - parseFloat(v.total || 0) / 1.21), 0)

  const totalDeudaClientes = clientes.reduce((s, [_, c]) => s + (c.datos?.deuda || 0), 0)
  const totalDeudaProv = proveedores.reduce((s, [_, p]) => s + (p.datos?.deuda || 0), 0)

  const pendingPedidos = pedidos.length
  const lowStock = productos.filter(([_, p]) => p.cantidad > 0 && p.cantidad <= 3).length
  const outOfStock = productos.filter(([_, p]) => !p.cantidad || p.cantidad === 0).length
  const cadenasActivas = cadenas.filter(([_, c]) => c.procesos?.some((p) => !p.fechaDeEntrega)).length

  return (
    <Layout history={props.history} page="Inicio" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={2}>
            {/* Row 1: Key metrics */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard icon={<AttachMoney />} label="Ventas del mes" value={`$${formatMoney(totalVentasMes)}`} color="primary" />
                </Grid>
                <Grid item xs={6} sm={3} md={1.5}>
                  <StatCard icon={<ShoppingCart />} label="Pendientes" value={pendingPedidos} color="warning" link="/Pedidos" />
                </Grid>
                <Grid item xs={6} sm={3} md={1.5}>
                  <StatCard icon={<AccountBalance />} label={`$${formatMoney(totalDeudaClientes)}`} color="error" link="/Deudas" />
                </Grid>
                <Grid item xs={6} sm={3} md={1.5}>
                  <StatCard icon={<AccountBalance />} label={`$${formatMoney(totalDeudaProv)}`} color="warning" link="/Deudas" />
                </Grid>
                <Grid item xs={6} sm={3} md={1.5}>
                  <StatCard icon={<Inventory />} label="Stock bajo" value={lowStock + outOfStock} color={lowStock > 0 ? 'error' : 'success'} link="/Productos" />
                </Grid>
                <Grid item xs={6} sm={3} md={1.5}>
                  <StatCard icon={<Send />} label="Cadenas activas" value={cadenasActivas} color="info" link="/Cadenas-De-Produccion" />
                </Grid>
              </Grid>
            </Grid>

            {/* Row 2: Charts */}
            <Grid item xs={12} lg={8}>
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle1" fontWeight={700}>Ventas y Compras</Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <SalesChart sortedCompras={sortedCompras} sortedVentas={sortedVentas} />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}>
                <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle1" fontWeight={700}>IVA mensual</Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <IvaChart sortedCompras={sortedCompras} sortedVentas={sortedVentas} />
                </Box>
              </Paper>
            </Grid>

            {/* Row 3: Quick info panels */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle1" fontWeight={700}>Productos con stock bajo</Typography>
                </Box>
                <Box sx={{ p: 2, maxHeight: 280, overflow: 'auto' }}>
                  {productos.filter(([_, p]) => p.cantidad <= 3).slice(0, 10).length > 0 ? (
                    productos.filter(([_, p]) => p.cantidad <= 3).slice(0, 10).map(([name, p]) => (
                      <Box key={name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.8, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                          <Warning sx={{ fontSize: 16, color: p.cantidad === 0 ? 'error.main' : 'warning.main' }} />
                          <Typography variant="body2" component={Link} to={`/Producto?${encodeURIComponent(p.nombre || name)}`}
                            sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' } }}>
                            {p.nombre || name}
                          </Typography>
                        </Box>
                        <Chip size="small" label={p.cantidad || 0} color={p.cantidad === 0 ? 'error' : 'warning'} variant="filled" sx={{ fontWeight: 700 }} />
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <CheckCircle color="success" sx={{ fontSize: 32, mb: 1 }} />
                      <Typography color="text.secondary" variant="body2">Todo en stock</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle1" fontWeight={700}>Resumen financiero</Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">Clientes deben</Typography>
                    <Typography variant="body2" fontWeight={700} color="error.main">$ {formatMoney(totalDeudaClientes)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">Nosotros debemos</Typography>
                    <Typography variant="body2" fontWeight={700} color="warning.main">$ {formatMoney(totalDeudaProv)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">IVA Ventas del mes</Typography>
                    <Typography variant="body2" fontWeight={700} color="primary.main">$ {formatMoney(ivaVentasMes)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" color="text.secondary">Balance neto</Typography>
                    <Typography variant="body2" fontWeight={800} color={totalDeudaClientes >= totalDeudaProv ? 'success.main' : 'error.main'}>
                      $ {formatMoney(totalDeudaClientes - totalDeudaProv)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Layout>
  )
}

export default withStore(Inicio)
