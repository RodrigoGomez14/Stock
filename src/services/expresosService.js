import { getData, updateData, removeData, pushData } from './database'

export const getExpresos = (uid) => getData(uid, 'expresos')

export const createExpreso = (uid, nombre, data) => updateData(uid, `expresos/${nombre}`, data)

export const updateExpreso = (uid, nombre, data) => updateData(uid, `expresos/${nombre}`, data)

export const removeExpreso = (uid, nombre) => removeData(uid, `expresos/${nombre}`)

export const pushEnvioExpreso = (uid, nombre, data) => pushData(uid, `expresos/${nombre}/envios`, data)

export const updateEnvioExpreso = (uid, nombre, envioId, data) => updateData(uid, `expresos/${nombre}/envios/${envioId}`, data)
