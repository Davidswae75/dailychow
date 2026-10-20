import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported, onRegistered, register, type Messaging } from 'firebase/messaging'
import { getAuth } from "firebase/auth";

export const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};


export const app = initializeApp(config);
export const db = getFirestore(app)
export const auth = getAuth(app)

// getMessaging throws on browsers without push support (e.g. iOS Safari outside an installed PWA)
export const getMessagingSafe = async (): Promise<Messaging | null> =>
  (await isSupported()) ? getMessaging(app) : null;



// // 1. Implement callback to receive the Firebase installation ID upon registration.
// // This is triggered every time a manual register() finishes, a FID change
// // is detected, or a pushsubscriptionchange event is fired.
// onRegistered(messaging, (installationId) => {
//   console.log('Registered installation ID:', installationId);

//   // Send the Firebase Installation ID to your app server and update the UI if needed.
//   sendRegistrationToServer(installationId);
// });

// // 2. You can also manually trigger registration (recommended on app startup)
// register(messaging, {
//   vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>'
// }).then(() => {
//   // Success! The Firebase Installation ID can be used to target messages to this app
//   // instance and will be delivered asynchronously to your onRegistered() callback.
// }).catch((err) => {
//   console.error('An error occurred while registering', err);
// });