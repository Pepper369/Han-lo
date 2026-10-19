/* Service worker: app chạy offline sau lần mở đầu tiên.
   Đổi VERSION khi sửa file tĩnh để buộc cập nhật cache. */
const VERSION = "hanlo-v1.0.2";
const CDN_CACHE = VERSION + "-cdn";
const SHELL = [
  "./index.html",
  "./gioi-thieu.html",
  "./404.html",
  "./styles.css",
  "./data.js",
  "./core.js",
  "./app.js",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./favicon-32.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== VERSION && k !== CDN_CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || !req.url.startsWith("http")) return;

  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    // Trang: ưu tiên mạng để nhận bản mới, mất mạng thì dùng bản đã lưu
    if (req.mode === "navigate") {
      event.respondWith(fetch(req).catch(() => caches.match("./index.html")));
      return;
    }
    event.respondWith(
      caches.open(VERSION).then(async (cache) => {
        const hit = await cache.match(req, { ignoreSearch: true });
        const net = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  // CDN (thư viện viết chữ + dữ liệu nét): trả bản lưu ngay, cập nhật ngầm
  event.respondWith(
    caches.open(CDN_CACHE).then(async (cache) => {
      const hit = await cache.match(req);
      const net = fetch(req)
        .then((res) => { cache.put(req, res.clone()); return res; })
        .catch(() => hit);
      return hit || net;
    })
  );
});
