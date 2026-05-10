import React from 'react'
import { Card, CardContent, Button, Typography, Chip, IconButton, Box, Divider } from '@mui/material'
import { Edit, Visibility, Phone, Place, LocalShipping } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const toStr = (v) => (typeof v === 'string' ? v : JSON.stringify(v))

export const CardExpreso = ({ datos, search }) => {
  if (search && !datos.nombre.toLowerCase().includes(search.toLowerCase())) return null

  return (
    <Card sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
            <LocalShipping color="primary" sx={{ flexShrink: 0 }} />
            <Typography variant="body1" fontWeight={700}
              component={Link} to={`/Expreso?${encodeURIComponent(datos.nombre)}`}
              sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' } }}>
              {datos.nombre}
            </Typography>
          </Box>
          <IconButton size="small" component={Link} to={`/Editar-Expreso?${encodeURIComponent(datos.nombre)}`}
            sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main' }, ml: 1 }}>
            <Edit fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
          {datos.telefono?.length > 0 && (
            <Chip icon={<Phone />} label={toStr(datos.telefono[0])} size="small" variant="outlined" sx={{ fontSize: 11 }} />
          )}
          {datos.direccion?.length > 0 && (
            <Chip icon={<Place />} label={toStr(datos.direccion[0])} size="small" variant="outlined" sx={{ fontSize: 11 }} />
          )}
        </Box>
      </CardContent>

      <Button component={Link} to={`/Expreso?${encodeURIComponent(datos.nombre)}`}
        startIcon={<Visibility />} fullWidth color="primary" variant="contained"
        sx={{ borderRadius: 0, py: 1.2, fontWeight: 600, fontSize: 12 }}>
        Ver detalle
      </Button>
    </Card>
  )
}
