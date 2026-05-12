import React from 'react'
import { Card, CardContent, Button, Typography, Chip, IconButton, Box, Divider } from '@mui/material'
import { Edit, Visibility, Phone, Email, AttachMoney } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../../utilities'

const toStr = (v) => (typeof v === 'string' ? v : JSON.stringify(v))

export const CardProveedor = ({ datos, search, pushKey }) => {
  if (search && !datos.nombre.toLowerCase().includes(search.toLowerCase())) return null

  return (
    <Card sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="body1" fontWeight={700}
            component={Link} to={`/Proveedor?${encodeURIComponent(pushKey)}`}
            sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' }, flex: 1 }}>
            {datos.nombre}
          </Typography>
          <IconButton size="small" component={Link} to={`/Editar-Proveedor?${encodeURIComponent(pushKey)}`}
            sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main' }, ml: 1 }}>
            <Edit fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
          {datos.telefono?.length > 0 && (
            <Chip icon={<Phone />} label={toStr(datos.telefono[0])} size="small" variant="outlined" sx={{ fontSize: 11 }} />
          )}
          {datos.mails?.length > 0 && (
            <Chip icon={<Email />} label={toStr(datos.mails[0])} size="small" variant="outlined" sx={{ fontSize: 11 }} />
          )}
        </Box>

        <Divider sx={{ mb: 1.5 }} />

        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">Deuda</Typography>
          <Typography variant="h6" fontWeight={800} color={datos.deuda > 0 ? 'error.main' : 'success.main'}>
            $ {formatMoney(datos.deuda || 0)}
          </Typography>
        </Box>
      </CardContent>

      <Button component={Link} to={`/Proveedor?${encodeURIComponent(pushKey)}`}
        startIcon={<Visibility />} fullWidth color="primary" variant="contained"
        sx={{ borderRadius: 0, py: 1.2, fontWeight: 600, fontSize: 12 }}>
        Ver detalle
      </Button>
    </Card>
  )
}
