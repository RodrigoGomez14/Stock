import React from 'react'
import { useLocation } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Typography, Paper, Button, Divider
} from '@mui/material'
import { Add, ArrowUpward, ArrowDownward, Send, Payment } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney } from '../utilities'

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

const HistorialProveedor = (props) => {
  const location = useLocation()
  const nombre = decodeURIComponent(location.search.replace(/^\?/, ''))

  if (!props.proveedores || !nombre) {
    return (
      <Layout history={props.history} page="Historial" user={props.user?.uid}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><Typography>Cargando...</Typography></Box>
      </Layout>
    )
  }

  const proveedor = props.proveedores[nombre]
  const deudaActual = proveedor?.datos?.deuda || 0

  // Merge entregas (debt increase) and pagos (debt decrease)
  const timeline = []

  if (proveedor.entregas) {
    Object.entries(proveedor.entregas).forEach(([id, e]) => {
      timeline.push({
        id, fecha: e.fecha, tipo: 'entrega',
        concepto: `${e.articulos?.length || 0} producto(s)`,
        monto: parseFloat(e.total || 0),
        deudaPasada: e.deudaPasada || 0,
        deudaActualizada: e.deudaActualizada || 0,
        aumento: true,
        detalles: e.articulos?.map(a => `${a.cantidad}x ${a.producto || a.nombre}`).join(', ') || '',
      })
    })
  }

  if (proveedor.pagos) {
    Object.entries(proveedor.pagos).forEach(([id, p]) => {
      timeline.push({
        id, fecha: p.fecha, tipo: 'pago',
        concepto: p.efectivo ? 'Efectivo' : p.transferencias?.length ? 'Transferencia' : p.cheques?.length ? 'Cheques' : p.chequesPersonales?.length ? 'Ch. Personal' : 'Pago',
        monto: parseFloat(p.total || 0),
        deudaPasada: p.deudaPasada || 0,
        deudaActualizada: p.deudaActualizada !== undefined ? p.deudaActualizada : Math.max(0, (p.deudaPasada || 0) - parseFloat(p.total || 0)),
        aumento: false,
        metodo: [
          p.efectivo && 'Efectivo',
          p.transferencias?.length && 'Transf.',
          p.cheques?.length && 'Cheques',
          p.chequesPersonales?.length && 'Ch. Pers.',
        ].filter(Boolean).join(' + '),
      })
    })
  }

  timeline.sort((a, b) => {
    const [dA, mA, yA] = (a.fecha || '').split('/')
    const [dB, mB, yB] = (b.fecha || '').split('/')
    return new Date(yB, mB - 1, dB) - new Date(yA, mA - 1, dA)
  })

  const grouped = {}
  timeline.forEach((entry) => {
    const [d, m, y] = (entry.fecha || '').split('/')
    const key = `${y}-${m}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(entry)
  })

  const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <Layout history={props.history} page={`Historial ${nombre}`} user={props.user?.uid}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={700}>{nombre}</Typography>
            <Typography variant="body2" color="text.secondary">
              Deuda actual: <Box component="span" fontWeight={700} color={deudaActual > 0 ? 'error.main' : 'success.main'}>
                $ {formatMoney(deudaActual)}
              </Box>
            </Typography>
          </Box>
          <Button component={Link} to={`/Nuevo-Pago-Proveedor?${nombre}`} variant="contained" startIcon={<Add />}>
            Nuevo Pago
          </Button>
        </Box>

        {timeline.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
            Sin movimientos registrados.
          </Typography>
        ) : (
          sortedKeys.map((key) => {
            const [y, m] = key.split('-')
            const label = `${MONTHS[parseInt(m) - 1]} ${y}`
            const items = grouped[key]
            return (
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }} key={key}>
                <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'action.selected', borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" fontWeight={700}>{label}</Typography>
                </Box>
                <Box sx={{ px: 2.5, py: 1 }}>
                  {items.map((entry, i) => (
                    <React.Fragment key={`${entry.tipo}-${entry.id}`}>
                      {i > 0 && <Divider sx={{ my: 1 }} />}
                      <Box sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {entry.tipo === 'entrega' ? (
                              <Send sx={{ fontSize: 20, color: 'error.main' }} />
                            ) : (
                              <Payment sx={{ fontSize: 20, color: 'success.main' }} />
                            )}
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {entry.tipo === 'entrega' ? 'Entrega recibida' : 'Pago registrado'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {entry.fecha} — {entry.concepto}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                              {entry.aumento ? (
                                <ArrowUpward sx={{ fontSize: 16, color: 'error.main' }} />
                              ) : (
                                <ArrowDownward sx={{ fontSize: 16, color: 'success.main' }} />
                              )}
                              <Typography variant="body2" fontWeight={700} color={entry.aumento ? 'error.main' : 'success.main'}>
                                {entry.aumento ? '+' : '-'}$ {formatMoney(entry.monto)}
                              </Typography>
                            </Box>
                            {entry.tipo === 'pago' && entry.metodo && (
                              <Typography variant="caption" color="text.disabled">{entry.metodo}</Typography>
                            )}
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, ml: 4.5, mt: 0.5 }}>
                          <Box sx={{ textAlign: 'center', flex: 1, bgcolor: 'action.hover', borderRadius: 1, py: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">Deuda anterior</Typography>
                            <Typography variant="body2" fontWeight={600}>$ {formatMoney(entry.deudaPasada)}</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center', flex: 1, bgcolor: 'action.hover', borderRadius: 1, py: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {entry.tipo === 'entrega' ? 'Monto' : 'Pagado'}
                            </Typography>
                            <Typography variant="body2" fontWeight={700} color={entry.aumento ? 'error.main' : 'success.main'}>
                              $ {formatMoney(entry.monto)}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center', flex: 1, bgcolor: 'primary.dark', borderRadius: 1, py: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">Deuda actualizada</Typography>
                            <Typography variant="body2" fontWeight={800}>$ {formatMoney(entry.deudaActualizada)}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </React.Fragment>
                  ))}
                </Box>
              </Paper>
            )
          })
        )}
      </Box>
    </Layout>
  )
}
export default withStore(HistorialProveedor)
