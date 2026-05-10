import React from 'react'
import { useLocation } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Paper, Chip, Stepper, Step, StepLabel, Button,
  Table, TableHead, TableBody, TableRow, TableCell
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { formatMoney } from '../utilities'

const HistorialDeProduccion = (props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const nombre = decodeURIComponent(location.search.replace(/^\?/, ''))
  const historial = props.productos?.[nombre]?.historialDeCadenas

  if (!historial) {
    return (
      <Layout history={props.history} page="Historial" user={props.user?.uid}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">Sin historial de producción para {nombre}.</Typography>
        </Box>
      </Layout>
    )
  }

  const entries = Object.entries(historial).reverse()

  return (
    <Layout history={props.history} page={`Historial - ${nombre}`} user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Button size="small" onClick={() => navigate(-1)} startIcon={<ArrowBack />}>Volver</Button>
          <Typography variant="h5" fontWeight={700}>Producción: {nombre}</Typography>
        </Box>

        {entries.map(([key, cadena], idx) => {
          const stepsCount = cadena.procesos?.length || 0
          const completados = cadena.procesos?.filter((p) => p.fechaDeEntrega).length || 0

          return (
            <Paper key={key} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
              <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'action.selected', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  #{entries.length - idx} — {cadena.fechaDeInicio || '—'}
                </Typography>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Stepper activeStep={completados} alternativeLabel>
                  {cadena.procesos?.map((p, i) => (
                    <Step key={i} completed={!!p.fechaDeEntrega}>
                      <StepLabel
                        StepIconProps={{
                          sx: { '&.Mui-completed': { color: 'success.main' } },
                        }}
                      >
                        <Typography variant="caption">{p.proceso}</Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Table size="small" sx={{ mt: 2 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Proceso</TableCell>
                      <TableCell>Proveedor</TableCell>
                      <TableCell>Inicio</TableCell>
                      <TableCell>Fin</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cadena.procesos?.map((p, i) => (
                      <TableRow key={i} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{p.proceso}</TableCell>
                        <TableCell>{p.isProcesoPropio ? 'Propio' : p.proveedor || '—'}</TableCell>
                        <TableCell>{p.fechaDeInicio || '—'}</TableCell>
                        <TableCell>
                          {p.fechaDeEntrega ? (
                            <Chip size="small" label={p.fechaDeEntrega} color="success" variant="outlined" />
                          ) : (
                            <Chip size="small" label="Pendiente" color="warning" variant="outlined" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          )
        })}
      </Box>
    </Layout>
  )
}

export default withStore(HistorialDeProduccion)
