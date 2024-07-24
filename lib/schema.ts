import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  retype: z.string().min(8),
});

export const profileSchema = z.object({
  tag_name: z.string().min(3).max(255),
  display_name: z.string().min(1).max(255),
  avatar_url: z.string().url(),
});