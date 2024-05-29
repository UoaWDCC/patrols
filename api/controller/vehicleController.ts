import type { Request, Response } from 'express';
import prisma from '../db/database';

export const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const vehicle = await prisma.vehicles.findUnique({
            where: { id: Number(id) },
        });

        if (!vehicle) {
            return res.status(404).json({ error: 'No such vehicle' });
        }
        res.status(200).json(vehicle);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}