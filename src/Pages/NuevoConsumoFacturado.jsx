import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, TextField, Typography, Paper, Button, Grid, Backdrop,
  CircularProgress, Snackbar
} from '@mui/material'
import { Alert } from '@mui/material'
import { pushData, updateData } from '../services'
import { checkSearch, obtenerFecha } from '../utilities'

const NuevoConsumoFacturado = (props) => {
  const [total, setTotal] = useState('')
  const [totalIva, setTotalIva] = useState('')
  const [titulo, setTitulo] = useState('')
  const [fecha, setFecha] = useState('')
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const isEdit = !!props.history.location.search

  useEffect(() => {
    if (isEdit) {
      const c = props.compras?.[checkSearch(props.history.location.search)]
      if (c) {
        setTitulo(c.titulo || '')
        setTotal(c.total || '')
        setTotalIva(c.totalIva || '')
        setFecha(c.fecha || '')
      }
    }
  }, [])

  const guardar = async () => {
    if (!titulo || !total || !totalIva) return
    setLoading(true)
    const aux = {
      fecha: fecha || obtenerFecha(), titulo, total: parseFloat(total),
      totalIva: parseFloat(totalIva), consumoFacturado: true,
      metodoDePago: { facturacion: true },
    }
    try {
      if (isEdit) {
        await updateData(props.user.uid, `compras/${checkSearch(props.history.location.search)}`, aux)
      } else {
        await pushData(props.user.uid, 'compras', aux)
      }
      setSnack(isEdit ? 'Consumo editado' : 'Consumo registrado')
      setTimeout(() => props.history.replace('/Iva'), 1500)
    } catch { setLoading(false) }
  }

  return (
    <Layout history={props.history} page={isEdit ? 'Editar Consumo' : 'Nuevo Consumo'} user={props.user?.uid} blockGoBack={true}>
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {isEdit ? 'Editar consumo facturado' : 'Nuevo consumo facturado'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Registrá un gasto con factura a nombre de la empresa para el control de IVA.
        </Typography>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Concepto *" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Total ($)" type="number" value={total} onChange={(e) => setTotal(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="IVA discriminado ($) *" type="number" value={totalIva} onChange={(e) => setTotalIva(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Fecha" type="date" value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                InputLabelProps={{ shrink: true }} />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 1, mt: 3, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => props.history.goBack()}>Cancelar</Button>
            <Button variant="contained" onClick={guardar} disabled={!titulo || !total || !totalIva}>
              {isEdit ? 'Guardar cambios' : 'Registrar consumo'}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}
export default withStore(NuevoConsumoFacturado)
