import React from 'react'
import { Card, CardContent, Button, Typography, Box, Chip } from '@mui/material'
import { Visibility } from '@mui/icons-material'
import { ImgCache } from '../ImgCache'
import { Link } from 'react-router-dom'
import { formatMoney } from '../../utilities'

const calcularPrecioMeli = (precio) => {
  if (!precio || precio <= 0) return 0
  const markup = 1.35 // 35% de margen
  const costoFijo = 500 // costo fijo de envío/operación
  return Math.round(precio * markup + costoFijo)
}

export const CardProducto = ({ name, precio, cantidad, isSubproducto, imagen, search, variantes }) => {
  if (search && !name.toLowerCase().includes(search.toLowerCase())) return null

  return (
    <Card sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
      {/* Imagen — altura fija para alinear tarjetas */}
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
        {variantes && Object.keys(variantes).length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.3, flexWrap: 'wrap', mt: 0.5, mb: 1 }}>
            {Object.entries(variantes).map(([key, v]) => (
              <Chip key={key} size="small" label={`${key}${v.precio ? ` $${formatMoney(v.precio)}` : ''}`}
                variant="outlined" sx={{ fontSize: 9, height: 18 }} />
            ))}
          </Box>
        )}
        <Box sx={{ mt: 'auto', bgcolor: 'primary.dark', mx: -2, px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography variant="h5" fontWeight={800} color="white">
              $ {formatMoney(precio)}
            </Typography>
            <Typography variant="h5" fontWeight={800} color="white">
              {cantidad} u.
            </Typography>
          </Box>
          <Typography variant="body1" fontWeight={600} sx={{ color: '#fff', opacity: 0.85, mt: 0.5 }}>
            🛒 MELI: {precio > 0 ? `$ ${formatMoney(calcularPrecioMeli(precio))}` : '—'}
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
