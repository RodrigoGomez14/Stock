import React from 'react'
import { Box, Typography, IconButton, Tooltip, Button } from '@mui/material'
import { Menu, ArrowBack, ShoppingCart, MoveToInbox, Payment } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { CashBalance } from './CashBalance'

const quickActions = [
  { label: 'Nuevo Pedido', icon: <ShoppingCart fontSize="small" />, path: '/Nuevo-Pedido' },
  { label: 'Nueva Entrega', icon: <MoveToInbox fontSize="small" />, path: '/Nueva-Entrega' },
  { label: 'Pagar Servicios', icon: <Payment fontSize="small" />, path: '/Pagar-Servicios' },
]

export const NavBar = ({ page, history, setMenuOpened, menuOpened, blockGoBack, setBlockGoBack, user }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: menuOpened ? 200 : 64,
        right: 0,
        height: 56,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        gap: 0.5,
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(10, 25, 41, 0.8)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        transition: 'left 0.2s ease',
      }}
    >
      {page !== 'Menu' && (
        <IconButton
          size="small"
          onClick={() => (blockGoBack ? setBlockGoBack(true) : history.goBack())}
          sx={{ mr: 0.5, color: 'text.secondary' }}
        >
          <ArrowBack fontSize="small" />
        </IconButton>
      )}
      <Typography
        variant="body1"
        sx={{ fontWeight: 600, flex: 1, letterSpacing: 0.3 }}
      >
        {page}
      </Typography>

      {/* Quick actions — always visible */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mr: 1 }}>
        {quickActions.map((a) => (
          <Tooltip key={a.path} title={a.label}>
            <Button
              component={Link}
              to={a.path}
              size="small"
              variant="outlined"
              color="inherit"
              sx={{
                minWidth: 32,
                height: 32,
                px: 0.8,
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': { borderColor: 'primary.main', color: 'primary.light' },
              }}
            >
              {a.icon}
            </Button>
          </Tooltip>
        ))}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {user && <CashBalance uid={user} />}
        <IconButton
          size="small"
          onClick={() => setMenuOpened(!menuOpened)}
          sx={{ color: 'text.secondary' }}
        >
          <Menu fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  )
}
