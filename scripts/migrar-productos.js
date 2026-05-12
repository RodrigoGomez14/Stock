// Script de migración: asigna sku e idUnico a productos existentes
// Ejecutar: node scripts/migrar-productos.js

const admin = require('firebase-admin')
const path = require('path')

// Configurar Firebase Admin SDK
const serviceAccount = require(path.join(__dirname, '..', 'serviceAccountKey.json'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://stock-119e8-default-rtdb.firebaseio.com',
})

const db = admin.database()

const generarSku = (nombre) => {
  if (!nombre) return ''
  const palabras = nombre.split(' ').filter((w) => w && !['de', 'del', 'la', 'las', 'los', 'el', 'para', 'por', 'y', 'e', 'a', 'en', 'un', 'una', 'con', 'su'].includes(w.toLowerCase()))
  if (palabras.length === 0) return nombre.slice(0, 4).toUpperCase()
  const siglas = palabras.map((w) => w[0].toUpperCase()).join('')
  if (siglas.length >= 3) return siglas
  const extra = palabras[0].slice(1, 4 - siglas.length + 1).toUpperCase()
  return siglas + extra
}

async function migrar() {
  const snapshot = await db.ref().once('value')
  const allData = snapshot.val()

  if (!allData) {
    console.log('No hay datos en la base.')
    return
  }

  let totalMigrados = 0

  for (const [uid, userData] of Object.entries(allData)) {
    const productos = userData.productos
    if (!productos) continue

    const updates = {}

    for (const [nombre, prod] of Object.entries(productos)) {
      const nuevoSku = prod.sku || prod.id || generarSku(prod.nombre || nombre)
      const nuevoIdUnico = prod.idUnico || db.ref().child(`${uid}/productos`).push().key

      if (!prod.sku || !prod.idUnico) {
        updates[`${uid}/productos/${nombre}/sku`] = nuevoSku
        updates[`${uid}/productos/${nombre}/idUnico`] = nuevoIdUnico
        totalMigrados++
        console.log(`  [${nombre}] sku: ${nuevoSku}, idUnico: ${nuevoIdUnico}`)
      }
    }

    if (Object.keys(updates).length > 0) {
      await db.ref().update(updates)
      console.log(`Usuario ${uid}: ${Object.keys(updates).length} campo(s) actualizado(s)`)
    }
  }

  console.log(`\nMigración completada. ${totalMigrados} producto(s) actualizado(s).`)
  process.exit(0)
}

migrar().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
