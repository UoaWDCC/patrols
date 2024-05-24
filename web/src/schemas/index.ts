import { z } from "zod";

export const vehicleDetailsSchema = z.object({
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
  first_names: z.string(),
  surname: z.string(),
  mobile_phone: z.string(),
  home_phone: z.string(),
  call_sign: z.string(),
  police_station: z.string(),
  patrol_id: z.string(),
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
});

export const patrolDetailsSchema = z.object({
  name: z.string(),
  members_dev: z.array(userDetailsSchema),
});

export const formSchema = z.object({
  cpnzID: z.string(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const formObservationSchema = z.array(
  z.object({
    location: z.string(),
    description: z.string(),
    time: z.string(),
    category: z.string(),
    type: z.enum(["observation", "intel"]),
    displayed: z.boolean(),
  })
);

export const reportFormSchema = z.object({
  startOdometer: z.string(),
  weatherCondition: z.string(),
  intel: z.any(),
  observations: formObservationSchema,
  endOdometer: z.string(),
  debrief: z.string(),
});
