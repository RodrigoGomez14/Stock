import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Typography, Paper, TextField, Button, Grid, Backdrop,
  CircularProgress, Snackbar
} from '@mui/material'
import { Alert } from '@mui/material'
import { AccountBalance, Save } from '@mui/icons-material'
import { updateData } from '../services'

const NuevaCuentaBancaria = (props) => {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [banco, setBanco] = useState('')
  const [cbu, setCbu] = useState('')
  const [alias, setAlias] = useState('')
  const [titular, setTitular] = useState('')
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')

  const guardar = async () => {
    if (!nombre) return
    setLoading(true)
    try {
      await updateData(props.user.uid, 'CuentasBancarias', {
        [nombre]: { nombre, banco, cbu, alias, titular }
      })
      setSnack('Cuenta bancaria creada')
      setTimeout(() => navigate('/Cuentas-Bancarias', { replace: true }), 1500)
    } catch {
      setLoading(false)
    }
  }

  return (
    <Layout history={props.history} page="Nueva Cuenta Bancaria" user={props.user?.uid} blockGoBack={true}>
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <AccountBalance color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight={800}>Nueva cuenta bancaria</Typography>
        </Box>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Nombre de la cuenta *" value={nombre}
                onChange={(e) => setNombre(e.target.value)} autoFocus />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Banco" value={banco}
                onChange={(e) => setBanco(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Titular" value={titular}
                onChange={(e) => setTitular(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="CBU / Cuenta" value={cbu}
                onChange={(e) => setCbu(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Alias" value={alias}
                onChange={(e) => setAlias(e.target.value)} />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 1, mt: 3, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/Cuentas-Bancarias')}>Cancelar</Button>
            <Button variant="contained" onClick={guardar} disabled={!nombre}
              startIcon={<Save />}>
              Crear cuenta
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

export default withStore(NuevaCuentaBancaria)
