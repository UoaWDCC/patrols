import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { z } from "zod";

export default function ReportVehicle() {
  const navigate = useNavigate();

  // Function to navigate to the next form page
  const handleNextPage = () => {
    // Navigate to the next form page
    navigate("/ReportTwo");
  };

  // Function to navigate to the previous form page
  const handlePreviousPage = () => {
    // Navigate to the previous form page
    navigate("/LogHome");
  };

  // const vehicleReportFormSchema = z.object({
  //   checkListCompleted: z.boolean(),
  //   visibleDamage: z.string(),
  // });

  return (
    <div className="text-center min-h-screen relative bg-[#FFFFFF] max-w-3xl mx-auto">
      <div className="bg-[#1E3A8A] py-6 flex justify-between items-center px-4 rounded-b-3xl">
        <div>
          <h1 className="text-xl font-bold text-white">Shift in progress</h1>
          <p className="text-sm text-white">Event number: 2384839457</p>
        </div>
      </div>

      <div className="max-w-800 mx-auto px-4 my-8">
        <div className="bg-[#E9EFF2] p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">VEHICLE DETAILS</h2>
          <div className="mb-4">
            <label className="block text-left font-semibold mb-1">
              Select a Patrol Vehicle
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select an option</option>
              {/* Add more vehicle options */}
            </select>
            <p className="text-left text-sm text-gray-500">
              Don't see your vehicle? Register a new one here.
            </p>
          </div>
          <p className="text-left text-sm text-gray-500 mb-4">
            Please check your vehicle and equipment prior to starting your
            shift.
          </p>
          <div className="mb-4">
            <label className="block text-left font-semibold mb-1">
              Vehicle Checklist
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select an option</option>
              {/* Add more checklist options */}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-left font-semibold mb-1">
              Equipment Checklist
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select an option</option>
              {/* Add more checklist options */}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-left font-semibold mb-1">
              Please record any visible damage before starting your shift (if
              applicable).
            </label>
            <textarea
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Type your message here"
            ></textarea>
          </div>
          <div className="mb-4">
            <p className="text-left font-semibold mb-2">
              Is there anything that requires the attention of the vehicle
              manager?
            </p>
            <div className="flex items-center">
              <label className="mr-4">
                <input type="radio" value="yes" className="mr-2" />
                Yes
              </label>
              <label>
                <input type="radio" value="no" className="mr-2" />
                No
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePreviousPage}
            className="bg-[#334D92] px-4 py-2 rounded-lg text-white font-semibold flex items-center hover:bg-[#243B73]"
          >
            <FaChevronLeft className="mr-2" />
            Previous
          </button>
          <button
            onClick={handleNextPage}
            className="bg-[#334D92] px-4 py-2 rounded-lg text-white font-semibold flex items-center hover:bg-[#243B73]"
          >
            Next
            <FaChevronRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
