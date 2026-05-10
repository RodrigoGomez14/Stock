import React from 'react'
import { Card, CardContent, CardActions, Button, Typography, Chip, IconButton, Box, Divider, Avatar } from '@mui/material'
import { Edit, Visibility } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../../utilities'

export const CardProducto = ({ name, precio, cantidad, isSubproducto, imagen, search }) => {
  if (search && !name.toLowerCase().includes(search.toLowerCase())) return null

  return (
    <Card sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {imagen && (
            <Avatar src={imagen} variant="rounded" sx={{ width: 56, height: 56, flexShrink: 0 }} />
          )}
          <Box sx={{ minWidth: 0, flex: 1 }}>
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
              <Chip size="small" label={`Stock: ${cantidad}`} color={cantidad > 0 ? 'success' : 'error'} variant="outlined" />
            </Box>
          </Box>
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
