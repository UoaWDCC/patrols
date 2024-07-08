import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNavBar from "@components/BottomNavBar";
import LargeInfoButton from "@components/ui/LargeInfoButton";
import useDraftStatus from "../hooks/useDraftStatus";
import useUserData from "../hooks/useUserData";

export default function ReportSummary() {
  const navigate = useNavigate();
  const isDraft: boolean = useDraftStatus();
  const { currentUserDetails } = useUserData();
  const [showAmendmentDialog, setShowAmendmentDialog] = useState(false);
  const [amendmentText, setAmendmentText] = useState("");

  const handleNewReport = () => {
    navigate("/Report");
  };

  const handleDraftReport = () => {
    navigate("/report");
  };

  const handleMakeAmendment = () => {
    setShowAmendmentDialog(true);
  };

  const handleCloseDialog = () => {
    setShowAmendmentDialog(false);
    setAmendmentText("");
  };

  const handleConfirmAmendment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/send-email/amendment",
        {
          text: amendmentText,
          // might need to add report id here or smth
        }
      );
      console.log("Amendment submitted successfully:", response.data);
      handleCloseDialog();
    } catch (error) {
      console.error("Error submitting amendment:", error);
    }
  };

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
            Welcome,{" "}
            <span className="underline">{currentUserDetails?.first_names}</span>
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
            <p>Police Station Base: {currentUserDetails?.police_station}</p>
            <p>CP Call Sign: {currentUserDetails?.call_sign}</p>
            <p>Patrols: {currentUserDetails?.patrol_id}</p>
            <p>Vehicle: {/* You might need to fetch this separately */}</p>
          </div>
          <div className="flex flex-row justify-center space-x-2 items-center">
            <p className="text-xs">Details incorrect?</p>
            <button
              className="bg-[#EEF6FF] rounded-lg py-2 px-4 shadow-md"
              onClick={handleMakeAmendment}
            >
              Make Amendment
            </button>
          </div>
        </div>
      </div>
      <BottomNavBar />

      {showAmendmentDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Make an Amendment</h2>
            <textarea
              className="w-full h-32 p-2 border rounded mb-4"
              placeholder="Enter your amendment here..."
              value={amendmentText}
              onChange={(e) => setAmendmentText(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                onClick={handleCloseDialog}
              >
                Cancel
              </button>
              <button
                className="bg-[#0F1363] text-white px-4 py-2 rounded"
                onClick={handleConfirmAmendment}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
