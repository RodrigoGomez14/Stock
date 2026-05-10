import { getData, pushData, updateData } from './database'

export const getCheques = (uid) => getData(uid, 'cheques')

export const getChequesPersonales = (uid) => getData(uid, 'chequesPersonales')

export const pushCheque = (uid, data) => pushData(uid, 'cheques', data)

export const pushChequePersonal = (uid, data) => pushData(uid, 'chequesPersonales', data)

export const updateCheque = (uid, id, data) => updateData(uid, `cheques/${id}`, data)
