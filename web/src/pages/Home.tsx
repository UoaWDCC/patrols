import { Link, useNavigate } from 'react-router-dom';
import { FaCog, FaClipboardList, FaCogs, FaPlus } from 'react-icons/fa';

export default function Home() {
    const navigate = useNavigate();

    // Function to navigate to the logon page when new report button is clicked
    const handleNewReport = () => {
        navigate('/logon');
    };

    const handleReport = () => {
        navigate('/Report');
    };

    return (
        <div className="text-center min-h-screen relative bg-[#FFFFFF] max-w-3xl mx-auto">
            <div className="bg-[#ECEDFF] py-6 flex justify-between items-center px-4 rounded-b-3xl">
                <div className='px-8'>
                    <h1 className="text-xl font-bold text-black">
                        Welcome back, XXXXXXX
                    </h1>
                </div>
                <FaCog className="text-2xl text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-300" />
            </div>

            <div className="max-w-800 mx-auto px-8 my-8">
                <div className="bg-[#ECEDFF] p-4 rounded-lg shadow-md mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-md font-semibold">
                            Draft report detected
                        </h2>
                        <FaCog className="text-md text-gray-400 cursor-pointer" />
                    </div>
                    <p className="text-gray-600">Finish your report?</p>
                    <button
                        onClick={handleReport}
                        className="bg-[#334D92] w-full mx-auto px-6 py-4 mb-6 rounded-lg text-md font-semibold flex items-center justify-center transition-all duration-300 hover:bg-[#243B73] text-white shadow-sm hover:shadow-lg"
                    >
                    Write a report
                    </button>
                </div>

                <button
                    onClick={handleNewReport}
                    className="bg-[#334D92] w-full mx-auto px-6 py-4 mb-6 rounded-lg text-md font-semibold flex items-center justify-center transition-all duration-300 hover:bg-[#243B73] text-white shadow-sm hover:shadow-lg"
                >
                    <FaPlus className="mr-2" /> Log on to start a new shift
                </button>

                <div className="bg-[#ECEDFF] p-4 rounded-lg shadow-md mb-6">
                    <h2 className="text-md font-semibold mb-2">
                        Patrol vehicles
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Create a new report from scratch or select a template.
                    </p>
                    <button className="bg-white w-full mx-auto px-6 py-3 rounded-lg text-md font-semibold text-black shadow-sm hover:shadow-lg">
                        View and Update Patrol Vehicles
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#ECEDFF] text-black p-4 rounded-lg flex items-center hover:bg-[#808080] transition-colors duration-300">
                        <FaClipboardList className="mr-4 text-2xl" />
                        <div className="text-left">
                            <h3 className="text-base font-semibold">
                                Past Reports
                            </h3>
                            <p className="text-xs">View reports in the past.</p>
                        </div>
                    </div>
                    <div className="bg-[#ECEDFF] text-black p-4 rounded-lg flex items-center hover:bg-[#808080] transition-colors duration-300">
                        <FaCogs className="mr-4 text-2xl" />
                        <div className="text-left">
                            <h3 className="text-md font-semibold">
                                Report Settings
                            </h3>
                            <p className="text-xs">
                                Modify report templates including templates.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}