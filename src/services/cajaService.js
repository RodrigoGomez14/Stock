import { getData, updateData, pushData } from './database'

export const getCaja = (uid) => getData(uid, 'caja')

export const getCajaBalance = async (uid) => {
  const caja = await getData(uid, 'caja')
  return caja?.balance || 0
}

export const registrarMovimientoCaja = async (uid, { tipo, monto, descripcion, referencia }) => {
  const caja = await getData(uid, 'caja')
  const balanceActual = caja?.balance || 0
  const nuevoBalance = tipo === 'ingreso' ? balanceActual + monto : balanceActual - monto

  const movimiento = {
    tipo, monto, descripcion, referencia,
    balanceAnterior: balanceActual,
    balanceNuevo: nuevoBalance,
    fecha: new Date().toLocaleDateString('es-AR'),
    timestamp: Date.now(),
  }

  await pushData(uid, 'caja/movimientos', movimiento)
  await updateData(uid, 'caja/balance', nuevoBalance)
  return nuevoBalance
}

export const ingresoCaja = (uid, monto, descripcion, referencia) =>
  registrarMovimientoCaja(uid, { tipo: 'ingreso', monto, descripcion, referencia })

export const egresoCaja = (uid, monto, descripcion, referencia) =>
  registrarMovimientoCaja(uid, { tipo: 'egreso', monto, descripcion, referencia })
