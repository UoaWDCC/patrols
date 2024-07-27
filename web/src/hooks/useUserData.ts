import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import {
  userDetailsSchema,
  patrolDetailsSchema,
  vehicleDetailsSchema,
  shiftDetailsSchema,
  reportSchema,
} from "../schemas";

type UserDetails = z.infer<typeof userDetailsSchema>;
type VehicleDetails = z.infer<typeof vehicleDetailsSchema>;
type PatrolDetails = z.infer<typeof patrolDetailsSchema>;
type ShiftDetails = z.infer<typeof shiftDetailsSchema>;
type ReportDetails = z.infer<typeof reportSchema>;

const fetchUserData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/getUserDetails`
    );
    const {
      userDetails,
      patrolDetails,
      vehicleDetails,
      shiftDetails,
      reportDetails,
    } = response.data;
    const parsedUserDetails = userDetailsSchema.parse(userDetails);
    const parsedPatrolDetails = patrolDetailsSchema.parse(patrolDetails);
    const parsedVehicleDetails = vehicleDetailsSchema
      .array()
      .parse(vehicleDetails);
    const parsedShiftDetails = shiftDetailsSchema.parse(shiftDetails);
    console.log(reportDetails);
    return {
      parsedUserDetails,
      parsedPatrolDetails,
      parsedVehicleDetails,
      parsedShiftDetails,
      reportDetails,
    };
  } catch (error) {
    console.log("Error: ", error);
  }
};

const useUserData = () => {
  const [currentUserDetails, setCurrentUserDetails] = useState<UserDetails>();
  const [patrolDetails, setPatrolDetails] = useState<PatrolDetails>();
  const [fullName, setFullName] = useState<string>("");
  const [currentUserVehicles, setCurrentUserVehicles] = useState<
    VehicleDetails[]
  >([]);
  const [shiftDetails, setShiftDetails] = useState<ShiftDetails>();
  const [reportDetails, setReportDetails] = useState<ReportDetails[]>([]);

  const { data, refetch } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    staleTime: 300000, // data become stale after 5 minutes
  });

  useEffect(() => {
    if (data) {
      const {
        parsedUserDetails,
        parsedPatrolDetails,
        parsedVehicleDetails,
        parsedShiftDetails,
        reportDetails,
      } = data;

      setCurrentUserDetails(parsedUserDetails);
      setPatrolDetails(parsedPatrolDetails);

      setFullName(
        `${parsedUserDetails.first_names} ${parsedUserDetails.surname}`
      );

      if (parsedVehicleDetails.length === 0) {
        setCurrentUserVehicles([]);
      } else {
        const reorderedVehicles = [
          ...parsedVehicleDetails.filter((vehicle) => vehicle.selected),
          ...parsedVehicleDetails.filter((vehicle) => !vehicle.selected),
        ];
        setCurrentUserVehicles(reorderedVehicles);
      }

      setShiftDetails(parsedShiftDetails);

      setReportDetails(reportDetails);
    }
  }, [data]);

  return {
    currentUserDetails,
    fullName,
    currentUserVehicles,
    patrolDetails,
    shiftDetails,
    reportDetails,
    refetch,
  };
};

export default useUserData;
