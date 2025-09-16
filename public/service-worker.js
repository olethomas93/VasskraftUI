// public/sw.js
// Minimal SW: push + (optional) offline fallback

// ---------- lifecycle ----------
self.addEventListener('install', (event) => {
  // (Optional) Precache a simple offline page
  event.waitUntil(
    caches.open('static-v1').then((cache) =>
      cache.addAll(['/offline.html', '/icons/icon-192.png', '/icons/badge-72.png']).catch(() => {})
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// ---------- push ----------
self.addEventListener('push', (event) => {
  event.waitUntil((async () => {
    // Accept either plain text or JSON payloads
    let raw = '';
    let data = {};
    if (event.data) {
      try {
        raw = event.data.text();          // read once
        data = JSON.parse(raw);           // try JSON
      } catch {
        data = { body: raw || 'New notification' }; // fallback to text
      }
    }

    const title = data.title || 'Vasskraft';
    const options = {
      body: data.body || 'New notification',
      icon: data.icon || '/icons/icon-192.png',
      badge: data.badge || '/icons/badge-72.png',
      tag: data.tag || 'vasskraft',      // tag helps dedupe
      renotify: !!data.renotify,         // set true if you want vibration/attention on repeated tag
      data: {
        url: data.url || '/',            // where to go on click
        ...data.data                     // allow extra metadata
      }
    };

    // 1) Show the notification
    const shown = self.registration.showNotification(title, options);

    // 2) Broadcast the message to open tabs (e.g., to update UI)
    const broadcast = (async () => {
      const clientsList = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
      clientsList.forEach((client) => {
        client.postMessage({ type: 'PUSH_MESSAGE', payload: data });
      });
    })();

    await Promise.all([shown, broadcast]);
  })());
});

// Focus an existing tab if possible, otherwise open the URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || '/';

  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    // Try to focus a client with the same origin + path
    const target = new URL(url, self.location.origin);
    for (const client of allClients) {
      try {
        const cURL = new URL(client.url);
        if (cURL.origin === target.origin && cURL.pathname === target.pathname) {
          return client.focus();
        }
      } catch {}
    }
    // Otherwise, open a new window
    return self.clients.openWindow(url);
  })());
});

// (Optional) handle close for analytics/debug
self.addEventListener('notificationclose', (event) => {
  // You could postMessage to pages or hit an analytics endpoint here
});

// ---------- (Optional) offline fallback for navigations ----------
self.addEventListener('fetch', (event) => {
  // Only intercept top-level navigations
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        return await fetch(event.request);
      } catch {
        const cached = await caches.match('/offline.html');
        return cached || new Response('You are offline.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
    })());
  }
});
