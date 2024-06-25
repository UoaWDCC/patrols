import axios from "axios";
import { useEffect, useState } from "react";
import { userDetailsSchema, vehicleDetailsSchema } from "../../schemas";
import { z } from "zod";

type vehicleDetails = z.infer<typeof vehicleDetailsSchema>;

export default function VehicleTable() {
    const [patrolId, setPatrolId] = useState<Number>();
    const [vehicleData, setVehicleData] = useState<vehicleDetails[]>([]);

    useEffect(() => {
        const getPatrolLeadID = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/user/getUserDetails`
                );
            
                const userDetails = userDetailsSchema.parse(response.data);
                setPatrolId(Number(userDetails.patrol_id));
            } catch (error) {
                console.error("Error fetching patrol lead ID:", error);
            }
        }
    
        getPatrolLeadID();
      }, []);

      useEffect(() => {
        const getVehicleByPatrolId = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/vehicle/getVehicleByPatrolId/${patrolId}`
                );
            
                const vehicleData = vehicleDetailsSchema.array().parse(response.data);
                setVehicleData(vehicleData);
            } catch (error) {
                console.error("Error fetching vehicle data:", error);
            }
        };

        getVehicleByPatrolId();
      }, []);

      function removeVehicle(id: string) {
        axios.delete(`${import.meta.env.VITE_API_URL}/vehicle/deleteVehicle/${id}`)
        .then((response) => {
            console.log(response);
            setVehicleData(vehicleData.filter(vehicle => vehicle.id !== id));
        })
        .catch((error) => {
            console.error("Error deleting vehicle:", error);
        });
      };

      return (
        <div className="container">
            <h2 className="test-center">Vehicle List</h2>
            <button className="btn btn-primary">Add Vehicle</button>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Registration No</th>
                        <th>Colour</th>
                        <th>Model</th>
                        <th>Make</th>
                        <th>Has Livery or Signage</th>
                        <th>Has Police Radio</th>
                        <th>Selected</th>
                    </tr>
                </thead> 
                <tbody>
                    {vehicleData?.map(vehicle => (
                        <tr key={vehicle.id}>
                            <td>{vehicle.registration_no}</td>
                            <td>{vehicle.colour}</td>
                            <td>{vehicle.model}</td>
                            <td>{vehicle.make}</td>
                            <td>{vehicle.has_livery_or_signage}</td>
                            <td>{vehicle.has_police_radio}</td>
                            <td>{vehicle.selected}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => removeVehicle(vehicle.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      );
}