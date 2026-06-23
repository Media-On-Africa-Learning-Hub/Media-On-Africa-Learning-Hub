// Enhanced Service Worker for Media On Africa - WITH MEDIA CACHING
// Version for GitHub Pages subdirectory
const CACHE_NAME = "moa-v4";
const MEDIA_CACHE = "moa-media-v1";
const BASE_PATH = "/Media-On-Africa-Learning-Hub";

// All pages and assets to cache - WITH subdirectory path
const PRECACHE_URLS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/About.html`,
  `${BASE_PATH}/Subjects.html`,
  `${BASE_PATH}/quizzes.html`,
  `${BASE_PATH}/aptitude.html`,
  `${BASE_PATH}/forum.html`,
  `${BASE_PATH}/mental_wellness.html`,
  `${BASE_PATH}/blog.html`,
  `${BASE_PATH}/contact.html`,
  `${BASE_PATH}/library.html`,
  `${BASE_PATH}/khulisa.html`,
  `${BASE_PATH}/styles.css`,
  `${BASE_PATH}/offline.html`,
  `${BASE_PATH}/manifest.json`,
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
      .then(() => self.skipWaiting())
      .catch((err) => console.error("[SW] Install failed:", err))
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
          })
        );
      })
      .then(() => self.clients.claim())
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
      })
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
      })
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
            return caches.match(`${BASE_PATH}/offline.html`);
          }
        });
    })
  );
});