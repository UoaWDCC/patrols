import type { Request, Response } from "express";
import prisma from "../db/database";
import { LogonStatus, Weather } from "@prisma/client";
import { Resend } from "resend";
import { z } from "zod";
// import { userDetailsSchema } from "./emailController";

const EMAIL_API_KEY: string = process.env.RESEND_API_KEY as string;
const CPNZ_APP_EMAIL = "ecc@cpnz.org.nz";
const resend = new Resend(EMAIL_API_KEY);

const reportSchema = z.object({
  startOdometer: z.string(),
  weatherCondition: z.string(),
  memberId: z.string(),
  shiftId: z.string(),
  vehicleId: z.string(),
  endOdometer: z.string(),
  isFootPatrol: z.boolean(),
  debrief: z.string(),
  observations: z.array(
    z.object({
      time: z.string(),
      description: z.string(),
      displayed: z.boolean(),
      location: z.string(),
      category: z.string(),
      type: z.string(),
    })
  ),
});

const statsSchema = z.object({
  kmTravelled: z.number(),
  personIncidents: z.number(),
  vehicleIncidents: z.number(),
  propertyIncidents: z.number(),
  willfulDamageIncidents: z.number(),
  otherIncidents: z.number(),
  totalIncidents: z.number(),
});

const emailSchema = z.object({
  recipientEmail: z.string(),
  data: z.object({
    cpnzId: z.string(),
    email: z.string(),
    formData: reportSchema,
    statistics: statsSchema,
  }),
});

export const logOffStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(req.params.id);
    const user = await prisma.members_dev.findUnique({
      where: { cpnz_id: BigInt(id) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else if (user.logon_status === LogonStatus.No) {
      return res.status(400).json({ error: "User is already logged off" });
    }

    await prisma.members_dev.update({
      where: { cpnz_id: BigInt(id) },
      data: { logon_status: LogonStatus.No },
    });

    res.status(200).json({ message: "User has been logged off." });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const logOffEmail = async (req: Request, res: Response) => {
  console.log(req.body.data);

  const parseResult = emailSchema.safeParse(req.body);

  if (!parseResult.success) {
    // throw new Error(`Invalid email data: ${JSON.stringify(parseResult.error.flatten())}`);
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const observerName = await prisma.members_dev.findFirst({
    where: {
      cpnz_id: Number(parseResult.data.data.cpnzId),
    },
    select: { first_names: true, surname: true },
  });

  /* Getting the full name of the obeserver */
  if (!observerName) {
    return res
      .status(400)
      .json({ message: "No member found with the provided cpnz_id" });
  }

  const ObserverFullName = `${observerName.first_names} ${observerName.surname}`;

  const { recipientEmail, data }: z.infer<typeof emailSchema> =
    parseResult.data;

  // Check if the API key is provided
  if (!EMAIL_API_KEY) {
    res
      .status(400)
      .json({ message: "Auth failed: Please provide Resend API key." });
    // throw new Error("Auth failed: Please provide Resend API key.");
  }

  /* Create a post request to store the observation*/
  prisma.reports.create({
    data: {
      member_id: BigInt(data.formData.memberId),
      shift_id: BigInt(data.formData.shiftId),
      vehicle_details_id: BigInt(data.formData.vehicleId),
      odometer_initial_reading: Number(data.formData.startOdometer),
      odometer_final_reading: Number(data.formData.endOdometer),
      weather_condition: Weather.Wet,
      is_foot_patrol: data.formData.isFootPatrol,
      notes: data.formData.debrief,
      km_travelled: data.statistics.kmTravelled,
      person_incidents: data.statistics.personIncidents,
      vehicle_incidents: data.statistics.vehicleIncidents,
      property_incidents: data.statistics.propertyIncidents,
      willful_damage_incidents: data.statistics.willfulDamageIncidents,
      other_incidents: data.statistics.otherIncidents,
      total_incidents: data.statistics.totalIncidents,
    },
  });

  console.log("report created");

  // Loop through observations using forEach
  data.formData.observations.forEach((observation, index) => {
    prisma.observations.create({
      data: {
        start_time: observation.time,
        end_time: observation.time,
        location: observation.location,
        is_police_or_security_present: false,
        incident_category: observation.category,
        incident_sub_category: observation.category,
        description: observation.description,
        report_id: BigInt(data.formData.shiftId),
      },
    });
  });

  console.log("observation success");

  /* Send email to the recipient */
  try {
    const email = await resend.emails.send({
      from: `CPNZ <${CPNZ_APP_EMAIL}>`,
      to: [`${recipientEmail}`],
      subject: `CPNZ - Log Off - Patrol ID: ${data.cpnzId} - Shift ID: ${data.formData.shiftId}`,
      html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.8;">
          <p style="font-size: 1.2em; font-weight: bold;">
            ${ObserverFullName} requests to log off a shift with the following details:
          </p>
          <hr>
          <p>
            Please reply with the <strong>Event ID</strong> to 
            <a href="mailto:cpnz123@kmail.com" style="color: #1a73e8; text-decoration: none;">CPNZ Patrol Email</a>
          </p>
        </div>`,
    });

    res.status(200).json(email);
  } catch (error) {
    res.status(400).json(error);
  }
};
