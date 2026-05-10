import React, { createContext, useContext } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children, value }) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppState() {
  return useContext(AppContext)
}

export function withStore(Component) {
  return function WrappedComponent(props) {
    const state = useAppState()
    return <Component {...props} {...state} />
  }
}
