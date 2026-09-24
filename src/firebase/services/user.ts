import { useAuth } from "@/hooks/useAuth";
import { useDoc } from "@/hooks/useDoc";
import type { UserProps } from "@/types";

const { setDocument } = useDoc();
const { signIn } = useAuth()

export async function initUser(user: Omit<UserProps, "id" | "userID">) {
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

    return { ...user, userID: uid, id: uid };
   } catch (error: any) {
    throw new Error(error)
   }
  } 
