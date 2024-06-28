import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog, FaClipboardList, FaGavel } from "react-icons/fa";
import BottomNavBar from "@components/BottomNavBar";
import LargeInfoButton from "@components/ui/LargeInfoButton";
import SmallInfoButton from "@components/ui/SmallInfoButton";
import useDraftStatus from "../hooks/useDraftStatus";
import axios from "axios";

export default function ReportSummary() {
  const navigate = useNavigate();
  const isDraft: boolean = useDraftStatus();
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
        "http://localhost:3000/user/amendment",
        {
          text: amendmentText,
        }
      );
      console.log("Amendment submitted successfully:", response.data);
      handleCloseDialog();
    } catch (error) {
      console.error("Error submitting amendment:", error);
    }
  };

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
        <div className="bg-white px-4 py-2 mb-6 flex justify-center items-center space-x-4">
          <div className="cursor-pointer bg-[#EEF6FF] text-black p-4 rounded-lg hover:bg-[#808080] transition-colors duration-300">
            <SmallInfoButton
              heading="Past Reports"
              description="View reports in the past."
              icon={<FaClipboardList className="mr-4 text-2xl" />}
            />
          </div>
          <div
            className="cursor-pointer bg-[#EEF6FF] text-black p-4 rounded-lg hover:bg-[#808080] transition-colors duration-300"
            onClick={handleMakeAmendment}
          >
            <SmallInfoButton
              heading="Make an Amendment"
              description="Amend a previous report."
              icon={<FaGavel className="mr-4 text-2xl" />}
            />
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
