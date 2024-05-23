export default function ReportFinishDetails() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-left font-semibold mb-2">SHIFT FINISH DETAILS</h2>
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
          End of Shift De-brief Comments / Concerns (to be reviewed by Patrol
          Leader)
        </label>
        <textarea
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Type your message here"
        ></textarea>
      </div>
    </div>
  );
}
