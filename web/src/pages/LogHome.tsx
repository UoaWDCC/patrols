import { Link, useNavigate } from 'react-router-dom';
import { FaCog, FaClipboardList } from 'react-icons/fa';

export default function ReportSummary() {
  const navigate = useNavigate();

  // Function to navigate to the new report page
  const handleNewReport = () => {
    navigate('/Report');
  };

  // Function to navigate to the past reports page
  const handlePastReports = () => {
    navigate('/past-reports');
  };

  // Function to handle log-off
  const handleLogOff = () => {
    // Perform log-off actions
    navigate('/login');
  };

  return (
    <div className="text-center min-h-screen relative bg-[#FFFFFF] max-w-3xl mx-auto">
      <div className="bg-[#ECEDFF] py-6 flex justify-between items-center px-4 rounded-b-3xl">
        <div>
          <h1 className="text-xl font-bold text-black mx-4">Welcome back, XXXXXXX</h1>
        </div>
        <FaCog className="text-2xl text-black cursor-pointer hover:text-gray-200 transition-colors duration-300" />
      </div>
      <div className="max-w-800 mx-auto px-4 my-8">
        <div className="bg-[#ECEDFF] p-4 rounded-lg shadow-md mb-6 flex items-center">
          <FaClipboardList className="mr-4 text-2xl" />
          <div>
            <h2 className="text-md font-semibold">Draft report detected</h2>
            <p className="text-gray-600">Finish your report?</p>
          </div>
        </div>
        <div className="bg-white px-4 py-2 mb-6 flex flex-col items-center">
            <button
            onClick={handleNewReport}
            className="bg-[#EEEEEE] mx-autoo px-6 py-20 mb-4 rounded-lg shadow-lg mb-6 text-lg font-semibold text-black hover:bg-[#0F1363] hover:shadow-xl hover:text-white transition-all duration-300"
            style={{ width: '500px' }}
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
    </div>
  );
}