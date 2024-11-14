importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js",
);

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "https://api-cartilha.squareweb.app";
// Precaching de arquivos essenciais
workbox.precaching.precacheAndRoute([
  // Precaching das páginas principais
  { url: "/", revision: "1" }, // Página inicial
  { url: "/edicao-completa", revision: "1" },
  { url: "/autores", revision: "1" }, // Exemplo de página "sobre"

  // Precaching dos arquivos estáticos gerados no build
  { url: "/_next/static/chunks/pages/index.js", revision: "1" },
  { url: "/_next/static/chunks/pages/edicao-completa.js", revision: "1" },
  { url: "/_next/static/chunks/pages/autores.js", revision: "1" },

  // Manifests e outros recursos
  { url: "/manifest.json", revision: "1" },
  { url: "/favicon.ico", revision: "1" },

  // Recursos de mídia
  // { url: "/logo.png", revision: "1" },
]);

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Versão do cache para controle de atualizações
const CACHE_VERSION = "1.0.0";

// Rota para a API de capítulos
workbox.routing.registerRoute(
  new RegExp("baseUrl/api/capitulos?populate=*"),
  new workbox.strategies.NetworkFirst({
    cacheName: "api-capitulos-cache",
  }),
);

// Rotas para as collections
workbox.routing.registerRoute(
  new RegExp(
    `${baseUrl}/api/(pesticida-abelhas|boa-pratica-agroes|boa-pratica-apicolas|boa-pratica-comunicacaos)\\?populate=\\*`,
  ),
  new workbox.strategies.NetworkFirst({
    cacheName: `collections-cache-v${CACHE_VERSION}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 dia
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      // Plugin para validar se há atualizações
      {
        cachedResponseWillBeUsed: async ({ cachedResponse }) => {
          if (cachedResponse) {
            const dateHeader = cachedResponse.headers.get("date");
            const cacheAge = dateHeader
              ? Date.now() - new Date(dateHeader).getTime()
              : null;

            // Se o cache tiver mais de 1 hora, força uma atualização
            if (cacheAge > 60 * 60 * 1000) {
              return null; // Isso forçará uma nova requisição à rede
            }
          }
          return cachedResponse;
        },
      },
    ],
  }),
);

// Rota para a API de autores
workbox.routing.registerRoute(
  new RegExp(`${baseUrl}/api/autors\\?populate=\\*`),
  new workbox.strategies.NetworkFirst({
    cacheName: "autores-cache",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 semana
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

self.addEventListener("fetch", (event) => {
  if (
    event.request.url.includes("/api/capitulos") ||
    event.request.url.includes("/api/autors")
  ) {
    const promiseChain = fetch(event.request.clone()).catch(() => {
      return self.registration.sync.register("syncData");
    });
    event.waitUntil(promiseChain);
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag === "syncData") {
    event.waitUntil(syncData());
  }
});

// Função de sincronização atualizada
function syncData() {
  return Promise.all([
    workbox.precaching.cleanupOutdatedCaches(),
    caches.delete("collections-cache"),
    caches.delete("autores-cache"),
  ]).then(() => {
    return workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
  });
}

// Rotas para arquivos estáticos
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|ico|css)$/,
  new workbox.strategies.CacheFirst({
    cacheName: "static-cache",
  }),
);

// Rota para o arquivo de manifest
workbox.routing.registerRoute(
  /manifest.json$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "manifest-cache",
  }),
);

// Rota para outras rotas (página principal, etc.)
workbox.routing.registerRoute(
  ({ url }) => url.origin === self.location.origin,
  new workbox.strategies.StaleWhileRevalidate(),
);

// Fallback para páginas offline
workbox.routing.setCatchHandler(async ({ event }) => {
  if (event.request.destination === "document") {
    return caches.match("/offline");
  }

  // Tenta retornar dados do cache para APIs
  if (event.request.url.includes("/api/")) {
    const cache = await caches.open("collections-cache");
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }
  }

  return Response.error();
});

// Atualização do Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [
    `static-cache-v${CACHE_VERSION}`,
    `collections-cache-v${CACHE_VERSION}`,
    `autores-cache-v${CACHE_VERSION}`,
    `manifest-cache-v${CACHE_VERSION}`,
  ];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Remove caches antigos que não estão na whitelist ou são de versões anteriores
          if (
            !cacheWhitelist.includes(cacheName) ||
            (cacheName.includes("-cache-v") &&
              !cacheName.includes(`-v${CACHE_VERSION}`))
          ) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
