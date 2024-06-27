import { useNavigate } from "react-router-dom";
import { FaClipboardList } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { userDetailsSchema } from "../schemas";
import BottomNavBar from "@components/BottomNavBar";

const reportsDetailsSchema = z.object({
  message: z.string(),
  reports: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      createdAt: z.string(),
      location: z.string(),
      patrolID: z.number(),
      reportIncidentType: z.string(),
    })
  ),
});

type reportsDetails = z.infer<typeof reportsDetailsSchema>;

export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState<reportsDetails>();
  const [id, setId] = useState<number>();

  useEffect(() => {
    const getPatrolLeadID = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/getUserDetails`
      );

      const userDetails = userDetailsSchema.parse(response.data);
      setId(Number(userDetails.patrol_id));
    };

    getPatrolLeadID();
  }, []);

  useEffect(() => {
    const getAllReports = async () => {
      if (id !== undefined) {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/report/lead/${id}`
        );

        const reportsData = reportsDetailsSchema.parse(response.data);
        setData(reportsData);
      }
    };

    getAllReports();
  }, [id]);

  const handleLogOn = () => {
    navigate("/logon");
  };

  return (
    <div className="min-h-screen bg-white max-w-3xl mx-auto">
      <header className="flex justify-between items-center p-4 bg-white border-b">
        <h1 className="text-xl font-bold">Welcome, XXXXXXX</h1>
        <button className="text-red-500 font-semibold">Log Out</button>
      </header>
      
      <main className="p-4 flex flex-col gap-4">
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <p className="font-semibold">No patrol in progress.</p>
          <p>Ready to start a patrol?</p>
        </div>
        
        <button 
          onClick={handleLogOn}
          className="bg-blue-900 text-white py-12 rounded-lg flex items-center justify-center"
        >
          <span className="mr-4">🔑</span> Log On
        </button>
        
        <p className="text-center">Ready to start a patrol?</p>
        
        <Dialog>
          <DialogTrigger className="w-full bg-gray-100 text-black p-4 rounded-lg hover:bg-gray-200 transition-colors duration-300">
            <div className="flex items-center">
              <FaClipboardList className="mr-4 text-2xl" />
              <div className="text-left">
                <h3 className="font-semibold">Past Reports</h3>
                <p className="text-sm">View reports in the past.</p>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="p-8 max-h-[550px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold pb-6">
                All Reports
              </DialogTitle>
              <DialogDescription>
                {data == null ? (
                  <span>No reports found</span>
                ) : (
                  <div className="flex flex-col w-full gap-4">
                    {data.reports.map((d) => (
                      <div
                        key={d.id}
                        className="border-2 border-gray-300 rounded-lg shadow-md px-4 py-3 hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        <h3 className="text-lg font-semibold text-blue-900">
                          {d.title}
                        </h3>
                        <p><strong>Location</strong>: {d.location}</p>
                        <p><strong>Type:</strong> {d.reportIncidentType}</p>
                        <p><strong>Patrol ID:</strong> {d.patrolID}</p>
                      </div>
                    ))}
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        
        <div className="bg-gray-100 py-3 rounded-lg"></div>
      </main>

      <BottomNavBar />
    </div>
  );
}