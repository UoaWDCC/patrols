import type { Request, Response } from 'express';
import prisma from '../db/database';
import { report } from 'process';

/*
Replacer Function:
Replacing all fields that are BigInt to String
*/
function toObject(report: any){
    return JSON.parse(
        JSON.stringify(report,(key, value) => (typeof value === "bigint" ? value.toString() : value))
    );
}

export const getAllReport = async (req: Request, res: Response) => {
    try{
        const reports = await prisma.reports.findMany();
        
        if (!reports || reports.length === 0){
            return res.status(404).json({error : "There are no reports"});
        }

        const shifts: any[] = [];
        const vehicles: any[] = [];

        for (const report of reports){
            const shift = await prisma.shift.findUnique({
                where: {id: report?.shift_id},
                select: {
                    event_no: true,
                    patrol_id: true,
                    start_time: true,
                    end_time: true,
                    police_station_base: true,
                    observer_id: true,
                    driver_id: true, 
                    vehicle_id: true,
                }
            })
            if (!shift) { 
                return res.status(404).json({ error: 'Shift not found'});
            }

            const vehicle = await prisma.vehicle.findUnique({
                where: {id : report?.vehicle_details_id},
                select:{
                    // No patrol_id as the driver id would be the same
                    registration_no: true,
                    colour: true,
                    model: true,
                    make: true,
                    has_police_radio: true,
                    selected : true,
                }
            })
            if (!vehicle) { 
                return res.status(404).json({ error: 'Vehicle not found'});
            }

            shifts.push(toObject(shift));
            vehicles.push(toObject(vehicle));
        }
        const reportsWithDetails = reports.map((report, index) => ({
            report: toObject(report),
            shift: shifts[index],
            vehicle: vehicles[index],
        }));
        
        res.status(200).json({ reports: reportsWithDetails });
        
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
    
};

export const getSingleReport = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const report = await prisma.reports.findUnique({
            where: { id: Number(id) }
        });

        if (!report) {
            return res.status(404).json({ error: 'No such report' });
        }
        const shift = await prisma.shift.findUnique({
            where: {id: report?.shift_id},
            select: {
                event_no: true,
                patrol_id: true,
                start_time: true,
                end_time: true,
                police_station_base: true,
                observer_id: true,
                driver_id: true, 
                vehicle_id: true,
            }
        })
        if (!shift) { 
            return res.status(404).json({ error: 'Shift not found'});
        }
        const vehicle = await prisma.vehicle.findUnique({
            where: {id : report?.vehicle_details_id},
            select:{
                // No patrol_id as the driver id would be the same
                registration_no: true,
                colour: true,
                model: true,
                make: true,
                has_police_radio: true,
                selected : true,
            }
        })
        if (!vehicle) { 
            return res.status(404).json({ error: 'Vehicle not found'});
        }

        res.status(200).json({
            report: toObject(report),
            shift: toObject(shift),
            vehicle: toObject(vehicle),
        }
        );
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const createReport = async (req: Request, res: Response) => {
    try {
        const newReport = req.body;
        const report = await prisma.reports.create({ data: newReport });
        res.status(200).json(report);
        res.status(200).json({ message: 'Report created' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const updateReport = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const report = await prisma.reports.update({
            where: { id: Number(id) },
            data: updateData,
        });

        if (!report) {
            return res.status(404).json({ error: 'No such Report' });
        }
        res.status(200).json(report);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteReport = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const report = await prisma.reports.delete({
            where: { id: Number(id) },
        });

        if (!report) {
            return res.status(404).json({ error: 'No such Report' });
        }
        res.status(200).json({ report, message: 'Report deleted' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// export const getAllReportForLead = async (req: Request, res: Response) => {
//     try {
//         // Get the patrol request parameters
//         const patrolLeadId = req.params.id;
//         const patrolLead = await prisma.patrols.findFirst({
//             where: { id: Number(patrolLeadId) },
//             select: {
//                 id: true,
//                 role: true,
//             },
//         });

//         if (!patrolLead) {
//             // Check if patrol exists
//             return res.status(404).json({ error: 'Patrol does not exist' });
//         } else if (patrolLead.role !== Role.lead) {
//             // Check if patrol is a lead
//             return res
//                 .status(401)
//                 .json({ error: 'You are not authorized to view this report' });
//         }

//         // Get all the patrols assigned to the patrol lead
//         const assignedPatrol = await prisma.patrols.findUnique({
//             where: { supervisorID: Number(patrolLeadId) },
//             select: { id: true},
//         });
//         if (!assignedPatrol) {
//             // Check if there is any assigned patrols
//             return res.status(404).json({ error: 'No assigned patrol' });
//         }

//         // Get all the reports for the assigned patrols
//         const reports = await prisma.reports.findMany({
//             where: { patrolID: Number(assignedPatrol.id) },
//         });
//         if (!reports) {
//             // Check if there is any reports for the assigned patrols
//             return res
//                 .status(404)
//                 .json({ error: 'No reports for assigned patrols' });
//         }

//         // Return the reports
//         res.status(200).json({
//             reports,
//             message: 'All reports for assigned patrols generated for leads',
//         });
//     } catch (error: any) {
//         res.status(400).json({ error: error.message });
//     }
// };