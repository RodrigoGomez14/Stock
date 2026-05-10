import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, TextField, InputAdornment, IconButton, Typography,
  Card, CardContent, Button, Chip, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions, Backdrop, CircularProgress, Snackbar
} from '@mui/material'
import { Alert } from '@mui/material'
import { Search, Add, Send, Edit, Person, Receipt } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../utilities'
import { ImgCache } from '../components/ImgCache'
import { crearFacturaPayload, enviarFactura, getAfipApiUrl, setAfipApiUrl } from '../services/afipService'
import { pushData } from '../services'

const Pedidos = (props) => {
  const [search, setSearch] = useState('')
  const [facturandoId, setFacturandoId] = useState(null)
  const [showConfig, setShowConfig] = useState(false)
  const [afipUrl, setAfipUrl] = useState(getAfipApiUrl() || '')
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const pedidos = props.pedidos ? Object.entries(props.pedidos) : []
  const filtered = pedidos.filter(([_, p]) => !search || p.cliente?.toLowerCase().includes(search.toLowerCase()))

  return (
    <Layout history={props.history} page="Pedidos" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField fullWidth size="small" placeholder="Buscar por cliente..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            sx={{ maxWidth: 400 }} />
          <IconButton component={Link} to="/Nuevo-Pedido" color="primary"><Add /></IconButton>
        </Box>
        {filtered.length > 0 ? (
          <Grid container spacing={2}>
            {filtered.map(([id, p]) => (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Card sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'visible' }}>
                  <CardContent sx={{ flex: 1, pb: 1 }}>
                    {/* Header: client name + date + chip */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          component={Link}
                          to={`/Cliente?${encodeURIComponent(p.cliente)}`}
                          sx={{
                            textDecoration: 'none', color: 'inherit',
                            '&:hover': { color: 'primary.light' },
                            display: 'flex', alignItems: 'center', gap: 0.5,
                            fontSize: '1rem',
                          }}
                        >
                          <Person fontSize="small" sx={{ color: 'text.secondary' }} />
                          {p.cliente}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ ml: 3 }}>
                          {p.fecha}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip size="small" label={`${p.articulos?.length || 0} art.`} variant="outlined" sx={{ fontSize: 11 }} />
                        <IconButton
                          size="small"
                          component={Link}
                          to={`/Editar-Pedido?${id}`}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main' } }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Articles list */}
                    {p.articulos && p.articulos.length > 0 ? (
                      <Box sx={{ mb: 1.5 }}>
                        {p.articulos.slice(0, 5).map((art, i) => {
                          const prodData = props.productos?.[art.nombre || art.producto]
                          return (
                            <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5, px: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flex: 1, minWidth: 0 }}>
                                {prodData?.imagen && (
                                  <ImgCache src={prodData.imagen} sx={{ width: 28, height: 28, borderRadius: 1, objectFit: 'cover' }} />
                                )}
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                    {art.nombre || art.producto}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                    {art.cantidad}u × $ {formatMoney(art.precio || 0)}
                                  </Typography>
                                </Box>
                              </Box>
                              <Typography variant="body2" fontWeight={700} sx={{ color: 'text.primary', flexShrink: 0, ml: 1 }}>
                                $ {formatMoney((art.cantidad || 0) * (art.precio || 0))}
                              </Typography>
                            </Box>
                          )
                        })}
                        {p.articulos.length > 5 && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 0.5, pt: 0.5 }}>
                            +{p.articulos.length - 5} artículo(s) más
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.disabled" sx={{ mb: 1.5, fontStyle: 'italic' }}>
                        Sin artículos
                      </Typography>
                    )}

                    <Divider sx={{ mb: 1.5 }} />

                    {/* Total */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <Typography variant="caption" color="text.secondary">Total</Typography>
                      <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ fontSize: '1.25rem' }}>
                        $ {formatMoney(p.total || 0)}
                      </Typography>
                    </Box>
                  </CardContent>

                  {/* Actions row */}
                  <Box sx={{ display: 'flex', borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button component={Link} to={`/Enviar-Pedido?${id}`}
                      startIcon={<Send />} fullWidth color="primary" variant="contained"
                      sx={{ borderRadius: 0, py: 1.3, fontWeight: 600, fontSize: 12 }}>
                      Enviar
                    </Button>
                    <Button onClick={async () => {
                      if (!getAfipApiUrl()) { setShowConfig(true); return }
                      setFacturandoId(id); setLoading(true)
                      try {
                        const cliente = props.clientes?.[p.cliente]
                        const datos = cliente?.datos || {}
                        const payload = crearFacturaPayload({
                          clienteNombre: p.cliente,
                          clienteCuit: datos.cuit,
                          clienteDni: datos.dni,
                          articulos: p.articulos,
                          total: p.total,
                        })
                        const res = await enviarFactura(payload)
                        await pushData(props.user.uid, `facturas/${id}`, {
                          cae: res.CAE, vencimiento: res.CAE_FchVto, numero: res.comprobante,
                          fecha: new Date().toLocaleDateString('es-AR'),
                        })
                        setSnack(`Facturada! CAE: ${res.CAE}`)
                      } catch (e) { setSnack('Error: ' + e.message) }
                      setLoading(false); setFacturandoId(null)
                    }} startIcon={<Receipt />} fullWidth color="warning" variant="outlined"
                      sx={{ borderRadius: 0, py: 1.3, fontWeight: 500, fontSize: 12, borderLeft: '1px solid', borderColor: 'divider' }}>
                      Facturar
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No hay pedidos.</Typography>
          </Box>
        )}
      </Box>

      {/* AFIP Config Dialog */}
      <Dialog open={showConfig} onClose={() => setShowConfig(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Configurar facturación electrónica</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ingresá la URL de tu backend de facturación que se conecta con ARCA/AFIP.
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 2 }}>
            Ejemplo: https://tu-backend.com/api/afip/facturar
          </Typography>
          <TextField fullWidth size="small" label="URL del backend AFIP" value={afipUrl}
            onChange={(e) => setAfipUrl(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfig(false)}>Cancelar</Button>
          <Button variant="contained" onClick={() => { setAfipApiUrl(afipUrl); setShowConfig(false); setSnack('URL guardada') }}
            disabled={!afipUrl}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')}>
        <Alert severity={snack.includes('Error') ? 'error' : 'success'}>{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}
export default withStore(Pedidos)
