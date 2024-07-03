import type { Request, Response } from "express";
import prisma from '../db/database';
import { LogonStatus } from "@prisma/client";

export const logOffStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log(req.params.id);
        const user = await prisma.members_dev.findUnique({
            where: {cpnz_id: BigInt(id)},
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        } else if (user.logon_status === LogonStatus.No) {
            return res.status(400).json({ error: "User is already logged off" });
        }

        await prisma.members_dev.update({
            where: {cpnz_id: BigInt(id)},
            data: {logon_status: LogonStatus.No},
        });

        res.status(200).json({ message: "User has been logged off." });

    }catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}