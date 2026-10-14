import { useAuth } from "@/hooks/useAuth";
import { useDoc } from "@/hooks/useDoc";
import type { NewUser, UserProps } from "@/types";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../config";
import { useAuthStore, useUserStore } from "@/store";
import { router } from "@/router";

const { setDocument } = useDoc();
const { signIn } = useAuth();

export async function initUser(user: NewUser) {
  try {
    // The password goes to Firebase Auth only, never into the user document
    const { password, ...profile } = user;
    const { uid } = await signIn("register", profile.email, password);

    const data: UserProps = { ...profile, userID: uid, id: uid };
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
    const colref = collection(db, "users");
    const currentUserDoc = doc(colref, id);

    onSnapshot(currentUserDoc, async (docRef) => {
      if (docRef.exists()) {
        const data = docRef.data() as UserProps;
        setUserState(data);
        changeLoggedInStatus(true);
        console.log(data)
      } else {
        setUserState(null);
        changeLoggedInStatus(false);
        router.push('/sign-in')
      }
    });
  } catch (error: any) {
    throw new Error(error);
  }
}
