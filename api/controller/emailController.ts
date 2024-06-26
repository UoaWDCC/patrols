import type { Request, Response } from "express";
import { z } from "zod";
import { Resend } from "resend";

const EMAIL_API_KEY: string = process.env.RESEND_API_KEY as string;
const CPNZ_APP_EMAIL = "ecc@cpnz.org.nz";
const resend = new Resend(EMAIL_API_KEY);

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

export const sendEmail = async (req: Request, res: Response) => {
  const emailSchema = z.object({
    email: z.string(),
    recipientEmail: z.string(),
    cpnzID: z.string(),
    formData: formSchema,
    driver: userDetailsSchema,
  });

  const parseResult = emailSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const {
    email,
    recipientEmail,
    cpnzID,
    formData,
    driver,
  }: z.infer<typeof emailSchema> = parseResult.data;

  if (!EMAIL_API_KEY) {
    res
      .status(400)
      .json({ message: "Auth failed: Please provide Resend API key." });
  }

  console.log(EMAIL_API_KEY);

  const guestPatrollersFormatted =
    formData.guestPatrollers
      ?.map(
        (gp) =>
          `Guest Name: ${gp.name}, Guest Phone Number: ${gp.number}, Registered: ${gp.registered}`
      )
      .join("<br>") || "None";

  try {
    console.log(123);
    const data = await resend.emails.send({
      from: `CPNZ <${CPNZ_APP_EMAIL}>`,
      to: [`${recipientEmail}`],
      subject: `CPNZ - Log On - Patrol ID: 1 - Shift ID: 100003`,
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

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};
