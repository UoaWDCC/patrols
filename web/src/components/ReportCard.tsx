import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import { reportSchema } from "../schemas/index";
import { z } from "zod";
import { formatDate } from "@utils/formateDate";

interface ReportCardProps {
  report: z.infer<typeof reportSchema>;
  fullName: String;
}

export default function reportCard(props: ReportCardProps) {
  const { report, fullName } = props;
  return (
    <div
      key={report.id}
      className="p-6 px-8 bg-white mb-4 shadow-md rounded-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col justify-start items-start">
          <h3 className="text-lg font-semibold">{fullName}</h3>
          <p>
            {formatDate(report.start_time)} - {formatDate(report.end_time)}
          </p>
        </div>

        <div className="flex flex-col items-start">
          <p>
            Shift: <strong>{report.shift_id}</strong>
          </p>
          <p>
            Patroller ID: <strong>{report.member_id}</strong>
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <p>
          Total Incidents: <strong>{report.total_incidents}</strong>
        </p>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-cpnz-blue-800 text-[14px] self-end shadow-md">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="px-8 max-h-[600px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center">
                Details for Report ID: {report.id}
              </DialogTitle>
              <DialogDescription asChild className="text-base">
                <div>
                  <div className="text-[15px] mt-4">
                    <p>
                      Odometer initial reading:{" "}
                      <strong>{report.odometer_initial_reading}</strong> km
                    </p>
                    <p>
                      Odometer final reading:{" "}
                      <strong>{report.odometer_final_reading}</strong> km
                    </p>
                    <p>
                      Weather condition:{" "}
                      <strong>{report.weather_condition}</strong>
                    </p>
                  </div>

                  <h4 className="mt-4 font-semibold">Incidents</h4>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Vehicle incidents: {report.vehicle_incidents}</li>
                    <li>Person incidents: {report.person_incidents}</li>
                    <li>Property incidents: {report.property_incidents}</li>
                    <li>
                      Willful damage incidents:{" "}
                      {report.willful_damage_incidents}
                    </li>
                    <li>other incidents: {report.other_incidents}</li>
                    <li>
                      <strong>Total incidents: {report.total_incidents}</strong>
                    </li>
                  </ul>

                  <div className="text-[14px]">
                    {report.observations.map((observation) => (
                      <div
                        key={observation.id}
                        className="flex flex-col gap-2 mt-6"
                      >
                        <p>
                          <strong>Observation ID: {observation.id}</strong>
                        </p>
                        <div>
                          <p>
                            Start time:{" "}
                            {formatDate(observation.start_time.toString())}
                          </p>
                          <p>
                            End time:{" "}
                            {formatDate(observation.end_time.toString())}
                          </p>
                          <p>Location: {observation.location}</p>
                          <p>Description: {observation.description}</p>
                          <p>
                            Category: {observation.incident_category} -{" "}
                            {observation.incident_sub_category}
                          </p>
                          <p>
                            Police / security present:{" "}
                            {observation.is_police_or_security_present}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* 
                  <Button className="text-[15px] bg-cpnz-blue-800 mt-4">
                    Edit
                  </Button> */}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
