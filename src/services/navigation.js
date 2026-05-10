let historyStack = []
let suppressNext = false

export const suppressNextPush = () => {
  suppressNext = true
}

export const pushNav = (path) => {
  if (suppressNext) {
    suppressNext = false
    return
  }
  if (historyStack[historyStack.length - 1] !== path) {
    historyStack.push(path)
  }
  if (historyStack.length > 20) historyStack.shift()
}

export const popNav = () => {
  const last = historyStack.pop()
  const prev = historyStack[historyStack.length - 1]
  return prev || '/'
}

export const canGoBack = () => {
  return historyStack.length > 1
}

export const resetNav = () => {
  historyStack = []
  suppressNext = false
}
