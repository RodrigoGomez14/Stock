import { getData, pushData, updateData, removeData, getPushKey } from './database'
import { obtenerFecha } from '../utilities'

export const getProductos = (uid) => getData(uid, 'productos')

export const createProducto = (uid, data) => pushData(uid, 'productos', data)

export const updateProducto = (uid, nombre, data) => updateData(uid, `productos/${nombre}`, data)

export const removeProducto = (uid, nombre) => removeData(uid, `productos/${nombre}`)

export const updateProductoCantidad = (uid, nombre, cantidad) => updateData(uid, `productos/${nombre}`, { cantidad })

export const pushHistorialStock = (uid, nombre, entry) => pushData(uid, `productos/${nombre}/historialDeStock`, entry)

export const pushHistorialCadena = (uid, nombre, entry) => pushData(uid, `productos/${nombre}/historialDeCadenas`, entry)

export const updateMatrices = (uid, producto, matrices) => updateData(uid, `productos/${producto}/matrices`, matrices)

export const getCadenaKey = (uid) => getPushKey(uid, 'cadenasActivas')

export const pushCadenaActiva = (uid, data) => pushData(uid, 'cadenasActivas', data)

export const updateCadenaActiva = (uid, id, data) => updateData(uid, `cadenasActivas/${id}`, data)

export const removeCadenaActiva = (uid, id) => removeData(uid, `cadenasActivas/${id}`)

export const registrarMovimientoStock = async (uid, nombreProducto, { movimiento, concepto, referencia }) => {
  const prod = await getData(uid, `productos/${nombreProducto}`)
  const cantidadActual = parseFloat(prod?.cantidad || 0)
  const nuevaCantidad = cantidadActual + movimiento

  await updateData(uid, `productos/${nombreProducto}`, { cantidad: Math.max(0, nuevaCantidad) })
  await pushData(uid, `productos/${nombreProducto}/historialDeStock`, {
    fecha: obtenerFecha(),
    cantidad: nuevaCantidad,
    movimiento,
    concepto,
    referencia,
    timestamp: Date.now(),
  })
  return nuevaCantidad
}
