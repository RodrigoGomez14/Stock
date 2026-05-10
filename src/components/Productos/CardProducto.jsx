import React from 'react'
import { Card, CardContent, CardActions, Button, Typography, Chip, IconButton, Box, Divider } from '@mui/material'
import { Edit, Visibility } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../../utilities'

export const CardProducto = ({ name, precio, cantidad, isSubproducto, search }) => {
  if (search && !name.toLowerCase().includes(search.toLowerCase())) return null

  return (
    <Card sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
      <CardContent sx={{ flex: 1, pb: 1 }}>
        {/* Top row: name + edit icon */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body1" fontWeight={700}
              component={Link} to={`/Producto?${encodeURIComponent(name)}`}
              sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' }, display: 'block' }}>
              {name}
            </Typography>
          </Box>
          <IconButton
            size="small"
            component={Link}
            to={`/Editar-Producto?${encodeURIComponent(name)}`}
            sx={{ ml: 1, color: 'text.secondary', '&:hover': { color: 'warning.main' } }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Box>

        {/* Chips */}
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
          {isSubproducto && <Chip size="small" label="Subproducto" color="warning" variant="outlined" />}
          <Chip size="small" label={`Stock: ${cantidad}`} color={cantidad > 0 ? 'success' : 'error'} variant="outlined" />
        </Box>

        <Divider sx={{ mb: 1.5 }} />

        {/* Price */}
        <Typography variant="h5" fontWeight={800} color="primary.main">
          $ {formatMoney(precio)}
        </Typography>
      </CardContent>

      {/* Ver detalle — full width */}
      <Button
        component={Link}
        to={`/Producto?${encodeURIComponent(name)}`}
        startIcon={<Visibility />}
        fullWidth
        color="primary"
        variant="contained"
        sx={{ borderRadius: 0, py: 1.2, fontWeight: 600, fontSize: 12 }}
      >
        Ver detalle
      </Button>
    </Card>
  )
}
