import React, { useState } from 'react'
import { withStore } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Box, Typography, Paper, Button, Grid, TextField, InputAdornment,
  Backdrop, CircularProgress, Snackbar, Chip
} from '@mui/material'
import { Alert } from '@mui/material'
import { Search, PictureAsPdf, Check, Close } from '@mui/icons-material'
import { formatMoney, obtenerFecha } from '../utilities'
import { updateData } from '../services'
import { ImgCache } from '../components/ImgCache'
import logoSrc from '../images/logo.png'

const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']

const ListasDePrecios = (props) => {
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState('')
  const [editPrice, setEditPrice] = useState(null)
  const [editValue, setEditValue] = useState('')

  const productos = props.productos ? Object.entries(props.productos) : []

  const actualizarPrecio = async (name, nuevoPrecio) => {
    setLoading(true)
    try {
      await updateData(props.user.uid, `productos/${name}/precio`, parseFloat(nuevoPrecio))
      setSnack('Precio actualizado')
    } catch (e) { setSnack('Error: ' + e.message) }
    setEditPrice(null)
    setLoading(false)
  }

  const filtered = productos.filter(([name, p]) =>
    !search || name.toLowerCase().includes(search.toLowerCase())
  ).sort(([a], [b]) => a.localeCompare(b))

  // Group by category
  const grouped = {}
  filtered.forEach(([name, p]) => {
    const cat = p.categoria || 'Sin categor\u00eda'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push([name, p])
  })

  return (
    <Layout history={props.history} page="Listas de Precios" user={props.user?.uid}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h5" fontWeight={700}>Lista de Precios</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={() => {
              const sorted = [...productos].filter(([_, p]) => p.precio > 0).sort(([a], [b]) => a.localeCompare(b))
              const groupedPdf = {}
              sorted.forEach(([name, p]) => {
                const cat = p.categoria || 'PRODUCTOS'
                if (!groupedPdf[cat]) groupedPdf[cat] = []
                groupedPdf[cat].push({ name, precio: p.precio || 0, id: p.id, imagen: p.imagen })
              })
              const rows = Object.entries(groupedPdf).map(([cat, items]) => `
                <tr><td colspan="4" style="background:#0f172a;color:#fff;padding:10px 18px;font-weight:700;font-size:13px;letter-spacing:1.5px">${cat}</td></tr>
                <tr style="background:#f8fafc"><td style="padding:6px 18px;font-size:10px;color:#94a3b8;font-weight:600;width:44px"></td><td style="padding:6px 18px;font-size:10px;color:#94a3b8;font-weight:600">#</td><td style="padding:6px 18px;font-size:10px;color:#94a3b8;font-weight:600">PRODUCTO</td><td style="padding:6px 18px;font-size:10px;color:#94a3b8;font-weight:600;text-align:right">PRECIO</td></tr>
                ${items.map((item, i) => `
                  <tr style="${i % 2 === 0 ? 'background:#ffffff' : 'background:#f8fafc'};${i === items.length - 1 ? 'border-bottom:2px solid #0f172a' : ''}">
                    <td style="padding:8px 8px;text-align:center;width:44px">${item.imagen ? `<img src="${item.imagen}" style="width:32px;height:32px;object-fit:cover;border-radius:4px;display:block" />` : '<span style="font-size:18px;opacity:0.25">📷</span>'}</td>
                    <td style="padding:8px 18px;font-size:11px;color:#64748b">${item.id || '—'}</td>
                    <td style="padding:8px 18px;font-weight:600;color:#1e293b;font-size:13px">${item.name}</td>
                    <td style="padding:8px 18px;text-align:right;font-weight:800;color:#2563eb;font-size:15px">$${formatMoney(item.precio)}</td>
                  </tr>
                `).join('')}
              `).join('')
              const ahora = new Date()
              const mesAnio = `${meses[ahora.getMonth()]} ${ahora.getFullYear()}`
              const win = window.open('', '_blank')
              win.document.write(`<!DOCTYPE html>
<html><head><title>Lista de Precios</title>
<style>
  @page { size: A4; margin: 0 }
  body { font-family:'Inter','Segoe UI',Arial,sans-serif; margin:0; padding:0; color:#1e293b }
  .header { text-align:center; padding:18px 20px 14px; background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%) }
  .header .logo { height:40px; width:auto; margin-bottom:4px }
  .header h1 { font-size:20px; margin:4px 0; color:#fff; font-weight:700; letter-spacing:2px }
  .header .sub { font-size:11px; color:#94a3b8; margin:4px 0 }
  table { width:100%; border-collapse:collapse }
  .footer { text-align:center; padding:14px; font-size:9px; color:#94a3b8; border-top:1px solid #e2e8f0 }
  @media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }
</style></head><body>
  <div class="header">
    <img src="${logoSrc}" class="logo" alt="VG" />
    <h1>LISTA DE PRECIOS</h1>
    <div class="sub">www.valvulasgomez.com - gomezbonardi@hotmail.com - (011) 15-5410-6143</div>
    <div class="sub" style="color:#94a3b8;margin-top:6px">${mesAnio} · Precios expresados en ARS ($) + IVA</div>
  </div>
  <table><tr><th style="width:44px;padding:0"></th><th style="width:80px;padding:0"></th><th style="padding:0"></th><th style="padding:0;text-align:right"></th></tr>${rows}</table>
  <div class="footer">${mesAnio} - Precios expresados en ARS ($) + IVA. Sujetos a modificaci\u00f3n sin previo aviso.</div>
</body></html>`)
              win.document.close()
              setTimeout(() => win.print(), 600)
            }}>
              Exportar PDF
            </Button>
          </Box>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800}>{productos.length}</Typography>
              <Typography variant="caption" color="text.secondary">Productos</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800}>{Object.keys(grouped).length}</Typography>
              <Typography variant="caption" color="text.secondary">Categor\u00edas</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Search */}
        <TextField fullWidth size="small" placeholder="Buscar producto..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          sx={{ mb: 2 }} />

        {/* Products by category */}
        {Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([cat, items]) => (
            <Paper key={cat} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
              <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'primary.dark', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff' }}>
                  {cat} ({items.length})
                </Typography>
              </Box>
              <Box sx={{ px: 2.5, py: 1 }}>
                {items.map(([name, p]) => {
                  const isEditing = editPrice === name
                  return (
                    <Box key={name} sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5, py: 1.2,
                      borderBottom: '1px solid', borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                    }}>
                      {p.imagen ? (
                        <ImgCache src={p.imagen} sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Typography variant="body2" sx={{ opacity: 0.3 }}>📷</Typography>
                        </Box>
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>{name}</Typography>
                        <Box sx={{ display: 'flex', gap: 0.3, flexWrap: 'wrap', alignItems: 'center' }}>
                          {p.id && <Typography variant="caption" color="text.disabled">ID: {p.id}</Typography>}
                          <Chip size="small" label={p.isSubproducto ? 'Sub' : 'Final'}
                            color={p.isSubproducto ? 'warning' : 'primary'} variant="outlined" sx={{ fontSize: 9, height: 16 }} />
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right', minWidth: 100 }}>
                        {isEditing ? (
                          <Box sx={{ display: 'flex', gap: 0.3, alignItems: 'center' }}>
                            <TextField size="small" type="number" value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              sx={{ '& .MuiInputBase-input': { fontSize: 13, py: 0.5, width: 90 } }}
                              autoFocus onKeyDown={(e) => {
                                if (e.key === 'Enter') actualizarPrecio(name, editValue)
                                if (e.key === 'Escape') setEditPrice(null)
                              }} />
                            <Button size="small" variant="contained" color="success"
                              sx={{ minWidth: 28, height: 28, p: 0 }}
                              onClick={() => actualizarPrecio(name, editValue)}><Check fontSize="small" /></Button>
                            <Button size="small" variant="outlined"
                              sx={{ minWidth: 28, height: 28, p: 0 }}
                              onClick={() => setEditPrice(null)}><Close fontSize="small" /></Button>
                          </Box>
                        ) : (
                          <Typography variant="body1" fontWeight={700} color="primary.main"
                            onClick={() => { setEditPrice(name); setEditValue(String(p.precio || '')) }}
                            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                            $ {formatMoney(p.precio || 0)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Paper>
          ))
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
            {search ? 'No se encontraron productos.' : 'No hay productos registrados.'}
          </Typography>
        )}
      </Box>

      <Backdrop open={loading} sx={{ zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>
      <Snackbar open={!!snack} autoHideDuration={2000} onClose={() => setSnack('')}>
        <Alert severity={snack.includes('Error') ? 'error' : 'success'}>{snack}</Alert>
      </Snackbar>
    </Layout>
  )
}
export default withStore(ListasDePrecios)
