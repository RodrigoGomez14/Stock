import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Paper, Button, Table,
  TableHead, TableBody, TableRow, TableCell, IconButton
} from '@mui/material'
import { Add, ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../utilities'

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const Iva = (props) => {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)

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
  const balance = totalIvaVentas - totalIvaCompras

  return (
    <Layout history={props.history} page="IVA" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => setYear(y => y - 1)} size="small"><ChevronLeft /></IconButton>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#fff' }}>{year}</Typography>
            <IconButton onClick={() => setYear(y => Math.min(currentYear, y + 1))} size="small"><ChevronRight /></IconButton>
          </Box>
          <Button component={Link} to="/Nuevo-Consumo-Facturado" variant="contained" startIcon={<Add />}>
            Registrar consumo
          </Button>
        </Box>

        {/* Stats cards */}
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Paper variant="outlined" sx={{ py: 2.5, px: 1, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} sx={{ color: '#fff' }}>$ {formatMoney(totalIvaVentas)}</Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: 'rgba(255,255,255,0.6)' }}>IVA Ventas</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper variant="outlined" sx={{ py: 2.5, px: 1, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} sx={{ color: '#fff' }}>$ {formatMoney(totalIvaCompras)}</Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: 'rgba(255,255,255,0.6)' }}>IVA Compras</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper variant="outlined" sx={{ py: 2.5, px: 1, borderRadius: 2, textAlign: 'center', borderColor: balance >= 0 ? 'success.main' : 'error.main', borderWidth: 2 }}>
              <Typography variant="h4" fontWeight={900} sx={{ color: balance >= 0 ? '#4caf50' : '#ef5350' }}>
                $ {formatMoney(Math.abs(balance))}
              </Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: balance >= 0 ? '#4caf50' : '#ef5350' }}>
                {balance >= 0 ? 'A favor (IVA Ventas − Compras)' : 'A pagar (IVA Compras − Ventas)'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Monthly table */}
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 } }}>
                <TableCell>Mes</TableCell>
                <TableCell align="right">IVA Ventas</TableCell>
                <TableCell align="right">IVA Compras</TableCell>
                <TableCell align="right">Balance</TableCell>
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
                    <TableCell><Typography variant="body2" fontWeight={600} sx={{ color: '#fff' }}>{monthName}</Typography></TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={500} sx={{ color: '#fff' }}>{ven ? `$ ${formatMoney(ven.iva)}` : '—'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={500} sx={{ color: '#fff' }}>{com ? `$ ${formatMoney(com.iva)}` : '—'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700} sx={{ color: saldo >= 0 ? '#4caf50' : '#ef5350' }}>
                        {saldo !== 0 ? `${saldo >= 0 ? '+' : '-'}$ ${formatMoney(Math.abs(saldo))}` : '$ 0'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
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
