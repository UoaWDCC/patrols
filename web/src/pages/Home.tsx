import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import SignoutButton from "@components/SignoutButton";
import BottomNavBar from "@components/BottomNavBar";
import logon from "../assets/images/logon.png";
import useUserData from "../hooks/useUserData";
import ReportCard from "@components/ReportCard";
import { reportSchema } from "../schemas";
import { z } from "zod";

export default function Home() {
  const navigate = useNavigate();

  // Function to navigate to the logon page when new report button is clicked
  const handleNewReport = () => {
    navigate("/logon");
  };

  const { currentUserDetails, reportDetails } = useUserData();

  // Check the curent user's logon status, if "Yes", then redirect to logon home
  useEffect(() => {
    if (currentUserDetails && currentUserDetails.logon_status == "Yes") {
      navigate("/logHome");
    }
  }, [currentUserDetails?.logon_status]);

  return (
    <div className="text-center min-h-screen relative bg-[#FFFFFF] max-w-3xl mx-auto">
      <div className="bg-white pt-14 pb-4 flex justify-between items-center px-8">
        <h1 className="text-xl font-bold text-black mx-4">
          Welcome,{" "}
          <span className="underline">
            {currentUserDetails?.first_names} {currentUserDetails?.surname}
          </span>
        </h1>
        <SignoutButton />
      </div>
      <div className="max-w-800 mx-auto px-14 my-8">
        {currentUserDetails?.logon_status == "Pending" ? (
          <div className="py-12 my-6 border-2 rounded-xl bg-cpnz-blue-900 text-white shadow-md font-semibold text-[16px]">
            Waiting for Event Id...
          </div>
        ) : (
          <div>
            {/* <div className="">
              <h2 className="text-base font-bold">No patrol in progress.</h2>
              <h3 className="font-light">Ready to start a patrol?</h3>
            </div> */}
            <button onClick={handleNewReport} className="w-full">
              <div className="bg-cpnz-blue-900 rounded-lg shadow-md mb-6 py-20 items-center flex flex-row justify-center w-full space-x-4">
                <img src={logon} alt="logon" className="w-10 h-9" />
                <h1 className="text-white font-semibold text-lg">Log On</h1>
              </div>
            </button>
          </div>
        )}

        <div className="text-right px-6">
          <p className="font-light">Ready to start a patrol?</p>
        </div>
        <div className="mb-10">
          <h2 className="font-bold text-left">Past Reports</h2>

          {reportDetails.length > 0 ? (
            <div className=" bg-[#F8F8F8] shadow-md mt-4">
              <ReportCard
                {...(reportDetails[0] as z.infer<typeof reportSchema>)}
              />
            </div>
          ) : (
            <div className=" bg-[#F8F8F8] shadow-md mt-4 my-10" />
          )}

          <Dialog>
            <DialogTrigger className="flex-1 text-black" asChild>
              <button className="w-full">
                <div className="p-4 bg-[#EEF6FF] shadow-md mt-4">
                  <p>View More</p>
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="p-8 max-h-[550px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center text-subheading pb-12">
                  All Reports
                </DialogTitle>
                <DialogDescription asChild>
                  <div>
                    {reportDetails.map((report) => (
                      <ReportCard
                        {...(report as z.infer<typeof reportSchema>)}
                        key={report.id}
                      />
                    ))}
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
}
