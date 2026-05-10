import { database } from './firebase'

const getRef = (uid, path) => {
  let ref = database().ref().child(uid)
  if (path) {
    path.split('/').forEach(segment => {
      ref = ref.child(segment)
    })
  }
  return ref
}

export const getData = async (uid, path) => {
  const snapshot = await getRef(uid, path).once('value')
  return snapshot.val()
}

export const onData = (uid, path, callback) => {
  const ref = getRef(uid, path)
  ref.on('value', snapshot => {
    callback(snapshot.val())
  })
  return () => ref.off('value')
}

export const pushData = (uid, path, data) => {
  const ref = getRef(uid, path)
  return ref.push(data)
}

export const pushDataWithKey = (uid, path, data) => {
  const ref = getRef(uid, path)
  const newRef = ref.push()
  newRef.set(data)
  return newRef.key
}

export const updateData = (uid, path, data) => {
  return getRef(uid, path).update(data)
}

export const setData = (uid, path, data) => {
  return getRef(uid, path).set(data)
}

export const removeData = (uid, path) => {
  return getRef(uid, path).remove()
}

export const getPushKey = (uid, path) => {
  return getRef(uid, path).push().key
}
