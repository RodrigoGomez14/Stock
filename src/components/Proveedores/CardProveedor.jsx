import React from 'react'
import { Card, CardContent, CardActions, Button, Typography, Chip, IconButton, Menu, MenuItem, Box } from '@mui/material'
import { MoreVert, AttachMoney } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../../utilities'

export const CardProveedor = ({ datos, search }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  if (search && !datos.nombre.toLowerCase().includes(search.toLowerCase())) {
    return null
  }

  return (
    <Card sx={{ borderRadius: 3, transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" fontWeight={600} component={Link} to={`/Proveedor?${encodeURIComponent(datos.nombre)}`}
            sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' } }}>
            {datos.nombre}
          </Typography>
          <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVert />
          </IconButton>
        </Box>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem component={Link} to={`/Editar-Proveedor?${encodeURIComponent(datos.nombre)}`}>Editar</MenuItem>
        </Menu>
        <Box sx={{ mt: 2 }}>
          <Chip
            size="small"
            icon={<AttachMoney />}
            label={`$ ${formatMoney(datos.deuda || 0)}`}
            color={datos.deuda > 0 ? 'error' : 'success'}
            variant="outlined"
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/Proveedor?${encodeURIComponent(datos.nombre)}`}>Ver detalle</Button>
        <Button size="small" component={Link} to={`/Historial-Proveedor?${encodeURIComponent(datos.nombre)}`}>Historial</Button>
      </CardActions>
    </Card>
  )
}
