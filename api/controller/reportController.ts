import type { Request, Response } from "express";
import prisma from "../db/database";

type Observation = {
  id: string;
  report_id: string;
  start_time: Date;
  end_time: Date;
  location: string;
  is_police_or_security_present: boolean;
  incident_category: string;
  incident_sub_category: string;
  description: string;
};

/*
Replacer Function:
Replacing all fields that are BigInt to String
*/
function toObject(report: any) {
  return JSON.parse(
    JSON.stringify(report, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export const getAllReport = async (req: Request, res: Response) => {
  try {
    const reports = await prisma.reports.findMany();

    if (!reports || reports.length === 0) {
      return res.status(404).json({ error: "There are no reports" });
    }

    const shifts: any[] = [];
    const vehicles: any[] = [];

    for (const report of reports) {
      const shift = await prisma.shift.findUnique({
        where: { id: report?.shift_id },
        select: {
          event_no: true,
          patrol_id: true,
          start_time: true,
          end_time: true,
          police_station_base: true,
          observer_id: true,
          driver_id: true,
          vehicle_id: true,
        },
      });
      if (!shift) {
        return res.status(404).json({ error: "Shift not found" });
      }

      const vehicle = await prisma.vehicle.findUnique({
        where: { id: report?.vehicle_details_id },
        select: {
          // No patrol_id as the driver id would be the same
          registration_no: true,
          colour: true,
          model: true,
          make: true,
          has_police_radio: true,
          selected: true,
        },
      });
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }

      shifts.push(toObject(shift));
      vehicles.push(toObject(vehicle));
    }
    const reportsWithDetails = reports.map((report: any, index: any) => ({
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
      where: { id: Number(id) },
    });

    if (!report) {
      return res.status(404).json({ error: "No such report" });
    }
    const shift = await prisma.shift.findUnique({
      where: { id: report?.shift_id },
      select: {
        event_no: true,
        patrol_id: true,
        start_time: true,
        end_time: true,
        police_station_base: true,
        observer_id: true,
        driver_id: true,
        vehicle_id: true,
      },
    });
    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: report?.vehicle_details_id },
      select: {
        patrol_id: true,
        registration_no: true,
        colour: true,
        model: true,
        make: true,
        has_police_radio: true,
        selected: true,
      },
    });
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.status(200).json({
      report: toObject(report),
      shift: toObject(shift),
      vehicle: toObject(vehicle),
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const createReport = async (req: Request, res: Response) => {
  try {
    const newReport = req.body;
    const report = await prisma.reports.create({ data: newReport });
    res.status(200).json(report);
    res.status(200).json({ message: "Report created" });
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
      return res.status(404).json({ error: "No such Report" });
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
      return res.status(404).json({ error: "No such Report" });
    }
    res.status(200).json({ report, message: "Report deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllReportForLead = async (req: Request, res: Response) => {
  try {
    // Get the patrol request parameters
    const patrolId = req.params.id;
    const reports = await prisma.shift.findMany({
      where: { patrol_id: BigInt(patrolId) },
      select: {
        reports: true,
      },
    });

    if (!reports) {
      return res.status(404).json({ error: "No reports found" });
    }
    console.log(reports.map((report) => report.reports[0]?.shift_id));

    const allShifts = await prisma.shift.findMany({
      where: {
        id: {
          in: reports.map((report) => report.reports[0]?.shift_id),
        },
      },
      select: {
        event_no: true,
        id: true,
        start_time: true,
        end_time: true,
        observer_id: true,
      },
    });

    const filteredReports = reports
      .filter((r) => r.reports[0] !== undefined)
      .map((r) => ({
        ...r.reports[0],
        id: String(r.reports[0].id),
        shift_id: String(r.reports[0].shift_id),
        vehicle_details_id: String(r.reports[0].vehicle_details_id),
        member_id: String(r.reports[0].member_id),
        observations: [] as Observation[],
        start_time: allShifts?.find((s) => s.id === r.reports[0].shift_id)
          ?.start_time,
        end_time: allShifts?.find((s) => s.id === r.reports[0].shift_id)
          ?.end_time,
        event_no: allShifts?.find((s) => s.id === r.reports[0].shift_id)
          ?.event_no,
      }));

    const reportIds = filteredReports.map((report) => BigInt(report.id));
    console.log(filteredReports);

    const observations = await prisma.observations.findMany({
      where: {
        report_id: {
          in: reportIds,
        },
      },
    });

    const filteredObservations = observations.map((o) => ({
      ...o,
      report_id: String(o.report_id),
      id: String(o.id),
    }));

    filteredReports.forEach((r) => {
      for (const o of filteredObservations) {
        if (o.report_id === String(r.id)) {
          r.observations.push(o);
        }
      }
    });

    res.status(200).json(filteredReports);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
