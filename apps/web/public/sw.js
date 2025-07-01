/**
 * Service Worker for brAInwav AI Engineering Roadmap
 * Provides offline functionality and caching for the learning platform
 */

const CACHE_NAME = 'brainwav-roadmap-v1';
const OFFLINE_URL = '/offline';

// Assets to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/roadmap-2025',
  '/offline',
  '/manifest.json',
  '/config/roadmap-config-2025.json',
  // Add other critical assets
];

// Dynamic content patterns that should be cached
const CACHE_PATTERNS = [
  /^\/api\/config/,
  /^\/config\//,
  /\.(?:js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2)$/,
];

// API endpoints that should work offline with cached responses
const OFFLINE_APIS = ['/api/config', '/api/progress'];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      try {
        await cache.addAll(STATIC_ASSETS);
      } catch (error) {
        console.error('Failed to cache static assets:', error);
      }

      // Force activation of the new service worker
      await self.skipWaiting();
    })(),
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)),
      );

      // Take control of all clients
      await self.clients.claim();
    })(),
  );
});

/**
 * Fetch event - implement cache-first strategy with network fallback
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external domains
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(handleFetch(request));
});

/**
 * Handle fetch requests with caching strategy
 */
async function handleFetch(request) {
  const url = new URL(request.url);

  try {
    // For API requests, try network first, then cache
    if (url.pathname.startsWith('/api/')) {
      return await handleApiRequest(request);
    }

    // For static assets, try cache first, then network
    if (shouldCache(url.pathname)) {
      return await handleStaticAsset(request);
    }

    // For pages, try network first, then cache, then offline page
    return await handlePageRequest(request);
  } catch (error) {
    console.error('Fetch error:', error);
    return await handleOfflineFallback(request);
  }
}

/**
 * Handle API requests - network first with cache fallback
 */
async function handleApiRequest(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    // Try network first
    const response = await fetch(request);

    if (response.ok) {
      // Cache successful API responses
      const responseClone = response.clone();
      await cache.put(request, responseClone);
    }

    return response;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Add offline header to indicate cached response
      const headers = new Headers(cachedResponse.headers);
      headers.set('X-Served-By', 'ServiceWorker-Cache');

      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers,
      });
    }

    // No cache available, return error response
    return new Response(
      JSON.stringify({
        error: 'Network unavailable',
        message: 'This feature requires an internet connection',
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

/**
 * Handle static assets - cache first with network fallback
 */
async function handleStaticAsset(request) {
  const cache = await caches.open(CACHE_NAME);

  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Cache miss, fetch from network
  try {
    const response = await fetch(request);

    if (response.ok) {
      // Cache the response for future use
      const responseClone = response.clone();
      await cache.put(request, responseClone);
    }

    return response;
  } catch (error) {
    // Network failed and no cache available
    throw error;
  }
}

/**
 * Handle page requests - network first with offline fallback
 */
async function handlePageRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);

    if (response.ok) {
      // Cache successful page responses
      const cache = await caches.open(CACHE_NAME);
      const responseClone = response.clone();
      await cache.put(request, responseClone);
    }

    return response;
  } catch (error) {
    // Network failed, try cache
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // No cache available, return offline page
    return await handleOfflineFallback(request);
  }
}

/**
 * Handle offline fallback
 */
async function handleOfflineFallback(request) {
  const cache = await caches.open(CACHE_NAME);

  // For navigation requests, show offline page
  if (request.mode === 'navigate') {
    const offlineResponse = await cache.match(OFFLINE_URL);
    if (offlineResponse) {
      return offlineResponse;
    }
  }

  // For other requests, return a generic offline response
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'This content is not available offline',
    }),
    {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

/**
 * Check if a URL should be cached
 */
function shouldCache(pathname) {
  return CACHE_PATTERNS.some((pattern) => pattern.test(pathname));
}

/**
 * Background sync for offline actions
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-progress') {
    event.waitUntil(syncOfflineProgress());
  }
});

/**
 * Sync offline progress when connection is restored
 */
async function syncOfflineProgress() {
  try {
    // Get offline queue from IndexedDB or localStorage
    const offlineData = await getOfflineData();

    for (const item of offlineData) {
      try {
        await syncItem(item);
      } catch (error) {
        console.error('Failed to sync item:', item, error);
      }
    }

    // Clear synced data
    await clearOfflineData();
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

/**
 * Get offline data from storage
 */
async function getOfflineData() {
  // This is a simplified implementation
  // In a real app, you'd use IndexedDB for more complex data
  return [];
}

/**
 * Sync individual offline item
 */
async function syncItem(item) {
  const { action, data } = item;

  switch (action) {
    case 'COMPLETE_TASK':
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      break;

    case 'UPDATE_PROGRESS':
      await fetch('/api/progress/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      break;

    default:
      console.warn('Unknown sync action:', action);
  }
}

/**
 * Clear offline data after successful sync
 */
async function clearOfflineData() {
  // Clear the offline queue
  // Implementation depends on storage method used
}

/**
 * Handle messages from the main thread
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'CACHE_UPDATE':
      // Force update cache with new data
      updateCache(payload);
      break;

    case 'CLEAR_CACHE':
      // Clear specific cache entries
      clearCache(payload);
      break;

    default:
      console.warn('Unknown message type:', type);
  }
});

/**
 * Update cache with new data
 */
async function updateCache(data) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const { url, response } = data;

    await cache.put(url, new Response(response));
  } catch (error) {
    console.error('Failed to update cache:', error);
  }
}

/**
 * Clear specific cache entries
 */
async function clearCache(pattern) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();

    const keysToDelete = keys.filter((key) => (pattern ? key.url.includes(pattern) : true));

    await Promise.all(keysToDelete.map((key) => cache.delete(key)));
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}
