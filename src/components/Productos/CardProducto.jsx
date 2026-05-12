import React from 'react'
import { Card, CardContent, Button, Typography, Box, Chip } from '@mui/material'
import { Visibility } from '@mui/icons-material'
import { ImgCache } from '../ImgCache'
import { Link } from 'react-router-dom'
import { formatMoney } from '../../utilities'

export const CardProducto = ({ name, precio, precioMeli, cantidad, isSubproducto, imagen, search, variantes, seVendePorSeparado }) => {
  if (search && !name.toLowerCase().includes(search.toLowerCase())) return null

  return (
    <Card sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
      <Box sx={{ height: 220, width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8, overflow: 'hidden' }}>
        {imagen ? (
          <Link to={`/Producto?${encodeURIComponent(name)}`}>
            <ImgCache src={imagen} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </Link>
        ) : (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover' }}>
            <Typography variant="h2" sx={{ opacity: 0.25 }}>📷</Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ flex: 1, pb: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body1" fontWeight={700}
          component={Link} to={`/Producto?${encodeURIComponent(name)}`}
          sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' }, display: 'block' }}>
          {name}
        </Typography>
        <Box sx={{ mt: 'auto', bgcolor: 'primary.dark', mx: -2, px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography variant="h5" fontWeight={800} color="white">
              $ {formatMoney(precio)}
            </Typography>
            <Typography variant="h5" fontWeight={800} color="white">
              {cantidad} u.
            </Typography>
          </Box>
          <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
            <Box component="span" sx={{ color: '#ECC400' }}>🛒 MELI</Box>
            <Box component="span" sx={{ color: '#fff' }}>: {precioMeli > 0 ? `$ ${formatMoney(precioMeli)}` : '—'}</Box>
          </Typography>
        </Box>
      </CardContent>

      <Button component={Link} to={`/Producto?${encodeURIComponent(name)}`}
        startIcon={<Visibility />} fullWidth color="primary" variant="contained"
        sx={{ borderRadius: 0, py: 1.2, fontWeight: 600, fontSize: 12 }}>
        Ver detalle
      </Button>
    </Card>
  )
}
