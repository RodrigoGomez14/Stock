import { getData, pushData, updateData, removeData, getPushKey } from './database'

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
