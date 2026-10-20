import { defineStore } from "pinia";
import { ref } from "vue";
import { until } from "@vueuse/core";
import { onAuthStateChanged, type User } from "firebase/auth";
import { onSnapshot, type Unsubscribe } from "firebase/firestore";
import { auth } from "@/firebase/config";
import { userDoc } from "@/firebase/services/user";
import { getError } from "@/firebase/utils/error";
import type { UserProps } from "@/types";
import { useUserStore } from "./user";

/**
 * Owns the one auth listener and the one user-document listener for the app.
 * `settled()` resolves once the auth state and (if signed in) the first profile
 * snapshot are known, so the router guard can wait before deciding where to go.
 */
export const useAuthStore = defineStore("authStore", () => {
  const isLoggedIn = ref(false);
  const authUser = ref<User | null>(null);
  /** True until we know who (if anyone) is signed in and have their profile */
  const pending = ref(true);
  /** True while registration is creating the profile, so a missing doc isn't treated as signed out */
  const registering = ref(false);

  let started = false;
  let stopProfile: Unsubscribe | null = null;

  const changeLoggedInStatus = (state: boolean) => {
    isLoggedIn.value = state;
  };

  function watchProfile(uid: string) {
    const userStore = useUserStore();
    stopProfile = onSnapshot(
      userDoc(uid),
      (snap) => {
        if (snap.exists()) {
          userStore.setUserState(snap.data() as UserProps);
          isLoggedIn.value = true;
        } else if (registering.value) {
          // Profile is still being written, the next snapshot will have it
          return;
        } else {
          userStore.setUserState(null);
          isLoggedIn.value = false;
        }
        pending.value = false;
      },
      (error) => {
        getError(error);
        pending.value = false;
      }
    );
  }

  function start() {
    if (started) return;
    started = true;

    onAuthStateChanged(auth, (user) => {
      stopProfile?.();
      stopProfile = null;
      authUser.value = user;

      if (!user) {
        useUserStore().setUserState(null);
        isLoggedIn.value = false;
        pending.value = false;
        return;
      }
      pending.value = true;
      watchProfile(user.uid);
    });
  }

  const settled = async () => {
    start();
    await until(pending).toBe(false);
  };

  return {
    isLoggedIn,
    authUser,
    pending,
    registering,
    changeLoggedInStatus,
    start,
    settled,
  };
});
