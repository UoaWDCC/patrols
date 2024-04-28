import { FaCog, FaClipboardList, FaCogs, FaPlus } from "react-icons/fa";

export default function Home() {
  return (
    <div className="text-center min-h-screen relative bg-[#E6F0FF]">
      <div className="bg-[#1E3A8A] py-8 rounded-b-3xl flex justify-between items-center px-4">
        <div>
          <h1 className="text-xl font-bold text-white">Welcome back, XXXXXXX</h1>
        </div>
        <FaCog className="text-2xl text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-300" />
      </div>

      <div className="max-w-800 mx-auto px-4 my-8">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Draft report detected</h2>
            <FaCog className="text-xl text-gray-400 cursor-pointer" />
          </div>
          <p className="text-gray-600">Finish your report?</p>
        </div>

        <button className="bg-[#334D92] w-full mx-auto px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center transition-all duration-300 hover:bg-[#243B73] text-white shadow-sm hover:shadow-lg">
          <FaPlus className="mr-2" /> Log on to start a new shift
        </button>

        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h2 className="text-lg font-semibold mb-2">Patrol vehicles</h2>
          <p className="text-gray-600 mb-4">
            Create a new report from scratch or select a template.
          </p>
          <button className="bg-[#334D92] w-full mx-auto px-8 py-4 rounded-lg text-lg font-semibold text-white shadow-sm hover:shadow-lg">
            View and Update Patrol Vehicles
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-[#969696] text-white p-4 rounded-lg flex items-center hover:bg-[#808080] transition-colors duration-300">
            <FaClipboardList className="mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Past Reports</h3>
              <p className="text-sm">View reports in the past.</p>
            </div>
          </div>
          <div className="bg-[#969696] text-white p-4 rounded-lg flex items-center hover:bg-[#808080] transition-colors duration-300">
            <FaCogs className="mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Report Settings</h3>
              <p className="text-sm">Set up report templates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
