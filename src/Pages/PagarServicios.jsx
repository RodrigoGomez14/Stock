import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Paper, Button, Checkbox, IconButton,
  Table, TableHead, TableBody, TableRow, TableCell, Chip,
  Backdrop, CircularProgress, Snackbar, Select, MenuItem, FormControl, InputLabel,
  Collapse
} from '@mui/material'
import { Alert } from '@mui/material'
import { ChevronLeft, ChevronRight, AttachMoney, Check, Close } from '@mui/icons-material'
import { updateData } from '../services'
import { formatMoney, obtenerFecha } from '../utilities'

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const PagarServicios = (props) => {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const idPeriodo = `${year}-${month + 1}`
  const instancias = props.instanciasPago?.[idPeriodo] || {}
  const pendientes = Object.entries(instancias)
    .filter(([_, inst]) => inst.estado === 'pendiente')
    .map(([id, inst]) => ({ id, ...inst, nombre: props.servicios?.[id]?.nombre || '—', categoria: props.servicios?.[id]?.categoria }))

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const pagarSeleccionados = async () => {
    setLoading(true)
    try {
      const updates = {}
      selected.forEach((id) => {
        updates[`instanciasPago/${idPeriodo}/${id}/estado`] = 'pagado'
        updates[`instanciasPago/${idPeriodo}/${id}/fechaPago`] = obtenerFecha()
      })
      await updateData(props.user.uid, '', updates)
      setSnack(`${selected.length} servicio(s) pagado(s)`)
      setSelected([])
      setConfirmOpen(false)
    } catch { }
    setLoading(false)
  }

  const total = pendientes.filter((p) => selected.includes(p.id)).reduce((s, p) => s + parseFloat(p.monto || 0), 0)

  return (
    <Layout history={props.history} page="Pagar Servicios" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton onClick={() => setMonth((m) => Math.max(0, m - 1))}><ChevronLeft /></IconButton>
          <Typography variant="h6" fontWeight={600} sx={{ minWidth: 160, textAlign: 'center' }}>
            {MONTHS[month]} {year}
          </Typography>
          <IconButton onClick={() => setMonth((m) => Math.min(11, m + 1))}><ChevronRight /></IconButton>
        </Box>

        {pendientes.length > 0 ? (
          <>
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox"><Checkbox checked={selected.length === pendientes.length && pendientes.length > 0}
                      onChange={() => setSelected(selected.length === pendientes.length ? [] : pendientes.map((p) => p.id))} /></TableCell>
                    <TableCell>Servicio</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Vencimiento</TableCell>
                    <TableCell align="right">Monto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendientes.map((p) => (
                    <TableRow key={p.id} hover selected={selected.includes(p.id)}>
                      <TableCell padding="checkbox"><Checkbox checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} /></TableCell>
                      <TableCell>{p.nombre}</TableCell>
                      <TableCell><Chip size="small" label={p.categoria} variant="outlined" /></TableCell>
                      <TableCell>{p.vencimiento}</TableCell>
                      <TableCell align="right">$ {formatMoney(p.monto || 0)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
              <Typography variant="h6">Total: $ {formatMoney(total)}</Typography>
              <Button variant="contained" disabled={selected.length === 0}
                onClick={() => setConfirmOpen(true)} startIcon={<AttachMoney />}>
                Pagar ({selected.length})
              </Button>
            </Box>

            <Collapse in={confirmOpen}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mt: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Confirmar pago de {selected.length} servicio(s) por $ {formatMoney(total)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" startIcon={<Check />} onClick={pagarSeleccionados}>Confirmar</Button>
                  <Button variant="outlined" startIcon={<Close />} onClick={() => setConfirmOpen(false)}>Cancelar</Button>
                </Box>
              </Paper>
            </Collapse>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No hay servicios pendientes para este período.</Typography>
          </Box>
        )}
      </Box>

      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(PagarServicios)
