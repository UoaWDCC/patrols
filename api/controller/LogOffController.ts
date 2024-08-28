import type { Request, Response } from "express";
import prisma from "../db/database";
import { LogonStatus, Weather } from "@prisma/client";
import { Resend } from "resend";
import { z } from "zod";
// import { userDetailsSchema } from "./emailController";

const EMAIL_API_KEY: string = process.env.RESEND_API_KEY as string;
const CPNZ_APP_EMAIL = "ecc@cpnz.org.nz";
const POLICE_EMAIL = process.env.CPNZ_ECC_RECIPIENT_EMAIL;
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
  data: z.object({
    cpnzID: z.string(),
    email: z.string(),
    formData: reportSchema,
    statistics: statsSchema,
  }),
});

export const logOffEmail = async (req: Request, res: Response) => {
  console.log(req.body.data);

  const parseResult = emailSchema.safeParse(req.body);

  if (!parseResult.success) {
    // throw new Error(`Invalid email data: ${JSON.stringify(parseResult.error.flatten())}`);
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const observerName = await prisma.members_dev.findFirst({
    where: {
      cpnz_id: Number(parseResult.data.data.cpnzID),
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

  const {data }: z.infer<typeof emailSchema> =
    parseResult.data;

  // Check if the API key is provided
  if (!EMAIL_API_KEY) {
    res
      .status(400)
      .json({ message: "Auth failed: Please provide Resend API key." });
    // throw new Error("Auth failed: Please provide Resend API key.");
  }

  /* Create a post request to store the observation*/
  const report = await prisma.reports.create({
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
  data.formData.observations.forEach(async (observation, index) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const time = new Date(currentDate + "T" + observation.time).toISOString();

    await prisma.observations.create({
      data: {
        start_time: time,
        end_time: time,
        location: observation.location,
        is_police_or_security_present: false,
        incident_category: observation.category,
        incident_sub_category: observation.category,
        description: observation.description,
        report_id: report.id,
      },
    });
  });

  console.log("observation success");

  /* Send email to the recipient */
  try {
    const email = await resend.emails.send({
      from: `CPNZ <${CPNZ_APP_EMAIL}>`,
      to: [`${POLICE_EMAIL}`],
      subject: `CPNZ - Log Off - Patrol ID: ${data.cpnzID} - Shift ID: ${data.formData.shiftId}`,
      html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.8;">
            <h2>This is a controlled test from CPNZ</h2>
          <p style="font-size: 1.2em; font-weight: bold;">
            ${ObserverFullName} requests to log off. 
          </p>
          <hr>
          <p>
            Please reply with the <strong>Event ID</strong> to 
            <a href="mailto:cpnz123@kmail.com" style="color: #1a73e8; text-decoration: none;">CPNZ Patrol Email</a>
          </p>
        </div>`,
    });

    await prisma.members_dev.update({
      where: { id: BigInt(data.formData.memberId) },
      data: { logon_status: LogonStatus.No },
    });

    res.status(200).json(email);
  } catch (error) {
    res.status(400).json(error);
  }
};
