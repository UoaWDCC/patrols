import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";

export default function ReportFormObservation() {
  const navigate = useNavigate();

  // Function to navigate to the next form page
  const handleNextPage = () => {
    // Navigate to the next form page or submit the form
    navigate("/LogHome");
  };

  // Function to navigate to the previous form page
  const handlePreviousPage = () => {
    // Navigate to the previous form page
    navigate("/ReportTwo");
  };

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
          <h2 className="text-lg font-semibold mb-4">OBSERVATION</h2>
          <div className="mb-4">
            <button className="bg-[#334D92] px-4 py-2 rounded-lg text-white font-semibold hover:bg-[#243B73]">
              + Add Observation
            </button>
          </div>
          <div className="mb-4">
            <h3 className="text-left font-semibold mb-2">New Observation</h3>
            <div className="mb-4">
              <label className="block text-left font-semibold mb-1">
                Time of Observation
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message here"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left font-semibold mb-1">
                Location
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message here"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left font-semibold mb-1">
                Police/Security in attendance
              </label>
              <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select an option</option>
                {/* Add options */}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-left font-semibold mb-1">
                Time Observation Ended
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message here"
              />
            </div>
            <div className="mb-4">
              <h4 className="text-left font-semibold mb-2">
                CPNZ Incident Statistics*
              </h4>
              <div className="flex items-center mb-2">
                <input type="checkbox" className="mr-2" />
                <label>Vehicle</label>
              </div>
              <div className="flex items-center mb-2">
                <input type="checkbox" className="mr-2" />
                <label>Property</label>
              </div>
              <div className="flex items-center mb-2">
                <input type="checkbox" className="mr-2" />
                <label>People</label>
              </div>
              <div className="flex items-center mb-2">
                <input type="checkbox" className="mr-2" />
                <label>Wilful Damage</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label>Nothing to Report (NTR)</label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-left font-semibold mb-2">
              SHIFT FINISH DETAILS
            </h2>
            <div className="mb-4">
              <label className="block text-left font-semibold mb-1">
                Finish Date
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message here"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left font-semibold mb-1">
                Finish Time
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message here"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left font-semibold mb-1">
                Odometer FINISH Kms (5 digits)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message here"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left font-semibold mb-1">
                End of Shift De-brief Comments / Concerns (to be reviewed by
                Patrol Leader)
              </label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Type your message here"
              ></textarea>
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
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
