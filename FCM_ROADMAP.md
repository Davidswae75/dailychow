# Push Notifications in Daily Chow (Firebase Cloud Messaging)

A simple roadmap for sending push notifications (e.g. "🍲 Time to pick tonight's dish!") to Daily Chow users.

---

## The big picture (read this first)

FCM has **3 moving parts**:

```
 ┌──────────────┐  1. asks permission      ┌──────────────┐
 │  User's      │  2. gets a TOKEN  ─────▶ │  Firestore   │  (we save the token)
 │  browser/PWA │                          └──────┬───────┘
 └──────▲───────┘                                 │ 3. Cloud Function reads tokens
        │                                  ┌──────▼───────┐
        └──────── 4. notification ──────── │ Cloud        │
                     (via Google FCM)      │ Function     │
                                           └──────────────┘
```

- **Token** = a device's "address". No token, no notification.
- **Frontend (Vue)** gets the token and stores it.
- **Service worker** shows notifications when the app is closed / in the background.
- **Cloud Function (backend)** decides *when* and *who* to notify, and sends it.

> Everything here uses the **modular** API (`import { x } from "firebase/..."`), not the namespaced `firebase.x()` style.

> The browser can never send a push to itself or to others. Sending always happens from the backend (Cloud Functions).

---

## ✅ Current setup: no Cloud Functions (send from the Firebase Console)

Steps 1–3 are **already built** into the app. Steps 4–5 (Cloud Functions) are for later.

**What the app does now**
- **Preferences → Account → Notifications**: tap it to allow notifications. This device's token is saved to `users/{uid}.fcmTokens`.
- When the app is open, notifications show as a toast. When it's closed, the phone or computer shows them ([src/sw.ts](src/sw.ts)).
- Tapping a notification opens Daily Chow.

**How to send one (no code)**
1. Firebase Console → **Messaging** → **Create your first campaign** → **Firebase Notification messages**.
2. Write the title and text.
3. **Target** → choose your **web app**.
4. **Scheduling** → *Now*, a date/time, or **recurring** (e.g. daily at 18:00).
5. **Review** → **Publish**.

**To test on one device:** in the campaign, click **Send test message** and paste a token from the `fcmTokens` field of your user document in Firestore.

> Notifications only work on the **built app over HTTPS** (or `localhost`): run `npm run build && npm run preview`. In `npm run dev` the service worker isn't active.

---

## Step 0 — Firebase Console setup (one time)

