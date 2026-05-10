import { getData, pushData, updateData } from './database'

export const getCompras = (uid) => getData(uid, 'compras')

export const pushCompra = (uid, data) => pushData(uid, 'compras', data)

export const updateCompra = (uid, id, data) => updateData(uid, `compras/${id}`, data)
