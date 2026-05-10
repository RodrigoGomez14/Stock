import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Typography, IconButton, Button, Backdrop, CircularProgress, Snackbar,
  Paper, Chip, Menu, MenuItem, Divider
} from '@mui/material'
import { Alert } from '@mui/material'
import {
  Edit, Delete, Phone, Email, Place, LocalShipping,
  Badge, CreditCard, Payment, Person, AttachMoney, History,
  MoreVert, ArrowUpward, ArrowDownward, Receipt
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { removeData } from '../services'
import { formatMoney } from '../utilities'
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

const Cliente = (props) => {
  const location = useLocation()
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [snack, setSnack] = useState('')
  const [menuAnchor, setMenuAnchor] = useState(null)
  const scrollRef = useRef(null)
  const nombre = decodeURIComponent(location.search.replace(/^\?/, ''))

  useEffect(() => {
    if (props.clientes && nombre) {
      setCliente({ nombre, ...props.clientes[nombre] })
      setLoading(false)
    }
  }, [props.clientes, nombre])

  const eliminar = async () => {
    setLoading(true)
    try {
      await removeData(props.user.uid, `clientes/${nombre}`)
      setSnack('Cliente eliminado')
      setTimeout(() => props.history.replace('/Clientes'), 1500)
    } catch { setLoading(false) }
  }

  if (loading || !cliente) {
    return (
      <Layout history={props.history} page="Cliente" user={props.user?.uid}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      </Layout>
    )
  }

  const d = cliente.datos || {}
  const pedidos = Object.values(cliente.pedidos || {})
  const pagos = Object.values(cliente.pagos || {})

  // Merge timeline
  const timeline = []
  pedidos.forEach((p, i) => {
    if (p.metodoDePago) {
      timeline.push({
        fecha: p.fecha, tipo: 'pedido', data: p, key: `p-${i}`,
        monto: p.total || 0, aumento: true,
        concepto: `${p.articulos?.length || 0} artículo(s)`,
      })
    }
  })
  pagos.forEach((p, i) => {
    const monto = parseFloat(p.total || p.monto || 0)
    if (monto > 0) {
      timeline.push({
        fecha: p.fecha, tipo: 'pago', data: p, key: `pay-${i}`,
        monto, aumento: false,
        concepto: p.efectivo ? 'Efectivo' : p.transferencias?.length ? 'Transferencia' : p.cheques?.length ? 'Cheques' : 'Pago',
      })
    }
  })
  timeline.sort((a, b) => {
    const [dA, mA, yA] = (a.fecha || '').split('/')
    const [dB, mB, yB] = (b.fecha || '').split('/')
    return new Date(yB, mB - 1, dB) - new Date(yA, mA - 1, dA)
  })

  return (
    <Layout history={props.history} page={nombre} user={props.user?.uid}>
      <Box sx={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
        {/* BANNER — contacto + nombre */}
        <Paper sx={{ borderRadius: 0, px: 3, py: 2, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
              <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: 'primary.dark', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Person sx={{ fontSize: 28, color: 'primary.light' }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h5" fontWeight={700}>{nombre}</Typography>
                <Box sx={{ display: 'flex', gap: 0.3, flexWrap: 'wrap', mt: 0.3 }}>
                  {d.dni && <Chip size="small" label={`DNI: ${d.dni}`} variant="outlined" sx={{ fontSize: 10 }} />}
                  {d.cuit && <Chip size="small" label={`CUIT: ${d.cuit}`} variant="outlined" sx={{ fontSize: 10 }} />}
                  {d.telefono?.map((t, i) => <Chip key={i} icon={<Phone sx={{ fontSize: 12 }} />} label={fmt(t)} size="small" sx={{ fontSize: 10 }} />)}
                  {d.mails?.map((m, i) => <Chip key={i} icon={<Email sx={{ fontSize: 12 }} />} label={fmt(m)} size="small" sx={{ fontSize: 10 }} />)}
                  {d.direcciones?.map((dir, i) => <Chip key={i} icon={<Place sx={{ fontSize: 12 }} />} label={fmt(dir)} size="small" variant="outlined" sx={{ fontSize: 10 }} />)}
                  {d.expresos?.map((ex, i) => (
                    <Chip key={i} icon={<LocalShipping sx={{ fontSize: 12 }} />} label={fmt(ex)} size="small" variant="outlined"
                      component={Link} to={`/Expreso?${encodeURIComponent(fmt(ex))}`} clickable sx={{ fontSize: 10 }} />
                  ))}
                </Box>
              </Box>
            </Box>
            {/* 3-dot menu */}
            <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
              <MoreVert />
            </IconButton>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
              <MenuItem component={Link} to={`/Editar-Cliente?${encodeURIComponent(nombre)}`}>
                <Edit fontSize="small" sx={{ mr: 1 }} /> Editar
              </MenuItem>
              <MenuItem onClick={() => { setMenuAnchor(null); if (window.confirm('Eliminar cliente?')) eliminar() }}>
                <Delete fontSize="small" sx={{ mr: 1, color: 'error.main' }} /> Eliminar
              </MenuItem>
            </Menu>
          </Box>
        </Paper>

        {/* DEUDA + ACCIONES — full width card */}
        <Paper sx={{ borderRadius: 0, px: 3, py: 1.5, flexShrink: 0, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
            <Typography variant="caption" color="text.secondary">Deuda</Typography>
            <Typography variant="h5" fontWeight={900} color={d.deuda > 0 ? 'error.main' : 'success.main'}>
              $ {formatMoney(d.deuda || 0)}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
              {pedidos.length} pedidos · {pagos.length} pagos
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button size="small" variant="contained" component={Link} to={`/Nuevo-Pago-Cliente?${encodeURIComponent(nombre)}`}
              startIcon={<AttachMoney />} sx={{ fontSize: 12 }}>
              Cobrar
            </Button>
            <Button size="small" variant="outlined" component={Link} to={`/Historial-Cliente?${encodeURIComponent(nombre)}`}
              startIcon={<History />} sx={{ fontSize: 12 }}>
              Historial
            </Button>
          </Box>
        </Paper>

        {/* TIMELINE — scrollable */}
        <Box ref={scrollRef} sx={{ flex: 1, overflow: 'auto', px: 3, py: 2 }}>
          {timeline.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {timeline.map((entry) => (
                <Paper key={entry.key} variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
                  <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {entry.aumento ? (
                        <ArrowUpward sx={{ fontSize: 18, color: 'error.main' }} />
                      ) : (
                        <ArrowDownward sx={{ fontSize: 18, color: 'success.main' }} />
                      )}
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {entry.tipo === 'pedido' ? 'Pedido enviado' : 'Pago registrado'}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {entry.fecha} · {entry.concepto}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" fontWeight={700} color={entry.aumento ? 'error.main' : 'success.main'}>
                      {entry.aumento ? '+' : '-'}$ {formatMoney(entry.monto)}
                    </Typography>
                  </Box>
                  {entry.tipo === 'pedido' && entry.data.articulos?.length > 0 && (
                    <Divider />
                  )}
                  {entry.tipo === 'pedido' && entry.data.articulos?.slice(0, 3).map((art, j) => {
                    const prodData = props.productos?.[art.nombre || art.producto]
                    return (
                      <Box key={j} sx={{ px: 2, py: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {prodData?.imagen && <ImgCache src={prodData.imagen} sx={{ width: 24, height: 24, borderRadius: 0.5 }} />}
                        <Typography variant="caption" sx={{ flex: 1 }}>{art.nombre || art.producto}</Typography>
                        <Typography variant="caption" color="text.disabled">{art.cantidad}u</Typography>
                        <Typography variant="caption" fontWeight={600}>$ {formatMoney((art.cantidad || 0) * (art.precio || 0))}</Typography>
                      </Box>
                    )
                  })}
                  {entry.tipo === 'pedido' && entry.data.articulos?.length > 3 && (
                    <Typography variant="caption" color="text.disabled" sx={{ px: 2, pb: 0.5, display: 'block' }}>
                      +{entry.data.articulos.length - 3} más
                    </Typography>
                  )}
                  {entry.tipo === 'pago' && (
                    <Box sx={{ px: 2, pb: 0.5, display: 'flex', gap: 0.3, flexWrap: 'wrap' }}>
                      {entry.data.efectivo && <Chip label={`Efectivo: $${formatMoney(entry.data.efectivo)}`} size="small" variant="outlined" sx={{ fontSize: 10 }} />}
                      {entry.data.transferencias?.map((t, j) => <Chip key={j} label={`${t.cuenta}: $${formatMoney(t.monto)}`} size="small" variant="outlined" sx={{ fontSize: 10 }} />)}
                      {entry.data.cheques?.length > 0 && <Chip label={`${entry.data.cheques.length} cheque(s)`} size="small" variant="outlined" sx={{ fontSize: 10 }} />}
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary" variant="body2">Sin movimientos registrados.</Typography>
            </Box>
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

export default withStore(Cliente)
