import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, TextField, InputAdornment, Typography,
  IconButton, Button, Switch, FormControlLabel, Snackbar, Paper
} from '@mui/material'
import { Alert } from '@mui/material'
import { Search, Add, Send, Person, Receipt, LocalShipping } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../utilities'
import { ImgCache } from '../components/ImgCache'
import { updateData, pushData } from '../services'
import { printShippingLabel, initLabelService } from '../services/labelService'
import { enviarFactura, crearNotaCredito, getApiKey } from '../services/afipService'
import { getCliente, getProducto, obtenerFecha } from '../utilities'
import meliLogo from '../images/logomeli.png'

const Pedidos = (props) => {
  const [search, setSearch] = useState('')
  const [snack, setSnack] = useState('')
  const [snackAction, setSnackAction] = useState(null)
  const [facturando, setFacturando] = useState(null)
  React.useEffect(() => { initLabelService() }, [])
  const pedidos = props.pedidos ? Object.entries(props.pedidos) : []
  const filtered = pedidos.filter(([_, p]) => !search || p.cliente?.toLowerCase().includes(search.toLowerCase()))

  const showSnack = (msg) => { setSnack(msg); setSnackAction(null) }

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
      showSnack(activar ? 'IVA aplicado al pedido' : 'IVA quitado del pedido')
    } catch (e) {
      showSnack('Error: ' + (e?.message || ''))
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
                <Paper variant="outlined" sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                  {/* Header */}
                  <Box sx={{ px: 2.5, py: 1.8, bgcolor: p.esMeli ? '#ECC400' : 'primary.dark', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}
                        component={p.cliente ? Link : 'div'} to={p.cliente ? `/Cliente?${encodeURIComponent(p.cliente)}` : undefined}
                        sx={{ textDecoration: 'none', color: p.esMeli ? '#1a1a1a' : '#fff', display: 'flex', alignItems: 'center', gap: 1, lineHeight: 1.2, '&:hover': { opacity: p.cliente ? 0.8 : 1 } }}>
                        {p.esMeli ? (
                          <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
                            <Box component="img" src={meliLogo} sx={{ width: 18, height: 18, objectFit: 'contain' }} />
                          </Box>
                        ) : (
                          <Person fontSize="small" />
                        )}
                        {p.esMeli ? 'Pedido MELI' : p.cliente}
                      </Typography>
                      <Typography variant="caption" sx={{ color: p.esMeli ? 'rgba(26,26,26,0.5)' : 'rgba(255,255,255,0.5)' }}>{p.fecha}</Typography>
                    </Box>
                    <FormControlLabel
                      control={<Switch checked={!!p.facturado} onChange={() => toggleFacturacion(id, p, !p.facturado)} sx={{ '& .MuiSwitch-thumb': { bgcolor: p.facturado ? '#ff9800' : (p.esMeli ? '#90a4ae' : '#90a4ae') } }} />}
                      label={p.facturado ? 'IVA' : 'S/IVA'}
                      labelPlacement="start"
                      sx={{ '& .MuiTypography-root': { fontSize: 11, fontWeight: 700, color: p.facturado ? '#ff9800' : (p.esMeli ? 'rgba(26,26,26,0.4)' : 'rgba(255,255,255,0.4)') } }}
                    />
                  </Box>

                  {/* Articles */}
                  <Box sx={{ px: 2.5, py: 1.5, flex: 1 }}>
                    {p.articulos && p.articulos.length > 0 ? (
                      <>
                        {p.articulos.slice(0, 5).map((art, i) => {
                          const prodData = getProducto(props.productos, art.nombre || art.producto)
                          return (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.8, borderBottom: i < Math.min(p.articulos.length, 5) - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                              {prodData?.imagen ? (
                                <ImgCache src={prodData.imagen} sx={{ width: 32, height: 32, borderRadius: 1, objectFit: 'cover', flexShrink: 0 }} />
                              ) : (
                                <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <Typography variant="caption">📷</Typography>
                                </Box>
                              )}
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="body2" fontWeight={600}
                                  component={Link} to={`/Producto?${encodeURIComponent(art.nombre || art.producto)}`}
                                  sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.light' } }}>
                                  {art.nombre || art.producto}
                                </Typography>
                                <Typography variant="caption" color="text.disabled">{art.cantidad}u x $ {formatMoney(art.precio || 0)} c/u</Typography>
                              </Box>
                              <Typography variant="body2" fontWeight={700} sx={{ color: '#fff', flexShrink: 0 }}>$ {formatMoney((art.cantidad || 0) * (art.precio || 0))}</Typography>
                            </Box>
                          )
                        })}
                        {p.articulos.length > 5 && (
                          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', pt: 0.5 }}>
                            +{p.articulos.length - 5} artículo(s) más
                          </Typography>
                        )}
                      </>
                    ) : (
                      <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>Sin artículos</Typography>
                    )}
                  </Box>

                  {/* Total bar */}
                  <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'action.selected', borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight={600}>Total</Typography>
                    <Typography variant="h6" fontWeight={800} sx={{ color: '#fff' }}>$ {formatMoney(p.total || 0)}</Typography>
                  </Box>

                  {/* Actions */}
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
                              const datos = (getCliente(props.clientes, p.cliente)?.datos || {})
                              await crearNotaCredito({ clienteNombre: p.cliente, clienteCuit: datos.cuit, clienteDni: datos.dni, articulos: p.articulos || [], total: p.total || 0, facturaAsociada: { cae: facturaExistente.cae, numero: facturaExistente.numero } })
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
                          if (!getApiKey()) { showSnack('Configurá tu API Key en Ajustes'); return }
                          setFacturando(id)
                          try {
                            const dCliente = (getCliente(props.clientes, p.cliente)?.datos || {})
                            const articulosSinIva = (p.articulos || []).map((art) => ({ ...art, precio: parseFloat((parseFloat(art.precio || 0) / 1.21).toFixed(2)) }))
                            const res = await enviarFactura({ clienteNombre: p.cliente, clienteCuit: dCliente.cuit, clienteDni: dCliente.dni, articulos: articulosSinIva, total: parseFloat((p.total || 0) / 1.21).toFixed(2), facturacion: true })
                            await pushData(props.user.uid, `facturas/${id}`, { cae: res.CAE, vencimiento: res.CAE_FchVto, numero: res.comprobante, fecha: obtenerFecha() })
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
                      const cl = getCliente(props.clientes, p.cliente)
                      const datos = cl?.datos || {}
                      const dir = datos.direcciones?.[0] || {}
                      const localidad = datos.localidad || dir.ciudad || ''
                      const provincia = datos.provincia || dir.provincia || ''
                      if (!localidad || !provincia) { setSnack('Error: El cliente no tiene dirección.'); setSnackAction(`/Editar-Cliente?${encodeURIComponent(p.cliente)}`); return }
                      printShippingLabel(p, cl)
                    }}
                      startIcon={<LocalShipping />} fullWidth color="info" variant="outlined"
                      sx={{ borderRadius: 0, py: 1.3, fontWeight: 500, fontSize: 12, borderLeft: '1px solid', borderColor: 'divider' }}>
                      Etiqueta
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No hay pedidos.</Typography>
          </Box>
        )}
      </Box>

      <Snackbar open={!!snack} autoHideDuration={snack.includes('dirección') ? 6000 : 3000} onClose={() => { setSnack(''); setSnackAction(null) }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.includes('Error') ? 'error' : 'success'}
          action={snackAction ? (
            <Button component={Link} to={snackAction} size="small" sx={{ color: '#fff', textDecoration: 'underline', fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>
              Agregar dirección →
            </Button>
          ) : undefined}>
          {snack}
        </Alert>
      </Snackbar>
    </Layout>
  )
}
export default withStore(Pedidos)
