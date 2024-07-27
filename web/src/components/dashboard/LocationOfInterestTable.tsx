import { useEffect, useState } from "react";
import axios from "axios";
import { locationOfInterestSchema, userDetailsSchema } from "../../schemas";
import { z } from "zod";
import AddLocationOfInterestModal from "./AddLocationOfInterestModal";
import { formatDate } from "@utils/formateDate";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Button } from "@components/ui/button";

interface LocationOfInterTableProps {
  showActions: boolean;
}

type LocationOfInterestDetails = z.infer<typeof locationOfInterestSchema>;

const LocationOfInteretTable: React.FC<LocationOfInterTableProps> = ({
  showActions,
}) => {
  const [patrolId, setPatrolId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationOfInterestData, setLocationOfInterest] = useState<
    LocationOfInterestDetails[]
  >([]);

  useEffect(() => {
    const getPatrolLeadID = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/getUserDetails`
        );
        const userDetails = userDetailsSchema.parse(response.data.userDetails);
        setPatrolId(String(userDetails.patrol_id));
      } catch (error) {
        console.error("Error fetching patrol lead ID:", error);
      }
    };

    getPatrolLeadID();
  }, []);

  useEffect(() => {
    const getLocationOfInterestByPatrolId = async () => {
      if (!patrolId) return; // Ensure patrolId is not empty

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/location-of-interest/${patrolId}`
        );
        console.log("API Response:", response.data);
        const locationOfInterestData = locationOfInterestSchema
          .array()
          .parse(response.data);
        setLocationOfInterest(locationOfInterestData);
      } catch (error) {
        console.error("Error fetching location of interest:", error);
      }
    };

    getLocationOfInterestByPatrolId();
  }, [patrolId]);

  const handleAddVehicle = async (
    newLocationOfInterest: LocationOfInterestDetails
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/location-of-interest`,
        newLocationOfInterest
      );
      const addedLocationOfInterest = response.data;
      setLocationOfInterest([
        ...locationOfInterestData,
        addedLocationOfInterest,
      ]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  const removeVehicle = async (id: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/location-of-interest/${id}`
      );
      setLocationOfInterest((prev) =>
        prev.filter((location_of_interest) => location_of_interest.id !== id)
      );
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!locationOfInterestData.length && !showActions) {
    return null; // Render nothing if data is empty and showActions is false
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-center text-2xl font-bold my-4">
        Location Of Interest
      </h2>
      <div className="p-12 shadow-md mb-8 max-h-[400px] overflow-y-auto">
        <Table className="">
          <TableCaption>
            List of all locations of interests in your patrol
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Is Police Or Security Present</TableHead>
              <TableHead>Incident Category</TableHead>
              <TableHead>Incident Sub Category</TableHead>
              <TableHead>Description</TableHead>
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {locationOfInterestData.map((location_of_interest) => (
              <TableRow key={location_of_interest.id}>
                <TableCell>
                  {formatDate(location_of_interest.start_time)}
                </TableCell>
                <TableCell>
                  {formatDate(location_of_interest.end_time)}
                </TableCell>
                <TableCell>{location_of_interest.location}</TableCell>
                <TableCell>
                  {location_of_interest.is_police_or_security_present
                    ? "Yes"
                    : "No"}
                </TableCell>
                <TableCell>{location_of_interest.incident_category}</TableCell>
                <TableCell>
                  {location_of_interest.incident_sub_category}
                </TableCell>
                <TableCell>{location_of_interest.description}</TableCell>
                {showActions && (
                  <TableCell>
                    <Button
                      variant={"destructive"}
                      className="text-[14px]"
                      onClick={() => removeVehicle(location_of_interest.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showActions && (
        <Button className="bg-cpnz-blue-800 text-[14px]" onClick={openModal}>
          Add Location of Interest
        </Button>
      )}

      {showActions && (
        <AddLocationOfInterestModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddLocationOfInterest={handleAddVehicle}
          patrolId={patrolId}
        />
      )}
    </div>
  );
};

export default LocationOfInteretTable;
