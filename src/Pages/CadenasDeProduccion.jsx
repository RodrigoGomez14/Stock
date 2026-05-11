import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Paper, Chip, Button, Backdrop, CircularProgress,
  Snackbar, TextField, InputAdornment, Divider, Stepper, Step, StepLabel
} from '@mui/material'
import { Alert } from '@mui/material'
import { Search, PlayArrow, CheckCircle, Schedule, HourglassEmpty } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { updateData } from '../services'
import { obtenerFecha, formatMoney } from '../utilities'

const CadenaCard = ({ cadena, id, onIniciar }) => {
  const procesos = cadena.procesos || []
  const stepsCount = procesos.length
  const completados = procesos.filter((p) => p.fechaDeEntrega).length

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
      {/* Header */}
      <Box sx={{ px: 3, py: 2, bgcolor: 'action.selected', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="h6" fontWeight={700}>{cadena.producto}</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
              <Chip size="small" icon={<Schedule />} label={cadena.fechaDeInicio || '—'} variant="outlined" sx={{ fontSize: 11 }} />
              {cadena.cantidad > 0 && (
                <Chip size="small" label={`${cadena.cantidad} unidad(es)`} color="primary" variant="filled" sx={{ fontWeight: 700, fontSize: 11 }} />
              )}
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h5" fontWeight={900} color={completados === stepsCount ? 'success.main' : 'primary.main'}>
                {completados}/{stepsCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">pasos</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stepper */}
      <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stepper activeStep={completados} alternativeLabel>
          {procesos.map((p, i) => (
            <Step key={i} completed={!!p.fechaDeEntrega}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    '&.Mui-active': { color: 'primary.main' },
                    '&.Mui-completed': { color: 'success.main' },
                  },
                }}
              >
                <Typography variant="caption" fontWeight={completados >= i ? 600 : 400}>
                  {p.proceso}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Detail of each process step */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>Detalle de pasos</Typography>
        {procesos.map((p, i) => (
          <Box key={i} sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, py: 1.2,
            borderBottom: i < procesos.length - 1 ? '1px solid' : 'none',
            borderColor: 'divider',
          }}>
            {/* Status icon */}
            <Box sx={{
              width: 36, height: 36, borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              bgcolor: p.fechaDeEntrega ? 'success.main' : p.fechaDeInicio ? 'primary.main' : 'action.hover',
            }}>
              {p.fechaDeEntrega ? <CheckCircle sx={{ fontSize: 18, color: '#fff' }} /> :
               p.fechaDeInicio ? <HourglassEmpty sx={{ fontSize: 16, color: '#fff' }} /> :
               <Typography variant="caption" color="text.disabled">{i + 1}</Typography>}
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600}>
                {p.proceso}
                {p.isProcesoPropio && <Chip size="small" label="Propio" color="warning" variant="outlined" sx={{ ml: 0.5, fontSize: 10 }} />}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {p.isProcesoPropio ? 'Sin proveedor (proceso propio)' : (
                  <>Proveedor: <Box component={Link} to={`/Proveedor?${encodeURIComponent(p.proveedor)}`}
                    sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
                    {p.proveedor}
                  </Box></>
                )}
              </Typography>
            </Box>

            {/* Dates */}
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              {p.fechaDeEntrega ? (
                <Box>
                  <Typography variant="caption" color="success.main" fontWeight={600}>Completado</Typography>
                  <Typography variant="caption" color="text.disabled" display="block">{p.fechaDeEntrega}</Typography>
                </Box>
              ) : p.fechaDeInicio ? (
                <Box>
                  <Typography variant="caption" color="primary.main" fontWeight={600}>En proceso</Typography>
                  <Typography variant="caption" color="text.disabled" display="block">Inició: {p.fechaDeInicio}</Typography>
                </Box>
              ) : (
                <Typography variant="caption" color="text.disabled">Pendiente</Typography>
              )}
            </Box>

            {/* Action */}
            {i === completados && !p.fechaDeEntrega && (
              <Button
                size="small"
                variant={p.fechaDeInicio ? 'contained' : 'outlined'}
                color={p.fechaDeInicio ? 'success' : 'primary'}
                onClick={() => onIniciar(id, i)}
                sx={{ ml: 1, flexShrink: 0, minWidth: 80, fontSize: 11 }}
              >
                {p.fechaDeInicio ? 'Finalizar' : 'Iniciar'}
              </Button>
            )}
          </Box>
        ))}
      </Box>

      {/* Completed badge */}
      {completados === stepsCount && (
        <Box sx={{ px: 3, py: 1.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'success.main', color: '#fff' }}>
          <Typography variant="body2" fontWeight={700} textAlign="center">
            ✓ Cadena de producción completada
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

const CadenasDeProduccion = (props) => {
  const [search, setSearch] = useState('')
  const [snack, setSnack] = useState('')
  const [loading, setLoading] = useState(false)

  const iniciarProceso = (id, step) => {
    setLoading(true)
    const cadena = props.cadenasActivas?.[id]
    if (!cadena) return
    const proceso = cadena.procesos?.[step]

    if (proceso?.fechaDeInicio && !proceso?.fechaDeEntrega) {
      if (proceso.isProcesoPropio) {
        props.history.push(`/Finalizar-Proceso-Propio?${id}`)
      } else {
        props.history.push(`/Finalizar-Proceso?${id}`)
      }
      return
    }

    const aux = [...cadena.procesos]
    aux[step] = { ...aux[step], fechaDeInicio: obtenerFecha() }
    updateData(props.user.uid, `cadenasActivas/${id}/procesos`, aux)
      .then(() => { setSnack('Proceso iniciado'); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const cadenas = props.cadenasActivas ? Object.entries(props.cadenasActivas) : []
  const filtered = cadenas.filter(([_, c]) => !search || c.producto?.toLowerCase().includes(search.toLowerCase()))

  return (
    <Layout history={props.history} page="Cadenas de Producción" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <TextField fullWidth size="small" placeholder="Buscar por producto..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          sx={{ mb: 2 }} />

        {filtered.length > 0 ? (
          filtered.map(([id, cadena]) => (
            <CadenaCard key={id} cadena={cadena} id={id} onIniciar={iniciarProceso} />
          ))
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
            {search ? 'No se encontraron cadenas.' : 'No hay cadenas de producción activas.'}
          </Typography>
        )}
      </Box>

      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(CadenasDeProduccion)
