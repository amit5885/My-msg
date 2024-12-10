import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be atleast 3 characters")
    .max(10, "Username shouldn't be more than 10 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character"),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters" }),
});
