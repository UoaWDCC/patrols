import prisma from '../db/database';
import supabase from '../supabase/supabase_client';
import type { Request, Response } from 'express';

export const getUserDetailsByEmail = async (req: Request, res: Response) => {
    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userEmail = user?.email;

        const userDetails = await prisma.patrols.findUnique({
            where: {
                email: userEmail,
            },
            select: {
                id: true,
                email: true,
                name: true,
                vehicles: true,
            },
        });

        res.status(200).json(userDetails);
    } catch (error) {
        console.error('Error:', error);
    }
};
