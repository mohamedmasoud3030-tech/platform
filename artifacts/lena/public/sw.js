/**
 * LENA Digital House — minimal offline service worker (REMEDIATION_PLAN M5).
 *
 * Deliberately small and conservative:
 *  - only GET requests are considered;
 *  - API traffic (path contains /api/) always goes straight to the network
 *    and is never cached — an offline inquiry form must fail loudly, not
 *    silently queue;
 *  - cross-origin requests are never touched;
 *  - navigations are network-first and fall back to the offline page;
 *  - the rest (built assets, images, logos) is cache-first so a returning
 *    visitor with a connection still gets the fast path.
 *
 * There is no analytics, no message channel and no push subscription here.
 */
const SHELL_VERSION = "lena-shell-v1";
const OFFLINE_PAGE = "./offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_VERSION).then((cache) => cache.addAll(["./", OFFLINE_PAGE])).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== SHELL_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes("/api/")) return;

  if (request.mode === "navigate") {
    // Network first so visitors always see the freshest build when online;
    // fall back to the cached shell, then to the offline page.
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL_VERSION).then((cache) => cache.put("./", copy));
          return response;
        })
        .catch(() =>
          caches.open(SHELL_VERSION).then((cache) =>
            cache.match("./").then((cached) => cached ?? cache.match(OFFLINE_PAGE)),
          ),
        ),
    );
    return;
  }

  // Static assets: cache first, network fallback, store successes.
  event.respondWith(
    caches.open(SHELL_VERSION).then((cache) =>
      cache.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }),
      ),
    ),
  );
});
