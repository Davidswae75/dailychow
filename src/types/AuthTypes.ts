import type { Dish } from "@/lib/dishes";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

export type UserProps = {
  fullName: string;
  email: string;
  password: string;
  userID: string;
  role: "user";
  dislikes: any[];
  foodEaten: any[];
  id: string;
  joinedDate: Date | string;
} & UserPreference;

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
