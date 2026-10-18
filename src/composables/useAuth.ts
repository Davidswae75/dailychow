import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "vue-router";
import { getUserByid } from "@/firebase/services/user";
import { getError } from "@/firebase/utils/error";
import { useUserStore } from "@/store";
import { useToast } from "vue-toastification";

export function useAuth() {
  const toast = useToast()

  const signIn = async (
    type: "register" | "login",
    email: string,
    password: string
  ) => {
    const cred =
      type === "register"
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: cred.user.uid,
    };
  };

  const checkUser = () => {
    const { setUserState } = useUserStore();
    const router = useRouter();

    onAuthStateChanged(auth, async (cred) => {
      try {
        if (!cred) {
          router.push("/sign-in");
          setUserState(null);
          return;
        }
        await getUserByid(cred.uid);
      } catch (error: any) {
        router.push("/sign-in");
        getError(error);
      }
    });
  };

  const signOutUser = async () => {
    await signOut(auth).then(() => {
      toast.info('Logged Out Successfully')
    })
  }

  return {
    signIn,
    checkUser,
    signOutUser
  };
}
