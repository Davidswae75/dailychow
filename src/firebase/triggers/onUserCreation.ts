import { useDoc } from "@/hooks/useDoc";
import type { UserProps } from "@/types";
import { getError} from "../utils/error";
import { FirebaseError } from "firebase/app";

export async function onUserCreation(user: UserProps) {
   try {
    const { setDocument } = useDoc();

    const payload: UserProps = {
      email: user.email,
      fullName: user.fullName,
      password: user.password,
      id: user.id,
      foodEaten: [],
      notInterested: user.notInterested,
      role: "user",
      userID: user.id,
      interests: user.interests,
      bodyType: user.bodyType,
      favourites: [...user.favourites],
      dislikes: [],
      createdAt: new Date(),
      joinedDate: new Date(),
    };
  
    await setDocument({
      col: "users",
      data: payload,
      id: user.id,
    });
   } catch (error) {
    getError(error)
   }

}
