// Enhanced Service Worker for Media On Africa - WITH MEDIA CACHING
const CACHE_NAME = "moa-v3";
const MEDIA_CACHE = "moa-media-v1";

// All pages and assets to cache
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/About.html",
  "/Subjects.html",
  "/quizzes.html",
  "/aptitude.html",
  "/forum.html",
  "/mental_wellness.html",
  "/blog.html",
  "/contact.html",
  "/library.html",
  "/khulisa.html",
  "/styles.css",
  "/offline.html",
  "/manifest.json",
];

// Image extensions to cache
const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg"];

// Check if URL is an image
function isImage(url) {
  return IMAGE_EXTENSIONS.some((ext) => url.toLowerCase().includes(ext));
}

// Check if URL is a video
function isVideo(url) {
  return VIDEO_EXTENSIONS.some((ext) => url.toLowerCase().includes(ext));
}

// Install - cache all files
self.addEventListener("install", (event) => {
  console.log("[SW] Installing and caching files...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching", PRECACHE_URLS.length, "files");
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting()),
  );
});

// Activate - clean old cache
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key !== CACHE_NAME && key !== MEDIA_CACHE) {
              console.log("[SW] Removing old cache:", key);
              return caches.delete(key);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch - serve from cache first
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Handle images - cache them separately
  if (isImage(url)) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then((cache) => {
        return cache.match(event.request).then((cached) => {
          if (cached) {
            console.log("[SW] Image from cache:", url.split("/").pop());
            return cached;
          }
          return fetch(event.request).then((response) => {
            if (response.status === 200) {
              cache.put(event.request, response.clone());
              console.log("[SW] Image cached:", url.split("/").pop());
            }
            return response;
          });
        });
      }),
    );
    return;
  }

  // Handle videos
  if (isVideo(url)) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then((cache) => {
        return cache.match(event.request).then((cached) => {
          if (cached) {
            console.log("[SW] Video from cache:", url.split("/").pop());
            return cached;
          }
          return fetch(event.request).then((response) => {
            if (response.status === 200) {
              cache.put(event.request, response.clone());
              console.log("[SW] Video cached:", url.split("/").pop());
            }
            return response;
          });
        });
      }),
    );
    return;
  }

  // Handle HTML/CSS/JS pages
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (
            event.request.method !== "GET" ||
            networkResponse.status !== 200
          ) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/offline.html");
          }
        });
    }),
  );
});
