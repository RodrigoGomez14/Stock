// Facturación Electrónica — TusFacturasAPP
// ==========================================
// Documentación: https://tusfacturas.app/desarrolladores
//
// Requiere:
//   1. Suscripción activa en TusFacturasAPP
//   2. API Key obtenida desde el panel de TusFacturasAPP
//   3. Configurar empresa (CUIT, punto de venta) en su panel

const TUS_FACTURAS_URL = 'https://api.tusfacturas.app/v1'

export const setApiKey = (key) => localStorage.setItem('tf_api_key', key)
export const getApiKey = () => localStorage.getItem('tf_api_key') || ''

// Tipos de comprobante AFIP
export const TIPOS_COMPROBANTE = {
  'Factura A': 1,
  'Factura B': 6,
  'Factura C': 11,
  'Nota de Crédito A': 3,
  'Nota de Crédito B': 8,
}

// Condiciones de IVA del cliente
export const CONDICIONES_IVA = [
  { id: 1, label: 'Responsable Inscripto' },
  { id: 2, label: 'Monotributista' },
  { id: 3, label: 'Consumidor Final' },
  { id: 4, label: 'Exento' },
]

// Armar items para TusFacturasAPP
const armarItems = (articulos, facturacion) => {
  const iva = facturacion ? 21 : 0
  return articulos.map((art) => ({
    descripcion: art.nombre || art.producto || 'Producto',
    cantidad: parseFloat(art.cantidad || 1),
    precio_unitario: parseFloat(art.precio || 0),
    alicuota_iva: iva,
  }))
}

// Facturar — llama a TusFacturasAPP
export const enviarFactura = async ({
  clienteNombre,
  clienteCuit,
  clienteDni,
  condicionIva = 3, // Consumidor Final por defecto
  tipoComprobante = 6,
  articulos = [],
  total,
  facturacion = false,
}) => {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('Configurá tu API Key de TusFacturasAPP en Ajustes > Facturación')

  const cuit = clienteCuit || ''
  const dni = clienteDni || ''
  const tipoDoc = cuit ? 80 : dni ? 96 : 99
  const nroDoc = cuit || dni || ''

  const items = armarItems(articulos, facturacion)
  const neto = items.reduce((s, i) => s + i.cantidad * i.precio_unitario, 0)
  const ivaTotal = facturacion ? neto * 0.21 : 0

  const res = await fetch(`${TUS_FACTURAS_URL}/facturas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
    body: JSON.stringify({
      tipo_comprobante: tipoComprobante,
      punto_venta: 1,
      cliente: {
        nombre: clienteNombre,
        tipo_documento: tipoDoc,
        numero_documento: nroDoc,
        condicion_iva: condicionIva,
      },
      items,
      importe_neto: Math.round(neto * 100) / 100,
      importe_iva: Math.round(ivaTotal * 100) / 100,
      importe_total: Math.round(neto * 100) / 100 + Math.round(ivaTotal * 100) / 100,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Error TusFacturasAPP: ${err}`)
  }

  return res.json() // { cae, cae_vencimiento, numero_comprobante, ... }
}

// Nota de Crédito — anula una factura existente
export const crearNotaCredito = async ({
  clienteNombre,
  clienteCuit,
  clienteDni,
  condicionIva = 3,
  tipoComprobante = 8, // Nota de Crédito B
  articulos = [],
  total,
  facturacion = false,
  facturaAsociada, // { cae, numero }
}) => {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('API Key no configurada')
  if (!facturaAsociada?.cae) throw new Error('La factura original no tiene CAE')

  const cuit = clienteCuit || ''
  const dni = clienteDni || ''
  const tipoDoc = cuit ? 80 : dni ? 96 : 99
  const nroDoc = cuit || dni || ''
  const items = armarItems(articulos, facturacion)
  const neto = items.reduce((s, i) => s + i.cantidad * i.precio_unitario, 0)
  const ivaTotal = facturacion ? neto * 0.21 : 0

  const res = await fetch(`${TUS_FACTURAS_URL}/notas-credito`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
    body: JSON.stringify({
      tipo_comprobante: tipoComprobante,
      punto_venta: 1,
      cliente: { nombre: clienteNombre, tipo_documento: tipoDoc, numero_documento: nroDoc, condicion_iva: condicionIva },
      items,
      importe_neto: Math.round(neto * 100) / 100,
      importe_iva: Math.round(ivaTotal * 100) / 100,
      importe_total: Math.round(neto * 100) / 100 + Math.round(ivaTotal * 100) / 100,
      comprobante_asociado: { cae: facturaAsociada.cae, numero: facturaAsociada.numero },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Error TusFacturasAPP: ${err}`)
  }

  return res.json()
}
