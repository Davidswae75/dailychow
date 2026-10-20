import { ref } from "vue";
import { getToken, onMessage } from "firebase/messaging";
import { arrayUnion, setDoc } from "firebase/firestore";
import { useToast } from "vue-toastification";
import { auth, getMessagingSafe } from "@/firebase/config";
import { userDoc } from "@/firebase/services/user";
import { getError } from "@/firebase/utils/error";

const permission = ref<NotificationPermission | "unsupported">(
  typeof Notification === "undefined" ? "unsupported" : Notification.permission,
);
let listening = false;

/** Push notifications: asks permission, saves this device's FCM token, shows in-app toasts. */
export function useNotifications() {
  const toast = useToast();

  // Gets this device's token and stores it on the user's doc (one user can have many devices)
  async function saveToken() {
    const messaging = await getMessagingSafe();
    const user = auth.currentUser;
    if (!messaging || !user) return;
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.ready,
    });
    if (token) await setDoc(userDoc(user.uid), { fcmTokens: arrayUnion(token) }, { merge: true });
  }

  /** Call from a tap: browsers block permission prompts that the user didn't trigger. */
  async function enable() {
    if (!(await getMessagingSafe())) {
      permission.value = "unsupported";
      toast.warning("Notifications aren't supported here. On iPhone, add Daily Chow to your Home Screen first.");
      return;
    }
    permission.value = await Notification.requestPermission();
    if (permission.value === "denied") {
      toast.info("Notifications are blocked. Turn them on in your browser's site settings.");
      return;
    }
    if (permission.value !== "granted") return;
    try {
      await saveToken();
      toast.success("Notifications are on.");
    } catch (error) {
      getError(error);
    }
  }

  /** Refreshes the token and shows messages that arrive while the app is open. Safe to call more than once. */
  async function listen() {
    if (listening || permission.value !== "granted") return;
    const messaging = await getMessagingSafe();
    if (!messaging) return;
    listening = true;
    saveToken().catch(() => {});
    onMessage(messaging, ({ notification }) => {
      if (notification) toast.info([notification.title, notification.body].filter(Boolean).join(": "));
    });
  }

  return { permission, enable, listen };
}
