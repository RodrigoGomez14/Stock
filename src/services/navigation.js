let historyStack = []
let suppressNext = false

const rootPaths = [
  '/', '/Productos', '/Clientes', '/Proveedores', '/Expresos',
  '/Pedidos', '/Entregas', '/Deudas', '/Cheques',
  '/Cuentas-Bancarias', '/Servicios', '/Iva', '/Cadenas-De-Produccion',
]

const getPathKey = (path) => {
  const qIndex = path.indexOf('?')
  return qIndex >= 0 ? path.slice(0, qIndex) : path
}

export const suppressNextPush = () => {
  suppressNext = true
}

export const pushNav = (path) => {
  if (suppressNext) {
    suppressNext = false
    return
  }
  const key = getPathKey(path)
  if (rootPaths.includes(key)) {
    historyStack = [path]
  } else {
    if (historyStack[historyStack.length - 1] !== path) {
      historyStack.push(path)
    }
    if (historyStack.length > 20) historyStack.shift()
  }
}

export const popNav = () => {
  const last = historyStack.pop()
  const prev = historyStack[historyStack.length - 1] || '/'
  return prev
}

export const canGoBack = () => {
  return historyStack.length > 1
}

export const resetNav = () => {
  historyStack = []
  suppressNext = false
}
