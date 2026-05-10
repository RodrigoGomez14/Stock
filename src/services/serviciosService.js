import { getData, updateData, removeData, pushData, setData, getPushKey } from './database'

export const getServicios = (uid) => getData(uid, 'servicios')

export const createServicio = (uid, data) => pushData(uid, 'servicios', data)

export const updateServicio = (uid, id, data) => updateData(uid, `servicios/${id}`, data)

export const removeServicio = (uid, id) => removeData(uid, `servicios/${id}`)

export const pushHistorialPagoServicio = (uid, data) => pushData(uid, 'historialPagosServicios', data)

export const pushInstanciaPago = (uid, periodoId, servicioId, data) => setData(uid, `instanciasPago/${periodoId}/${servicioId}`, data)

export const getPushKeyServicios = (uid) => getPushKey(uid, 'servicios')
