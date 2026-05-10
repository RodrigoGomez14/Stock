import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import { monthsList } from '../utilities'
import { Cheque as ChequePersonal } from '../components/Cheques/ChequePersonal'

const ChequesPersonalesPage = (props) => {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const cheques = props.chequesPersonales || {}
  const filtered = Object.entries(cheques).filter(([_, c]) => {
    if (!c.fecha) return false
    const [d, m, y] = c.fecha.split('/')
    return parseInt(m) === month && parseInt(y) === year
  })

  return (
    <Layout history={props.history} page="Cheques Personales" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Mes</InputLabel>
            <Select value={month} label="Mes" onChange={(e) => setMonth(e.target.value)}>
              {monthsList.map((m, i) => <MenuItem key={i} value={i + 1}>{m}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Año</InputLabel>
            <Select value={year} label="Año" onChange={(e) => setYear(e.target.value)}>
              {[2024, 2025, 2026].map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
        {filtered.length > 0 ? (
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Número</TableCell>
                  <TableCell>Banco</TableCell>
                  <TableCell>Vencimiento</TableCell>
                  <TableCell align="right">Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(([id, c]) => <ChequePersonal key={id} id={id} data={c} />)}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>Sin cheques personales</Typography>
        )}
      </Box>
    </Layout>
  )
}
export default withStore(ChequesPersonalesPage)
