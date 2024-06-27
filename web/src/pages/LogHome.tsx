import { useNavigate } from "react-router-dom";
import { FaCog, FaClipboardList } from "react-icons/fa";
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
    setIsAwaitingEventId(true);
    // Here you would typically send a request to your backend
    // and then update the state based on the response
  };

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setIsAwaitingEventId(false);
  };

  const handleNewReport = () => {
    navigate("/Report");
  };

  const handleDraftReport = () => {
    navigate("/report");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white max-w-3xl mx-auto">
        <header className="flex justify-between items-center p-4 bg-white border-b">
          <h1 className="text-xl font-bold">Welcome, XXXXXXX</h1>
          <button className="text-red-500 font-semibold">Log Out</button>
        </header>
        
        <main className="p-4 flex flex-col gap-6">
          {isAwaitingEventId ? (
            <div className="text-center py-8">
              <div className="flex justify-center space-x-1 mb-4">
                <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
              <h2 className="text-xl font-bold mb-2">Awaiting Event ID...</h2>
              <p>Your log on form has been submitted.</p>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 py-24 rounded-lg text-center">
                <p className="font-semibold">Awaiting Event ID...</p>
                <p>Your log on form has been submitted.</p>
              </div>
            </>
          )}
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold">Past Reports</h3>
            <p className="text-sm">View reports in the past.</p>
          </div>
        </main>

        <BottomNavBar />
      </div>
    );
  }

  return (
    <div className="text-center min-h-screen relative bg-[#FFFFFF] max-w-3xl mx-auto">
      <div className="bg-[#EEF6FF] py-6 flex justify-between items-center px-4">
        <div>
          <h1 className="text-xl font-bold text-black mx-4">
            Welcome back, XXXXXXX
          </h1>
        </div>
        <FaCog className="text-2xl text-black cursor-pointer hover:text-gray-200 transition-colors duration-300" />
      </div>
      <div className="max-w-800 mx-auto px-8 my-8">
        {isDraft && (
          <LargeInfoButton
            heading={"Draft report detected"}
            description={"You have a report you haven't submitted."}
            className="bg-[#0F1363] p-4 rounded-lg shadow-md mb-6"
            iconDescription={"Finish your report?"}
            onClick={handleDraftReport}
            variant={"dark"}
          />
        )}
        <LargeInfoButton
          heading={"Report your observations"}
          description={"Use this to report your observations during your shift"}
          className="bg-[#EEF6FF] p-4 rounded-lg shadow-md mb-6"
          iconDescription={"Start a New Report"}
          onClick={handleNewReport}
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

      <BottomNavBar />
    </div>
  );
}