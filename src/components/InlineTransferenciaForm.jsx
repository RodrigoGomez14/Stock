import React, { useState, useEffect } from 'react'
import { Collapse, Paper, Grid, TextField, Button, Autocomplete, Box, IconButton, Typography } from '@mui/material'
import { Delete, Check, Close } from '@mui/icons-material'
import { formatMoney } from '../utilities'

export const InlineTransferenciaForm = ({ show, setShow, datos, setdatos, editIndex, seteditIndex, total, settotal, cuentasBancarias }) => {
  const [cuenta, setCuenta] = useState('')
  const [monto, setMonto] = useState('')

  useEffect(() => {
    if (editIndex !== -1 && datos[editIndex]) {
      setCuenta(datos[editIndex].cuenta)
      setMonto(datos[editIndex].monto)
    }
  }, [editIndex])

  const reset = () => { setCuenta(''); setMonto('') }

  const agregar = () => {
    if (!cuenta || !monto) return
    const item = { cuenta, monto: parseFloat(monto) }
    if (editIndex >= 0) {
      const copy = [...datos]
      const oldMonto = parseFloat(copy[editIndex].monto || 0)
      copy[editIndex] = item
      setdatos(copy)
      settotal(t => t - oldMonto + item.monto)
    } else {
      setdatos([...datos, item])
      settotal(t => t + item.monto)
    }
    reset()
    setShow(false)
    seteditIndex(-1)
  }

  return (
    <>
      {datos.length > 0 && (
        <Box sx={{ mb: 1 }}>
          {datos.map((t, i) => (
            <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
              <Typography variant="body2">{t.cuenta}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" fontWeight={600}>$ {formatMoney(t.monto)}</Typography>
                <IconButton size="small" color="error" onClick={() => {
                  const copy = datos.filter((_, j) => j !== i)
                  setdatos(copy)
                  settotal(t => t - t.monto)
                }}><Delete fontSize="small" /></IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Collapse in={show}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                value={cuenta}
                options={cuentasBancarias ? Object.keys(cuentasBancarias) : []}
                getOptionLabel={(o) => o}
                onChange={(_, v) => setCuenta(v || '')}
                onInputChange={(_, v) => setCuenta(v || '')}
                renderInput={(p) => <TextField {...p} label="Cuenta destino" fullWidth size="small" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Monto ($)" type="number" value={monto}
                onChange={(e) => setMonto(e.target.value)} />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
            <Button size="small" variant="contained" startIcon={<Check />} onClick={agregar} disabled={!cuenta || !monto}>
              {editIndex >= 0 ? 'Guardar' : 'Agregar'}
            </Button>
            <Button size="small" variant="outlined" startIcon={<Close />} onClick={() => { setShow(false); seteditIndex(-1); reset() }}>
              Cancelar
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </>
  )
}
