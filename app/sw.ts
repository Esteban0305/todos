/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

const CACHE_NAME = "task-manager-cache-v1"
const APP_SHELL = [
  "/",
  "/reports",
  "/manifest.json",
  "/favicon.ico",
  "/public/icon-72x72.png",
  "/public/icon-96x96.png",
  "/icon-128x128.png",
  "/icon-144x144.png",
  "/icon-152x152.png",
  "/icon-192x192.png",
  "/icon-384x384.png",
  "/icon-512x512.png",
  "/maskable-icon.png",
  "/apple-touch-icon.png",
  "/screenshot1.png",
  "/screenshot2.png",
  "/browserconfig.xml",
  "/robots.txt",
  "/sitemap.xml",
  "/offline.html",
]

// Install event - cache the app shell
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install")
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Caching app shell")
      return cache.addAll(APP_SHELL)
    }),
  )
  // Activate immediately
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate")
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key)
            return caches.delete(key)
          }
        }),
      )
    }),
  )
  // Ensure the service worker takes control immediately
  return self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // For navigation requests (HTML pages), use a network-first strategy
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache a copy of the response
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
          return response
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match("/offline.html")
          })
        }),
    )
    return
  }

  // For other requests, use a cache-first strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      // If not in cache, fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses or non-GET requests
          if (!response || response.status !== 200 || event.request.method !== "GET") {
            return response
          }

          // Cache a copy of the response
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
          return response
        })
        .catch((error) => {
          console.log("[ServiceWorker] Fetch failed:", error)

          // For image requests, return a fallback image
          if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
            return caches.match("/icon-192x192.png")
          }

          // For other requests, just propagate the error
          throw error
        })
    }),
  )
})

// Handle offline fallbacks
self.addEventListener("fetch", (event) => {
  if (
    event.request.mode === "navigate" ||
    (event.request.method === "GET" && event.request.headers.get("accept")?.includes("text/html"))
  ) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match("/offline.html")
      }),
    )
  }
})

export {}
