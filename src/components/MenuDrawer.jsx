import React from 'react'
import { auth } from '../services'
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Divider, IconButton, Box, Typography, Avatar
} from '@mui/material'
import {
  Home, Inventory, MoveToInbox, LocalShipping,
  AccountBalanceWallet, LocalAtm, AccountBalance,
  Contacts, Payment, Link as LinkIcon,
  ShoppingCart, AssignmentLate, ExitToApp, ChevronRight
} from '@mui/icons-material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
const menuSections = [
  {
    label: 'General',
    items: [
      { label: 'Inicio', icon: <Home />, path: '/' },
      { label: 'Productos', icon: <Inventory />, path: '/Productos' },
    ],
  },
  {
    label: 'Movimientos',
    items: [
      { label: 'Pedidos', icon: <MoveToInbox />, path: '/Pedidos' },
      { label: 'Entregas', icon: <MoveToInbox />, path: '/Entregas' },
    ],
  },
  {
    label: 'Contactos',
    items: [
      { label: 'Clientes', icon: <Contacts />, path: '/Clientes' },
      { label: 'Proveedores', icon: <Contacts />, path: '/Proveedores' },
      { label: 'Expresos', icon: <LocalShipping />, path: '/Expresos' },
    ],
  },
  {
    label: 'Finanzas',
    items: [
      { label: 'Deudas', icon: <AccountBalanceWallet />, path: '/Deudas' },
      { label: 'Cheques', icon: <LocalAtm />, path: '/Cheques' },
      { label: 'Cuentas Bancarias', icon: <AccountBalance />, path: '/Cuentas-Bancarias' },
      { label: 'Servicios', icon: <Payment />, path: '/Servicios' },
    ],
  },
  {
    label: 'Acciones Rápidas',
    items: [
      { label: 'Nuevo Pedido', icon: <ShoppingCart />, path: '/Nuevo-Pedido' },
      { label: 'Nueva Entrega', icon: <ShoppingCart />, path: '/Nueva-Entrega' },
      { label: 'Pagar Servicios', icon: <AssignmentLate />, path: '/Pagar-Servicios' },
    ],
  },
  {
    label: 'Producción',
    items: [
      { label: 'Cadenas de Producción', icon: <LinkIcon />, path: '/Cadenas-De-Produccion' },
    ],
  },
]

const DRAWER_WIDTH = 260

export const MenuDrawer = ({ menuOpened, setMenuOpened }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = () => {
    auth().signOut()
    navigate('/', { replace: true })
  }

  const isActive = (path) => {
    const current = location.pathname.slice(1)
    const target = path.slice(1)
    if (target === '') return current === ''
    return current.startsWith(target) || current === target
  }

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      open={menuOpened}
      sx={{
        width: menuOpened ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          overflowX: 'hidden',
          transition: (t) => t.transitions.create('width', {
            easing: t.transitions.easing.sharp,
            duration: t.transitions.duration.enteringScreen,
          }),
          ...(!menuOpened && {
            width: 0,
            transition: (t) => t.transitions.create('width', {
              easing: t.transitions.easing.sharp,
              duration: t.transitions.duration.leavingScreen,
            }),
          }),
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1, minHeight: 64 }}>
        <IconButton onClick={() => setMenuOpened(false)}>
          <ChevronRight />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        {menuSections.map((section) => (
          <Box key={section.label}>
            {menuOpened && (
              <Typography
                variant="caption"
                sx={{ px: 2, pt: 2, pb: 0.5, display: 'block', color: 'text.secondary', fontWeight: 600, letterSpacing: 1 }}
              >
                {section.label}
              </Typography>
            )}
            <List dense>
              {section.items.map((item) => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={isActive(item.path)}
                    sx={{
                      borderRadius: '0 24px 24px 0',
                      mr: 1,
                      '&.Mui-selected': {
                        bgcolor: 'primary.dark',
                        '&:hover': { bgcolor: 'primary.dark' },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: isActive(item.path) ? 'primary.light' : undefined }}>
                      {item.icon}
                    </ListItemIcon>
                    {menuOpened && <ListItemText primary={item.label} />}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 1 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleSignOut}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <ExitToApp color="error" />
              </ListItemIcon>
              {menuOpened && <ListItemText primary="Cerrar sesión" />}
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}
