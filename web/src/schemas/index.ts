import { z } from "zod";

export const userDetailsSchema = z.object({
  name: z.string(),
  id: z.number(),
  email: z.string().email(),
  vehicles: z.array(z.string()),
});