import useUserData from "../hooks/useUserData";
import LogonForm from "@components/logon/LogonForm";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  userDetailsSchema,
  vehicleDetailsSchema,
  patrolDetailsSchema,
} from "../schemas";
import Loading from "@components/ui/Loading";
import login from '../assets/images/login.png';
import BottomNavBar from "@components/BottomNavBar";

interface FormData {
  currentUserDetails: z.infer<typeof userDetailsSchema>;
  currentUserVehicles: z.infer<typeof vehicleDetailsSchema>[];
  patrolDetails: z.infer<typeof patrolDetailsSchema>;
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
        patrolDetails: {
          name: patrolDetails.name,
          members_dev: patrolDetails.members_dev,
        },
      };
      setFormData(formDataObject);
      setLoading(false);
    }
  }, [currentUserDetails, fullName, currentUserVehicles, patrolDetails]);

  if (loading) {
    return <Loading />;    
  }

  if (formData) {
    return (
      <div className=" bg-white flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <div className="bg-white py-8 max-w-800 mx-auto px-14 my-8">
            <div className="my-12 flex flex-row space-x-2 justify-center items-center">
              <img
                src={login}
                alt="login"
                className="w-8 h-8"
              />
              <h3 className="text-3xl font-semibold text-center">
                Shift Log-on Form
              </h3>
            </div>
            <LogonForm
              currentUserDetails={formData.currentUserDetails}
              currentUserVehicles={formData.currentUserVehicles}
              patrolDetails={formData.patrolDetails}
            />
          </div>
          <BottomNavBar />
        </div>
      </div>
      
    );
  }
}
