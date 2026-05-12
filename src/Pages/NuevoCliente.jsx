import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, TextField, Button, Grid, Typography, Chip, Paper, Autocomplete,
  Backdrop, CircularProgress, Snackbar, IconButton
} from '@mui/material'
import { Alert } from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import { BaseWizard } from '../components/BaseWizard'
import { removeData, updateData } from '../services'
import { checkSearch, getCliente, fmtValor } from '../utilities'

const EMPTY_CLIENT = {
  nombre: '', dni: '', cuit: '', expreso: null,
  telefonos: [], mails: [], direcciones: [], infoExtra: [], deuda: 0,
}

const NuevoCliente = (props) => {
  const [data, setData] = useState({ ...EMPTY_CLIENT })
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')

  const isEdit = !!props.history.location.search

  const toStr = (v) => (typeof v === 'string' ? v : JSON.stringify(v))

  useEffect(() => {
    if (isEdit) {
      const found = getCliente(props.clientes, checkSearch(props.history.location.search))
      const c = found?.datos || found
      if (c) {
        setData({
          nombre: c.nombre || '',
          dni: c.dni || '',
          cuit: c.cuit || '',
          expreso: c.expreso || null,
          telefonos: (c.telefonos || []).map(toStr),
          mails: (c.mails || []).map(toStr),
          direcciones: (c.direcciones || []).map((d) => typeof d === 'string' ? { calleYnumero: d, ciudad: '', cp: '', provincia: '' } : d),
          infoExtra: (c.infoExtra || []).map(toStr),
        })
      }
    }
  }, [])

  const set = (field) => (val) => setData((prev) => ({ ...prev, [field]: val }))

  const addItem = (field) => {
    setData((prev) => ({ ...prev, [field]: [...prev[field], ''] }))
  }
  const updateItem = (field, index) => (e) => {
    const copy = [...data[field]]
    copy[index] = e.target.value
    setData((prev) => ({ ...prev, [field]: copy }))
  }
  const removeItem = (field, index) => () => {
    setData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }))
  }

  const guardar = async () => {
    setLoading(true)
    const payload = {
      datos: {
        nombre: data.nombre,
        dni: data.dni,
        cuit: data.cuit,
        expresos: data.expreso ? [data.expreso] : [],
        mails: data.mails,
        direcciones: data.direcciones,
        telefonos: data.telefonos,
        infoExtra: data.infoExtra,

      },
    }
    try {
      if (isEdit) {
        const oldName = props.history.location.search.slice(1)
        await removeData(props.user.uid, `clientes/${oldName}`)
        await updateData(props.user.uid, `clientes/${data.nombre}`, payload)
      } else {
        await updateData(props.user.uid, 'clientes', { [data.nombre]: payload })
      }
      setSnack(isEdit ? 'Cliente editado correctamente' : 'Cliente creado correctamente')
      setTimeout(() => props.history.replace(`/Cliente?${data.nombre}`), 1500)
    } catch { setLoading(false) }
  }

  const renderListEditor = (items, label, field) => (
    <Box>
      {items.map((item, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            label={`${label} ${i + 1}`}
            value={typeof item === 'string' ? item : fmtValor(item)}
            onChange={updateItem(field, i)}
          />
          <IconButton color="error" onClick={removeItem(field, i)}><Delete /></IconButton>
        </Box>
      ))}
      <Button size="small" startIcon={<Add />} onClick={() => addItem(field)}>
        Agregar {label.toLowerCase()}
      </Button>
    </Box>
  )

  const stepPanels = [
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Datos personales</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Nombre *" value={data.nombre} onChange={(e) => set('nombre')(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth label="DNI" value={data.dni} onChange={(e) => set('dni')(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth label="CUIT" value={data.cuit} onChange={(e) => set('cuit')(e.target.value)} />
        </Grid>
      </Grid>
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Teléfonos</Typography>
      {renderListEditor(data.telefonos, 'Teléfono', 'telefonos')}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>Emails</Typography>
        {renderListEditor(data.mails, 'Email', 'mails')}
      </Box>
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Direcciones</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Completá al menos dirección, localidad y provincia para poder imprimir etiquetas de envío.
      </Typography>
      {data.direcciones.map((dir, i) => {
        const addr = typeof dir === 'string' ? { calleYnumero: dir } : dir
        return (
          <Paper key={i} variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 1.5 }}>
            <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: 'block' }}>Dirección {i + 1}</Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <TextField fullWidth size="small" label="Dirección" value={addr.calleYnumero || ''}
                  onChange={(e) => {
                    const copy = [...data.direcciones]
                    copy[i] = { ...addr, calleYnumero: e.target.value }
                    set('direcciones')(copy)
                  }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="Localidad" value={addr.ciudad || ''}
                  onChange={(e) => {
                    const copy = [...data.direcciones]
                    copy[i] = { ...addr, ciudad: e.target.value }
                    set('direcciones')(copy)
                  }} />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth size="small" label="CP" value={addr.cp || ''}
                  onChange={(e) => {
                    const copy = [...data.direcciones]
                    copy[i] = { ...addr, cp: e.target.value }
                    set('direcciones')(copy)
                  }} />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth size="small" label="Provincia" value={addr.provincia || ''}
                  onChange={(e) => {
                    const copy = [...data.direcciones]
                    copy[i] = { ...addr, provincia: e.target.value }
                    set('direcciones')(copy)
                  }} />
              </Grid>
            </Grid>
            <Box sx={{ mt: 1, textAlign: 'right' }}>
              <IconButton size="small" color="error" onClick={() => set('direcciones')(data.direcciones.filter((_, j) => j !== i))}><Delete fontSize="small" /></IconButton>
            </Box>
          </Paper>
        )
      })}
      <Button size="small" startIcon={<Add />} onClick={() => set('direcciones')([...data.direcciones, { calleYnumero: '', ciudad: '', cp: '', provincia: '' }])}>
        Agregar dirección
      </Button>
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>Expreso / Transporte</Typography>
        <Autocomplete
          freeSolo
          value={data.expreso}
          options={props.expresos ? Object.values(props.expresos).map(e => e.datos?.nombre || e.nombre || '').filter(Boolean) : []}
          getOptionLabel={(o) => o}
          onChange={(_, v) => set('expreso')(v)}
          onInputChange={(_, v) => set('expreso')(v)}
          renderInput={(params) => <TextField {...params} label="Expreso preferido" fullWidth size="small" />}
        />
      </Box>
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Info adicional</Typography>
      {renderListEditor(data.infoExtra, 'Nota', 'infoExtra')}
    </Box>,

    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Confirmar datos</Typography>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={6}><Typography variant="caption" color="text.secondary">Nombre</Typography><Typography>{data.nombre}</Typography></Grid>
          <Grid item xs={3}><Typography variant="caption" color="text.secondary">DNI</Typography><Typography>{data.dni || '—'}</Typography></Grid>
          <Grid item xs={3}><Typography variant="caption" color="text.secondary">CUIT</Typography><Typography>{data.cuit || '—'}</Typography></Grid>
          <Grid item xs={6}><Typography variant="caption" color="text.secondary">Teléfonos</Typography><Typography>{data.telefonos.length} registrados</Typography></Grid>
          <Grid item xs={6}><Typography variant="caption" color="text.secondary">Emails</Typography><Typography>{data.mails.length} registrados</Typography></Grid>
          <Grid item xs={12}><Typography variant="caption" color="text.secondary">Direcciones</Typography>
            {data.direcciones.length > 0 ? (
              data.direcciones.map((dir, i) => {
                const a = typeof dir === 'string' ? { calleYnumero: dir } : dir
                return <Typography key={i} variant="body2">{[a.calleYnumero, a.ciudad, a.cp, a.provincia].filter(Boolean).join(', ') || '—'}</Typography>
              })
            ) : <Typography variant="body2">—</Typography>}
          </Grid>
          <Grid item xs={6}><Typography variant="caption" color="text.secondary">Expreso</Typography><Typography>{data.expreso || '—'}</Typography></Grid>
        </Grid>
      </Paper>
    </Box>,
  ]

  return (
    <Layout history={props.history} page={isEdit ? 'Editar Cliente' : 'Nuevo Cliente'} user={props.user?.uid} blockGoBack={true}>
      <BaseWizard
        stepLabels={['Datos', 'Contacto', 'Dirección', 'Adicional', 'Confirmar']}
        steps={stepPanels}
        activeStep={activeStep}
        onNext={() => setActiveStep((s) => s + 1)}
        onBack={() => setActiveStep((s) => s - 1)}
        onFinish={guardar}
        disabled={!data.nombre}
        finishLabel={isEdit ? 'Guardar Cambios' : 'Crear Cliente'}
      />
      <Backdrop open={loading} sx={{ zIndex: (t) => t.zIndex.drawer + 1, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success" variant="filled">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}

export default withStore(NuevoCliente)
