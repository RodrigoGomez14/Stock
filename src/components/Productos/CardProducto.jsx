import React from 'react'
import { Card, CardContent, CardActions, Button, Typography, Chip, IconButton, Box, Divider } from '@mui/material'
import { Edit, Visibility } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../../utilities'

export const CardProducto = ({ name, precio, cantidad, isSubproducto, imagen, search }) => {
  if (search && !name.toLowerCase().includes(search.toLowerCase())) return null

  return (
    <Card sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
      {/* Imagen — altura fija para alinear tarjetas */}
      <Box sx={{ height: 220, width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8, overflow: 'hidden' }}>
        {imagen ? (
          <Link to={`/Producto?${encodeURIComponent(name)}`}>
            <Box component="img" src={imagen} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </Link>
        ) : (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover' }}>
            <Typography variant="h2" sx={{ opacity: 0.25 }}>📷</Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="body1" fontWeight={700}
            component={Link} to={`/Producto?${encodeURIComponent(name)}`}
            sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' }, display: 'block' }}>
            {name}
          </Typography>
          <IconButton size="small" component={Link} to={`/Editar-Producto?${encodeURIComponent(name)}`}
            sx={{ ml: 1, color: 'text.secondary', '&:hover': { color: 'warning.main' } }}>
            <Edit fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
          {isSubproducto && <Chip size="small" label="Subproducto" color="warning" variant="outlined" />}
          <Chip size="small" label={`Stock: ${cantidad}`} color={cantidad > 0 ? 'success' : 'error'} variant="filled" sx={{ fontWeight: 600 }} />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="h5" fontWeight={800} color="primary.main">
          $ {formatMoney(precio)}
        </Typography>
      </CardContent>

      <Button component={Link} to={`/Producto?${encodeURIComponent(name)}`}
        startIcon={<Visibility />} fullWidth color="primary" variant="contained"
        sx={{ borderRadius: 0, py: 1.2, fontWeight: 600, fontSize: 12 }}>
        Ver detalle
      </Button>
    </Card>
  )
}
