import type { Dish } from "@/lib/dishes";
import type { MealLog, MealPlan } from "./MealTypes";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

/** The user document in Firestore. Never holds the password: Firebase Auth owns that. */
export type UserProps = {
  fullName: string;
  email: string;
  userID: string;
  role: "user";
  /** Dish ids the user never wants suggested */
  dislikes: string[];
  foodEaten: MealLog[];
  plan?: MealPlan;
  id: string;
  joinedDate: Date | string;
  createdAt?: Date | string;
} & UserPreference;

/** What registration collects: the profile plus the password Firebase Auth needs. */
export type NewUser = Omit<UserProps, "id" | "userID"> & { password: string };

export interface UserPreference {
  interests: string;
  notInterested: {
    dietaryNeeds: string[];
    pepperLevel: string;
  };
  bodyType: {
    id: string;
    name: string;
    category: string;
  };
  favourites: Dish[];
}

const registerSchemaZod = z.object({
  fullName: z.string().nonempty("Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  interests: z.string(),
  notInterested: z.object({
    dietaryNeeds: z.array(z.string()),
    pepperLevel: z.string(),
  }),
  bodyType: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
  }),
  favourites: z.array(z.custom<Dish>()).default([]),
});

export type RegisterSchemaType = z.infer<typeof registerSchemaZod>;
export const registerSchema = toTypedSchema(registerSchemaZod);

const loginSchemaZod = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type loginSchemaType = z.infer<typeof loginSchemaZod>;
export const loginSchema = toTypedSchema(loginSchemaZod);
