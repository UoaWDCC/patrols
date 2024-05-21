import prisma from '../db/database';
import supabase from '../supabase/supabase_client';
import type { Request, Response } from 'express';
import { z } from 'zod';

const updateDetailSchema = z.object({
    id: z.number(),
    email: z.string(),
    password: z.string().min(4, 'Password must be at least 4 characters long'),
    // vehicles: z.string(), // Need to change once we have some vehicle dummy data
});

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
            },
        });

        res.status(200).json(userDetails);
    } catch (error) {
        console.error('Error:', error);
    }
};

export const updateUserDetails = async (req: Request, res: Response) => {
    try {
        const parseResult = updateDetailSchema.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({ error: parseResult.error.flatten() });
        }

        const { id, email, password } = parseResult.data;

        const { error } = await supabase.auth.updateUser({
            email: email,
            password: password,
        });

        if (error) {
            console.log(`Error updating details: ${error}`);
        }

        const updatedUserDetails = await prisma.patrols.update({
            where: {
                id: id,
            },
            data: {
                // email: email,
                password: password,
                // vehicles: vehicles,
            },
        });

        res.status(200).json(updatedUserDetails);
    } catch (error) {
        console.error('Error: ', error);
    }
};
