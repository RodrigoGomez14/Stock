import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, TextField, InputAdornment, IconButton, Typography,
  Card, CardContent, Button, Chip, Divider, Switch, FormControlLabel,
  Snackbar
} from '@mui/material'
import { Alert } from '@mui/material'
import { Search, Add, Send, Person, Receipt, LocalShipping } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../utilities'
import { ImgCache } from '../components/ImgCache'
import { updateData, pushData } from '../services'
import { enviarFactura, crearNotaCredito, getApiKey } from '../services/afipService'
import { printShippingLabel, initLabelService } from '../services/labelService'
import { obtenerFecha } from '../utilities'

const Pedidos = (props) => {
  const [search, setSearch] = useState('')
  const [snack, setSnack] = useState('')
  const [facturando, setFacturando] = useState(null)
  React.useEffect(() => { initLabelService() }, [])
  const pedidos = props.pedidos ? Object.entries(props.pedidos) : []
  const filtered = pedidos.filter(([_, p]) => !search || p.cliente?.toLowerCase().includes(search.toLowerCase()))

  const toggleFacturacion = async (id, p, activar) => {
    const articulos = (p.articulos || []).map((art) => {
      const precioBase = parseFloat(art.precio || 0)
      return {
        ...art,
        precio: activar ? Math.round(precioBase * 1.21 * 100) / 100 : Math.round(precioBase / 1.21 * 100) / 100,
      }
    })
    const nuevoTotal = articulos.reduce((s, a) => s + (a.cantidad || 0) * (a.precio || 0), 0)
    try {
      await updateData(props.user.uid, `pedidos/${id}`, { articulos, total: Math.round(nuevoTotal * 100) / 100, facturado: activar })
      setSnack(activar ? 'IVA aplicado al pedido' : 'IVA quitado del pedido')
    } catch (e) {
      setSnack('Error: ' + (e?.message || ''))
    }
  }

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
                <Card sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
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
                        <FormControlLabel
                          control={<Switch size="small" checked={!!p.facturado}
                            onChange={() => toggleFacturacion(id, p, !p.facturado)} />}
                          label={p.facturado ? 'IVA' : 'S/IVA'}
                          labelPlacement="start"
                          sx={{ '& .MuiTypography-root': { fontSize: 10, fontWeight: 700, color: p.facturado ? 'warning.main' : 'text.disabled' } }}
                        />
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
                                  <Typography variant="body2" sx={{ fontWeight: 500, textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' } }}
                                    component={Link} to={`/Producto?${encodeURIComponent(art.nombre || art.producto)}`}>
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
                    {p.facturado && (() => {
                      const facturaExistente = props.facturas?.[id] && Object.values(props.facturas[id]).find((f) => f.cae)
                      if (facturaExistente) {
                        return (
                          <Button onClick={async () => {
                            setFacturando(id)
                            try {
                              const dCliente = props.clientes?.[p.cliente]?.datos || {}
                              await crearNotaCredito({
                                clienteNombre: p.cliente,
                                clienteCuit: dCliente.cuit,
                                clienteDni: dCliente.dni,
                                articulos: p.articulos || [],
                                total: p.total || 0,
                                facturaAsociada: { cae: facturaExistente.cae, numero: facturaExistente.numero },
                              })
                              setSnack('Nota de crédito emitida')
                            } catch (e) { setSnack('Error: ' + (e?.message || '')) }
                            setFacturando(null)
                          }}
                            startIcon={<Receipt />} fullWidth color="error" variant="outlined"
                            disabled={facturando === id}
                            sx={{ borderRadius: 0, py: 1.3, fontWeight: 500, fontSize: 12, borderLeft: '1px solid', borderColor: 'divider' }}>
                            NC
                          </Button>
                        )
                      }
                      return (
                        <Button onClick={async () => {
                          if (!getApiKey()) { setSnack('Configurá tu API Key en Ajustes'); return }
                          setFacturando(id)
                          try {
                            const dCliente = props.clientes?.[p.cliente]?.datos || {}
                            const articulosSinIva = (p.articulos || []).map((art) => ({
                              ...art,
                              precio: parseFloat((parseFloat(art.precio || 0) / 1.21).toFixed(2)),
                            }))
                            const res = await enviarFactura({
                              clienteNombre: p.cliente,
                              clienteCuit: dCliente.cuit,
                              clienteDni: dCliente.dni,
                              articulos: articulosSinIva,
                              total: parseFloat((p.total || 0) / 1.21).toFixed(2),
                              facturacion: true,
                            })
                            await pushData(props.user.uid, `facturas/${id}`, {
                              cae: res.CAE, vencimiento: res.CAE_FchVto, numero: res.comprobante,
                              fecha: obtenerFecha(),
                            })
                            setSnack(`Facturada! CAE: ${res.CAE}`)
                          } catch (e) { setSnack('Error: ' + (e?.message || '')) }
                          setFacturando(null)
                        }}
                          startIcon={<Receipt />} fullWidth color="warning" variant="contained"
                          disabled={facturando === id}
                          sx={{ borderRadius: 0, py: 1.3, fontWeight: 600, fontSize: 12, borderLeft: '1px solid', borderColor: 'divider' }}>
                          Facturar
                        </Button>
                      )
                    })()}
                    <Button onClick={() => {
                      const cl = props.clientes?.[p.cliente]
                      const datos = cl?.datos || {}
                      const dir = datos.direcciones?.[0] || {}
                      const localidad = datos.localidad || dir.ciudad || ''
                      const provincia = datos.provincia || dir.provincia || ''
                      if (!localidad || !provincia) {
                        setSnack('Error: El cliente no tiene dirección. Agregala desde el perfil del cliente.')
                        return
                      }
                      printShippingLabel(p, cl)
                    }}
                      startIcon={<LocalShipping />} fullWidth color="info" variant="outlined"
                      sx={{ borderRadius: 0, py: 1.3, fontWeight: 500, fontSize: 12, borderLeft: '1px solid', borderColor: 'divider' }}>
                      Etiqueta
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

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')}>
        <Alert severity={snack.includes('Error') ? 'error' : 'success'}>{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}
export default withStore(Pedidos)
