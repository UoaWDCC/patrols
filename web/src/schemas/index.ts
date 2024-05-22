import { z } from "zod";

export const vehiclesSchema = z.object({
  name: z.string(),
  created_at: z.string(),
  registration_number: z.string(),
  colour: z.string(),
  livery: z.boolean(),
  selected: z.boolean(),
});

export const userDetailsSchema = z.object({
  cpnz_id: z.string(),
  email: z.string().email(),
  mobile_phone: z.string(),
  home_phone: z.string(),
  call_sign: z.string(),
  police_station: z.string(),
  patrol_id: z.string(),
  vehicle_dev: z.array(vehiclesSchema),
});

export const tokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export const emailSchema = z.object({
  patrolName: z.string(),
  email: z.string(),
  patrolID: z.string(),
  formData: z.string(),
})
