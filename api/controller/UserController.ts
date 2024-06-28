import prisma from "../db/database";
import supabase from "../supabase/supabase_client";
import type { Request, Response } from "express";
import { sendEmail } from './emailController';
import { z } from "zod";


function toObject(data: any) {
  return JSON.parse(
    JSON.stringify(data, (key, value) => (typeof value === "bigint" ? value.toString() : value))
  );
}


function extractCPNZIDFromEmail(userEmail: string) {
  const atSymbolIndex: number = userEmail.indexOf("@");
  return parseInt(userEmail.substring(0, atSymbolIndex));
}

export const getUserDetailsByCPNZID = async (req: Request, res: Response) => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return res.status(404).json({ error: "User not found" });
    }

    /* Emails are not unique in members table so cannot use findUnique
        Use findFirst to retrieve using email and CPNZ ID to ensure correct user is returned */
    const userDetails = await prisma.members_dev.findFirst({
      where: {
        email: user?.email,
        cpnz_id: extractCPNZIDFromEmail(user?.email as string),
      },
      select: {
        cpnz_id: true,
        patrol_id: true,
        email: true,
        mobile_phone: true,
        home_phone: true,
        first_names: true,
        surname: true,
        call_sign: true,
        police_station: true,
      },
    });

    if (!userDetails) {
      return res.status(404).json({ error: "User details not found" });
    }

    const patrolDetails = await prisma.patrols_dev.findUnique({
      where: {
        id: userDetails?.patrol_id,
      },
      select: {
        name: true,
        members_dev: true,
      },
    });

    const vehicleDetails = await prisma.vehicle.findMany({
      where: {
        patrol_id: userDetails?.patrol_id,
      },
    });

    function toObject(userDetails: any) {
      return JSON.parse(
        JSON.stringify(
          userDetails,
          (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
        )
      );
    }

    res.status(200).json({
      userDetails: toObject(userDetails),
      vehicleDetails: toObject(vehicleDetails),
      patrolDetails: toObject(patrolDetails),
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

const amendmentSchema = z.object({
  text: z.string(),
});

export const handleAmendment = async (req: Request, res: Response) => {
  const parseResult = amendmentSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { text } = parseResult.data;

  try {
    // Store text in the database
    const amendment = await prisma.amendment.create({
      data: {
        description: text,
      },
    });

    // Prepare email request data
    const emailRequest = {
      body: {
        email: 'ecc@cpnz.org.nz',
        recipientEmail: 'jbac208@aucklanduni.ac.nz',  // test address
        cpnzID: amendment.id.toString(),  // Assuming cpnzID is the amendment ID
        formData: {
          startTime: 'start test',
          endTime: 'end test',
          policeStationBase: 'Example Station',
          cpCallSign: 'Example CallSign',
          patrol: 'Example Patrol',
          observerName: 'Example Observer',
          observerNumber: '1234567890',
          guestPatrollers: [],
          driver: 'Example Driver',
          vehicle: 'Example Vehicle',
          liveryOrSignage: 'Example Livery',
          havePoliceRadio: 'Yes',
        },
        driver: {
          cpnz_id: '123',
          email: 'driver-email@gmail.com',
          first_names: 'Driver First Names',
          surname: 'Driver Surname',
          mobile_phone: '1234567890',
          home_phone: '0987654321',
          call_sign: 'Example CallSign',
          police_station: 'Example Station',
          patrol_id: '123',
        },
      },
    };

    await sendEmail(emailRequest as unknown as Request, res);

    res.status(201).json({ message: 'Amendment submitted successfully', amendment: toObject(amendment) });
  } catch (error) {
    console.error('Error handling amendment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