1. Open [Firebase Console](https://console.firebase.google.com) → your project.
2. **Project settings → Cloud Messaging → Web Push certificates → Generate key pair.**
3. Copy the key and add it to your `.env`:
   ```env
   VITE_FIREBASE_VAPID_KEY=your_key_here
   ```
4. *(Only when you add Cloud Functions)* Upgrade to the **Blaze (pay-as-you-go)** plan. (Free tier usage is still free.)

---

## Step 1 — Make messaging safe to load

Not every browser supports push (e.g. iOS Safari outside an installed PWA). Calling `getMessaging()` there throws an error and can break the app.

Update [src/firebase/config.ts](src/firebase/config.ts):

```ts
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

export const app = initializeApp(config);
// ...db, auth unchanged

export const getMessagingSafe = async (): Promise<Messaging | null> =>
  (await isSupported()) ? getMessaging(app) : null;
```

And remove the old `export const messaging = getMessaging(app)` line.

---

## Step 2 — Add FCM to the service worker (modular API)

The modular SDK uses `import`, and a plain `public/*.js` file can't be bundled. So instead of a separate `firebase-messaging-sw.js`, we put FCM **inside the PWA service worker you already have**, and let Vite bundle it.

**2a.** Switch vite-plugin-pwa to `injectManifest` in [vite.config.ts](vite.config.ts). This means you write your own service worker file, and Vite still adds the precache list to it:

```ts
VitePWA({
  strategies: "injectManifest",
  srcDir: "src",
  filename: "sw.ts",
  registerType: "autoUpdate",
  injectRegister: false,
  injectManifest: {
    globPatterns: ["**/*.{js,css,html,svg,png,webp,gif,woff2}"],
  },
  manifest: { /* unchanged */ },
  // remove the `workbox: {...}` block. Its settings move into sw.ts below
}),
```

Install the Workbox helpers:

```bash
npm i -D workbox-precaching workbox-routing workbox-strategies workbox-expiration workbox-core
```

**2b.** Create **`src/sw.ts`**:

```ts
/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { clientsClaim } from "workbox-core";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

declare const self: ServiceWorkerGlobalScope;

// ---- PWA caching (same behaviour as the old `workbox` config) ----
self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
registerRoute(new NavigationRoute(createHandlerBoundToURL("/index.html")));

registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com",
  new CacheFirst({ cacheName: "google-fonts", plugins: [new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 })] })
);
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({ cacheName: "images", plugins: [new ExpirationPlugin({ maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 })] })
);

// ---- Firebase Cloud Messaging (modular) ----
// Vite bundles this file, so import.meta.env works here.
const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});
const messaging = getMessaging(app);

// Runs when a message arrives while the app is CLOSED or in the background.
// If the message has a `notification` field, FCM shows it automatically,
// so only data-only messages need to be shown by hand here.
onBackgroundMessage(messaging, (payload) => {
  if (payload.notification) return;
  self.registration.showNotification(payload.data?.title ?? "Daily Chow", {
    body: payload.data?.body,
    icon: "/pwa-192x192.png",
  });
});
```

> Your existing `registerSW(...)` in [src/main.ts](src/main.ts) keeps working. It now registers this file.

---

## Step 3 — Ask permission & save the token (frontend)

Create **`src/composables/useNotifications.ts`**:

```ts
import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { useToast } from "vue-toastification";
import { db, auth, getMessagingSafe } from "@/firebase/config";

export function useNotifications() {
  const toast = useToast();

  async function enableNotifications() {
    const messaging = await getMessagingSafe();
    if (!messaging) return toast.error("Notifications aren't supported on this device.");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return toast.info("Notifications are turned off.");

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      // Use our PWA service worker (src/sw.ts) instead of firebase-messaging-sw.js
      serviceWorkerRegistration: await navigator.serviceWorker.ready,
    });

    const user = auth.currentUser;
    if (user && token) {
      // A user can have many devices → store tokens as an array
      await setDoc(doc(db, "users", user.uid), { fcmTokens: arrayUnion(token) }, { merge: true });
      toast.success("Notifications enabled 🎉");
    }
  }

  // Runs when a notification arrives while the app is OPEN
  async function listenInForeground() {
    const messaging = await getMessagingSafe();
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      toast.info(`${payload.notification?.title}: ${payload.notification?.body}`);
    });
  }

  return { enableNotifications, listenInForeground };
}
```

**Use it:**
- Call `enableNotifications()` from a **button click** (e.g. "Remind me to eat 🍛" in settings). Browsers block permission prompts that aren't triggered by the user.
- Call `listenInForeground()` once after login (e.g. in the dashboard layout's `onMounted`).

---

## Step 4 — Set up Cloud Functions (backend)

The `functions/` folder exists but isn't initialized yet. From the project root:

```bash
npm install -g firebase-tools
firebase login
firebase init functions     # choose: existing project, TypeScript, install deps = yes
```

This creates `functions/package.json`, `firebase.json`, etc.

---

## Step 5 — Write the function that sends notifications

> **Why does this code use `getFirestore().doc(...).get()` and not `getDoc(doc(...))`?**
> Cloud Functions use the **Admin SDK** (`firebase-admin`), not the web SDK (`firebase`). The Admin SDK has no `getDoc` / `doc` / `collection` functions. It only has the chained style shown below, and this is what Google's own docs use for the Admin SDK.
> Its imports are still split by feature (`firebase-admin/firestore`, `firebase-admin/messaging`), but its methods are chained.
> The rule: **frontend (`src/`) = `getDoc(docRef)` style; backend (`functions/`) = `db.doc(path).get()` style.**

Pick **the trigger that fits** in `functions/src/index.ts`:

### Option A: Scheduled (e.g. every day at 6pm — "What's for dinner?")

```ts
import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

initializeApp();

export const dinnerReminder = onSchedule(
  { schedule: "0 18 * * *", timeZone: "Africa/Lagos" },
  async () => {
    const users = await getFirestore().collection("users").get();
    const tokens = users.docs.flatMap((d) => d.get("fcmTokens") ?? []);
    if (!tokens.length) return;

    // sendEachForMulticast accepts up to 500 tokens per call
    for (let i = 0; i < tokens.length; i += 500) {
      await getMessaging().sendEachForMulticast({
        tokens: tokens.slice(i, i + 500),
        notification: {
          title: "🍲 Dinner time!",
          body: "Can't decide? Let Daily Chow pick tonight's dish.",
        },
        webpush: { fcmOptions: { link: "/dashboard/home" } }, // page to open on tap
      });
    }
  }
);
```

### Option B: Triggered by a Firestore change (e.g. a new meal plan is created)

```ts
import { onDocumentCreated } from "firebase-functions/v2/firestore";

export const onMealPlanCreated = onDocumentCreated("mealPlans/{id}", async (event) => {
  const userId = event.data?.get("userId");
  const user = await getFirestore().doc(`users/${userId}`).get();
  const tokens: string[] = user.get("fcmTokens") ?? [];
  if (!tokens.length) return;

  await getMessaging().sendEachForMulticast({
    tokens,
    notification: { title: "Meal plan ready ✅", body: "Your plan for the week is set." },
  });
});
```

---

## Step 6 — Deploy & test

```bash
firebase deploy --only functions
```

**Quick test without writing any backend code:**
1. Log the token in the browser console after `getToken(...)`.
2. Firebase Console → **Messaging → New campaign → Notifications → Send test message** → paste the token.

**Test both cases:**
| App state | Who shows it |
|---|---|
| App open (tab focused) | `onMessage` → toast (Step 3) |
| App closed / background | `src/sw.ts` (Step 2) |

---

## Step 7 — Housekeeping (do later, but do it)

- **Remove dead tokens:** `sendEachForMulticast` returns which tokens failed. Remove ones with error `messaging/registration-token-not-registered` from Firestore.
- **Firestore rules:** make sure a user can only write to their own `users/{uid}` doc.
- **Logout:** call `deleteToken(messaging)` and remove the token from Firestore so the next person on that device doesn't get their notifications.
- **iPhone users:** push only works if they **Add to Home Screen** (installed PWA), iOS 16.4+.

---

## Checklist

- [ ] VAPID key generated & added to `.env`
- [ ] Blaze plan enabled
- [ ] `config.ts` uses `isSupported()`
- [ ] `vite.config.ts` switched to `injectManifest` + `src/sw.ts` created
- [ ] `useNotifications` composable + "Enable notifications" button
- [ ] `firebase init functions` done
- [ ] Function written & deployed
- [ ] Tested with app open AND closed
- [ ] Dead-token cleanup + logout handling
