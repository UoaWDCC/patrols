import placeholder from '../assets/images/placeholder.png';
import BottomNavBar from '@components/BottomNavBar';
import PatrolDetailsForm from '@components/profile/PatrolDetailsForm';
import UserDetailsForm from '@components/profile/UserDetailsForm';
import VehicleDetailsForm from '@components/profile/VehicleDetailsForm';
import useUserData from "../hooks/useUserData";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  userDetailsSchema,
  vehicleDetailsSchema,
  patrolDetailsSchema,
} from "../schemas";
import Loading from "@components/ui/Loading";

interface ProfileData {
  currentUserDetails: z.infer<typeof userDetailsSchema>;
  currentUserVehicles: z.infer<typeof vehicleDetailsSchema>[];
  currentPatrolDetails: z.infer<typeof patrolDetailsSchema>;
}

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<ProfileData>();
  const { currentUserDetails, patrolDetails, currentUserVehicles } =
    useUserData();

  useEffect(() => {
    if (currentUserDetails && currentUserVehicles && patrolDetails) {
      const profileDataObject: ProfileData = {
        currentUserDetails,
        currentUserVehicles,
        currentPatrolDetails: {
          name: patrolDetails.name,
          members_dev: patrolDetails.members_dev,
        },
      };
      setProfileData(profileDataObject);
      setLoading(false);
    }
  }, [currentUserDetails, currentUserVehicles, patrolDetails]);

  if (loading) {
    return <Loading />;
  }

  if (profileData) {
    return (
      <div className="text-center flex-col min-h-screen flex max-w-3xl mx-auto">
        <div className="bg-[#eef6ff] h-28 mb-4 pl-8 pt-4">
          <div>
            <img
              src={placeholder}
              alt="placeholder"
              className="rounded-full w-10 h-10"
            />
          </div>
          <div>
            <h1 className="font-bold text-left pt-2 text-2xl">Profile</h1>
          </div>
        </div>
        <UserDetailsForm currentUserDetails={profileData.currentUserDetails} />
        <PatrolDetailsForm
          currentUserDetails={profileData.currentUserDetails}
          patrolDetails={profileData.currentPatrolDetails}
        />
        <VehicleDetailsForm
          currentUserVehicles={profileData.currentUserVehicles}
        />
        <BottomNavBar />
      </div>
    );
  }
}
