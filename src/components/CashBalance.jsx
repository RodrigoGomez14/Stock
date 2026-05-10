import React, { useState, useEffect } from 'react'
import { Chip, Popover, Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material'
import { AccountBalanceWallet, Refresh } from '@mui/icons-material'
import { getData } from '../services/database'
import { formatMoney } from '../utilities'

export const CashBalance = ({ uid }) => {
  const [balance, setBalance] = useState(null)
  const [movimientos, setMovimientos] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)

  const load = async () => {
    const caja = await getData(uid, 'caja')
    setBalance(caja?.balance || 0)
    setMovimientos(caja?.movimientos ? Object.values(caja.movimientos).reverse() : [])
  }

  useEffect(() => { if (uid) load() }, [uid])

  return (
    <>
      <Chip
        icon={<AccountBalanceWallet />}
        label={`Caja: $ ${formatMoney(balance || 0)}`}
        color={balance > 0 ? 'success' : balance < 0 ? 'error' : 'default'}
        variant="outlined"
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ cursor: 'pointer', mr: 1 }}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, minWidth: 300, maxHeight: 400, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={700}>Movimientos de caja</Typography>
            <IconButton size="small" onClick={load}><Refresh fontSize="small" /></IconButton>
          </Box>
          {movimientos.length > 0 ? (
            <List dense>
              {movimientos.map((m, i) => (
                <ListItem key={i} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">{m.descripcion}</Typography>
                        <Typography variant="body2" fontWeight={600} color={m.tipo === 'ingreso' ? 'success.main' : 'error.main'}>
                          {m.tipo === 'ingreso' ? '+' : '-'}$ {formatMoney(m.monto)}
                        </Typography>
                      </Box>
                    }
                    secondary={`${m.fecha} — Saldo: $ ${formatMoney(m.balanceNuevo)}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" variant="body2">Sin movimientos</Typography>
          )}
        </Box>
      </Popover>
    </>
  )
}
