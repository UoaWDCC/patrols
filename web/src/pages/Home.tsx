import { useNavigate } from "react-router-dom";
import { FaCog, FaClipboardList, FaCogs, FaPlus } from "react-icons/fa";
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
import SmallInfoButton from "@components/ui/SmallInfoButton";
import LargeInfoButton from "@components/ui/LargeInfoButton";
import useDraftStatus from "../hooks/useDraftStatus";

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
      <div className="bg-[#EEF6FF] py-6 flex justify-between items-center px-4">
        <div>
          <h1 className="text-xl font-bold text-black mx-4">
            Welcome back, XXXXXXX
          </h1>
        </div>
        <FaCog className="text-2xl text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-300" />
      </div>
      <div className="max-w-800 mx-auto px-8 my-8">
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
        <LargeInfoButton
          className="bg-[#0F1363] p-4 rounded-lg shadow-md mb-6 text-left"
          heading={"Log on to start a new shift"}
          description={"Create a new report from scratch or select a template."}
          icon={<FaPlus className="mr-2" />}
          iconDescription={"Start a New Shift"}
          onClick={() => handleNewReport()}
          variant={"dark"}
        />
        <LargeInfoButton
          className="bg-[#EEF6FF] p-4 rounded-lg shadow-md mb-6 text-left"
          heading={"Patrol vehicles"}
          description={"Create a new report from scratch or select a template."}
          iconDescription={"View and Update Patrol Vehicles"}
          variant={"light"}
        />
        <div className="flex justify-between gap-10">
          <div className="basis-1/2 flex">
            <Dialog>
              <DialogTrigger className="flex-1 bg-[#EEF6FF] text-black p-4 rounded-lg hover:bg-[#808080] transition-colors duration-300">
                <SmallInfoButton
                  heading="Past Reports"
                  description="View reports in the past."
                  icon={<FaClipboardList className="mr-4 text-2xl" />}
                />
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
          <div className="basis-1/2 flex">
            <Dialog>
              <DialogTrigger className="flex-1 bg-[#EEF6FF] text-black p-4 rounded-lg hover:bg-[#808080] transition-colors duration-300">
                <SmallInfoButton
                  heading="Report Settings"
                  description="Modify report templates including templates."
                  icon={<FaCogs className="mr-4 text-2xl" />}
                />
              </DialogTrigger>
              <DialogContent className="p-8 max-h-[550px] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-center text-subheading pb-12">
                    Templates
                  </DialogTitle>
                  <DialogDescription>
                    {data == null ? (
                      <span>No templates found</span>
                    ) : (
                      <div>Some data...</div>
                    )}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <SignoutButton />
      <BottomNavBar />
    </div>
  );
}
