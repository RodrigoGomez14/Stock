import React from 'react'
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material'
import { MenuOpen, ArrowBackRounded } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { CashBalance } from './CashBalance'

export const NavBar = ({ page, history, setMenuOpened, menuOpened, blockGoBack, setBlockGoBack, user }) => {
  const theme = useTheme()
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        height: 64,
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(26, 115, 232, 0.9)',
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        ...(menuOpened && {
          marginRight: 240,
          width: `calc(100% - 240px)`,
        }),
      }}
    >
      <Toolbar sx={{ height: 64, minHeight: '64px !important' }}>
        {!menuOpened && page !== 'Menu' && (
          <IconButton
            edge="start"
            onClick={() => (blockGoBack ? setBlockGoBack(true) : history.goBack())}
            color="inherit"
            sx={{ mr: 1 }}
          >
            <ArrowBackRounded />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 600, letterSpacing: 0.5 }}>
          {page}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user && <CashBalance uid={user} />}
          {!menuOpened && (
            <IconButton
              edge="end"
              onClick={() => setMenuOpened(true)}
              color="inherit"
              sx={{ display: menuOpened ? 'none' : 'inline-flex' }}
            >
              <MenuOpen />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
