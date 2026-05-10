import React from 'react'
import { Card, CardContent, CardActions, Button, Typography, Chip, IconButton, Box } from '@mui/material'
import { MoreVert, Delete } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../../utilities'

export const CardProducto = ({ name, precio, cantidad, isSubproducto, search, onDelete }) => {
  if (search && !name.toLowerCase().includes(search.toLowerCase())) return null

  return (
    <Card sx={{ borderRadius: 3, transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" fontWeight={600}
              component={Link} to={`/Producto?${encodeURIComponent(name)}`}
              sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' } }}>
              {name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {isSubproducto && <Chip size="small" label="Subproducto" color="warning" variant="outlined" />}
              <Chip size="small" label={`Stock: ${cantidad}`} color={cantidad > 0 ? 'success' : 'error'} variant="outlined" />
            </Box>
          </Box>
          <IconButton size="small" onClick={() => onDelete?.(name)} color="error">
            <Delete />
          </IconButton>
        </Box>
        <Typography variant="h5" fontWeight={700} sx={{ mt: 2 }}>
          $ {formatMoney(precio)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/Producto?${encodeURIComponent(name)}`}>Ver detalle</Button>
        <Button size="small" component={Link} to={`/Editar-Producto?${encodeURIComponent(name)}`}>Editar</Button>
      </CardActions>
    </Card>
  )
}
