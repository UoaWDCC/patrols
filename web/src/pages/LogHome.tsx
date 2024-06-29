import { useNavigate } from "react-router-dom";
import { FaCog, FaClipboardList, FaHome, FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { userDetailsSchema } from "../schemas";
import BottomNavBar from "@components/BottomNavBar";
import LargeInfoButton from "@components/ui/LargeInfoButton";
import SmallInfoButton from "@components/ui/SmallInfoButton";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAwaitingEventId, setIsAwaitingEventId] = useState(false);
  const [data, setData] = useState<reportsDetails>();
  const [id, setId] = useState<number>();
  const isDraft: boolean = useDraftStatus();
  const [showPatrolInfo, setShowPatrolInfo] = useState(false);

  useEffect(() => {
    const getPatrolLeadID = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/getUserDetails`
        );
        const userDetails = userDetailsSchema.parse(response.data);
        setId(Number(userDetails.patrol_id));
        setIsLoggedIn(true);
        setIsAwaitingEventId(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setIsLoggedIn(false);
        setIsAwaitingEventId(false);
      }
    };

    getPatrolLeadID();
  }, []);

  const handleLogOn = () => {
    setShowPatrolInfo(true);
  };

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setIsAwaitingEventId(false);
    setShowPatrolInfo(false);
  };

  const handleNewReport = () => {
    navigate("/Report");
  };

  const handleMakeAmendment = () => {
    // Handle make amendment logic
  };

  const renderBottomNavBar = () => (
    <button
      className="bg-blue-900 text-white px-4 py-2 rounded w-1/3"
      onClick={handleLogOn}
    >
      LOG ON &gt;
    </button>
  );

  if (showPatrolInfo) {
    return (
      <div className="min-h-screen bg-white max-w-3xl mx-auto pb-16">
        <header className="bg-[#EEF6FF] py-6 flex justify-between items-center px-4">
          <h1 className="text-xl font-bold">Welcome, XXXXXXX</h1>
          <FaCog className="text-2xl text-black cursor-pointer hover:text-gray-200 transition-colors duration-300" />
        </header>

        <main className="p-4 flex flex-col gap-6">
          <div className="text-left">
            <p className="font-semibold">Patrol in progress.</p>
            <p>Event ID: xxxxxxxxxx</p>
          </div>

          <button
            className="w-full bg-blue-900 text-white p-4 rounded-lg"
            onClick={handleNewReport}
          >
            Start a New Report
          </button>

          <div className="text-left">
            <p>Police Station Base</p>
            <p>CP Call Sign</p>
            <p>Patrols</p>
            <p>Vehicle</p>
          </div>

          <div className="flex justify-between items-center">
            <span>Details incorrect?</span>
            <button
              className="bg-gray-200 text-black px-4 py-1 rounded"
              onClick={handleMakeAmendment}
            >
              Make Amendment
            </button>
          </div>

          <button
            className="w-full bg-red-400 text-white p-4 rounded-lg"
            onClick={handleLogOut}
          >
            Submit Report & Log Off
          </button>
        </main>

        {renderBottomNavBar()}
      </div>
    );
  }

  return (
    <div className="text-center min-h-screen relative bg-[#FFFFFF] max-w-3xl mx-auto pb-16">
      <div className="bg-[#EEF6FF] py-6 flex justify-between items-center px-4">
        <div>
          <h1 className="text-xl font-bold text-black mx-4">
            Welcome back, XXXXXXX
          </h1>
        </div>
        <FaCog className="text-2xl text-black cursor-pointer hover:text-gray-200 transition-colors duration-300" />
      </div>
      <div className="max-w-800 mx-auto px-8 my-20">
        {isDraft && (
          <LargeInfoButton
            heading={"Draft report detected"}
            description={"You have a report you haven't submitted."}
            className="bg-[#0F1363] p-4 rounded-lg shadow-md mb-6"
            iconDescription={"Finish your report?"}
            onClick={() => navigate("/report")}
            variant={"dark"}
          />
        )}
        <LargeInfoButton
          heading={"Awaiting Event ID..."}
          description={"Your log on form has been submitted."}
          className=""
          iconDescription={""}
          // onClick={handleNewReport}
          variant={"light"}
        />
        <div className="bg-white px-4 py-2 mb-6 flex flex-col items-center">
          <div className="cursor-pointer bg-[#EEF6FF] text-black p-4 rounded-lg hover:bg-[#808080] transition-colors duration-300 w-full">
            <SmallInfoButton
              heading="Past Reports"
              description="View reports in the past."
              icon={<FaClipboardList className="mr-4 text-2xl" />}
            />
          </div>
        </div>
      </div>

      {renderBottomNavBar()}
    </div>
  );
}
