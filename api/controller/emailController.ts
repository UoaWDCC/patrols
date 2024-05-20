import type { Request, Response } from 'express';
import { z } from 'zod';
import { Resend } from 'resend';
import prisma from '../db/database';

const EMAIL_API_KEY = process.env.RESEND_API_KEY
const trialDomain = 'onboarding@resend.dev';
const CPNZ_APP_EMAIL = process.env.CPNZ_DOMAIN ?? trialDomain
const resend = new Resend(EMAIL_API_KEY);

export const sendEmail = async (req: Request, res: Response) => {

    const emailSchema = z.object({
        email: z.string(),
        patrolName: z.string(),
        patrolID: z.string(),
        formData: z.string() // temp, will update to full log on form info later
    });

    const parseResult = emailSchema.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.flatten() });
    }

    const { email, patrolName, patrolID, formData }: z.infer<typeof emailSchema> = parseResult.data;

    // might be easier if frontend just need to pass a patrol id, all other info availiable in auth session

    // const user = await prisma.patrols.findUnique({
    //     where: { id: parseInt(patrolID) },
    //     select: { email: true },
    // });

    // if (!user) {
    //     return { error: 'User not found' };
    // }

    // const patrolName = user.name;

    //end 

    if (!EMAIL_API_KEY) {
        res.status(400).json({ message: 'Auth failed: Please provide Resend API key.' })
    }

    try {
        const data = await resend.emails.send({
            from: `No-Reply@CPNZ.com <${CPNZ_APP_EMAIL}>`,
            to: [`${email}`],
            subject: `Request Log On - Patrol ID: ${patrolID}`,
            html: `<strong>${patrolName}</strong> request to log on a shift with following details: <br><br> ${formData}<br><br><hr>please reply with the <strong>Event ID<strong> to <a href="mailto:cpnz123@kmail.com">CPNZ Patrol Email</a>`,
        });

        res.status(200).json(data);

    } catch (error) {
        res.status(400).json(error);
    }
}