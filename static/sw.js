// Service worker for chat Web Push notifications.
// Payload: { title, body, tag, data: { type, chat_id, message_id, url } }

self.addEventListener('install', () => self.skipWaiting());

// Take control of already open tabs so notification clicks can reach them
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

const adminWindows = () => self.clients.matchAll({ type: 'window', includeUncontrolled: true });

self.addEventListener('push', event => {
  const payload = event.data.json();
  event.waitUntil(adminWindows().then(windows => {
    // A visible admin tab already shows the message itself (toast via Reverb)
    if (windows.some(client => client.visibilityState === 'visible')) {
      return;
    }
    return self.registration.showNotification(payload.title, {
      body: payload.body,
      tag: payload.tag,
      renotify: true,
      icon: '/favicon.ico',
      data: payload.data,
    });
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data.url;
  event.waitUntil(adminWindows().then(windows => {
    const client = windows[0];
    if (!client) {
      return self.clients.openWindow(url);
    }
    // The SPA routes inside the existing tab instead of reloading it
    client.postMessage({ type: 'chat.open', url });
    return client.focus();
  }));
});
