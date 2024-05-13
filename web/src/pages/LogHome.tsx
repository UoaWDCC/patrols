import { Link, useNavigate } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';

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
            <div className="bg-[#1E3A8A] py-6 flex justify-between items-center px-4 rounded-b-3xl">
                <div>
                    <h1 className="text-xl font-bold text-white">
                        Welcome back, XXXXXXX
                    </h1>
                </div>
                <FaCog className="text-2xl text-white cursor-pointer hover:text-gray-200 transition-colors duration-300" />
            </div>

            <div className="max-w-800 mx-auto px-4 my-8">
                <div className="bg-[#E9EFF2] p-4 rounded-lg shadow-md mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">
                            Draft report detected
                        </h2>
                    </div>
                    <p className="text-gray-600">Finish your report?</p>
                </div>

                <div className="bg-[#E9EFF2] p-4 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Start a New Report
                    </h2>
                    <button
                        onClick={handleNewReport}
                        className="bg-[#334D92] w-full mx-auto px-6 py-4 mb-4 rounded-lg text-lg font-semibold text-white transition-all duration-300 hover:bg-[#243B73] shadow-sm hover:shadow-lg"
                    >
                        Start a New Report
                    </button>
                </div>

                <div className="bg-[#E9EFF2] p-4 rounded-lg shadow-md mb-6">
                    <button
                        onClick={handlePastReports}
                        className="bg-white w-full mx-auto px-6 py-4 rounded-lg text-lg font-semibold text-black shadow-sm hover:shadow-lg"
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