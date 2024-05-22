import prisma from '../db/database';
import supabase from '../supabase/supabase_client';
import type { Request, Response } from 'express';
import { z } from 'zod';

const vehiclesSchema = z.object({
    name: z.string(),
    created_at: z.date(),
    model: z.string(),
    registration_number: z.string(),
    colour: z.string().nullable(),
    livery: z.boolean().nullable(),
    patrol_id: z.bigint(),
    selected: z.boolean(),
});

const userDetailsSchema = z.object({
    mobile_phone: z.bigint(),
    home_phone: z.bigint(),
    call_sign: z.string(),
    police_station: z.string(),
    patrol_id: z.bigint(),
    id: z.string(),
    email: z.string().email(),
    vehicle_dev: z.array(vehiclesSchema),
});

const updateSelectedVehicleSchema = z.object({
    currentVehicle: vehiclesSchema,
    newVehicle: vehiclesSchema,
});

function extractCPNZIDFromEmail(userEmail: string) {
    const atSymbolIndex: number = userEmail.indexOf('@');
    return parseInt(userEmail.substring(0, atSymbolIndex));
}

export const getUserDetailsByCPNZID = async (req: Request, res: Response) => {
    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error) {
            return res.status(404).json({ error: 'User not found' });
        }

        /* Emails are not unique in members table so cannot use findUnique
        Use findFirst to retrieve using email and CPNZ ID to ensure correct user is returned */
        const userDetails = await prisma.members_dev.findFirst({
            where: {
                email: user?.email,
                cpnz_id: extractCPNZIDFromEmail(user?.email as string),
            },
            select: {
                cpnz_id: true,
                patrol_id: true,
                email: true,
                mobile_phone: true,
                home_phone: true,
                first_names: true,
                surname: true,
                call_sign: true,
                police_station: true,
            },
        });

        const vehicleDetails = await prisma.vehicle_dev.findMany({
            where: {
                patrolID: userDetails?.patrol_id,
            },
        });

        function toObject(userDetails: any) {
            return JSON.parse(
                JSON.stringify(
                    userDetails,
                    (key, value) =>
                        typeof value === 'bigint' ? value.toString() : value // return everything else unchanged
                )
            );
        }

        res.status(200).json(toObject({ toObject, vehicleDetails }));
    } catch (error) {
        console.error('Error:', error);
    }
};

// export const updateUserDetails = async (req: Request, res: Response) => {
//     try {
//         const parseResult = userDetailsSchema.safeParse(req.body);

//         if (!parseResult.success) {
//             return res.status(400).json({ error: parseResult.error.flatten() });
//         }

//         const { id, email, password } = parseResult.data;

//         const { error } = await supabase.auth.updateUser({
//             email: email,
//             password: password,
//         });

//         if (error) {
//             console.log(`Error updating details: ${error}`);
//         }

//         const updatedUserDetails = await prisma.patrols.update({
//             where: {
//                 id: id,
//             },
//             data: {
//                 // email: email,
//                 password: password,
//                 // vehicles: vehicles,
//             },
//         });

//         res.status(200).json(updatedUserDetails);
//     } catch (error) {
//         console.error('Error: ', error);
//     }
// };
