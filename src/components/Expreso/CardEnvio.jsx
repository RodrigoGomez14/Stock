import React, { useState } from 'react'
import {
  Card, CardContent, CardHeader, CardActions, IconButton, Typography,
  Chip, Button, Paper, Menu, MenuItem, Collapse, TextField,
  Grid, Box
} from '@mui/material'
import { MoreVert, ExpandMore, ExpandLess } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { Alert } from '@mui/material'
import { obtenerFecha } from '../../utilities'

export const CardEnvio = ({ envio, search, asentarLlegada, asentarResolucionInconveniente, asentarInconveniente }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [descripcion, setDescripcion] = useState('')

  if (search && !envio.remito?.toString().includes(search)) return null

  const handleSubmitInconveniente = () => {
    if (!descripcion) return
    asentarInconveniente({ descripcion, fecha: obtenerFecha() })
    setShowForm(false)
    setDescripcion('')
  }

  return (
    <Card sx={{ borderRadius: 3, mb: 1 }}>
      <CardHeader
        action={
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton onClick={() => setExpanded(!expanded)} size="small">
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            {!envio.fechaDeLlegada && (
              <>
                <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <MoreVert />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                  <MenuItem onClick={() => { setAnchorEl(null); asentarLlegada() }}>Asentar llegada</MenuItem>
                  {!envio.inconveniente && (
                    <MenuItem onClick={() => { setAnchorEl(null); setShowForm(true) }}>Asentar inconveniente</MenuItem>
                  )}
                  {envio.inconveniente && !envio.resolucionInconveniente && (
                    <MenuItem onClick={() => { setAnchorEl(null); asentarResolucionInconveniente({ fecha: obtenerFecha() }) }}>
                      Inconveniente resuelto
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
          </Box>
        }
        title={
          <Link to={`/Cliente?${envio.cliente}`} style={{ color: '#fff', textDecoration: 'none' }}>
            {envio.cliente}
          </Link>
        }
        subheader={`Remito N° ${envio.remito}`}
        sx={{
          bgcolor: envio.fechaDeLlegada ? 'success.dark' : envio.inconveniente ? 'warning.dark' : 'primary.dark',
          color: '#fff',
          '& .MuiCardHeader-subheader': { color: 'rgba(255,255,255,0.8)' },
        }}
      />

      <Collapse in={expanded}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {envio.fechaDeLlegada && <Alert severity="success">Llegó el {envio.fechaDeLlegada}</Alert>}
            {envio.resolucionInconveniente && <Alert severity="success">Resuelto el {envio.resolucionInconveniente.fecha}</Alert>}
            {envio.inconveniente && !envio.resolucionInconveniente && (
              <Alert severity="warning">{envio.inconveniente.descripcion} ({envio.inconveniente.fecha})</Alert>
            )}
            <Typography variant="body2" color="text.secondary">Fecha de salida: {envio.fecha}</Typography>
          </Box>

          {showForm && (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mt: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Asentar inconveniente</Typography>
              <TextField fullWidth size="small" label="Descripción" value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)} sx={{ mb: 1 }} />
              <Button size="small" variant="contained" color="error" disabled={!descripcion}
                onClick={handleSubmitInconveniente}>Asentar</Button>
              <Button size="small" onClick={() => setShowForm(false)} sx={{ ml: 1 }}>Cancelar</Button>
            </Paper>
          )}
        </CardContent>
      </Collapse>
    </Card>
  )
}
