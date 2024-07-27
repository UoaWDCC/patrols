import prisma from "../db/database";
import supabase from "../supabase/supabase_client";
import type { Request, Response } from "express";
import { toObject } from "../util/serializeBigInt";

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
        id: true,
        cpnz_id: true,
        patrol_id: true,
        email: true,
        mobile_phone: true,
        home_phone: true,
        first_names: true,
        surname: true,
        call_sign: true,
        police_station: true,
        logon_status: true,
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

    const shiftDetails = await prisma.shift.findFirst({
      where: {
        patrol_id: userDetails?.patrol_id,
      },
      orderBy: {
        id: "desc",
      },
      select: {
        event_no: true,
        id: true,
      },
    });

    if (shiftDetails?.event_no === null) {
      shiftDetails.event_no = "N/A";
    }

    const userRole = await prisma.members_dev.findFirst({
      where: {
        email: user?.email,
        cpnz_id: extractCPNZIDFromEmail(user?.email as string),
      },
      select: {
        officer_type: true,
      },
    });

    const reports = await prisma.reports.findMany({
      where: { member_id: BigInt(userDetails?.patrol_id) },
    });

    if (!reports) {
      return res.status(404).json({ error: "No reports found" });
    }

    res.status(200).json({
      userDetails: toObject(userDetails),
      vehicleDetails: toObject(vehicleDetails),
      patrolDetails: toObject(patrolDetails),
      shiftDetails: toObject(shiftDetails),
      userRole: toObject(userRole),
      reports: toObject(reports),
    });
  } catch (error) {
    console.error("Error:", error);
  }
};
