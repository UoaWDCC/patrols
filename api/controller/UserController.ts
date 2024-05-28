import prisma from "../db/database";
import supabase from "../supabase/supabase_client";
import type { Request, Response } from "express";

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

    const vehicleDetails = await prisma.vehicle_dev.findMany({
      where: {
        patrolID: userDetails?.patrol_id,
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
