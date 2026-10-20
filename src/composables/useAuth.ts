import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { getError } from "@/firebase/utils/error";
import { useAuthStore } from "@/store";
import { useRouter } from "vue-router";
import { until } from "@vueuse/core";
import { useToast } from "vue-toastification";

export function useAuth() {
  const toast = useToast();
  const router = useRouter();
  const authStore = useAuthStore();

  /** Signs in and waits until the profile has loaded, so the next navigation passes the guard. */
  const signIn = async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    authStore.start();
    await until(() => authStore.authUser?.uid === user.uid && !authStore.pending).toBe(true);
    return { uid: user.uid };
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      toast.info("Logged Out Successfully");
      router.push("/sign-in");
    } catch (error) {
      getError(error);
    }
  };

  return {
    signIn,
    signOutUser,
  };
}
