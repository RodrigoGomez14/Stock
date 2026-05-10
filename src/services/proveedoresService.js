import { getData, pushData, updateData, removeData } from './database'

export const getProveedores = (uid) => getData(uid, 'proveedores')

export const createProveedor = (uid, nombre, data) => updateData(uid, `proveedores/${nombre}`, data)

export const updateProveedor = (uid, nombre, data) => updateData(uid, `proveedores/${nombre}`, data)

export const removeProveedor = (uid, nombre) => removeData(uid, `proveedores/${nombre}`)

export const pushEntregaProveedor = (uid, nombre, data) => pushData(uid, `proveedores/${nombre}/entregas`, data)

export const pushPagoProveedor = (uid, nombre, data) => pushData(uid, `proveedores/${nombre}/pagos`, data)

export const updateDeudaProveedor = (uid, nombre, deuda) => updateData(uid, `proveedores/${nombre}/datos/deuda`, deuda)
