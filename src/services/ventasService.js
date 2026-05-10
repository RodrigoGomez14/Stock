import { pushData } from './database'

export const pushVenta = (uid, data) => pushData(uid, 'ventas', data)

export const pushIvaVenta = (uid, data) => pushData(uid, 'iva/ventas', data)
