import { updateData, pushData } from './database'

export const updateCuentaBancaria = (uid, nombre, data) => updateData(uid, `CuentasBancarias`, data)

export const pushIngresoCuenta = (uid, cuenta, data) => pushData(uid, `CuentasBancarias/${cuenta}/ingresos`, data)

export const pushEgresoCuenta = (uid, cuenta, data) => pushData(uid, `CuentasBancarias/${cuenta}/egresos`, data)
