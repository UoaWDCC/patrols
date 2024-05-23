export default function ReportObservation() {
  return (
    <div className="text-center min-h-screen relative bg-[#FFFFFF] max-w-3xl mx-auto">
      <div className="max-w-800 mx-auto px-4 my-8">
        <div className="bg-[#E9EFF2] p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">OBSERVATION</h2>
          <div className="mb-4">
            <button className="bg-[#334D92] px-4 py-2 rounded-lg text-white font-semibold hover:bg-[#243B73]">
              + Add Observation
            </button>
          </div>
          <div className="mb-4">
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
        </div>
      </div>
    </div>
  );
}
