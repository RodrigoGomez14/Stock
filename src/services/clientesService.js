import { getData, pushData, updateData, removeData } from './database'

export const getClientes = (uid) => getData(uid, 'clientes')

export const createCliente = (uid, nombre, data) => updateData(uid, `clientes/${nombre}`, data)

export const updateCliente = (uid, nombre, data) => updateData(uid, `clientes/${nombre}`, data)

export const removeCliente = (uid, nombre) => removeData(uid, `clientes/${nombre}`)

export const pushPedidoCliente = (uid, nombre, data) => pushData(uid, `clientes/${nombre}/pedidos`, data)

export const pushPagoCliente = (uid, nombre, data) => pushData(uid, `clientes/${nombre}/pagos`, data)

export const updateDeudaCliente = (uid, nombre, deuda) => updateData(uid, `clientes/${nombre}/datos/deuda`, deuda)
