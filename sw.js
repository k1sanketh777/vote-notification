// Nethinethera Notification Service Worker
const CACHE = 'nethinethera-v1';

self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });

// Listen for messages from the main page to trigger notifications
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'NOTIFY') {
    self.registration.showNotification(e.data.title, {
      body: e.data.body,
      icon: 'https://osxijjbjgxvaeurpghtv.supabase.co/storage/v1/object/public/mpmu-logos/logos/1.png',
      badge: 'https://osxijjbjgxvaeurpghtv.supabase.co/storage/v1/object/public/mpmu-logos/logos/1.png',
      tag: e.data.tag || 'nethinethera',
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: self.location.origin }
    });
  }
});

// When notification is clicked, focus the tab
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes('nethinethera') && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(e.notification.data.url);
    })
  );
});
