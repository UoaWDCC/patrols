import axios from "axios";
import { useEffect, useState } from "react";
import { userDetailsSchema, vehicleDetailsSchema } from "../../schemas";
import { z } from "zod";

type vehicleDetails = z.infer<typeof vehicleDetailsSchema>;

export default function VehicleTable() {
    const [patrolId, setPatrolId] = useState<string>();
    const [vehicleData, setVehicleData] = useState<vehicleDetails[]>([]);

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
        }
    
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

      function removeVehicle(id: string) {
        axios.delete(`${import.meta.env.VITE_API_URL}/vehicle/${id}`)
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
                            <td>{vehicle.has_livery_or_signage ? "Yes" : "No"}</td>
                            <td>{vehicle.has_police_radio ? "Yes" : "No"}</td>
                            <td>{vehicle.selected ? "Yes" : "No"}</td>
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