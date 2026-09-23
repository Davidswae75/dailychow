import { signIn } from "@/hooks/useAuth";
import { useDoc } from "@/hooks/useDoc";
import type { UserProps } from "@/types";
import { showErr } from "../utils/error";
import { FirebaseError } from "firebase/app";

const { setDocument } = useDoc();

export async function initUser(user: Omit<UserProps, 'id' | 'userID'>) {
   try {
    const { uid } = await signIn("register", user.email, user.password);

    await setDocument({
      col: "users",
      data: {
        ...user,
        userID: uid,
        id: uid,
      },
      id: uid,
    });

    return { ...user, userID: uid, id: uid}
   } catch (error) {
    if (error instanceof FirebaseError) {
      showErr(error);
    } else {
      console.error("An unexpected error occurred:", error);
    }
   }

}
