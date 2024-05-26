import { useNavigate } from "react-router-dom";
import { FaCog, FaClipboardList } from "react-icons/fa";
import BottomNavBar from "@components/BottomNavBar";
import LargeInfoButton from "@components/ui/LargeInfoButton";
import SmallInfoButton from "@components/ui/SmallInfoButton";

export default function ReportSummary() {
  const navigate = useNavigate();

  // Function to navigate to the new report page
  const handleNewReport = () => {
    navigate("/Report");
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
        <LargeInfoButton
          heading={"Draft report detected"}
          description={"You have a report you haven't submitted."}
          className="bg-[#0F1363] p-4 rounded-lg shadow-md mb-6"
          iconDescription={"Finish your report?"}
          variant={"dark"}
        />
        <LargeInfoButton
          heading={"Report your observations"}
          description={"Use this to report your observations during your shift"}
          className="bg-[#EEF6FF] p-4 rounded-lg shadow-md mb-6"
          iconDescription={"Start a New Report"}
          onClick={handleNewReport}
          variant={"light"}
        />
        <div className="bg-white px-4 py-2 mb-6 flex flex-col items-center">
          <div className="cursor-pointer bg-[#EEF6FF] text-black p-4 rounded-lg hover:bg-[#808080] transition-colors duration-300">
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
