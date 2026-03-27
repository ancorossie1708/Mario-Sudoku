const CACHE_NAME = 'mario-sudoku-v3'; // עדכון ל-v3 כדי לאלץ ריענון אצל המשתמשים
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './pics/mario.png',
  './pics/luigy.png',
  './pics/peach.png',
  './pics/toad.png',
  './pics/bowser.png',
  './pics/wario.png'
];

// התקנה ושמירת קבצים בזיכרון המטמון (Cache)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  // גורם ל-Service Worker החדש להיכנס לפעולה מיד בלי לחכות לסגירת האפליקציה
  self.skipWaiting();
});

// ניקוי זיכרונות מטמון ישנים (חשוב מאוד לעדכון גרסאות!)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // אם מצאנו זיכרון ישן ששמו שונה מ-v3 הנוכחי, נמחק אותו
          if (cacheName !== CACHE_NAME) {
            console.log('מוחק זיכרון מטמון ישן:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// הגשת קבצים מהזיכרון המקומי לטובת עבודה באופליין
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});