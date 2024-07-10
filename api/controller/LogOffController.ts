import type { Request, Response } from "express";
import prisma from '../db/database';
import { LogonStatus, Weather } from "@prisma/client";
import { Resend } from "resend";
import { z } from "zod";
import { start } from "repl";
// import { userDetailsSchema } from "./emailController";

const EMAIL_API_KEY: string = process.env.RESEND_API_KEY as string;
const CPNZ_APP_EMAIL = "ecc@cpnz.org.nz";
const resend = new Resend(EMAIL_API_KEY);


const reportSchema = z.object({
    member_id: z.number(),
    shift_id: z.number(),
    vehicle_details_id: z.number(),
    odometer_start: z.number(),
    odometer_end: z.number(),
    weather_condition: z.nativeEnum(Weather), // Change the type to Weather
    is_foot_patrol: z.boolean(),
    notes: z.string(),
    observations: z.array(
        z.object({
            start_time: z.string().datetime(),
            end_time: z.string().datetime(),
            location: z.string(),
            police_security_presence: z.boolean(),
            incident_catorgory: z.string(),
            incident_sub_category: z.string(),
            description: z.string(),
        })
    ),
});



export const logOffStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log(req.params.id);
        const user = await prisma.members_dev.findUnique({
            where: {cpnz_id: BigInt(id)},
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        } else if (user.logon_status === LogonStatus.No) {
            return res.status(400).json({ error: "User is already logged off" });
        }

        await prisma.members_dev.update({
            where: {cpnz_id: BigInt(id)},
            data: {logon_status: LogonStatus.No},
        });

        res.status(200).json({ message: "User has been logged off." });

    }catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export const logOffEmail = async (req: Request, res: Response) => {
    const emailSchema = z.object({
        recipientEmail: z.string(),
        cpnzID: z.string(),
        report : reportSchema,
    });

    const parseResult = emailSchema.safeParse(req.body);

    if (!parseResult.success) {
        // throw new Error(`Invalid email data: ${JSON.stringify(parseResult.error.flatten())}`);
        return res.status(400).json({ error: parseResult.error.flatten() });
      }
    
    const observerName = await prisma.members_dev.findFirst({
        where: {
            cpnz_id: Number(parseResult.data.cpnzID),
        },
        select: { first_names: true, surname: true },
    });

    /* Getting the full name of the obeserver */
    if (!observerName) {
      return res.status(400).json({message: 'No member found with the provided cpnz_id'});
    }

    const ObserverFullName = `${observerName.first_names} ${observerName.surname}`;

    const {
        recipientEmail,
        cpnzID,
        report,
    }: z.infer<typeof emailSchema> = parseResult.data;

    // Check if the API key is provided
    if (!EMAIL_API_KEY) {
        res.status(400).json({ message: "Auth failed: Please provide Resend API key." });
        // throw new Error("Auth failed: Please provide Resend API key.");
      }
    /* Create a post request to store the observation*/

    prisma.reports.create({
        data: {
            member_id: report.member_id,
            shift_id: report.shift_id,
            vehicle_details_id: report.vehicle_details_id,
            odometer_initial_reading: report.odometer_start,
            odometer_final_reading: report.odometer_end,
            weather_condition: report.weather_condition,
            is_foot_patrol: report.is_foot_patrol,
            notes: report.notes,
        },
        });
    
    // Loop through observations using forEach
    report.observations.forEach((observation, index) => {
        prisma.observations.create({
            data: {
                start_time: observation.location,
                end_time: observation.end_time,
                location: observation.location,
                is_police_or_security_present: observation.police_security_presence,
                incident_category: observation.incident_catorgory,
                incident_sub_category: observation.incident_sub_category,
                description: observation.description,
                report_id: report.shift_id,
            },
        });
    });


    /* Send email to the recipient */
    try {
        const data = await resend.emails.send({
          from: `CPNZ <${CPNZ_APP_EMAIL}>`,
          to: [`${recipientEmail}`],
          subject: `CPNZ - Log Off - Patrol ID: ${cpnzID}`,
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
      
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json(error);
      }
    }


       