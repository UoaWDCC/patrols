import { z } from "zod";

export const userDetailsSchema = z.object({
  name: z.string(),
  id: z.number(),
  email: z.string().email(),
  vehicles: z.array(z.string()),
});

export const tokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export const emailSchema = z.object({
  email: z.string(),
  patrolName: z.string(),
  patrolID: z.string(),
  formData: z.string(),
})