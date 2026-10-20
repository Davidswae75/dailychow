/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { clientsClaim } from "workbox-core";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: Array<string | { url: string; revision: string | null }> };

// ---- PWA caching ----
self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
registerRoute(new NavigationRoute(createHandlerBoundToURL("/index.html")));

registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com",
  new CacheFirst({ cacheName: "google-fonts", plugins: [new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 })] }),
);
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({ cacheName: "images", plugins: [new ExpirationPlugin({ maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 })] }),
);

// ---- Firebase Cloud Messaging ----

// Tapping a notification focuses an open Daily Chow tab, or opens one.
// Registered before getMessaging so it runs instead of Firebase's own click handler.
self.addEventListener("notificationclick", (event) => {
  event.stopImmediatePropagation();
  event.notification.close();
  const fcm = event.notification.data?.FCM_MSG;
  const url = fcm?.fcmOptions?.link ?? fcm?.data?.url ?? "/dashboard/home";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((tabs) => {
      const tab = tabs[0];
      return tab ? tab.focus().then((t) => t.navigate(url)) : self.clients.openWindow(url);
    }),
  );
});

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});
const messaging = getMessaging(app);

// Messages with a `notification` field (all Console campaigns) are shown by Firebase
// automatically; only data-only messages need to be shown here.
onBackgroundMessage(messaging, (payload) => {
  if (payload.notification) return;
  self.registration.showNotification(payload.data?.title ?? "Daily Chow", {
    body: payload.data?.body,
    icon: "/pwa-192x192.png",
    data: { FCM_MSG: payload },
  });
});
