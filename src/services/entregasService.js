import { getData, pushData, updateData, removeData } from './database'

export const getEntregas = (uid) => getData(uid, 'entregas')

export const createEntrega = (uid, data) => pushData(uid, 'entregas', data)

export const updateEntrega = (uid, id, data) => updateData(uid, `entregas/${id}`, data)

export const removeEntrega = (uid, id) => removeData(uid, `entregas/${id}`)
