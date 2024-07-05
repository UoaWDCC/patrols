import type { Request, Response } from "express";
import prisma from "../db/database";

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const newVehicle = req.body;
    const createdVehicle = await prisma.vehicle.create({ data: newVehicle });
    const createdVehicleWithBigInt = {
      ...createdVehicle,
      patrol_id: BigInt(createdVehicle.patrol_id),
    };
    res
      .status(201)
      .json({ vehicle: createdVehicleWithBigInt, message: "Vehicle created" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vehicle = await prisma.vehicle.delete({
      where: { id: Number(id) },
    });

    if (!vehicle) {
      return res.status(404).json({ error: "No such Vehicle" });
    }
    res.status(200).json({ vehicle, message: "Vehicle deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getVehicleByPatrolId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vehicles = await prisma.vehicle.findMany({
      where: { patrol_id: BigInt(id) },
    });

    if (!vehicles) {
      return res.status(404).json({ error: "No vehicles found" });
    }

    // Convert the id and patrol_id from BigInt to String (As BigInt is not supported in JSON format)
    const vehiclesToSend = vehicles.map((vehicle): any => ({
      ...vehicle,
      id: String(vehicle.id),
      patrol_id: String(vehicle.patrol_id),
    }));

    res.status(200).json(vehiclesToSend);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
