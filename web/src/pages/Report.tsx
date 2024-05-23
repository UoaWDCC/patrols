export default function Report() {
  return (
    <div className="text-center min-h-screen relative bg-[#FFFFFF] max-w-3xl mx-auto">
      <div className="bg-[#1E3A8A] py-6 flex justify-between items-center px-4 rounded-b-3xl">
        <div>
          <h1 className="text-xl font-bold text-white">Shift in progress</h1>
          <p className="text-sm text-white">Event number: 2384839457</p>
        </div>
      </div>

      <button className="bg-[#334D92] px-4 py-2 rounded-lg text-white font-semibold flex items-center hover:bg-[#243B73]">
        Submit
      </button>
    </div>
  );
}
