import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { userDetailsSchema } from "../schemas";
import SignoutButton from "@components/SignoutButton";
import BottomNavBar from "@components/BottomNavBar";
import LargeInfoButton from "@components/ui/LargeInfoButton";
import useDraftStatus from "../hooks/useDraftStatus";
import logon from "../assets/images/logon.png";

const reportsDetailsSchema = z.object({
  message: z.string(),
  reports: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      createdAt: z.string(),
      location: z.string(),
      patrolID: z.number(),
      reportIncidentType: z.string(),
    })
  ),
});

type reportsDetails = z.infer<typeof reportsDetailsSchema>;

export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState<reportsDetails>();
  const [id, setId] = useState<number>();
  const isDraft: boolean = useDraftStatus();

  // Function to navigate to the logon page when new report button is clicked
  const handleNewReport = () => {
    navigate("/logon");
  };

  const handleDraftReport = () => {
    navigate("/report");
  };

  useEffect(() => {
    const getPatrolLeadID = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/getUserDetails`
      );

      const userDetails = userDetailsSchema.parse(response.data);
      setId(Number(userDetails.patrol_id));
    };

    getPatrolLeadID();
  }, []);

  useEffect(() => {
    const getAllReports = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/report/lead/${id}`
      );

      const reportsData = reportsDetailsSchema.parse(response.data);
      setData(reportsData);
    };

    if (id !== undefined) {
      getAllReports();
    }
  }, [id]);

  return (
    <div className="text-center min-h-screen relative bg-[#FFFFFF] max-w-3xl mx-auto">
      <div className="bg-white pt-14 pb-4 flex justify-between items-center px-8">
        <div>
          <h1 className="text-xl font-bold text-black mx-4">
            Welcome, <span className="underline">XXXXXXX</span>
          </h1>
        </div>
        <SignoutButton />
      </div>
      <div className="max-w-800 mx-auto px-14 my-8">
        {isDraft && (
          <LargeInfoButton
            heading={"Draft report detected"}
            description={"You have a report you haven't submitted."}
            className="bg-[#EEF6FF] p-4 rounded-lg shadow-md mb-6"
            iconDescription={"Finish your report?"}
            onClick={handleDraftReport}
            variant={"light"}
          />
        )}
        <div>
          <div className="py-12">
            <h2 className="text-base font-bold">
              No patrol in progress.
            </h2>
            <p className="font-light">
              Ready to start a patrol?
            </p>
          </div>
          <button onClick={handleNewReport} className="w-full">
            <div className="bg-cpnz-blue-900 rounded-lg shadow-md mb-6 py-14 items-center flex flex-row justify-center w-full space-x-4">
                <img src={logon} alt="logon" className="w-10 h-9"/>
                <h1 className="text-white font-semibold text-lg">
                  Log On
                </h1>
            </div>
          </button>
        </div>
        <div className="text-right px-6">
          <p className="font-light">Ready to start a patrol?</p>
        </div>
        <div className="mb-10">
          <h2 className="font-bold text-left">Past Reports</h2>
          <div className="p-10 bg-[#F8F8F8] shadow-md mt-4">
          <Dialog>
              <DialogTrigger className="flex-1 text-black p-4">
              </DialogTrigger>
              <DialogContent className="p-8 max-h-[550px] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-center text-subheading pb-12">
                    All Reports
                  </DialogTitle>
                  <DialogDescription>
                    {data == null ? (
                      <span>No reports found</span>
                    ) : (
                      <div className="flex flex-col w-full gap-8">
                        {data.reports.map((d) => (
                          <div
                            key={d.id}
                            className="flex-1 border-2 border-zinc-400 rounded-lg shadow-md px-6 py-4 hover:bg-zinc-200 transition-all cursor-pointer"
                          >
                            <h3 className="text-lg font-semibold text-cpnz-blue-900 ">
                              {d.title}
                            </h3>
                            <p>
                              <strong>Location</strong>: {d.location}
                            </p>
                            <p>
                              <strong>Type:</strong> {d.reportIncidentType}
                            </p>
                            <p>
                              <strong>Patrol ID:</strong> {d.patrolID}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="p-6 bg-[#EEF6FF] shadow-md mt-4"></div>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
}
