// 機械作業:いつも最新の画面を出す(ネットにつながらないときだけ、前に見た画面を出す)
const CACHE = "kikai-sagyo-v1";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;   // Firebaseなどはそのまま
  e.respondWith(fetch(e.request).then(res => {
    const c = res.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); return res;
  }).catch(() => caches.match(e.request)));
});
