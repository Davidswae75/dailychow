import type { NewUser, UserProps } from "@/types";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config";

export const userDoc = (uid: string) => doc(db, "users", uid);

/**
 * Creates the Auth account, then the profile document. If the profile write
 * fails the Auth account is deleted again, so we never leave an account
 * without a profile behind.
 */
export async function initUser(user: NewUser) {
  // The password goes to Firebase Auth only, never to the user document
  const { password, ...profile } = user;

  const { user: authUser } = await createUserWithEmailAndPassword(auth, profile.email, password);

  const data: UserProps = { ...profile, userID: authUser.uid, id: authUser.uid };
  try {
    await setDoc(userDoc(authUser.uid), data);
  } catch (error) {
    await deleteUser(authUser).catch(() => {});
    throw error;
  }
  return data;
}
