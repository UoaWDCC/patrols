import type { Request, Response } from 'express';
import prisma from '../db/database';

export const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: BigInt(id) },
        });

        if (!vehicle) {
            return res.status(404).json({ error: 'No such vehicle' });
        }

        const vehicleJSON = JSON.stringify(vehicle, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        );
        
        res.status(200).json(vehicleJSON);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};