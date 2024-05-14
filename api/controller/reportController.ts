import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllReport = async (req: Request, res: Response) => {
    const reports = await prisma.reports.findMany();
    res.status(200).send(reports)
};

export const getSingleReport = async (req: Request, res: Response) => {
    try {
    const { id } = req.params;
        const report = await prisma.reports.findUnique({where: {id: Number(id)}});

        if (!report) {
            return res.status(404).json({error: 'No such report'})
        }
        res.status(200).json(report)
        
    } catch (error : any) {
        res.status(400).json({error: error.message})
    }
}
  
export const createReport = async (req: Request, res: Response) => {
    try {
        const newReport = req.body;
        const report = await prisma.reports.create({data: newReport});
        res.status(200).json(report);
        res.status(200).json({message: 'Report created'})
    } catch (error : any) {
        res.status(400).json({error: error.message})
    }
}

export const updateReport = async (req: Request, res: Response) => {
    try {
    const { id } = req.params;
    const updateData = req.body;
        const report = await prisma.reports.update({
            where: {id: Number(id)},
            data: updateData,
        });
        
        if (!report) {
            return res.status(404).json({error: 'No such Report'})
        }
    res.status(200).json(report)
    } catch (error : any) {
        res.status(400).json({error: error.message})
    }
}


export const deleteReport = async (req: Request, res: Response) => {
    try {
    const { id } = req.params;
    
    const report = await prisma.reports.delete({
        where:{id: Number(id)}});

    if (!report) {
        return res.status(404).json({error: 'No such Report'})
    }
    res.status(200).json({report, message: 'Report deleted'})

    } catch (error : any) {
        res.status(400).json({error: error.message})
    }
}

export const getAllReportForLead = async (req: Request, res: Response) => {
    try {
        // Get the patrol request parameters
        const patrolLeadId = req.params.id;
        const patrolLead = await prisma.patrols.findFirst(
            {where: {id: Number(patrolLeadId)},
            select: {
                id: true,

                //Issue with fetch role, expects a String but patrol(role) is Enum in our schema
                // role: true
            }        
        });
    
        if (!patrolLead) { // Check if patrol exists
            return res.status(404).json({error: 'No such patrol lead'})
        } 

        // Need to implement role check once type compatibility issue is fixed. 
        // else if (patrolLead.role !== 'lead') { // Check if patrol is a lead
        //     return res.status(401).json({error: 'You are not authorized to view this report'})
        // }

        // Get all the patrols assigned to the patrol lead
        const assignedPatrol = await prisma.patrols.findUnique({where: {supervisorID: Number(patrolLeadId)}, select:{id: true, reports: true}});
        if (!assignedPatrol) { // Check if there is any assigned patrols
            return res.status(404).json({error: 'No assigned patrol'})
        }
        
        // Get all the reports for the assigned patrols
        const reports = await prisma.reports.findMany({where: {patrolID: Number(assignedPatrol.id)}});
        if (!reports) { // Check if there is any reports for the assigned patrols
            return res.status(404).json({error: 'No reports for assigned patrols'})
        }
        
        // Return the reports
        res.status(200).json({reports, message: 'All reports for assigned patrols generated for leads'});
        
    } catch (error : any) {
        res.status(400).json({error: error.message})
    }
}

// async function main() {
//     const report = await prisma.report.findMany();
//     console.log(report);
// }

// main()
// .then(async () => {
//     await prisma.$disconnect();
// })
// .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);

// });

// Middleware to validate the ID
// async function validateIdMiddleware(req: Request, res: Response, next: NextFunction, id: string) {
//    try {
//        // Validate the ID against the schema
//        prisma.reports.id.parse(id);
//        // If valid, attach the ID to the request and proceed
//        req.params.id = id;
//        next();
//    } catch (error) {
//        // If validation fails, return an error response
//        return res.status(404).json({ error: 'Invalid ID' });
//    }
// }