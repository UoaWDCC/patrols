export default function ReportIntel() {
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
          <h2 className="text-lg font-semibold mb-4">
            INTEL - Directives & Taskings for this shift
          </h2>
          <div className="mb-4">
            <label className="block text-left font-semibold mb-1">
              Weather Condition
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select an option</option>
              {/* Add weather condition options */}
            </select>
          </div>

          {/* <div className="mb-4">
            <label className="block text-left font-semibold mb-1">
              Odometer START Kms (5 digits)
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message here"
            />
          </div> */}
          <div className="mb-4">
            <p className="text-left font-semibold mb-2">
              Are you leaving your vehicle to conduct a Foot Patrol?
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
      </div>
    </div>
  );
}
