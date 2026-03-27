const CACHE_NAME = 'mario-sudoku-v4'; // שדרוג לגרסה v4
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './pics/mario.png',
  './pics/luigy.png',
  './pics/peach.png',
  './pics/toad.png',
  './pics/bowser.png',
  './pics/wario.png',
  './animation/bowser_laugh.webp' // הוספת קובץ האנימציה לרשימה
];

// התקנה: מוריד את כל הקבצים החדשים לזיכרון
self.addEventListener('install', (event) => {
  self.skipWaiting(); // מכריח את ה-SW החדש להשתלט מיד
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// הפעלה: מוחק באגרסיביות כל זיכרון ישן (v1, v2, v3)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    })
  );
  // משתלט על כל הטאבים הפתוחים מיד
  self.clients.claim();
});

// ניהול בקשות: אסטרטגיית "רשת קודם" לקובץ הראשי כדי להבטיח עדכון
self.addEventListener('fetch', (event) => {
  // אם מדובר בניווט לדף הראשי, נסה להביא מהרשת כדי לראות אם יש שינוי
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // לשאר הקבצים (תמונות וכו'), השתמש בזיכרון המטמון למהירות
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});