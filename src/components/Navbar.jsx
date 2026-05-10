import React from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { Menu, ArrowBack } from '@mui/icons-material'
import { CashBalance } from './CashBalance'

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
          sx={{ mr: 1, color: 'text.secondary' }}
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
