import type { Response, Request } from "express";
import prisma from "../db/database";

function toObject(report: any) {
  return JSON.parse(
    JSON.stringify(report, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export const getAllStolenVehicle = async (req: Request, res: Response) => {
  try {
    const stolenVehicles = await prisma.stolen_vehicle.findMany({
      select: {
        registration_number: true,
        vehicle_color: true,
        vehicle_brand: true,
        vehicle_model: true,
        vehicle_type: true,
        years: true,
        reported_date: true,
        city: true,
      },
    });
    if (!stolenVehicles || stolenVehicles.length === 0) {
      return res.status(304).json({ error: "There are no stolen vehicles" });
    }
    return res.status(200).json(toObject(stolenVehicles));
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const getSingleStolenVehicle = async (req: Request, res: Response) => {
  const { registration_no } = req.params;
  try {
    const stolenVehicle = await prisma.stolen_vehicle.findUnique({
      where: { registration_number: registration_no.toUpperCase() },
      select: {
        registration_number: true,
        vehicle_color: true,
        vehicle_brand: true,
        vehicle_model: true,
        vehicle_type: true,
        years: true,
        reported_date: true,
        city: true,
      },
    });

    if (!stolenVehicle) {
      return res.status(404).json({ error: "Stolen vehicle not found" });
    }

    return res.status(200).json(toObject(stolenVehicle));
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};
