import { auth } from './firebase'

export const signIn = (email, password) => {
  return auth().signInWithEmailAndPassword(email, password)
}

export const signOut = () => {
  return auth().signOut()
}

export const sendPasswordReset = (email) => {
  auth().languageCode = 'es'
  return auth().sendPasswordResetEmail(email)
}

export const onAuthStateChanged = (callback) => {
  return auth().onAuthStateChanged(callback)
}
