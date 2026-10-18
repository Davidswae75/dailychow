import { useAuth } from "@/composables/useAuth";
import { useDoc } from "@/composables/useDoc";
import type { NewUser, UserProps } from "@/types";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config";
import { useAuthStore, useUserStore } from "@/store";
import { router } from "@/router";

const { setDocument } = useDoc();
const { signIn } = useAuth();

export const userDoc = (uid: string) => doc(db, "users", uid);

export async function initUser(user: NewUser) {
  try {
    const { uid } = await signIn("register", user.email, user.password);
    const data: UserProps = { ...user, userID: uid, id: uid };
    
    //For security reasons, best the password goes to Firebase Auth only, not to the user document
    await setDocument({ col: "users", data, id: uid });

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getUserByid(id: string) {
  const { setUserState } = useUserStore();
  const { changeLoggedInStatus } = useAuthStore();

  try {
    onSnapshot(userDoc(id), async (docRef) => {
      if (docRef.exists()) {
        const data = docRef.data() as UserProps;
        setUserState(data);
        changeLoggedInStatus(true);
        console.log(data);
      } else {
        setUserState(null);
        changeLoggedInStatus(false);
        router.push("/sign-in");
      }
    });
  } catch (error: any) {
    throw new Error(error);
  }
}
