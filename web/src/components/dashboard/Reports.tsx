import { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import useUserData from "../../hooks/useUserData";
import { reportSchema } from "../../schemas";
import ReportCard from "../../components/ReportCard";

export default function Reports() {
  const { currentUserDetails, fullName } = useUserData();
  const [reports, setReports] = useState<z.infer<typeof reportSchema>[]>([]);

  useEffect(() => {
    const fetchAllReports = async () => {
      if (!currentUserDetails?.patrol_id) {
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/report/lead/${
            currentUserDetails.patrol_id
          }`
        );

        setReports(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllReports();
  }, [currentUserDetails]);

  return (
    <div>
      <h2 className="text-center mt-12 font-bold text-2xl">Reports</h2>

      <div className="max-w-[700px] p-12 shadow-lg mx-auto max-h-[560px] overflow-y-auto mt-8 rounded-xl">
        {reports.map((report) => (
          <ReportCard report={report} fullName={fullName} key={report.id} />
        ))}
      </div>
    </div>
  );
}
