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
import InfoButton from "@components/home/InfoButton";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [id, setId] = useState<number>();

  // Function to navigate to the logon page when new report button is clicked
  const handleNewReport = () => {
    navigate("/logon");
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
        <div className="bg-[#EEF6FF] p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-md font-semibold">Draft report detected</h2>
          <p className="text-gray-600">Finish your report?</p>
        </div>
        <div className="bg-[#0F1363] px-4 py-2 rounded-lg shadow-md mb-6">
          <h2 className="text-sm font-bold text-white ml-10 mt-3 text-left">
            Log on to start a new shift
          </h2>
          <p className="text-white text-xs ml-10 text-left my-3">
            Create a new report from scratch or select a template.
          </p>
          <button
            onClick={handleNewReport}
            className="bg-white w-full mx-auto px-6 py-4 mb-3 rounded-lg text-md font-semibold flex items-center justify-center transition-all duration-300 text-black shadow-sm hover:shadow-lg"
          >
            <FaPlus className="mr-2" /> Start a New Shift
          </button>
        </div>

        <div className="bg-[#EEF6FF] p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-md font-semibold mb-2">Patrol vehicles</h2>
          <p className="text-gray-600 mb-4">
            Create a new report from scratch or select a template.
          </p>
          <button className="bg-white w-full mx-auto px-6 py-3 rounded-lg text-md font-semibold text-black shadow-sm hover:shadow-lg">
            View and Update Patrol Vehicles
          </button>
        </div>

        <div className="flex justify-between gap-10">
          <InfoButton
            heading="Past Reports"
            description="View reports in the past."
            icon={<FaClipboardList className="mr-4 text-2xl" />}
            onClick={() => setIsDialogOpen(true)}
          />
          <Dialog
            open={isDialogOpen}
            onOpenChange={() => setIsDialogOpen(false)}
          >
            <DialogTrigger>
              <button className="hidden"></button>
            </DialogTrigger>
            <DialogContent className="p-8 max-h-[550px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center text-subheading pb-12">
                  All Reports
                </DialogTitle>
                <DialogDescription>
                  {data == null ? (
                    <div>No reports found</div>
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
          <InfoButton
            heading="Report Settings"
            description="Modify report templates including templates."
            icon={<FaCogs className="mr-4 text-2xl" />}
          />
        </div>
      </div>
      <SignoutButton />
      <BottomNavBar />
    </div>
  );
}
