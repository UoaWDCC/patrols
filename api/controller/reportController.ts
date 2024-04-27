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