// Google Sheets integration for price lists
// 1. Create a Google Sheet with columns: ID | Producto | Precio | Categoría
// 2. Deploy this Apps Script as a web app:
//    https://script.google.com/home → Nuevo proyecto → pegar código → Implementar → App web
//
// Google Apps Script code:
/*
const SHEET_ID = 'TU_SHEET_ID'
const SHEET_NAME = 'Precios'

function doGet(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)
  const data = sheet.getDataRange().getValues()
  const headers = data.shift()
  const productos = data.map(row => ({
    id: row[0], producto: row[1], precio: row[2], categoria: row[3]
  }))
  return ContentService.createTextOutput(JSON.stringify(productos))
    .setMimeType(ContentService.MimeType.JSON)
}

function doPost(e) {
  const { id, precio } = JSON.parse(e.postData.contents)
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)
  const data = sheet.getDataRange().getValues()
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.getRange(i + 1, 3).setValue(precio) // columna C = Precio
      break
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON)
}
*/

const SHEETS_URL = process.env.REACT_APP_GOOGLE_SHEETS_URL || ''

export const setSheetsUrl = (url) => {
  // This would be set via Firebase or env var
  localStorage.setItem('sheets_url', url)
}

export const getSheetsUrl = () => {
  return SHEETS_URL || localStorage.getItem('sheets_url') || ''
}

export const fetchPreciosFromSheet = async () => {
  const url = getSheetsUrl()
  if (!url) throw new Error('No hay URL de Google Sheets configurada')
  const res = await fetch(url)
  return res.json()
}

export const updatePrecioInSheet = async (id, nuevoPrecio) => {
  const url = getSheetsUrl()
  if (!url) throw new Error('No hay URL de Google Sheets configurada')
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ id, precio: nuevoPrecio }),
  })
  return res.json()
}
