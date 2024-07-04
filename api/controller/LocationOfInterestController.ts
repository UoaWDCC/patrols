import type { Request, Response } from 'express';
import prisma from "../db/database";

export const createLocationOfInterest = async (req: Request, res: Response) => {
    try {
        const newLocationOfInterest =  {
            ...req.body,
            start_time: new Date(req.body.start_time),
            end_time: new Date(req.body.end_time),
        };
        const locationOfInterest = await prisma.location_of_interest.create({ data: newLocationOfInterest });
        res.status(200).json(locationOfInterest);
        res.status(200).json({ message: 'Location of interest created' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getLocationOfInterestByPatrolId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const locationsOfInterest = await prisma.location_of_interest.findMany({
            where: { patrol_id: BigInt(id) },
        });

        if (!locationsOfInterest) {
            return res.status(404).json({ error: 'No locations of interest found' });
        }

        // Convert the id and patrol_id from BigInt to String (As BigInt is not supported in JSON format)
        const locationsOfInterestToSend = locationsOfInterest.map(locationOfInterest => ({
            ...locationOfInterest,
            id: String(locationOfInterest.id),
            patrol_id: String(locationOfInterest.patrol_id),
        }));
        
        res.status(200).json(locationsOfInterestToSend);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteLocationOfInterest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.location_of_interest.delete({ where: { id: BigInt(id) } });
        res.status(200).json({ message: 'Location of interest deleted' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};