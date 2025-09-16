// Minimal service worker for offline support
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    }),
  )
})

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.text() : 'New notification'
  self.registration.showNotification('Vasskraft', {
    body: data,
  })
  self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: 'PUSH_MESSAGE', message: data })
    })
  })
})
