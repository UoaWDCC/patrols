import { useNavigate } from "react-router-dom";
import BottomNavBar from "@components/BottomNavBar";
import useDraftStatus from "../hooks/useDraftStatus";
import useUserData from "../hooks/useUserData";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@components/ui/input";

export default function ReportSummary() {
  const navigate = useNavigate();
  const isDraft: boolean = useDraftStatus();

  const [showAmendmentDialog, setShowAmendmentDialog] = useState(false);
  const [amendmentText, setAmendmentText] = useState("");
  const [registrationInput, setRegistrationInput] = useState("");

  // Function to navigate to the new report page
  const handleNewReport = () => {
    navigate("/Report");
  };

  const handleOpenAmendment = () => {
    setShowAmendmentDialog(true);
  };

  const handleCloseDialog = () => {
    setShowAmendmentDialog(false);
    setAmendmentText("");
  };

  const handleConfirmAmendment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/email/amendment",
        {
          text: amendmentText,
          event_no: shiftDetails?.event_no,
        }
      );
      console.log("Amendment submitted successfully:", response.data);
      handleCloseDialog();
    } catch (error) {
      console.error("Error submitting amendment:", error);
    }
  };

  const { currentUserDetails, currentUserVehicles, shiftDetails } =
    useUserData();

  const selectedVehicle = currentUserVehicles.find(
    (vehicle) => vehicle.selected
  );
  const registrationNo = selectedVehicle
    ? selectedVehicle.registration_no
    : null;
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
            Welcome,{" "}
            <span className="underline">
              {currentUserDetails?.first_names +
                " " +
                currentUserDetails?.surname}
            </span>
          </h1>
        </div>
      </div>
      <div className="max-w-800 mx-auto px-14 my-8">
        <div>
          <div className="py-12">
            <h2 className="text-base font-bold">Patrol in progress...</h2>
            <h3 className="font-light">Event ID: {shiftDetails?.event_no}</h3>
          </div>

          <button
            onClick={handleNewReport}
            className="w-full transition-all duration-300 hover:opacity-80"
          >
            <div className="flex flex-col gap-2 bg-cpnz-blue-900 rounded-lg shadow-md mb-6 py-20 items-center justify-center w-full">
              <h1 className="text-white font-semibold text-lg">
                {isDraft ? "Continue Draft Report" : "Start a New Report"}
              </h1>
            </div>
          </button>
        </div>
        <div className="my-6">
          <div className="mb-8">
            <p>
              Police Station Base:{" "}
              <strong>{currentUserDetails?.police_station}</strong>
            </p>
            <p>
              CP Call Sign: <strong>{currentUserDetails?.call_sign}</strong>
            </p>
            <p>
              Patrols: <strong>{currentUserDetails?.patrol_id}</strong>{" "}
            </p>
            <p>
              Vehicle: <strong>{registrationNo}</strong>
            </p>
          </div>
          <div className="flex flex-row justify-center space-x-2 items-center">
            <p className="text-xs">Details incorrect?</p>
            <button
              className="bg-[#EEF6FF] rounded-lg py-2 px-4 shadow-md"
              onClick={handleOpenAmendment}
            >
              Make Amendment
            </button>
          </div>
          <div className="mt-8">
              <label className="block text-left font-semibold ml-1">
                Enter a Registration Number:
              </label>
              <div className="flex mt-1">
                <Input
                  className="mt-2 font-light text-xs h-12"
                  type="text"
                  placeholder="Enter registration number"
                  value={registrationInput}
                  onChange={(e) => setRegistrationInput(e.target.value)}
                />
              </div>
            </div>
        </div>
      </div>

      {showAmendmentDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">Make an Amendment</h2>
            <p className="mb-6">
              Event No: <strong>{shiftDetails?.event_no}</strong>
            </p>
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

      <BottomNavBar />
    </div>
  );
}
