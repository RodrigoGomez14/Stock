import React from 'react'
import { Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell, Chip } from '@mui/material'
import { formatMoney } from '../utilities'

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

export const ChequesReceivable = ({ cheques, title = 'Cheques a cobrar' }) => {
  if (!cheques || Object.keys(cheques).length === 0) return null

  // Group by month of vencimiento — only cheques still in our possession
  const byMonth = {}
  Object.entries(cheques).forEach(([id, c]) => {
    if (!c.vencimiento) return
    if (c.egreso || c.destinatario || c.dadoDeBaja) return
    const [d, m, y] = c.vencimiento.split('/')
    const key = `${y}-${m}`
    if (!byMonth[key]) byMonth[key] = { total: 0, count: 0, items: [] }
    byMonth[key].total += parseFloat(c.valor || 0)
    byMonth[key].count += 1
    byMonth[key].items.push({ id, ...c })
  })

  const sorted = Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b))

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>{title}</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Período</TableCell>
              <TableCell align="right">Cheques</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map(([key, data]) => {
              const [y, m] = key.split('-')
              return (
                <TableRow key={key} hover>
                  <TableCell><Chip size="small" label={`${MONTHS[parseInt(m) - 1]} ${y}`} variant="outlined" /></TableCell>
                  <TableCell align="right">{data.count}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>$ {formatMoney(data.total)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
