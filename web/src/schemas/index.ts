import { z } from "zod";

export const vehicleDetailsSchema = z.object({
  id: z.string(),
  patrol_id: z.string(),
  registration_no: z.string(),
  colour: z.string(),
  model: z.string(),
  make: z.string(),
  has_livery_or_signage: z.boolean(),
  has_police_radio: z.boolean(),
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
  logon_status: z.enum(["No", "Pending", "Yes"]),
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
    location: z.string().min(1),
    description: z.string().min(1),
    time: z.string().min(1),
    category: z.string().min(1),
    type: z.enum(["observation", "intel"]),
    displayed: z.boolean(),
  })
);

export const reportFormSchema = z.object({
  startOdometer: z.string().min(3, "Odometer must be at least 3 digits"),
  weatherCondition: z.string(),
  intel: z.any(),
  observations: formObservationSchema,
  endOdometer: z.string().min(3, "Odometer must be at least 3 digits"),
  debrief: z.string(),
});

export const locationOfInterestSchema = z.object({
  id: z.string(),
  patrol_id: z.string(),
  location: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  is_police_or_security_present: z.boolean(),
  incident_category: z.string(),
  incident_sub_category: z.string(),
  description: z.string(),
});
