import React from 'react'
import { Box, Typography, Paper, Chip, Divider } from '@mui/material'
import { ArrowUpward, ArrowDownward } from '@mui/icons-material'
import { formatMoney } from '../utilities'

const StockHistory = ({ historial, currentStock }) => {
  const entries = historial ? Object.values(historial).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)) : []

  if (entries.length === 0) return null

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight={700}>Historial de stock</Typography>
        <Chip size="small" label={`Actual: ${currentStock || 0}`} color={currentStock > 0 ? 'success' : 'error'} variant="filled" />
      </Box>
      <Box sx={{ p: 2 }}>
        {entries.slice(0, 15).map((entry, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Divider sx={{ my: 1 }} />}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {(entry.movimiento || 0) > 0 ? (
                  <ArrowUpward sx={{ fontSize: 16, color: 'success.main' }} />
                ) : (
                  <ArrowDownward sx={{ fontSize: 16, color: 'error.main' }} />
                )}
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {(entry.movimiento || 0) > 0 ? '+' : ''}{entry.movimiento}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {entry.concepto || '—'} · {entry.fecha}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" fontWeight={600}>
                {entry.cantidad}
              </Typography>
            </Box>
          </React.Fragment>
        ))}
      </Box>
    </Paper>
  )
}
export default StockHistory
