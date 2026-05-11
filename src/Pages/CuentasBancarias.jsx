import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Paper, TextField, InputAdornment, IconButton,
  Button, Collapse, Chip, Divider, Table, TableHead, TableBody,
  TableRow, TableCell
} from '@mui/material'
import { Search, Add, AccountBalance, Edit, ExpandMore, ExpandLess, ArrowUpward, ArrowDownward } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney, obtenerFecha } from '../utilities'

const AccountCard = ({ nombre, cuenta }) => {
  const [expanded, setExpanded] = useState(false)

  const ingresos = cuenta?.ingresos ? Object.values(cuenta.ingresos) : []
  const egresos = cuenta?.egresos ? Object.values(cuenta.egresos) : []
  const totalIngresos = ingresos.reduce((s, i) => s + parseFloat(i.total || 0), 0)
  const totalEgresos = egresos.reduce((s, e) => s + parseFloat(e.total || 0), 0)
  const balance = totalIngresos - totalEgresos

  const allMovements = [
    ...ingresos.map((m) => ({ ...m, tipo: 'ingreso' })),
    ...egresos.map((m) => ({ ...m, tipo: 'egreso' })),
  ].sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))

  const lastMovement = allMovements[0]

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ p: 2.5 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountBalance color="primary" />
              <Box>
                <Typography variant="h6" fontWeight={700}>{nombre}</Typography>
                {cuenta.banco && (
                  <Typography variant="caption" color="text.secondary">{cuenta.banco}</Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
              {cuenta.cbu && <Chip size="small" label={`CBU: ${cuenta.cbu}`} variant="outlined" sx={{ fontSize: 11 }} />}
              {cuenta.alias && <Chip size="small" label={`Alias: ${cuenta.alias}`} variant="outlined" sx={{ fontSize: 11 }} />}
              {cuenta.titular && <Chip size="small" label={cuenta.titular} variant="outlined" sx={{ fontSize: 11 }} />}
            </Box>
          </Grid>
          <Grid item sx={{ textAlign: 'right' }}>
            <Typography variant="h5" fontWeight={800} color={balance >= 0 ? 'success.main' : 'error.main'}>
              $ {formatMoney(balance)}
            </Typography>
            {lastMovement && (
              <Typography variant="caption" color="text.disabled">
                Último mov: {lastMovement.fecha}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>

      {allMovements.length > 0 && (
        <>
          <Divider />
          <Box sx={{ px: 2.5, py: 1 }}>
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              sx={{ fontSize: 12 }}
            >
              {expanded ? 'Ocultar movimientos' : `Ver movimientos (${allMovements.length})`}
            </Button>
          </Box>
          <Collapse in={expanded}>
            <Divider />
            <Box sx={{ px: 2.5, py: 1.5, maxHeight: 300, overflow: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Concepto</TableCell>
                    <TableCell align="right">Monto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allMovements.map((m, i) => (
                    <TableRow key={i} hover>
                      <TableCell>
                        <Typography variant="caption">{m.fecha}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {m.tipo === 'ingreso' ? (
                            <ArrowDownward fontSize="inherit" color="success" />
                          ) : (
                            <ArrowUpward fontSize="inherit" color="error" />
                          )}
                          <Typography variant="body2">{m.concepto || m.tipo || '—'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}
                          color={m.tipo === 'ingreso' ? 'success.main' : 'error.main'}>
                          {m.tipo === 'ingreso' ? '+' : '-'}$ {formatMoney(m.total || 0)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1.5, mt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" fontWeight={600}>Saldo</Typography>
                <Typography variant="body2" fontWeight={700} color={balance >= 0 ? 'success.main' : 'error.main'}>
                  $ {formatMoney(balance)}
                </Typography>
              </Box>
            </Box>
          </Collapse>
        </>
      )}
    </Paper>
  )
}

const CuentasBancarias = (props) => {
  const [search, setSearch] = useState('')
  const cuentas = props.CuentasBancarias ? Object.entries(props.CuentasBancarias) : []
  const filtered = cuentas.filter(([n]) => !search || n.toLowerCase().includes(search.toLowerCase()))

  return (
    <Layout history={props.history} page="Cuentas Bancarias" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <TextField fullWidth size="small" placeholder="Buscar cuenta..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            sx={{ maxWidth: 400 }} />
          <Button component={Link} to="/Nueva-Cuenta-Bancaria" variant="contained" startIcon={<Add />}>
            Nueva cuenta
          </Button>
        </Box>

        {filtered.length > 0 ? (
          <Grid container spacing={2}>
            {filtered.map(([nombre, cuenta]) => (
              <Grid item xs={12} key={nombre}>
                <AccountCard nombre={nombre} cuenta={cuenta} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <AccountBalance sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {search ? 'No se encontraron cuentas' : 'No hay cuentas bancarias'}
            </Typography>
            {!search && (
              <Button component={Link} to="/Nueva-Cuenta-Bancaria" variant="contained" startIcon={<Add />}>
                Crear primera cuenta
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Layout>
  )
}

export default withStore(CuentasBancarias)
