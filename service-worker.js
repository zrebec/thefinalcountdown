const CACHE_NAME = "tfc-v15";
const BASE = new URL("./", self.location.href);
const ASSET_PATHS = [
  "./",
  "./index.html",
  "./style.css?v=tfc15",
  "./script.js?v=tfc15",
  "./manifest.json",
  "./favicon.svg",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
  "./static-events.json?v=tfc15",
];
const ASSETS = ASSET_PATHS.map((path) => new URL(path, BASE).href);
const SHELL_URLS = [new URL("./", BASE).href, new URL("./index.html", BASE).href];

async function cachedShell() {
  const cache = await caches.open(CACHE_NAME);
  for (const url of SHELL_URLS) {
    const hit = await cache.match(url);
    if (hit) return hit;
  }
  return undefined;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of ASSETS) {
        try {
          await cache.add(url);
        } catch {
          /* skip missing; a failed addAll would abort the whole install */
        }
      }
    }).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const fromNetwork = () =>
    fetch(event.request).then((response) => {
      if (response && response.ok && response.type === "basic") {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    });

  if (event.request.mode === "navigate") {
    event.respondWith(
      fromNetwork().catch(() =>
        caches.match(event.request).then((cached) => cached || cachedShell()),
      ),
    );
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((cached) => cached || fromNetwork())
      .catch(() => cachedShell()),
  );
});
