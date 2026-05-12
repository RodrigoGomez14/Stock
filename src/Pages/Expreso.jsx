import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Card, CardContent, IconButton,
  Button, Backdrop, CircularProgress, Snackbar,
  Paper, Chip, Avatar
} from '@mui/material'
import { Alert } from '@mui/material'
import {
  Edit, Delete, Phone, Place, LocalShipping,
  Person, Send, History, CheckCircle, HelpOutline
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { removeData } from '../services'
import { formatMoney, getExpreso } from '../utilities'
import { ImgCache } from '../components/ImgCache'

const fmt = (v) => {
  if (typeof v === 'string') return v
  if (typeof v !== 'object' || v === null) return ''
  if (v.mail) return v.mail
  if (v.email) return v.email
  if (v.telefono) return v.telefono
  if (v.numero) return v.numero
  if (v.calleYnumero) {
    const parts = [v.calleYnumero, v.ciudad, v.cp, v.provincia].filter(Boolean)
    return parts.join(', ')
  }
  if (v.nombre) return v.nombre
  return JSON.stringify(v)
}

const Expreso = (props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [expreso, setExpreso] = useState(null)
  const [loading, setLoading] = useState(true)
  const [snack, setSnack] = useState('')
  const nombre = decodeURIComponent(location.search.replace(/^\?/, ''))

  useEffect(() => {
    if (props.expresos && nombre) {
      const p = getExpreso(props.expresos, nombre)
      setExpreso({ nombre: p.datos?.nombre || p.nombre || nombre, ...p })
      setLoading(false)
    }
  }, [props.expresos, nombre])

  const eliminar = async () => {
    setLoading(true)
    try {
      const entry = Object.entries(props.expresos).find(([k, v]) =>
        k === nombre || v.nombre === nombre || v.datos?.nombre === nombre
      )
      const actualKey = entry ? entry[0] : nombre
      await removeData(props.user.uid, `expresos/${actualKey}`)
      setSnack('Transporte eliminado')
      setTimeout(() => navigate('/Expresos', { replace: true }), 1500)
    } catch { setLoading(false) }
  }

  if (loading || !expreso) {
    return (
      <Layout history={props.history} page="Expreso" user={props.user?.uid}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      </Layout>
    )
  }

  const d = expreso.datos || {}
  const envios = Object.values(expreso.envios || {})

  return (
      <Layout history={props.history} page={expreso.nombre || nombre} user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>

        {/* HEADER */}
        <Paper sx={{ borderRadius: 2, p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.dark', fontSize: 24, fontWeight: 700 }}>
                  <LocalShipping sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>{nombre}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                    {d.telefono?.map((t, i) => (
                      <Chip key={i} icon={<Phone sx={{ fontSize: 12 }} />} label={fmt(t)} size="small" />
                    ))}
                    {d.direccion?.map((dir, i) => (
                      <Chip key={i} icon={<Place sx={{ fontSize: 12 }} />} label={fmt(dir)} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { md: 'flex-end' }, flexWrap: 'wrap' }}>
                <Button variant="outlined" component={Link} to={`/Editar-Expreso?${encodeURIComponent(nombre)}`} startIcon={<Edit />}>
                  Editar
                </Button>
                <IconButton color="error" onClick={() => { if (window.confirm('Eliminar transporte?')) eliminar() }}>
                  <Delete />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* STATS */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 2 }}>
              <Send sx={{ fontSize: 32, color: 'primary.light' }} />
              <Typography variant="h5" fontWeight={800}>{envios.length}</Typography>
              <Typography variant="caption" color="text.secondary">Env\u00edos totales</Typography>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 2 }}>
              <CheckCircle sx={{ fontSize: 32, color: 'success.main' }} />
              <Typography variant="h5" fontWeight={800}>{envios.filter((e) => e.fechaDeLlegada).length}</Typography>
              <Typography variant="caption" color="text.secondary">Entregados</Typography>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ borderRadius: 2, textAlign: 'center', py: 2 }}>
              <HelpOutline sx={{ fontSize: 32, color: 'warning.main' }} />
              <Typography variant="h5" fontWeight={800}>{envios.filter((e) => e.inconveniente && !e.resuelto).length}</Typography>
              <Typography variant="caption" color="text.secondary">Incidencias</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* ENVÍOS */}
        <Box>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>Env\u00edos</Typography>
          {envios.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {envios.slice().reverse().map((e, i) => (
                <Paper key={i} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <Box sx={{
                    px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    bgcolor: e.fechaDeLlegada ? 'success.main' : e.inconveniente && !e.resuelto ? 'warning.light' : 'action.selected',
                    borderBottom: '1px solid', borderColor: 'divider',
                  }}>
                    <Box>
                      <Typography variant="body2" fontWeight={600} sx={{ color: e.fechaDeLlegada || (e.inconveniente && !e.resuelto) ? '#fff' : 'inherit' }}>
                        {e.cliente || '—'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: e.fechaDeLlegada || (e.inconveniente && !e.resuelto) ? 'rgba(255,255,255,0.8)' : 'text.disabled' }}>
                        Remito: {e.remito || '—'} · {e.fecha || '—'}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" fontWeight={700} sx={{ color: e.fechaDeLlegada || (e.inconveniente && !e.resuelto) ? '#fff' : 'text.secondary', display: 'block' }}>
                        {e.fechaDeLlegada ? 'Entregado' : e.inconveniente && !e.resuelto ? 'Incidencia' : 'En tr\u00e1nsito'}
                      </Typography>
                      {e.inconveniente && (
                        <Typography variant="caption" sx={{ color: e.fechaDeLlegada || (e.inconveniente && !e.resuelto) ? 'rgba(255,255,255,0.8)' : 'text.disabled', fontSize: 10 }}>
                          {e.inconveniente}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>Sin env\u00edos registrados.</Typography>
          )}
        </Box>
      </Box>

      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(Expreso)
