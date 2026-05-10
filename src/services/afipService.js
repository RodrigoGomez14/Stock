// ARCA (ex AFIP) - Factura Electrónica
// ======================================
//
// ARQUITECTURA:
//   React App → Backend API (Node.js) → ARCA Web Services (WSFE)
//
// Hoy: solo estructuramos los datos y los enviamos a un backend.
// Mañana: el backend implementa WSAA + WSFE real.
//
// ---------------------------------------
// PASOS PARA IMPLEMENTAR EL BACKEND:
// ---------------------------------------
// 1. OBTENER CERTIFICADO DIGITAL
//    - Solicitar certificado en AFIP/ARCA (según el tipo: factura A, B, C, etc.)
//    - Se obtiene un .crt y una clave privada .key
//
// 2. WSAA (AUTENTICACIÓN)
//    - El backend crea un TRA (Ticket de Requerimiento de Acceso) en XML
//    - Lo firma con el certificado → CMS
//    - Envía el CMS a: https://wsaa.afip.gov.ar/ws/services/LoginCms
//    - Recibe un TA (Ticket de Acceso) con token + sign
//    - El TA expira a las 12 horas
//
// 3. WSFE (FACTURACIÓN)
//    - Con el TA, llama a:
//      https://servicios1.afip.gov.ar/wsfe/service.asmx
//    - Método: FECAESolicitar (para factura electrónica)
//    - Envía los datos del comprobante (cliente, items, montos, IVA)
//    - Recibe el CAE + vencimiento
//
// 4. DEVOLUCIÓN
//    - El backend devuelve: CAE, fecha de vencimiento, número de factura
//    - La app guarda estos datos en Firebase
//
// ---------------------------------------
// DATOS REQUERIDOS POR AFIP PARA FACTURAR:
// ---------------------------------------
// - Tipo de Comprobante: 1 (Factura A), 6 (Factura B), 11 (Factura C)
// - Punto de Venta: número (ej: 1)
// - CUIT del vendedor (de la app)
// - CUIT/DNI del comprador (cliente)
// - Tipo de Documento: 80 (CUIT), 96 (DNI)
// - Importe Neto (antes de IVA)
// - Importe IVA
// - Importe Total
// - Items (descripción, cantidad, precio unitario, IVA)
// - Condición de IVA: Responsable Inscripto, Consumidor Final, etc.

const API_URL = process.env.REACT_APP_AFIP_API_URL || ''

export const setAfipApiUrl = (url) => {
  localStorage.setItem('afip_api_url', url)
}

export const getAfipApiUrl = () => {
  return API_URL || localStorage.getItem('afip_api_url') || ''
}

// Tipos de comprobante AFIP
export const TIPOS_COMPROBANTE = {
  'Factura A': 1,   // Responsable Inscripto
  'Factura B': 6,   // Consumidor Final
  'Factura C': 11,  // Monotributista
  'Nota de Débito A': 2,
  'Nota de Débito B': 7,
  'Nota de Crédito A': 3,
  'Nota de Crédito B': 8,
}

// Alicuotas de IVA
export const ALICUOTAS_IVA = [
  { id: 3, desc: '0%', porcentaje: 0 },
  { id: 4, desc: '10.5%', porcentaje: 10.5 },
  { id: 5, desc: '21%', porcentaje: 21 },
  { id: 6, desc: '27%', porcentaje: 27 },
]

// Estructura completa de una factura para enviar al backend
export const crearFacturaPayload = ({
  clienteNombre,
  clienteCuit,
  clienteDni,
  tipoComprobante = 6, // Factura B por defecto
  puntoVenta = 1,
  articulos = [],
  total,
  facturacion = false,
}) => {
  // Determinar tipo de documento
  const tipoDoc = clienteCuit ? 80 : clienteDni ? 96 : 99
  const nroDoc = clienteCuit || clienteDni || ''

  // Calcular IVA de cada item
  const ivaPorcentaje = facturacion ? 21 : 0
  const ivaId = facturacion ? 5 : 3 // 5 = 21%, 3 = 0%

  const items = articulos.map((art, i) => ({
    descripcion: art.nombre || art.producto || 'Producto',
    cantidad: parseFloat(art.cantidad || 1),
    precioUnitario: parseFloat(art.precio || 0),
    importe: parseFloat(art.cantidad || 1) * parseFloat(art.precio || 0),
    ivaPorcentaje,
    ivaId,
  }))

  const neto = items.reduce((s, item) => s + item.importe, 0)
  const ivaTotal = neto * (ivaPorcentaje / 100)
  const totalFinal = neto + ivaTotal

  return {
    ticket: {
      tipoComprobante,
      puntoVenta,
    },
    comprador: {
      tipoDoc,
      nroDoc,
      nombre: clienteNombre,
    },
    importes: {
      neto: Math.round(neto * 100) / 100,
      ivaTotal: Math.round(ivaTotal * 100) / 100,
      total: Math.round((total || totalFinal) * 100) / 100,
    },
    items,
    fecha: new Date().toLocaleDateString('es-AR'),
  }
}

// Enviar factura al backend (que luego llama a AFIP)
export const enviarFactura = async (payload) => {
  const url = getAfipApiUrl()
  if (!url) {
    throw new Error(
      'Backend AFIP no configurado. Configurá la URL en Lista de Precios > Configurar AFIP.'
    )
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Error AFIP: ${err}`)
  }
  return res.json()
}
