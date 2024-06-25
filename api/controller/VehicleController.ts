import type { Request, Response } from 'express';
import prisma from "../db/database";

export const createVehicle = async (req: Request, res: Response) => {
    try {
        const newVehicle = req.body;
        const report = await prisma.vehicle.create({ data: newVehicle });
        res.status(200).json(report);
        res.status(200).json({ message: 'Vehicle created' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};