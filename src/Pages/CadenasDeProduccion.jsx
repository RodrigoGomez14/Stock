import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Paper, Chip, Button, Backdrop, CircularProgress,
  Snackbar, Stepper, Step, StepLabel, TextField, InputAdornment
} from '@mui/material'
import { Alert } from '@mui/material'
import { Search, PlayArrow, CheckCircle, Schedule } from '@mui/icons-material'
import { updateData } from '../services'
import { obtenerFecha, formatMoney } from '../utilities'

const CadenaCard = ({ cadena, id, onIniciar }) => {
  const stepsCount = cadena.procesos?.length || 0
  const activeStep = cadena.procesos?.filter((p) => p.fechaDeEntrega).length || 0

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
      <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'action.selected', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>{cadena.producto}</Typography>
          <Typography variant="caption" color="text.secondary">
            {cadena.cantidad ? `${cadena.cantidad} u. — ` : ''}Iniciado: {cadena.fechaDeInicio}
          </Typography>
        </Box>
        <Chip
          size="small"
          label={`${activeStep}/${stepsCount}`}
          color={activeStep === stepsCount ? 'success' : activeStep > 0 ? 'primary' : 'default'}
          variant="filled"
        />
      </Box>

      <Box sx={{ px: 2.5, py: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {cadena.procesos?.map((proceso, i) => (
            <Step key={i} completed={!!proceso.fechaDeEntrega}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    '&.Mui-active': { color: 'primary.main' },
                    '&.Mui-completed': { color: 'success.main' },
                  },
                }}
              >
                <Typography variant="caption" fontWeight={activeStep >= i ? 600 : 400}>
                  {proceso.proceso}
                </Typography>
                {proceso.fechaDeEntrega && (
                  <Typography variant="caption" color="text.disabled" display="block">
                    {proceso.fechaDeEntrega}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Current step actions */}
      {activeStep < stepsCount && (
        <Box sx={{ px: 2.5, py: 1.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              Siguiente: {cadena.procesos[activeStep].proceso}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {cadena.procesos[activeStep].isProcesoPropio
                ? 'Proceso propio'
                : `Proveedor: ${cadena.procesos[activeStep].proveedor}`}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            startIcon={cadena.procesos[activeStep]?.fechaDeInicio ? <CheckCircle /> : <PlayArrow />}
            onClick={() => onIniciar(id, activeStep)}
          >
            {cadena.procesos[activeStep]?.fechaDeInicio ? 'Finalizar' : 'Iniciar'}
          </Button>
        </Box>
      )}

      {activeStep === stepsCount && (
        <Box sx={{ px: 2.5, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Chip label="Completada ✓" color="success" size="small" variant="filled" />
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
      // Ya iniciado → ir a finalizar
      if (proceso.isProcesoPropio) {
        props.history.push(`/Finalizar-Proceso-Propio?${id}`)
      } else {
        props.history.push(`/Finalizar-Proceso?${id}`, {})
      }
      return
    }

    // Iniciar proceso
    const aux = [...cadena.procesos]
    aux[step] = { ...aux[step], fechaDeInicio: obtenerFecha() }
    updateData(props.user.uid, `cadenasActivas/${id}/procesos`, aux)
      .then(() => { setSnack('Proceso iniciado'); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const cadenas = props.cadenasActivas ? Object.entries(props.cadenasActivas) : []
  const filtered = cadenas.filter(([_, c]) => !search || c.producto?.toLowerCase().includes(search.toLowerCase()))

  const activas = cadenas.filter(([_, c]) => c.procesos?.some((p) => !p.fechaDeEntrega)).length
  const completadas = cadenas.length - activas

  return (
    <Layout history={props.history} page="Cadenas de Producción" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800}>{cadenas.length}</Typography>
              <Typography variant="caption" color="text.secondary">Total</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} color="primary.main">{activas}</Typography>
              <Typography variant="caption" color="text.secondary">Activas</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} color="success.main">{completadas}</Typography>
              <Typography variant="caption" color="text.secondary">Completadas</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Search */}
        <TextField fullWidth size="small" placeholder="Buscar por producto..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          sx={{ mb: 2 }} />

        {/* List */}
        {filtered.length > 0 ? (
          filtered.map(([id, cadena]) => (
            <CadenaCard key={id} cadena={cadena} id={id} onIniciar={iniciarProceso} />
          ))
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
            {search ? 'No se encontraron cadenas.' : 'No hay cadenas de producción activas. Iniciá una desde el perfil de un producto.'}
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
