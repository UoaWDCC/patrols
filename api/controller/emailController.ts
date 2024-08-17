import prisma from "../db/database";
import type { Request, Response } from "express";
import { z } from "zod";
import { Resend } from "resend";
import { LogonStatus } from "@prisma/client";

const EMAIL_API_KEY: string = process.env.RESEND_API_KEY as string;
const CPNZ_APP_EMAIL = process.env.CPNZ_EMAIL_TEST;
const POLICE_EMAIL = process.env.CPNZ_ECC_RECIPIENT_EMAIL;
const resend = new Resend(EMAIL_API_KEY);

function toObject(data: any) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

const formSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  policeStationBase: z.string(),
  cpCallSign: z.string(),
  patrol: z.string(),
  observerName: z.string(),
  observerNumber: z.string(),
  guestPatrollers: z
    .array(
      z.object({
        name: z.string(),
        number: z.string(),
        registered: z.string(),
      })
    )
    .optional(),
  driver: z.string(),
  vehicle: z.string(),
  liveryOrSignage: z.string(),
  havePoliceRadio: z.string(),
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

export const sendShiftRequest = async (req: Request, res: Response) => {
  const emailSchema = z.object({
    email: z.string(),
    cpnzID: z.string(),
    formData: formSchema,
    driver: userDetailsSchema,
  });

  const parseResult = emailSchema.safeParse(req.body);
  const recipientEmail = POLICE_EMAIL;

  if (!parseResult.success) {
    //return res.status(400).json({ error: parseResult.error.flatten() });
    throw new Error(
      `Invalid email data: ${JSON.stringify(parseResult.error.flatten())}`
    );
  }

  const observer_id = await prisma.members_dev.findFirst({
    where: {
      cpnz_id: Number(parseResult.data.cpnzID),
    },
    select: { id: true },
  });

  if (!observer_id) {
    throw new Error("Observer not found");
  }

  await prisma.members_dev.update({
    where: {
      cpnz_id: Number(parseResult.data.cpnzID),
    },
    data: {
      logon_status: LogonStatus.Pending,
    },
  });

  const driver_id = await prisma.members_dev.findFirst({
    where: {
      cpnz_id: Number(parseResult.data.driver.cpnz_id),
    },
    select: { id: true },
  });

  if (!driver_id) {
    throw new Error("Driver not found.");
  }

  let shift;

  try {
    const startDateTime = new Date(parseResult.data.formData.startTime);
    const endDateTime = new Date(parseResult.data.formData.endTime);

    const d = {
      patrol_id: Number(parseResult.data.driver.patrol_id),
      start_time: startDateTime,
      end_time: endDateTime,
      police_station_base: parseResult.data.formData.policeStationBase,
      observer_id: observer_id.id,
      driver_id: driver_id.id,
      vehicle_id: Number(parseResult.data.formData.vehicle),
    };

    shift = await prisma.shift.create({
      data: {
        patrol_id: Number(parseResult.data.driver.patrol_id),
        start_time: startDateTime,
        end_time: endDateTime,
        police_station_base: parseResult.data.formData.policeStationBase,
        observer_id: observer_id.id,
        driver_id: driver_id.id,
        vehicle_id: Number(parseResult.data.formData.vehicle),
      },
    });

    const { email, cpnzID, formData, driver }: z.infer<typeof emailSchema> =
      parseResult.data;

    if (!EMAIL_API_KEY) {
      //res.status(400).json({ message: "Auth failed: Please provide Resend API key." });
      throw new Error("Auth failed: Please provide Resend API key.");
    }

    const guestPatrollersFormatted =
      formData.guestPatrollers
        ?.map(
          (gp) =>
            `Guest Name: ${gp.name}, Guest Phone Number: ${gp.number}, Registered: ${gp.registered}`
        )
        .join("<br>") || "None";

    const data = await resend.emails.send({
      from: `CPNZ <${CPNZ_APP_EMAIL}>`,
      to: [`${recipientEmail}`],
      subject: `CPNZ - Log On - Patrol ID: ${parseResult.data.driver.patrol_id} - Shift ID: ${shift?.id}`,
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.8;">
    <p style="font-size: 1.2em; font-weight: bold;">
      ${
        formData.observerName
      } requests to log on a shift with the following details:
    </p>
    <p>
      <strong>Start Time:</strong> <span style="font-size: 1.1em; color: #333;">${
        formData.startTime
      }</span> <br>
      <strong>End Time:</strong> <span style="font-size: 1.1em; color: #333;">${
        formData.endTime
      }</span> <br>
      <strong>CPNZ ID:</strong> ${cpnzID} <br>
      <strong>Name:</strong> ${formData.observerName} <br>
      <strong>Mobile Number:</strong> ${formData.observerNumber} <br>
      <strong>Email:</strong> ${email} <br>
      <strong>Police Station Base:</strong> ${formData.policeStationBase} <br>
      <strong>Patrol:</strong> ${formData.patrol} <br>
      <strong>Driver Name:</strong> ${
        driver.first_names + " " + driver.surname
      } <br>
      <strong>Driver Number:</strong> ${
        driver.mobile_phone ? driver.mobile_phone : driver.home_phone
      } <br>
        <strong>Guest Patrollers:</strong><br> ${guestPatrollersFormatted}<br>
      <strong>Vehicle:</strong> ${formData.vehicle} <br>
      <strong>Livery or Signage:</strong> ${formData.liveryOrSignage} <br>
      <strong>Have Police Radio:</strong> ${formData.havePoliceRadio} <br>
    </p>
    <hr>
    <p>
      Please reply with the <strong>Event ID</strong> to
      <a href="mailto:cpnz123@kmail.com" style="color: #1a73e8; text-decoration: none;">CPNZ Patrol Email</a>
    </p>
  </div>`,
    });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const amendmentSchema = z.object({
  text: z.string(),
  event_no: z.string(),
  // z.union([z.string(), z.number(), z.bigint()]).transform((val) => {
  //   if (typeof val === "string" || typeof val === "number") {
  //     return BigInt(val);
  //   }
  //   return val;
  // }),
});

export const sendAmendEmail = async (
  email: string,
  text: string,
  event_no: string
) => {
  if (!EMAIL_API_KEY) {
    throw new Error("Auth failed: Please provide Resend API key.");
  }

  const subject = `CPNZ - Amendment for Event No: ${event_no}`;

  try {
    const data = await resend.emails.send({
      from: `CPNZ <${CPNZ_APP_EMAIL}>`,
      to: [email],
      subject: subject,
      html: `<p>${text}</p>`,
    });
    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending email:", error.message);
      throw new Error(`Error sending email: ${error.message}`);
    } else {
      console.error("Unknown error sending email:", error);
      throw new Error("Unknown error sending email");
    }
  }
};

export const handleAmendment = async (req: Request, res: Response) => {
  const parseResult = amendmentSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { text, event_no } = parseResult.data;

  console.log(event_no);

  try {
    // Store text in the database
    const amendment = await prisma.amendment.create({
      data: {
        description: text,
        event_no: event_no,
      },
    });

    // Send the amendment email
    try {
      const recipientEmail = POLICE_EMAIL;

      if (!recipientEmail) {
        throw new Error(
          "Please ensure recipient email is provided. e.g. Police-ECC email address"
        );
      }
      const emailResponse = await sendAmendEmail(
        recipientEmail,
        text,
        event_no
      );
      res.status(201).json({
        message: "Amendment submitted successfully",
        amendment: toObject(amendment),
        emailResponse,
      });
    } catch (emailError) {
      if (emailError instanceof Error) {
        console.error("Error sending email:", emailError.message);
        res
          .status(500)
          .json({ message: "Error sending email", error: emailError.message });
      } else {
        console.error("Unknown error sending email:", emailError);
        res.status(500).json({ message: "Unknown error sending email" });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error handling amendment:", error.message);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    } else {
      console.error("Unknown error handling amendment:", error);
      res.status(500).json({ message: "Unknown error handling amendment" });
    }
  }
};
