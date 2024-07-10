import { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { Button } from "@components/ui/button";
import useUserData from "../../hooks/useUserData";
import { reportSchema } from "../../schemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";

export default function Reports() {
  const { currentUserDetails } = useUserData();
  const [reports, setReports] = useState<z.infer<typeof reportSchema>[]>([]);

  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/report/lead/${
            currentUserDetails?.patrol_id
          }`
        );

        console.log(response.data);
        setReports(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllReports();
  }, [currentUserDetails]);

  return (
    <div>
      <h2 className="text-center mt-12 font-bold text-2xl">Reports</h2>

      <div className="max-w-[700px] p-12 shadow-lg mx-auto max-h-[560px] overflow-y-auto mt-8 rounded-xl">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-6 px-8 bg-white mb-4 shadow-md rounded-lg"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">Report: {report.id}</h3>
              <div>
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
                            <strong>{report.odometer_initial_reading}</strong>{" "}
                            km
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
                          <li>
                            Property incidents: {report.property_incidents}
                          </li>
                          <li>
                            Willful damage incidents:{" "}
                            {report.willful_damage_incidents}
                          </li>
                          <li>other incidents: {report.other_incidents}</li>
                          <li>
                            <strong>
                              Total incidents: {report.total_incidents}
                            </strong>
                          </li>
                        </ul>

                        <div className="text-[14px]">
                          {report.observations.map((observation) => (
                            <div
                              key={observation.id}
                              className="flex flex-col gap-2 mt-6"
                            >
                              <p>
                                <strong>
                                  Observation ID: {observation.id}
                                </strong>
                              </p>
                              <div>
                                <p>
                                  Start time:{" "}
                                  {observation.start_time.toString()}
                                </p>
                                <p>
                                  End time: {observation.end_time.toString()}
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
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
