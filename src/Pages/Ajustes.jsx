import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Snackbar, IconButton, InputAdornment, Divider, Chip
} from '@mui/material'
import { Alert } from '@mui/material'
import {
  Settings, Key, Description, Save, Download, OpenInNew,
  Visibility, VisibilityOff, Store, Receipt
} from '@mui/icons-material'
import { getApiKey, setApiKey, getSheetsUrl, setSheetsUrl, getPuntoVenta, setPuntoVenta, exportAllData } from '../services'

const Ajustes = (props) => {
  const [apiKey, setApiKeyState] = useState(getApiKey())
  const [sheetsUrl, setSheetsUrlState] = useState(getSheetsUrl())
  const [puntoVenta, setPuntoVentaState] = useState(String(getPuntoVenta()))
  const [showKey, setShowKey] = useState(false)
  const [snack, setSnack] = useState('')
  const [exporting, setExporting] = useState(false)

  const saveApiKey = () => {
    setApiKey(apiKey)
    setSnack('API Key guardada')
  }

  const saveSheetsUrl = () => {
    setSheetsUrl(sheetsUrl)
    setSnack('URL de Google Sheets guardada')
  }

  const savePuntoVenta = () => {
    setPuntoVenta(parseInt(puntoVenta, 10) || 1)
    setSnack('Punto de venta guardado')
  }

  const handleExport = async () => {
    if (!props.user?.uid) return
    setExporting(true)
    try {
      const data = await exportAllData(props.user.uid)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `respaldo-stock-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      setSnack('Datos exportados correctamente')
    } catch (e) {
      setSnack('Error al exportar: ' + e.message)
    }
    setExporting(false)
  }

  const SectionTitle = ({ icon, title }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      {icon}
      <Typography variant="h6" fontWeight={700}>{title}</Typography>
    </Box>
  )

  return (
    <Layout history={props.history} page="Ajustes" user={props.user?.uid}>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Settings fontSize="large" color="primary" />
          <Typography variant="h5" fontWeight={800}>Configuración</Typography>
        </Box>

        {/* Facturación */}
        <Card sx={{ borderRadius: 2, mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <SectionTitle icon={<Receipt fontSize="small" color="primary" />} title="Facturación Electrónica" />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Conectá tu app con{' '}
              <Box component="a" href="https://tusfacturas.app" target="_blank" rel="noopener noreferrer"
                sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                TusFacturasAPP
                <OpenInNew sx={{ fontSize: 12, ml: 0.3, verticalAlign: 'middle' }} />
              </Box>
              {' '}para emitir factura electrónica (AFIP/ARCA).
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 2 }}>
              Obtené tu API Key desde el panel de TusFacturasAPP → Configuración → API.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <TextField
                size="small" label="API Key" value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                sx={{ flex: 1, minWidth: 250 }}
                type={showKey ? 'text' : 'password'}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Key fontSize="small" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowKey(!showKey)} edge="end">
                        {showKey ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="contained" onClick={saveApiKey} startIcon={<Save />} sx={{ height: 40 }}>
                Guardar
              </Button>
            </Box>
            <Divider sx={{ my: 2.5 }} />
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Punto de venta</Typography>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 1 }}>
              Número de punto de venta asignado por AFIP/ARCA (por defecto: 1).
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                size="small" label="Punto de venta" value={puntoVenta}
                onChange={(e) => setPuntoVentaState(e.target.value)}
                type="number" inputProps={{ min: 1, max: 9999 }}
                sx={{ width: 160 }}
              />
              <Button variant="outlined" onClick={savePuntoVenta} startIcon={<Save />} size="small">
                Guardar
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Google Sheets */}
        <Card sx={{ borderRadius: 2, mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <SectionTitle icon={<Description fontSize="small" color="primary" />} title="Google Sheets" />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              URL de tu Google Apps Script web app para sincronizar precios con la Lista de Precios.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <TextField
                size="small" label="URL de Google Sheets" value={sheetsUrl}
                onChange={(e) => setSheetsUrlState(e.target.value)}
                placeholder="https://script.google.com/macros/s/..."
                sx={{ flex: 1, minWidth: 300 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Store fontSize="small" /></InputAdornment>,
                }}
              />
              <Button variant="contained" onClick={saveSheetsUrl} startIcon={<Save />} sx={{ height: 40 }}>
                Guardar
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Respaldo */}
        <Card sx={{ borderRadius: 2, mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <SectionTitle icon={<Download fontSize="small" color="primary" />} title="Respaldo de datos" />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Exportá todos tus datos (clientes, productos, pedidos, etc.) como archivo JSON.
              Guardalo en un lugar seguro.
            </Typography>
            <Button
              variant="outlined" color="warning" onClick={handleExport}
              startIcon={<Download />} disabled={exporting}
            >
              {exporting ? 'Exportando...' : 'Exportar datos'}
            </Button>
            <Divider sx={{ my: 2.5 }} />
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
              ¿Copia de seguridad diaria automática?
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 1 }}>
              Firebase Realtime Database no ofrece respaldo automático. Opciones:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                • Usá <Chip label="firebase database:export" size="small" variant="outlined" sx={{ fontSize: 11 }} /> en tu terminal para exportar manualmente
              </Typography>
              <Typography variant="caption" color="text.secondary">
                • Configurá un script Node.js con GitHub Actions o Windows Task Scheduler para exportar a las 3 AM
              </Typography>
              <Typography variant="caption" color="text.secondary">
                • Probá la extensión Firebase "Export Collections to BigQuery" (gratuita hasta 10GB/mes)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                • Usá el botón "Exportar datos" de esta pantalla periódicamente
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack('')}>
          <Alert severity={snack.includes('Error') ? 'error' : 'success'}>{snack}</Alert>
        </Snackbar>
      </Box>
    </Layout>
  )
}

export default withStore(Ajustes)
