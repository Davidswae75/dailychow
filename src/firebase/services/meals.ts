/**
 * Firestore writes for meals, plans and preferences on the user document.
 * Reads come from the live user listener in services/user.ts, so the UI
 * updates by itself after each write.
 */
import {
  arrayRemove,
  arrayUnion,
  deleteField,
  updateDoc,
} from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config";
import type { MealTime } from "@/lib";
import type { MealLog, UserPreference } from "@/types";
import { userDoc } from "./user";

export const logMeal = (uid: string, meal: MealLog) =>
  updateDoc(userDoc(uid), { foodEaten: arrayUnion(meal) });

export const removeMeal = (uid: string, meal: MealLog) =>
  updateDoc(userDoc(uid), { foodEaten: arrayRemove(meal) });

/** Set or clear (dishId = null) one planned slot. */
export const setPlannedMeal = (
  uid: string,
  dateKey: string,
  slot: MealTime,
  dishId: string | null
) =>
  //using dots to create seperate path
  updateDoc(userDoc(uid), {
    [`plan.${dateKey}.${slot}`]: dishId ?? deleteField(),
  });

export const addDislike = (uid: string, dishId: string) =>
  updateDoc(userDoc(uid), { dislikes: arrayUnion(dishId) });

export const removeDislike = (uid: string, dishId: string) =>
  updateDoc(userDoc(uid), { dislikes: arrayRemove(dishId) });

export const updatePreferences = (
  uid: string,
  changes: Partial<UserPreference>
) => updateDoc(userDoc(uid), changes);

export const sendPasswordReset = (email: string) =>
  sendPasswordResetEmail(auth, email);
