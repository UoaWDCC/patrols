import userIcon from "../assets/images/gorilla.png";
import { FaCog } from "react-icons/fa";
import useUserData from "../hooks/useUserData";
import LogonForm from "@components/logon/LogonForm";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import {
  userDetailsSchema,
  vehicleDetailsSchema,
  patrolDetailsSchema,
} from "../schemas";

interface FormData {
  currentUserDetails?: z.infer<typeof userDetailsSchema>;
  currentUserVehicles: z.infer<typeof vehicleDetailsSchema>[];
  currentPatrolDetails: z.infer<typeof patrolDetailsSchema>;
}

export default function Logon() {
  const [formData, setFormData] = useState<FormData>();
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUserDetails, fullName, currentUserVehicles, patrolDetails } =
    useUserData();

  useEffect(() => {
    if (
      currentUserDetails &&
      fullName &&
      currentUserVehicles &&
      patrolDetails
    ) {
      const formDataObject = {
        currentUserDetails,
        fullName,
        currentUserVehicles,
        currentPatrolDetails: {
          name: patrolDetails.name,
          members_dev: patrolDetails.members_dev,
        },
      };
      setFormData(formDataObject);
      setLoading(false);
    }
  }, [currentUserDetails, fullName, currentUserVehicles, patrolDetails]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <Loader2 />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-white flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="bg-[#EEF6FF] px-8 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={userIcon}
              alt="User Icon"
              className="w-16 h-16 mr-4 rounded-full"
            />
            <h2 className="text-2xl font-bold">Welcome back, {fullName}</h2>
          </div>
          <button className="flex items-center">
            <span className="mr-2 text-lg font-semibold">Settings</span>
            <FaCog className="text-2xl text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-300" />
          </button>
        </div>
        <div className="bg-white p-8">
          <h3 className="text-3xl font-bold mb-8 text-center">
            Shift Log-on Form
          </h3>
          <LogonForm
            currentUserDetails={formData?.currentUserDetails}
            currentUserVehicles={formData?.currentUserVehicles || []}
            membersInPatrol={
              formData?.currentPatrolDetails ?? { name: "", members_dev: [] }
            }
          />
        </div>
      </div>
    </div>
  );
}
