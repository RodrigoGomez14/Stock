import React from 'react'
import { Box, Typography, IconButton, Tooltip, Button, Avatar } from '@mui/material'
import { ArrowBack, ShoppingCart, MoveToInbox, Payment } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { CashBalance } from './CashBalance'
import { canGoBack, popNav, suppressNextPush } from '../services/navigation'

const quickActions = [
  { label: 'Nuevo Pedido', icon: <ShoppingCart fontSize="small" />, path: '/Nuevo-Pedido' },
  { label: 'Nueva Entrega', icon: <MoveToInbox fontSize="small" />, path: '/Nueva-Entrega' },
  { label: 'Pagar Servicios', icon: <Payment fontSize="small" />, path: '/Pagar-Servicios' },
]

export const NavBar = ({ page, history, menuOpened, blockGoBack, setBlockGoBack, user }) => {
  const navigate = useNavigate()
  const userEmail = user?.email || ''
  const initial = userEmail ? userEmail[0].toUpperCase() : '?'

  const handleBack = () => {
    if (blockGoBack) {
      setBlockGoBack(true)
      return
    }
    suppressNextPush()
    const target = popNav()
    navigate(target, { replace: true })
  }

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
      {canGoBack() && (
        <IconButton size="small" onClick={handleBack} sx={{ mr: 0.5, color: 'text.secondary' }}>
          <ArrowBack fontSize="small" />
        </IconButton>
      )}
      <Typography variant="body1" sx={{ fontWeight: 600, flex: 1, letterSpacing: 0.3 }}>
        {page}
      </Typography>

      {/* Quick actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mr: 1 }}>
        {quickActions.map((a) => (
          <Tooltip key={a.path} title={a.label}>
            <Button component={Link} to={a.path} size="small" variant="outlined" color="inherit"
              sx={{ minWidth: 32, height: 32, px: 0.8, borderColor: 'divider', color: 'text.secondary',
                '&:hover': { borderColor: 'primary.main', color: 'primary.light' } }}>
              {a.icon}
            </Button>
          </Tooltip>
        ))}
      </Box>

      {/* User info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 1, borderLeft: '1px solid', borderColor: 'divider', pl: 1.5 }}>
        {user && <CashBalance uid={user.uid} />}
        {user && (
          <Tooltip title={userEmail}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.dark', fontSize: 13, fontWeight: 700 }}>
                  {initial}
                </Avatar>
                <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main', border: '2px solid', borderColor: 'background.default' }} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' }, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userEmail}
              </Typography>
            </Box>
          </Tooltip>
        )}
      </Box>
    </Box>
  )
}
