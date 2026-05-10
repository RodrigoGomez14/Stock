import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Grid, Typography, Card, CardContent, Chip, IconButton,
  Button, Backdrop, CircularProgress, Snackbar, Table,
  TableHead, TableBody, TableRow, TableCell, Paper,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import { Alert } from '@mui/material'
import { Add, ArrowForward } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { database } from '../services'
import { formatMoney, monthsList } from '../utilities'
import { Cheque } from '../components/Cheques/Cheque'
import { DialogEntregarCheque } from '../components/Cheques/DialogEntregarCheque'

const ChequesPage = (props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [snack, setSnack] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDialogEntregar, setShowDialogEntregar] = useState(false)

  const cheques = props.cheques || {}
  const filtered = Object.entries(cheques).filter(([_, c]) => {
    if (!c.fecha) return false
    const [d, m, y] = c.fecha.split('/')
    return parseInt(m) === month && parseInt(y) === year
  })

  const entregarCheque = async (id, fecha, nombre) => {
    setLoading(true)
    try {
      await database().ref().child(props.user.uid).child('cheques').child(id).update({ fechaDeEntrega: fecha, entregadoA: nombre })
      setSnack('Cheque entregado')
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
          <Button component={Link} to="/Depositar-Cheque" startIcon={<ArrowForward />} variant="contained" size="small">
            Depositar
          </Button>
          <Button component={Link} to="/Cheques-Personales" variant="outlined" size="small">
            Cheques Personales
          </Button>
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
                  <Cheque key={id} id={id} data={c} onEntregar={() => setShowDialogEntregar(id)} />
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
