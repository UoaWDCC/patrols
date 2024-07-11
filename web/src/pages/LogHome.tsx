import { useNavigate } from "react-router-dom";
import BottomNavBar from "@components/BottomNavBar";
import LargeInfoButton from "@components/ui/LargeInfoButton";
import useDraftStatus from "../hooks/useDraftStatus";
import useUserData from "../hooks/useUserData";
import { useEffect } from "react";

export default function ReportSummary() {
  const navigate = useNavigate();
  const isDraft: boolean = useDraftStatus();

  // Function to navigate to the new report page
  const handleNewReport = () => {
    navigate("/Report");
  };

  const handleDraftReport = () => {
    navigate("/report");
  };

  const { currentUserDetails } = useUserData();

  // Check the curent user's logon status, if "Yes", then redirect to logon home
  useEffect(() => {
    if (currentUserDetails && currentUserDetails.logon_status != "Yes") {
      navigate("/home");
    }
  }, [currentUserDetails?.logon_status]);

  return (
    <div className="text-center min-h-screen relative bg-[#FFFFFF] max-w-3xl mx-auto">
      <div className="bg-white pt-14 pb-4 flex justify-between items-center px-8">
        <div>
          <h1 className="text-xl font-bold text-black mx-4">
            Welcome, <span className="underline">XXXXXXX</span>
          </h1>
        </div>
      </div>
      <div className="max-w-800 mx-auto px-14 my-8">
        <div>
          <div className="py-12">
            <h2 className="text-base font-bold">Patrol in progress.</h2>
            <h3 className="font-light">Event ID: xxxxxxxxxx</h3>
          </div>
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
          <button
            onClick={handleNewReport}
            className="w-full transition-all duration-300 hover:opacity-80"
          >
            <div className="bg-cpnz-blue-900 rounded-lg shadow-md mb-6 py-14 items-center flex justify-center w-full">
              <h1 className="text-white font-semibold text-lg">
                Start a New Report
              </h1>
            </div>
          </button>
        </div>
        <div className="my-6">
          <div className="font-light mb-8">
            <p>Police Station Base</p>
            <p>CP Call Sign</p>
            <p>Patrols</p>
            <p>Vehicle</p>
          </div>
          <div className="flex flex-row justify-center space-x-2 items-center">
            <p className="text-xs">Details incorrect?</p>
            <button className="bg-[#EEF6FF] rounded-lg py-2 px-4 shadow-md">
              Make Amendment
            </button>
          </div>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
}
