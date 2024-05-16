import { useNavigate } from "react-router-dom";
import { FaCog, FaClipboardList } from "react-icons/fa";
import profile from "../assets/images/user.png";
import home from "../assets/images/home.png";

export default function ReportSummary() {
  const navigate = useNavigate();

  // Function to navigate to the new report page
  const handleNewReport = () => {
    navigate("/Report");
  };

  // Function to navigate to the past reports page
  const handlePastReports = () => {
    navigate("/past-reports");
  };

  // Function to handle log-off
  const handleLogOff = () => {
    // Perform log-off actions
    navigate("/login");
  };

  // Function to navigate to the profile page when profile button is clicked
  const handleProfile = () => {
    navigate("/profile");
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
        <div className="bg-[#EEF6FF] p-4 rounded-lg shadow-md mb-6 flex items-center">
          <FaClipboardList className="mr-4 text-2xl" />
          <div>
            <h2 className="text-md font-semibold">Draft report detected</h2>
            <p className="text-gray-600">Finish your report?</p>
          </div>
        </div>
        <div className="bg-white px-4 py-2 mb-6 flex flex-col items-center">
          <button
            onClick={handleNewReport}
            className="bg-[#EEEEEE] mx-autoo px-6 py-20 rounded-lg shadow-lg mb-6 text-lg font-semibold text-black hover:bg-[#0F1363] hover:shadow-xl hover:text-white transition-all duration-300"
            style={{ width: "500px" }}
          >
            Start a New Report
          </button>
          <button
            onClick={handlePastReports}
            className="bg-white w-800 mx-auto px-6 py-4 rounded-lg text-base font-semibold text-black shadow-sm hover:shadow-lg border-2 border-black"
          >
            Past Reports
          </button>
        </div>
        <div className="mt-8">
          <button
            onClick={handleLogOff}
            className="bg-[#FF0000] px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 hover:bg-[#CC0000] shadow-sm hover:shadow-lg"
          >
            Log-off
          </button>
        </div>
      </div>
      <div className="bg-[#EEF6FF] h-24 mt-6 flex items-center pl-12 pt-4 absolute bottom-0 max-w-3xl mx-auto w-full">
          <div className="font-semibold space-x-11 text-cpnz-blue-900 flex items-center">
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
