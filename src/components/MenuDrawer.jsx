import React from 'react'
import { auth } from '../services'
import {
  Box, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Divider, Typography, Tooltip
} from '@mui/material'
import {
  Home, Inventory, MoveToInbox, LocalShipping,
  AccountBalanceWallet, LocalAtm, AccountBalance,
  Contacts, Link as LinkIcon,
  ShoppingCart, AssignmentLate, ExitToApp, ChevronLeft,
  Receipt, ShowChart
} from '@mui/icons-material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../images/logo.png'

const menuItems = [
  { label: 'Inicio', icon: <Home />, path: '/' },
  { label: 'Productos', icon: <Inventory />, path: '/Productos' },
  { label: 'Clientes', icon: <Contacts />, path: '/Clientes' },
  { label: 'Proveedores', icon: <Contacts />, path: '/Proveedores' },
  { label: 'Expresos', icon: <LocalShipping />, path: '/Expresos' },
  { label: 'Pedidos', icon: <MoveToInbox />, path: '/Pedidos' },
  { label: 'Entregas', icon: <MoveToInbox />, path: '/Entregas' },
  { label: 'Deudas', icon: <AccountBalanceWallet />, path: '/Deudas' },
  { label: 'Cheques', icon: <LocalAtm />, path: '/Cheques' },
  { label: 'Cuentas', icon: <AccountBalance />, path: '/Cuentas-Bancarias' },
  { label: 'Servicios', icon: <Receipt />, path: '/Servicios' },
  { label: 'IVA', icon: <ShowChart />, path: '/Iva' },
  { label: 'Producción', icon: <LinkIcon />, path: '/Cadenas-De-Produccion' },
  { label: 'Nuevo Pedido', icon: <ShoppingCart />, path: '/Nuevo-Pedido' },
  { label: 'Nueva Entrega', icon: <ShoppingCart />, path: '/Nueva-Entrega' },
  { label: 'Pagar Servicios', icon: <AssignmentLate />, path: '/Pagar-Servicios' },
]

const SIDEBAR_WIDE = 200
const SIDEBAR_NARROW = 64

export const MenuDrawer = ({ menuOpened, setMenuOpened }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    const cur = location.pathname
    if (path === '/') return cur === '/'
    return cur.startsWith(path)
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: menuOpened ? SIDEBAR_WIDE : SIDEBAR_NARROW,
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        transition: 'width 0.2s ease',
      }}
    >
      {/* Logo + collapse button */}
      <Box
        sx={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: menuOpened ? 'space-between' : 'center',
          px: menuOpened ? 1.5 : 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {menuOpened && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component="img" src={logo} sx={{ height: 28, width: 28, borderRadius: 1 }} />
            <Typography variant="body2" fontWeight={700}>Stock</Typography>
          </Box>
        )}
        <Box
          component="div"
          onClick={() => setMenuOpened(!menuOpened)}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 1,
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <ChevronLeft
            fontSize="small"
            sx={{
              transition: 'transform 0.2s',
              transform: menuOpened ? 'rotate(0deg)' : 'rotate(180deg)',
            }}
          />
        </Box>
      </Box>

      {/* Menu items */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List dense>
          {menuItems.map((item) => {
            const active = isActive(item.path)
            return (
              <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
                {menuOpened ? (
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={active}
                    sx={{
                      mx: 1,
                      borderRadius: 2,
                      minHeight: 40,
                      '&.Mui-selected': {
                        bgcolor: 'primary.dark',
                        '&:hover': { bgcolor: 'primary.dark' },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: active ? 'primary.light' : 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: active ? 600 : 400 }}
                    />
                  </ListItemButton>
                ) : (
                  <Tooltip title={item.label} placement="right">
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      selected={active}
                      sx={{
                        justifyContent: 'center',
                        px: 0,
                        minHeight: 44,
                        '&.Mui-selected': {
                          bgcolor: 'primary.dark',
                          '&:hover': { bgcolor: 'primary.dark' },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          justifyContent: 'center',
                          color: active ? 'primary.light' : 'text.secondary',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                    </ListItemButton>
                  </Tooltip>
                )}
              </ListItem>
            )
          })}
        </List>
      </Box>

      {/* Sign out */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', py: 1 }}>
        {menuOpened ? (
          <ListItemButton
            onClick={() => { auth().signOut(); navigate('/', { replace: true }) }}
            sx={{ mx: 1, borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}>
              <ExitToApp fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ variant: 'body2' }} />
          </ListItemButton>
        ) : (
          <Tooltip title="Cerrar sesión" placement="right">
            <ListItemButton
              onClick={() => { auth().signOut(); navigate('/', { replace: true }) }}
              sx={{ justifyContent: 'center', px: 0 }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', color: 'error.main' }}>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  )
}
