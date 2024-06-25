import type { Request, Response } from 'express';
import prisma from "../db/database";

export const createLocationOfInterest = async (req: Request, res: Response) => {
    try {
        const newLocationOfInterest = req.body;
        const locationOfInterest = await prisma.location_of_interest.create({ data: newLocationOfInterest });
        res.status(200).json(locationOfInterest);
        res.status(200).json({ message: 'Location of interest created' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};