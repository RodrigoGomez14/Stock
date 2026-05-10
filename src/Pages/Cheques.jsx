import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Typography, Button, Backdrop, CircularProgress, Snackbar, Table,
  TableHead, TableBody, TableRow, TableCell, Paper, Collapse,
  FormControl, InputLabel, Select, MenuItem, TextField
} from '@mui/material'
import { Alert } from '@mui/material'
import { ArrowForward } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { updateData } from '../services'
import { formatMoney, monthsList, obtenerFecha } from '../utilities'
import { Cheque } from '../components/Cheques/Cheque'

const ChequesPage = (props) => {
  const navigate = useNavigate()
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [snack, setSnack] = useState('')
  const [loading, setLoading] = useState(false)
  const [entregarId, setEntregarId] = useState(null)
  const [entregarNombre, setEntregarNombre] = useState('')

  const cheques = props.cheques || {}
  const filtered = Object.entries(cheques).filter(([_, c]) => {
    if (!c.fecha) return false
    const [d, m, y] = c.fecha.split('/')
    return parseInt(m) === month && parseInt(y) === year
  })

  const entregarCheque = async (id) => {
    if (!entregarNombre) return
    setLoading(true)
    try {
      await updateData(props.user.uid, `cheques/${id}`, { fechaDeEntrega: obtenerFecha(), entregadoA: entregarNombre })
      setSnack('Cheque entregado')
      setEntregarId(null)
      setEntregarNombre('')
    } catch { }
    setLoading(false)
  }

  return (
    <Layout history={props.history} page="Cheques" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Mes</InputLabel>
            <Select value={month} label="Mes" onChange={(e) => setMonth(e.target.value)}>
              {monthsList.map((m, i) => <MenuItem key={i} value={i + 1}>{m}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Año</InputLabel>
            <Select value={year} label="Año" onChange={(e) => setYear(e.target.value)}>
              {[2024, 2025, 2026].map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </FormControl>
          <Button component={Link} to="/Depositar-Cheque" startIcon={<ArrowForward />} variant="contained" size="small">Depositar</Button>
          <Button component={Link} to="/Cheques-Personales" variant="outlined" size="small">Cheques Personales</Button>
        </Box>

        {filtered.length > 0 ? (
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Número</TableCell>
                  <TableCell>Banco</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Vencimiento</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(([id, c]) => (
                  <React.Fragment key={id}>
                    <Cheque key={id} id={id} data={c} onEntregar={() => { setEntregarId(id); setEntregarNombre('') }} />
                    {entregarId === id && (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ py: 0, borderBottom: 0 }}>
                          <Collapse in={entregarId === id}>
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, my: 1 }}>
                              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Entregar cheque</Typography>
                              <TextField size="small" label="Entregar a" value={entregarNombre}
                                onChange={(e) => setEntregarNombre(e.target.value)} sx={{ mr: 1 }} />
                              <Button size="small" variant="contained" disabled={!entregarNombre}
                                onClick={() => entregarCheque(id)}>Confirmar</Button>
                              <Button size="small" onClick={() => setEntregarId(null)} sx={{ ml: 1 }}>Cancelar</Button>
                            </Paper>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">No hay cheques para este período.</Typography>
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
export default withStore(ChequesPage)
