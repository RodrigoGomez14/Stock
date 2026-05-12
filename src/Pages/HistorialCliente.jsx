import React from 'react'
import { useLocation } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Typography, Paper, Button, Grid, Chip, Divider
} from '@mui/material'
import { Add, ArrowUpward, ArrowDownward, Receipt, Payment } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { formatMoney, getCliente } from '../utilities'

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

const HistorialCliente = (props) => {
  const location = useLocation()
  const nombre = decodeURIComponent(location.search.replace(/^\?/, ''))

  if (!props.clientes || !nombre) {
    return (
      <Layout history={props.history} page="Historial" user={props.user?.uid}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><Typography>Cargando...</Typography></Box>
      </Layout>
    )
  }

  const cliente = getCliente(props.clientes, nombre)
  const displayName = cliente?.datos?.nombre || cliente?.nombre || nombre
  const deudaActual = cliente?.datos?.deuda || 0

  // Merge pedidos (increase debt) and pagos (decrease debt) into timeline
  const timeline = []

  // Pedidos que se enviaron (tienen metodoDePago con deudaPasada/deudaActualizada)
  if (cliente.pedidos) {
    Object.entries(cliente.pedidos).forEach(([id, p]) => {
      if (p.metodoDePago) {
        timeline.push({
          id, fecha: p.fecha, tipo: 'pedido',
          concepto: `${p.articulos?.length || 0} artículo(s)`,
          monto: p.metodoDePago.adeudado > 0 ? p.metodoDePago.adeudado : parseFloat(p.total || 0),
          pagado: p.metodoDePago.pagado || 0,
          deudaPasada: p.metodoDePago.deudaPasada || 0,
          deudaActualizada: p.metodoDePago.deudaActualizada || 0,
          aumento: p.metodoDePago.adeudado > 0,
          detalles: p.articulos?.map(a => `${a.cantidad}x ${a.nombre || a.producto}`).join(', ') || '',
        })
      }
    })
  }

  // Pagos (solo si hay monto > 0, sino es un registro vacío)
  if (cliente.pagos) {
    Object.entries(cliente.pagos).forEach(([id, p]) => {
      const monto = parseFloat(p.total || 0)
      if (monto === 0) return // skip pagos sin monto
      timeline.push({
        id, fecha: p.fecha, tipo: 'pago',
        concepto: p.efectivo ? 'Efectivo' : p.transferencias?.length ? 'Transferencia' : p.cheques?.length ? 'Cheques' : 'Pago',
        monto,
        deudaPasada: p.deudaPasada || 0,
        deudaActualizada: p.deudaActualizada !== undefined ? p.deudaActualizada : Math.max(0, (p.deudaPasada || 0) - monto),
        aumento: false,
        metodo: [
          p.efectivo && 'Efectivo',
          p.transferencias?.length && 'Transf.',
          p.cheques?.length && 'Cheques',
        ].filter(Boolean).join(' + '),
      })
    })
  }

  // Sort by date (newest first)
  timeline.sort((a, b) => {
    const [dA, mA, yA] = (a.fecha || '').split('/')
    const [dB, mB, yB] = (b.fecha || '').split('/')
    return new Date(yB, mB - 1, dB) - new Date(yA, mA - 1, dA)
  })

  // Group by month for visual separation
  const grouped = {}
  timeline.forEach((entry) => {
    const [d, m, y] = (entry.fecha || '').split('/')
    const key = `${y}-${m}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(entry)
  })

  const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <Layout history={props.history} page={`Historial ${displayName}`} user={props.user?.uid}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={700}>{displayName}</Typography>
            <Typography variant="body2" color="text.secondary">
              Deuda actual: <Box component="span" fontWeight={700} color={deudaActual > 0 ? 'error.main' : 'success.main'}>
                $ {formatMoney(deudaActual)}
              </Box>
            </Typography>
          </Box>
          <Button component={Link} to={`/Nuevo-Pago-Cliente?${nombre}`} variant="contained" startIcon={<Add />}>
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
                            {entry.tipo === 'pedido' ? (
                              <Receipt sx={{ fontSize: 20, color: entry.aumento ? 'error.main' : 'text.secondary' }} />
                            ) : (
                              <Payment sx={{ fontSize: 20, color: 'success.main' }} />
                            )}
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {entry.tipo === 'pedido' ? 'Pedido enviado' : 'Pago registrado'}
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

                        {/* Debt progression */}
                        <Box sx={{ display: 'flex', gap: 2, ml: 4.5, mt: 0.5 }}>
                          <Box sx={{ textAlign: 'center', flex: 1, bgcolor: 'action.hover', borderRadius: 1, py: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">Deuda anterior</Typography>
                            <Typography variant="body2" fontWeight={600}>$ {formatMoney(entry.deudaPasada)}</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center', flex: 1, bgcolor: 'action.hover', borderRadius: 1, py: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {entry.tipo === 'pedido' ? 'Adeudado' : 'Pagado'}
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
export default withStore(HistorialCliente)
