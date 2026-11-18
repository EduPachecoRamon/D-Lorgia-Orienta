const CACHE = 'dlorgia-orienta-v480-primera-experiencia';
const CORE = [
  '/app', '/', '/portada.html',
  '/assets/portada-v48.css',
  '/assets/portada-v48.js',
  '/assets/acceso-v48.css',
  '/assets/media/piel-editorial.svg',
  '/assets/media/cuidado-editorial.svg',
  '/assets/media/orientacion.svg',
  '/assets/media/consulta.svg',
  '/assets/media/evaluacion.svg',
  '/assets/media/empresa-editorial.svg',
  '/assets/styles-v400.css',
  '/assets/app-v400.js',
  '/manifest.webmanifest',
  '/admin',
  '/conoce',
  '/experiencias',
  '/sedes',
  '/ayuda',
  '/admin/ayuda',
  '/assets/admin-v420.css',
  '/assets/admin-v420.js',
  '/assets/dlorgia-tokens.css',
  '/assets/dlorgia-typography.css',
  '/assets/dlorgia-components.css',
  '/assets/dlorgia-motion.css',
  '/assets/dlorgia-patient.css',
  '/assets/dlorgia-admin.css',
  '/assets/dlorgia-feedback.js',
  '/assets/dlorgia-ambient.js',
  '/assets/dlorgia-signature.svg',
  '/assets/dlorgia-atmosphere.webp',
  '/assets/dlorgia-ateliers-v44.css',
  '/assets/dlorgia-admin-v44.css',
  '/assets/dlorgia-admin-pmv45.css',
  '/assets/dlorgia-pmv45.css',
  '/assets/dlorgia-pages45.css',
  '/assets/dlorgia-gallery46.css',
  '/assets/dlorgia-gallery46.js',
  '/assets/dlorgia-imagery46.css',
  '/assets/dlorgia-imagery46.js',
  '/assets/dlorgia-admin-pmv46.css',
  '/assets/dlorgia-admin-a11y.js',
  '/assets/dlorgia-connected47.css',
  '/assets/dlorgia-campaigns47.js',
  '/assets/dlorgia-marketing47.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response(
        JSON.stringify({ error: 'Sin conexión' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      ))
    );
    return;
  }

  // Navegación y assets de la app: red primero y sin reutilizar HTTP cache viejo.
  const freshRequest = new Request(event.request, { cache: 'no-store' });
  event.respondWith(
    fetch(freshRequest)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === 'navigate') return caches.match('/app');
        return Response.error();
      })
  );
});
