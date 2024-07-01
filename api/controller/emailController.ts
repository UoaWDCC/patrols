import prisma from "../db/database";
import type { Request, Response } from "express";
import { z } from "zod";
import { Resend } from "resend";

const EMAIL_API_KEY: string = process.env.RESEND_API_KEY as string;
const CPNZ_APP_EMAIL = "ecc@cpnz.org.nz";
const resend = new Resend(EMAIL_API_KEY);


function toObject(data: any) {
  return JSON.parse(
    JSON.stringify(data, (key, value) => (typeof value === "bigint" ? value.toString() : value))
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

export const sendLogOnEmail = async (req: Request, res: Response) => {
  const emailSchema = z.object({
    email: z.string(),
    recipientEmail: z.string(),
    cpnzID: z.string(),
    formData: formSchema,
    driver: userDetailsSchema,
  });

  const parseResult = emailSchema.safeParse(req.body);

  if (!parseResult.success) {
    //return res.status(400).json({ error: parseResult.error.flatten() });
    throw new Error(`Invalid email data: ${JSON.stringify(parseResult.error.flatten())}`);
  }

  const {
    email,
    recipientEmail,
    cpnzID,
    formData,
    driver,
  }: z.infer<typeof emailSchema> = parseResult.data;

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

try {
  const data = await resend.emails.send({
    from: `CPNZ <${CPNZ_APP_EMAIL}>`,
    to: [`${recipientEmail}`],
    subject: `CPNZ - Log On - Patrol ID: ${cpnzID}`,
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
      <strong>CPNZ ID:</strong> ${formData.cpCallSign} <br>
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

  //res.status(200).json(data);
} catch (error) {
  //res.status(400).json(error);
  throw new Error(`Error sending email: ${error}`);
}
};


const amendmentSchema = z.object({
  text: z.string(),
  report_id: z.union([z.string(), z.number(), z.bigint()]).transform((val) => {
    if (typeof val === "string" || typeof val === "number") {
      return BigInt(val);
    }
    return val;
  }),
});

export const sendAmendEmail = async (email: string, text: string, reportId: bigint) => {
  if (!EMAIL_API_KEY) {
    throw new Error("Auth failed: Please provide Resend API key.");
  }

  const subject = `CPNZ - Amendment for Report ID: ${reportId}`;

  try {
    const data = await resend.emails.send({
      from: `CPNZ <${CPNZ_APP_EMAIL}>`,
      to: [email],
      subject: subject,
      html: `<p>${text}</p>`,
    });
    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error sending email:', error.message);
      throw new Error(`Error sending email: ${error.message}`);
    } else {
      console.error('Unknown error sending email:', error);
      throw new Error('Unknown error sending email');
    }
  }
};

export const handleAmendment = async (req: Request, res: Response) => {
  const parseResult = amendmentSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { text, report_id } = parseResult.data;

  try {
    // Check if the report_id exists in the reports table
    const report = await prisma.reports.findUnique({
      where: {
        id: report_id,
      },
    });

    if (!report) {
      return res.status(404).json({ message: `Report with ID ${report_id} not found` });
    }

    // Store text in the database
    const amendment = await prisma.amendment.create({
      data: {
        description: text,
        report_id: report_id,
      },
    });

    // Send the amendment email
    try {
      const emailResponse = await sendAmendEmail('jbac208@aucklanduni.ac.nz', text, report_id);
      res.status(201).json({ message: 'Amendment submitted successfully', amendment: toObject(amendment), emailResponse });
    } catch (emailError) {
      if (emailError instanceof Error) {
        console.error('Error sending email:', emailError.message);
        res.status(500).json({ message: 'Error sending email', error: emailError.message });
      } else {
        console.error('Unknown error sending email:', emailError);
        res.status(500).json({ message: 'Unknown error sending email' });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error handling amendment:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    } else {
      console.error('Unknown error handling amendment:', error);
      res.status(500).json({ message: 'Unknown error handling amendment' });
    }
  }
};
