import { useNavigate } from "react-router-dom";
import { FaCog, FaClipboardList, FaCogs, FaPlus } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@components/ui/button";
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
import profile from "../assets/images/user.png";
import home from "../assets/images/home.png";

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
  const { user } = useAuth();
  const [data, setData] = useState<reportsDetails>();
  const [id, setId] = useState<number>();

  // Function to navigate to the logon page when new report button is clicked
  const handleNewReport = () => {
    navigate("/logon");
  };

  // Function to navigate to the profile page when profile button is clicked
  const handleProfile = () => {
    navigate("/profile");
  };

  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut(); // Calls the signOut function when the sign out button is clicked
  };

  useEffect(() => {
    const getPatrolLeadID = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/getUserDetails`
      );

      const userDetails = userDetailsSchema.parse(response.data);
      setId(Number(userDetails.id));
    };

    getPatrolLeadID();
  });

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
      <div className="bg-[#ECEDFF] py-6 flex justify-between items-center px-4 rounded-b-3xl">
        <div className="px-8">
          <h1 className="text-xl font-bold text-black">
            Welcome back, XXXXXXX
          </h1>
        </div>
        <FaCog className="text-2xl text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-300" />
      </div>

      <div className="max-w-800 mx-auto px-8 my-8">
        <div className="bg-[#ECEDFF] p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-md font-semibold">Draft report detected</h2>
          <p className="text-gray-600">Finish your report?</p>
        </div>
        <div className="bg-[#0F1363] px-4 py-2 rounded-lg shadow-md mb-6">
          <h2 className="text-sm font-bold text-white ml-10 mt-3 text-left">
            {" "}
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

        <div className="bg-[#ECEDFF] p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-md font-semibold mb-2">Patrol vehicles</h2>
          <p className="text-gray-600 mb-4">
            Create a new report from scratch or select a template.
          </p>
          <button className="bg-white w-full mx-auto px-6 py-3 rounded-lg text-md font-semibold text-black shadow-sm hover:shadow-lg">
            View and Update Patrol Vehicles
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#ECEDFF] text-black p-4 rounded-lg flex items-center hover:bg-[#808080] transition-colors duration-300">
            <Dialog>
              <DialogTrigger className="flex items-center">
                <FaClipboardList className="mr-4 text-2xl" />
                <div className="text-left">
                  <h3 className="text-base font-semibold">Past Reports</h3>
                  <p className="text-xs">View reports in the past.</p>
                </div>
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
                            <h3 className="text-lg font-semibold text-cpnz-blue-900 ">{d.title}</h3>
                            <p><strong>Location</strong>: {d.location}</p>
                            <p><strong>Type:</strong> {d.reportIncidentType}</p>
                            <p><strong>Patrol ID:</strong> {d.patrolID}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="bg-[#ECEDFF] text-black p-4 rounded-lg flex items-center hover:bg-[#808080] transition-colors duration-300">
            <FaCogs className="mr-4 text-2xl" />
            <div className="text-left">
              <h3 className="text-md font-semibold">Report Settings</h3>
              <p className="text-xs">
                Modify report templates including templates.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Button
          onClick={handleSignOut}
          className="bg-cpnz-blue-900 text-md font-semibold hover:bg-cpnz-blue-800"
        >
          Sign Out
        </Button>
      </div>
      <div className="bg-[#eef6ff] h-24 mt-6 flex items-center pl-12 pt-4">
          <div className="font-semibold space-x-10 text-cpnz-blue-900 flex items-center">
            <button className="flex flex-col items-center">
              <img
              src={home}
              alt="home"
              className="w-8 h-8"
              />
              Home
            </button>
            <button className="flex flex-col items-center" onClick={handleProfile}>
              <img
                src={profile}
                alt="user"
                className="w-8 h-8"
              /> 
              Profile
            </button>
          </div>
        </div>
    </div>
  );
}
