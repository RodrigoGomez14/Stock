import React from 'react'
import { Card, CardContent, Button, Typography, Box } from '@mui/material'
import { History, Payment } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../../utilities'

const CardDeudaProveedor = ({ nombre, deuda }) => (
  <Card sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', textAlign: 'center', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
    <CardContent sx={{ flex: 1, pb: 1 }}>
      <Typography variant="body1" fontWeight={700}
        component={Link} to={`/Proveedor?${encodeURIComponent(nombre)}`}
        sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' }, display: 'block', mb: 1 }}>
        {nombre}
      </Typography>
      <Typography variant="h3" fontWeight={700} color={deuda > 0 ? 'error.main' : 'success.main'} sx={{ fontSize: '2rem' }}>
        $ {formatMoney(deuda || 0)}
      </Typography>
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
export default CardDeudaProveedor
