import logoSrc from '../images/logo.png'

let logoBase64 = ''

const toBase64 = (url) =>
  fetch(url)
    .then((r) => r.blob())
    .then((blob) => new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    }))
    .catch(() => '')

export const initLabelService = async () => {
  logoBase64 = await toBase64(logoSrc)
}

export const printShippingLabel = (pedido, clienteData = {}) => {
  const datos = clienteData.datos || {}
  const dir = datos.direcciones?.[0] || {}
  const localidad = datos.localidad || dir.ciudad || ''
  const codigoPostal = datos.codigoPostal || dir.cp || ''
  const provincia = datos.provincia || dir.provincia || ''

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Etiqueta de Env\u00edo</title>
  <style>
    @page { margin: 0; size: 150mm 100mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', sans-serif;
      width: 150mm;
      height: 100mm;
      overflow: hidden;
      background: #fff;
      color: #1a1a1a;
    }
    .etiqueta {
      width: 150mm;
      height: 100mm;
      position: relative;
      overflow: hidden;
    }
    .banda-azul {
      background-color: #1e293b;
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .logo {
      height: 100px;
      width: auto;
      display: block;
    }
    .contenido {
      padding: 25px 45px;
    }
    .remitente {
      font-size: 16pt;
      font-weight: bold;
      color: #333;
      margin-bottom: 20px;
    }
    .etiqueta-pequena {
      font-size: 9pt;
      font-weight: bold;
      color: #1e293b;
      letter-spacing: 1px;
      margin-bottom: 2px;
      text-transform: uppercase;
    }
    .nombre-cliente {
      font-size: 26pt;
      font-weight: 900;
      color: #000;
      line-height: 1.1;
      margin-bottom: 10px;
    }
    .accion-texto {
      font-size: 16pt;
      color: #555;
      margin-bottom: 25px;
    }
    .contenedor-ubicacion {
      border-left: 5px solid #1e293b;
      padding-left: 18px;
    }
    .ciudad-cp {
      font-size: 18pt;
      font-weight: bold;
      text-transform: uppercase;
      color: #000;
    }
    .provincia {
      font-size: 14pt;
      color: #666;
      text-transform: uppercase;
      margin-top: 2px;
    }
    @media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }
  </style>
</head>
<body>
  <div class="etiqueta">
    <div class="banda-azul">
      ${logoBase64 ? `<img src="${logoBase64}" class="logo" alt="Logo" />` : ''}
    </div>

    <div class="contenido">
      <div class="etiqueta-pequena">REMITENTE</div>
      <div class="remitente">Jorge Gomez</div>

      <div class="etiqueta-pequena">DESTINATARIO</div>
      <div class="nombre-cliente">${pedido.cliente || ''}</div>

      
      <div class="contenedor-ubicacion">
      <div class="accion-texto">Retira de dep\u00f3sito de</div>
        <div class="ciudad-cp">${localidad || ''}${codigoPostal ? ` (CP: ${codigoPostal})` : ''}</div>
        <div class="provincia">${provincia || ''}</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function () { window.print(); window.close(); }
  <\/script>
</body>
</html>`

  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}
