import { database } from './firebase'

const KEYS = {
  TF_API_KEY: 'tf_api_key',
  SHEETS_URL: 'sheets_url',
  PUNTO_VENTA: 'punto_venta',
}

export const getSetting = (key) => localStorage.getItem(key) || ''
export const setSetting = (key, value) => localStorage.setItem(key, value)

export const getApiKey = () => getSetting(KEYS.TF_API_KEY)
export const setApiKey = (key) => setSetting(KEYS.TF_API_KEY, key)

export const getSheetsUrl = () => getSetting(KEYS.SHEETS_URL)
export const setSheetsUrl = (url) => setSetting(KEYS.SHEETS_URL, url)

export const getPuntoVenta = () => parseInt(getSetting(KEYS.PUNTO_VENTA), 10) || 1
export const setPuntoVenta = (pv) => setSetting(KEYS.PUNTO_VENTA, String(pv))

export const exportAllData = async (uid) => {
  const snapshot = await database().ref().child(uid).once('value')
  return snapshot.val()
}
