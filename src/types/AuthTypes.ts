import type { UserPreference } from "@/views/onboarding/index.vue";
import { toTypedSchema } from "@vee-validate/zod";
import z from "zod";

export type UserProps = {
  fullName: string;
  email: string;
  password: string;
  userID: string;
  role: "user";
  dislikes: any[];
  foodEaten: any[];
  id: string;
  createdAt: Date | string;
  joinedDate: Date | string;
} & UserPreference;

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
  favourites: z.array(z.record(z.string(), z.any())).default([]),
});

export type RegisterSchemaType = z.infer<typeof registerSchemaZod>;
export const registerSchema = toTypedSchema(registerSchemaZod);
