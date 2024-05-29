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

export const addVehicle = async (req: Request, res: Response) => {
    try {
        const newVehicle = req.body;
        const vehicle = await prisma.vehicle.create({ data: newVehicle });
        res.status(200).json(vehicle);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteVehicle = async (req: Request, res: Response) => { 
    try {
        const { id } = req.params;
        const vehicle = await prisma.vehicle.delete({
            where: { id: BigInt(id) },
        });

        if (!vehicle) {
            return res.status(404).json({ error: 'No such vehicle' });
        }

        res.status(200).json(vehicle);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const updateVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const vehicle = await prisma.vehicle.update({
            where: { id: BigInt(id) },
            data: updateData,
        });

        if (!vehicle) {
            return res.status(404).json({ error: 'No such vehicle' });
        }

        res.status(200).json(vehicle);
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
            return res.status(404).json({ error: 'No vehicles found' });
        }

        const vehiclesJSON = JSON.stringify(vehicles, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        );
        
        res.status(200).json(vehiclesJSON);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};