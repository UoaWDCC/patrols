import { useEffect, useState } from "react";
import axios from "axios";
import { userDetailsSchema, vehicleDetailsSchema } from "../../schemas";
import { z } from "zod";
import AddVehicleModal from "./AddVehicleModal"; // Adjust the import path as needed
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

type VehicleDetails = z.infer<typeof vehicleDetailsSchema>;

const VehicleTable = () => {
  const [patrolId, setPatrolId] = useState<string>("");
  const [vehicleData, setVehicleData] = useState<VehicleDetails[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const getVehicleByPatrolId = async () => {
      if (!patrolId) return;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/vehicle/${patrolId}`
        );
        const vehicleData = vehicleDetailsSchema.array().parse(response.data);
        setVehicleData(vehicleData);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    getVehicleByPatrolId();
  }, [patrolId]);

  const handleAddVehicle = async (newVehicle: VehicleDetails) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/vehicle`, newVehicle);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  const removeVehicle = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/vehicle/${id}`);
      setVehicleData((prev) => prev.filter((vehicle) => vehicle.id !== id));
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

  return (
    <div className="container mx-auto">
      <h2 className="text-center text-2xl font-bold mt-8">Vehicle List</h2>
      <div className="p-12 shadow-md mb-8 max-h-[400px] overflow-y-auto">
        <Table>
          <TableCaption>
            List of all vehicles registered in your patrol.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Registration No</TableHead>
              <TableHead>Colour</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Make</TableHead>
              <TableHead>Has Livery or Signage</TableHead>
              <TableHead>Has Police Radio</TableHead>
              <TableHead>Has Police selected</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicleData.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">
                  {vehicle.registration_no}
                </TableCell>
                <TableCell>{vehicle.colour}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.make}</TableCell>
                <TableCell>
                  {vehicle.has_livery_or_signage ? "Yes" : "No"}
                </TableCell>
                <TableCell>{vehicle.has_police_radio ? "Yes" : "No"}</TableCell>
                <TableCell>{vehicle.selected ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Button
                    variant={"destructive"}
                    className="text-[14px]"
                    onClick={() => removeVehicle(vehicle.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button className="bg-cpnz-blue-800 text-[14px]" onClick={openModal}>
        Add Vehicle
      </Button>

      <AddVehicleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddVehicle={handleAddVehicle}
        patrolId={patrolId}
      />
    </div>
  );
};

export default VehicleTable;
