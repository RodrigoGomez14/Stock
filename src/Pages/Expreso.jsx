import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Typography, Card, CardContent, IconButton, Button,
  Backdrop, CircularProgress, Snackbar, Paper, Divider, Grid
} from '@mui/material'
import { Alert } from '@mui/material'
import { Edit, Delete, Phone, Place, LocalShipping } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { database } from '../services'
import { obtenerFecha } from '../utilities'
import { ListaDeEnvios } from '../components/Expreso/ListaDeEnvios'

const toStr = (v) => typeof v === 'string' ? v : JSON.stringify(v)
const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.8 }}>
    <Box sx={{ color: 'primary.light', display: 'flex' }}>{icon}</Box>
    <Box sx={{ minWidth: 80 }}><Typography variant="caption" color="text.secondary">{label}</Typography></Box>
    <Typography variant="body2">{value || '—'}</Typography>
  </Box>
)

const Expreso = (props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [expreso, setExpreso] = useState(null)
  const [loading, setLoading] = useState(true)
  const [snack, setSnack] = useState('')
  const [search, setSearch] = useState('')
  const nombre = decodeURIComponent(location.search.replace(/^\?/, ''))

  useEffect(() => {
    if (props.expresos && nombre) {
      setExpreso({ nombre, ...props.expresos[nombre] })
      setLoading(false)
    }
  }, [props.expresos, nombre])

  const eliminar = async () => {
    setLoading(true)
    try {
      await database().ref().child(props.user.uid).child('expresos').child(nombre).remove()
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

  return (
    <Layout history={props.history} page={nombre} user={props.user?.uid}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
        <Card sx={{ borderRadius: 3, mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShipping />
                <Typography variant="h5" fontWeight={700}>{nombre}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button size="small" component={Link} to={`/Editar-Expreso?${encodeURIComponent(nombre)}`} startIcon={<Edit />}>Editar</Button>
                <IconButton size="small" color="error" onClick={() => { if (window.confirm('Eliminar transporte?')) eliminar() }}><Delete /></IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Información de contacto</Typography>
            <Divider sx={{ mb: 1.5 }} />
            <Grid container spacing={0}>
              <Grid item xs={12} sm={6}>
                {d.telefono?.length > 0 && (
                  <InfoRow icon={<Phone fontSize="small" />} label="Teléfono" value={d.telefono.map(toStr).join(' | ')} />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {d.direccion?.length > 0 && (
                  <InfoRow icon={<Place fontSize="small" />} label="Dirección" value={d.direccion.map(toStr).join(' | ')} />
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>Envíos</Typography>
          <ListaDeEnvios
            envios={expreso.envios}
            id={nombre}
            user={props.user}
            database={database}
          />
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
