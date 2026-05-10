import { getData, pushData, updateData, removeData } from './database'

export const getPedidos = (uid) => getData(uid, 'pedidos')

export const createPedido = (uid, data) => pushData(uid, 'pedidos', data)

export const updatePedido = (uid, id, data) => updateData(uid, `pedidos/${id}`, data)

export const removePedido = (uid, id) => removeData(uid, `pedidos/${id}`)
