const CACHE_NAME = 'stock-images-v1'
const IMAGE_CACHE = 'stock-images-v1'
const MAX_IMAGE_AGE_DAYS = 90

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
})

self.addEventListener('fetch', (event) => {
  const url = event.request.url

  // Only cache images from Firebase Storage
  if (url.includes('firebasestorage.googleapis.com') || url.includes('storage.googleapis.com')) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request)
        if (cached) {
          const date = cached.headers.get('sw-cache-date')
          if (date) {
            const age = (Date.now() - parseInt(date)) / (1000 * 86400)
            if (age < MAX_IMAGE_AGE_DAYS) return cached
          } else {
            return cached
          }
        }
        try {
          const res = await fetch(event.request)
          if (res.ok) {
            const headers = new Headers(res.headers)
            headers.set('sw-cache-date', Date.now().toString())
            const cloned = new Response(await res.clone().blob(), { status: res.status, headers })
            cache.put(event.request, cloned)
          }
          return res
        } catch {
          return cached || new Response('', { status: 404 })
        }
      })
    )
  }
})
