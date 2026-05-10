import React from 'react'
import { Card, CardContent, CardActions, Button, Typography, Box } from '@mui/material'
import { LocalShipping } from '@mui/icons-material'
import { Link } from 'react-router-dom'

export const CardExpreso = ({ datos, search }) => {
  if (search && !datos.nombre.toLowerCase().includes(search.toLowerCase())) return null
  return (
    <Card sx={{ borderRadius: 3, transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalShipping color="primary" />
          <Typography variant="h6" fontWeight={600}
            component={Link} to={`/Expreso?${encodeURIComponent(datos.nombre)}`}
            sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' } }}>
            {datos.nombre}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/Expreso?${encodeURIComponent(datos.nombre)}`}>Ver detalle</Button>
        <Button size="small" component={Link} to={`/Editar-Expreso?${encodeURIComponent(datos.nombre)}`}>Editar</Button>
      </CardActions>
    </Card>
  )
}
