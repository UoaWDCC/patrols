import axios from 'axios';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { userDetailsSchema, vehicleDetailsSchema } from '../schemas';

type UserDetails = z.infer<typeof userDetailsSchema>;
type VehicleDetails = z.infer<typeof vehicleDetailsSchema>;

const useUserData = () => {
  const [loading, setLoading] = useState(true);
  const [currentUserDetails, setCurrentUserDetails] = useState<UserDetails>();
  const [fullName, setFullName] = useState<string>('');
  const [cpnzID, setCPNZID] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [callSign, setCallSign] = useState<string>('');
  const [patrolName, setPatrolName] = useState<string>('');
  const [policeStation, setPoliceStation] = useState<string>('');
  const [currentUserVehicles, setCurrentUserVehicles] = useState<
    VehicleDetails[]
  >([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetails | null>(
    null
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/getUserDetails`
        );

        const { userDetails, patrolDetails, vehicleDetails } = response.data;
        const parsedUserDetails = userDetailsSchema.parse(userDetails);
        const parsedVehicleDetails = vehicleDetailsSchema
          .array()
          .parse(vehicleDetails);
        setCurrentUserDetails(parsedUserDetails);
        setCallSign(userDetails.call_sign);
        setPatrolName(patrolDetails.name);
        setPoliceStation(userDetails.police_station.replace(/_/g, ' ')); // Replace enum underscores with space
        setEmail(userDetails.email);
        setCPNZID(userDetails.cpnz_id);
        setMobileNumber(userDetails.mobile_phone);
        setFullName(`${userDetails.first_names} ${userDetails.surname}`);

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

        setLoading(false);
      } catch (e) {
        console.log('Error: ', e);
      }
    };

    fetchUserData();
  }, []);

  return {
    loading,
    currentUserDetails,
    fullName,
    cpnzID,
    email,
    mobileNumber,
    callSign,
    patrolName,
    policeStation,
    selectedVehicle,
    currentUserVehicles,
  };
};

export default useUserData;
