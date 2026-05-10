import React from 'react'
import { useLocation } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Typography, Paper, Button, Table, TableHead, TableBody, TableRow, TableCell, Chip
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../utilities'

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

const HistorialCliente = (props) => {
  const location = useLocation()
  const nombre = decodeURIComponent(location.search.replace(/^\?/, ''))

  if (!props.clientes || !nombre) {
    return (
      <Layout history={props.history} page="Historial" user={props.user?.uid}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><Typography>Cargando...</Typography></Box>
      </Layout>
    )
  }

  const pagos = props.clientes[nombre]?.pagos
  if (!pagos) {
    return (
      <Layout history={props.history} page={`Historial ${nombre}`} user={props.user?.uid}>
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>{nombre}</Typography>
          <Typography color="text.secondary">Sin pagos registrados.</Typography>
          <Button component={Link} to={`/Nuevo-Pago-Cliente?${nombre}`} variant="contained" startIcon={<Add />} sx={{ mt: 2 }}>Nuevo Pago</Button>
        </Box>
      </Layout>
    )
  }

  const entries = Object.entries(pagos)
  const grouped = {}
  entries.forEach(([id, p]) => {
    const [d, m, y] = (p.fecha || '').split('/')
    const key = `${y}-${m}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push([id, p])
  })

  const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <Layout history={props.history} page={`Historial ${nombre}`} user={props.user?.uid}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>{nombre}</Typography>
          <Button component={Link} to={`/Nuevo-Pago-Cliente?${nombre}`} variant="contained" startIcon={<Add />}>Nuevo Pago</Button>
        </Box>

        {sortedKeys.map((key) => {
          const [y, m] = key.split('-')
          const label = `${MONTHS[parseInt(m) - 1]} ${y}`
          const items = grouped[key]
          return (
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }} key={key}>
              <Box sx={{ px: 2, py: 1.5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight={700}>{label}</Typography>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Método</TableCell>
                    <TableCell align="right">Monto</TableCell>
                    <TableCell>Deuda restante</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map(([id, p]) => (
                    <TableRow key={id} hover>
                      <TableCell>{p.fecha}</TableCell>
                      <TableCell>
                        {p.efectivo && <Chip size="small" label="Efectivo" variant="outlined" sx={{ mr: 0.5 }} />}
                        {p.totalTransferencia && <Chip size="small" label="Transf." variant="outlined" sx={{ mr: 0.5 }} />}
                        {p.cheques?.length > 0 && <Chip size="small" label={`${p.cheques.length} cheque(s)`} variant="outlined" sx={{ mr: 0.5 }} />}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>$ {formatMoney(p.total || 0)}</TableCell>
                      <TableCell>$ {formatMoney(p.deudaActualizada || 0)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )
        })}
      </Box>
    </Layout>
  )
}
export default withStore(HistorialCliente)
