import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Card, CardContent, Paper, Button, Chip, Table,
  TableHead, TableBody, TableRow, TableCell, IconButton
} from '@mui/material'
import { Add, ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../utilities'

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const Iva = (props) => {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)

  // Procesar ventas con facturacion=true → IVA = total - (total/1.21)
  const ivaVentas = {}
  if (props.ventas) {
    Object.values(props.ventas).forEach((v) => {
      if (v.metodoDePago?.facturacion) {
        const [d, m, y] = (v.fecha || '').split('/')
        if (y === year.toString()) {
          const iva = parseFloat(v.total || 0) - (parseFloat(v.total || 0) / 1.21)
          if (!ivaVentas[m]) ivaVentas[m] = { total: 0, iva: 0, count: 0 }
          ivaVentas[m].total += parseFloat(v.total || 0)
          ivaVentas[m].iva += iva
          ivaVentas[m].count++
        }
      }
    })
  }

  // Procesar compras con consumoFacturado=true → toman el totalIva
  const ivaCompras = {}
  if (props.compras) {
    Object.values(props.compras).forEach((c) => {
      if (c.consumoFacturado) {
        const [d, m, y] = (c.fecha || '').split('/')
        if (y === year.toString()) {
          if (!ivaCompras[m]) ivaCompras[m] = { total: 0, iva: 0, count: 0 }
          ivaCompras[m].total += parseFloat(c.total || 0)
          ivaCompras[m].iva += parseFloat(c.totalIva || 0)
          ivaCompras[m].count++
        }
      }
    })
  }

  // También compras con facturacion=true que NO son consumoFacturado
  if (props.compras) {
    Object.values(props.compras).forEach((c) => {
      if (!c.consumoFacturado && c.metodoDePago?.facturacion) {
        const [d, m, y] = (c.fecha || '').split('/')
        if (y === year.toString()) {
          const iva = parseFloat(c.total || 0) - (parseFloat(c.total || 0) / 1.21)
          if (!ivaCompras[m]) ivaCompras[m] = { total: 0, iva: 0, count: 0 }
          ivaCompras[m].total += parseFloat(c.total || 0)
          ivaCompras[m].iva += iva
          ivaCompras[m].count++
        }
      }
    })
  }

  const totalIvaVentas = Object.values(ivaVentas).reduce((s, m) => s + m.iva, 0)
  const totalIvaCompras = Object.values(ivaCompras).reduce((s, m) => s + m.iva, 0)

  return (
    <Layout history={props.history} page="IVA" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => setYear(y => y - 1)} size="small"><ChevronLeft /></IconButton>
            <Typography variant="h5" fontWeight={700}>{year}</Typography>
            <IconButton onClick={() => setYear(y => Math.min(currentYear, y + 1))} size="small"><ChevronRight /></IconButton>
          </Box>
          <Button component={Link} to="/Nuevo-Consumo-Facturado" variant="contained" startIcon={<Add />}>
            Registrar consumo
          </Button>
        </Box>

        {/* Stats cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={800} color="primary.main">$ {formatMoney(totalIvaVentas)}</Typography>
              <Typography variant="caption" color="text.secondary">IVA Ventas facturadas</Typography>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={800} color="warning.main">$ {formatMoney(totalIvaCompras)}</Typography>
              <Typography variant="caption" color="text.secondary">IVA Compras / Consumos</Typography>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 2, border: '2px solid', borderColor: 'primary.main' }}>
              <Typography variant="h4" fontWeight={900} color={totalIvaVentas - totalIvaCompras >= 0 ? 'success.main' : 'error.main'}>
                $ {formatMoney(Math.abs(totalIvaVentas - totalIvaCompras))}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {totalIvaVentas >= totalIvaCompras ? 'A favor (Ventas − Compras)' : 'A pagar (Compras − Ventas)'}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Monthly table */}
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Mes</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>IVA Ventas</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>IVA Compras</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Balance</TableCell>
                <TableCell align="right">Operaciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MONTHS.map((monthName, i) => {
                const m = (i + 1).toString()
                const ven = ivaVentas[m]
                const com = ivaCompras[m]
                const saldo = (ven?.iva || 0) - (com?.iva || 0)
                return (
                  <TableRow key={m} hover>
                    <TableCell><Typography variant="body2" fontWeight={600}>{monthName}</Typography></TableCell>
                    <TableCell align="right">
                      {ven ? <Chip size="small" label={`$ ${formatMoney(ven.iva)}`} color="primary" variant="outlined" /> : '—'}
                    </TableCell>
                    <TableCell align="right">
                      {com ? <Chip size="small" label={`$ ${formatMoney(com.iva)}`} color="warning" variant="outlined" /> : '—'}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700} color={saldo >= 0 ? 'success.main' : 'error.main'}>
                        $ {formatMoney(Math.abs(saldo))} {saldo >= 0 ? '✓' : '✗'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" color="text.disabled">
                        V: {ven?.count || 0} / C: {com?.count || 0}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Layout>
  )
}
export default withStore(Iva)
