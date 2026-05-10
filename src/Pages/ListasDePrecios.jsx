import React, { useState, useEffect } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Typography, Paper, Button, Grid, TextField, InputAdornment,
  Backdrop, CircularProgress, Snackbar, Table, TableHead, TableBody,
  TableRow, TableCell, Chip, IconButton, Autocomplete
} from '@mui/material'
import { Alert } from '@mui/material'
import { Search, Add, PictureAsPdf, CloudDownload, Edit } from '@mui/icons-material'
import { formatMoney, obtenerFecha } from '../utilities'
import { fetchPreciosFromSheet, updatePrecioInSheet, getSheetsUrl, setSheetsUrl } from '../services/preciosService'
import { updateData } from '../services'

const ListasDePrecios = (props) => {
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const [sheetUrl, setLocalSheetUrl] = useState(getSheetsUrl() || '')
  const [showConfig, setShowConfig] = useState(!getSheetsUrl())
  const [preciosSheet, setPreciosSheet] = useState([])

  const productos = props.productos ? Object.entries(props.productos) : []

  const importarDeSheet = async () => {
    setLoading(true)
    try {
      const data = await fetchPreciosFromSheet()
      setPreciosSheet(data)
      setSnack(`${data.length} precios importados desde Google Sheets`)
    } catch (e) {
      setSnack('Error al importar: ' + e.message)
    }
    setLoading(false)
  }

  const guardarUrl = () => {
    setSheetsUrl(sheetUrl)
    setShowConfig(false)
    setSnack('URL guardada')
  }

  const filtered = productos.filter(([name]) => !search || name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Layout history={props.history} page="Listas de Precios" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
        {/* Configuración de Google Sheets */}
        {showConfig && (
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Configurar Google Sheets</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ingresá la URL de tu Google Apps Script publicada como Web App.
            </Typography>
            <TextField fullWidth size="small" label="URL de Google Apps Script" value={sheetUrl}
              onChange={(e) => setLocalSheetUrl(e.target.value)} sx={{ mb: 1 }} />
            <Button variant="contained" onClick={guardarUrl} disabled={!sheetUrl}>Guardar</Button>
          </Paper>
        )}

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h5" fontWeight={700}>Lista de Precios</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<CloudDownload />} onClick={importarDeSheet} disabled={!getSheetsUrl()}>
              Importar de Sheets
            </Button>
            <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={() => {
              const sorted = [...productos].filter(([_, p]) => p.precio > 0)
                .sort(([a], [b]) => a.localeCompare(b))
              const grouped = {}
              sorted.forEach(([name, p]) => {
                const cat = p.isSubproducto ? 'SUBPRODUCTOS' : (p.categoria || 'PRODUCTOS')
                if (!grouped[cat]) grouped[cat] = []
                grouped[cat].push({ name, precio: p.precio || 0, id: p.id, isSub: p.isSubproducto })
              })

              const rows = Object.entries(grouped).map(([cat, items]) => `
                <tr><td colspan="3" style="background:#0f172a;color:#fff;padding:10px 18px;font-weight:700;font-size:13px;letter-spacing:1.5px">${cat}</td></tr>
                <tr style="background:#f8fafc"><td style="padding:6px 18px;font-size:10px;color:#94a3b8;font-weight:600">CÓDIGO</td><td style="padding:6px 18px;font-size:10px;color:#94a3b8;font-weight:600">PRODUCTO</td><td style="padding:6px 18px;font-size:10px;color:#94a3b8;font-weight:600;text-align:right">PRECIO</td></tr>
                ${items.map((item, i) => `
                  <tr style="${i % 2 === 0 ? 'background:#ffffff' : 'background:#f8fafc'};${i === items.length - 1 ? 'border-bottom:2px solid #0f172a' : ''}">
                    <td style="padding:8px 18px;font-size:11px;color:#64748b">${item.id || '—'}</td>
                    <td style="padding:8px 18px;font-weight:600;color:#1e293b;font-size:13px">${item.name}</td>
                    <td style="padding:8px 18px;text-align:right;font-weight:800;color:#2563eb;font-size:15px">$${formatMoney(item.precio)}</td>
                  </tr>
                `).join('')}
              `).join('')

              const total = sorted.reduce((s, [_, p]) => s + (p.precio || 0), 0)
              const win = window.open('', '_blank')
              win.document.write(`
                <html><head><title>Lista de Precios</title>
                <style>
                  @page { margin: 12mm }
                  body { font-family:'Inter','Segoe UI',Arial,sans-serif; margin:0; padding:0; color:#1e293b; -webkit-font-smoothing:antialiased }
                  .header { text-align:center; padding:30px 20px 20px; background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%); margin-bottom:0 }
                  .header h1 { font-size:22px; margin:0; color:#fff; font-weight:700; letter-spacing:2px }
                  .header .sub { font-size:12px; color:#94a3b8; margin:6px 0 0; font-weight:400 }
                  .header .divider { width:60px; height:3px; background:#3b82f6; margin:12px auto 0; border-radius:2px }
                  .info-bar { display:flex; justify-content:space-between; padding:12px 18px; background:#f8fafc; font-size:11px; color:#64748b; border-bottom:1px solid #e2e8f0 }
                  table { width:100%; border-collapse:collapse }
                  .footer { text-align:center; padding:20px; font-size:10px; color:#94a3b8; border-top:1px solid #e2e8f0; margin-top:0 }
                  .footer strong { color:#64748b }
                  @media print {
                    body { padding:0 }
                    .header { padding:25px 20px 18px }
                  }
                </style></head><body>
                  <div class="header">
                    <h1>LISTA DE PRECIOS</h1>
                    <div class="sub">Generado el ${obtenerFecha()} · ${sorted.length} producto(s)</div>
                    <div class="divider"></div>
                  </div>
                  <div class="info-bar">
                    <span>Total productos: <strong>${sorted.length}</strong></span>
                    <span>Valor total: <strong>$${formatMoney(total)}</strong></span>
                    <span>Precios en pesos argentinos</span>
                  </div>
                  <table>
                    <tr><th style="width:80px;padding:0"> </th><th style="padding:0"> </th><th style="padding:0;text-align:right"> </th></tr>
                    ${rows}
                  </table>
                  <div class="footer">Documento generado desde <strong>Central de Stock</strong> · Los precios pueden variar sin previo aviso</div>
                </body></html>
              `)
              win.document.close()
              setTimeout(() => win.print(), 600)
            }}>
              Exportar PDF
            </Button>
            <Button variant="outlined" size="small" onClick={() => setShowConfig(true)}>
              Configurar Sheets
            </Button>
          </Box>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800}>{productos.length}</Typography>
              <Typography variant="caption" color="text.secondary">Productos</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800}>
                {productos.filter(([_, p]) => p.precio && p.precio > 0).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">Con precio</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800}>{preciosSheet.length}</Typography>
              <Typography variant="caption" color="text.secondary">En Google Sheets</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Search */}
        <TextField fullWidth size="small" placeholder="Buscar producto..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          sx={{ mb: 2 }} />

        {/* Table */}
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell align="right">Precio actual</TableCell>
                <TableCell align="right">Precio Sheets</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(([name, p]) => {
                const sheetPrecio = preciosSheet.find((s) =>
                  s.id === p.id || s.producto?.toLowerCase() === name.toLowerCase()
                )
                const precioSheet = sheetPrecio ? parseFloat(sheetPrecio.precio) : null
                const diff = precioSheet && p.precio ? p.precio - precioSheet : 0
                return (
                  <TableRow key={name} hover>
                    <TableCell><Chip size="small" label={p.id || '—'} variant="outlined" /></TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{name}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      $ {formatMoney(p.precio || 0)}
                    </TableCell>
                    <TableCell align="right">
                      {precioSheet ? (
                        <Chip size="small" label={`$ ${formatMoney(precioSheet)}`}
                          color={diff !== 0 ? 'warning' : 'success'} variant="outlined" />
                      ) : '—'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary"
                        onClick={async () => {
                          const nuevo = prompt('Nuevo precio ($):', p.precio || 0)
                          if (nuevo && parseFloat(nuevo) >= 0) {
                            setLoading(true)
                            try {
                              if (p.id) await updatePrecioInSheet(p.id, parseFloat(nuevo))
                              await updateData(props.user.uid, `productos/${name}/precio`, parseFloat(nuevo))
                              setSnack('Precio actualizado')
                            } catch (e) {
                              setSnack('Error: ' + e.message)
                            }
                            setLoading(false)
                          }
                        }}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity="success">{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}
export default withStore(ListasDePrecios)
