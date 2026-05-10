import React from 'react'
import { Card, CardContent, Button, Typography, Chip, IconButton, Box, Divider } from '@mui/material'
import { Edit, Visibility, AttachMoney, History, Payment } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../../utilities'

const CardDeudaProveedor = ({ nombre, deuda, search }) => {
  if (search && !nombre.toLowerCase().includes(search.toLowerCase())) return null

  return (
    <Card sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="body1" fontWeight={700}
            component={Link} to={`/Proveedor?${encodeURIComponent(nombre)}`}
            sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' }, flex: 1 }}>
            {nombre}
          </Typography>
          <IconButton size="small" component={Link} to={`/Editar-Proveedor?${encodeURIComponent(nombre)}`}
            sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main' }, ml: 1 }}>
            <Edit fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 1.5 }} />

        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">Deuda</Typography>
          <Typography variant="h5" fontWeight={900} color={deuda > 0 ? 'error.main' : 'success.main'}>
            $ {formatMoney(deuda || 0)}
          </Typography>
        </Box>
      </CardContent>

      <Box sx={{ display: 'flex', borderTop: '1px solid', borderColor: 'divider' }}>
        <Button component={Link} to={`/Historial-Proveedor?${encodeURIComponent(nombre)}`}
          startIcon={<History />} fullWidth size="small"
          sx={{ borderRadius: 0, py: 1.2, fontWeight: 500, fontSize: 11 }}>
          Historial
        </Button>
        <Button component={Link} to={`/Nuevo-Pago-Proveedor?${encodeURIComponent(nombre)}`}
          startIcon={<Payment />} fullWidth size="small" color="primary" variant="contained"
          sx={{ borderRadius: 0, py: 1.2, fontWeight: 600, fontSize: 11 }}>
          Pagar
        </Button>
      </Box>
    </Card>
  )
}
export default CardDeudaProveedor
