import axios from 'axios';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import {
  userDetailsSchema,
  patrolDetailsSchema,
  vehicleDetailsSchema,
} from '../schemas';

type UserDetails = z.infer<typeof userDetailsSchema>;
type VehicleDetails = z.infer<typeof vehicleDetailsSchema>;
type PatrolDetails = z.infer<typeof patrolDetailsSchema>;

const fetchUserData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/getUserDetails`
    );
    const { userDetails, patrolDetails, vehicleDetails } = response.data;
    const parsedUserDetails = userDetailsSchema.parse(userDetails);
    const parsedPatrolDetails = patrolDetailsSchema.parse(patrolDetails);
    const parsedVehicleDetails = vehicleDetailsSchema
      .array()
      .parse(vehicleDetails);
    console.log("API CALL");
    return { parsedUserDetails, parsedPatrolDetails, parsedVehicleDetails };
  } catch (error) {
    console.log("Error: ", error);
  }
};

const useUserData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUserDetails, setCurrentUserDetails] = useState<UserDetails>();
  const [patrolDetails, setPatrolDetails] = useState<PatrolDetails>();
  const [fullName, setFullName] = useState<string>("");
  const [cpnzID, setCPNZID] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [callSign, setCallSign] = useState<string>("");
  const [patrolName, setPatrolName] = useState<string>("");
  const [policeStation, setPoliceStation] = useState<string>("");
  const [currentUserVehicles, setCurrentUserVehicles] = useState<
    VehicleDetails[]
  >([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetails | null>(
    null
  );
  const [membersInPatrol, setMembersInPatrol] = useState<UserDetails[]>([]);

  const { data, refetch } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    staleTime: 300000, // data become stale after 5 minutes
  });

  useEffect(() => {
    if (data) {
      const { parsedUserDetails, parsedPatrolDetails, parsedVehicleDetails } =
        data;

      setCurrentUserDetails(parsedUserDetails);
      setPatrolDetails(parsedPatrolDetails);
      setCallSign(parsedUserDetails.call_sign);
      setPatrolName(parsedPatrolDetails.name);
      setPoliceStation(parsedUserDetails.police_station.replace(/_/g, " "));
      setEmail(parsedUserDetails.email);
      setCPNZID(parsedUserDetails.cpnz_id);
      setMobileNumber(parsedUserDetails.mobile_phone);
      setFullName(
        `${parsedUserDetails.first_names} ${parsedUserDetails.surname}`
      );

      if (parsedVehicleDetails.length === 0) {
        setSelectedVehicle(null);
        setCurrentUserVehicles([]);
      } else {
        setSelectedVehicle(
          parsedVehicleDetails.find((vehicle) => vehicle.selected) || null
        );
        const reorderedVehicles = [
          ...parsedVehicleDetails.filter((vehicle) => vehicle.selected),
          ...parsedVehicleDetails.filter((vehicle) => !vehicle.selected),
        ];
        setCurrentUserVehicles(reorderedVehicles);
      }
      setMembersInPatrol(parsedPatrolDetails.members_dev);
      setLoading(false);
    }
  }, [data]);

  return {
    loading,
    setLoading,
    currentUserDetails,
    setCurrentUserDetails,
    fullName,
    setFullName,
    cpnzID,
    setCPNZID,
    email,
    setEmail,
    mobileNumber,
    setMobileNumber,
    callSign,
    setCallSign,
    patrolName,
    setPatrolName,
    policeStation,
    setPoliceStation,
    currentUserVehicles,
    setCurrentUserVehicles,
    selectedVehicle,
    setSelectedVehicle,
    membersInPatrol,
    setMembersInPatrol,
    patrolDetails,
    refetch,
  };
};

export default useUserData;
