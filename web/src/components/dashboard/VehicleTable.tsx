import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { userDetailsSchema, vehicleDetailsSchema } from '../../schemas';
import { z } from 'zod';
import AddVehicleModal from './AddVehicleModal'; // Adjust the import path as needed

type VehicleDetails = z.infer<typeof vehicleDetailsSchema>;

const VehicleTable = () => {
    const [patrolId, setPatrolId] = useState<string>('');
    const [vehicleData, setVehicleData] = useState<VehicleDetails[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const getPatrolLeadID = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/getUserDetails`);
                const userDetails = userDetailsSchema.parse(response.data.userDetails);
                setPatrolId(String(userDetails.patrol_id));
            } catch (error) {
                console.error('Error fetching patrol lead ID:', error);
            }
        };

        getPatrolLeadID();
    }, []);

    useEffect(() => {
        const getVehicleByPatrolId = async () => {
            if (!patrolId) return;
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/vehicle/${patrolId}`);
                const vehicleData = vehicleDetailsSchema.array().parse(response.data);
                setVehicleData(vehicleData);
            } catch (error) {
                console.error('Error fetching vehicle data:', error);
            }
        };

        getVehicleByPatrolId();
    }, [patrolId]);

    const handleAddVehicle = async (newVehicle: VehicleDetails) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/vehicle`, newVehicle);
            const addedVehicle = response.data;
            setVehicleData([...vehicleData, addedVehicle]);
            setIsModalOpen(false); // Close modal after adding vehicle
        } catch (error) {
            console.error('Error adding vehicle:', error);
        }
    };

    const removeVehicle = (id: string) => {
        axios.delete(`${import.meta.env.VITE_API_URL}/vehicle/${id}`)
            .then(() => {
                setVehicleData(vehicleData.filter(vehicle => vehicle.id !== id));
            })
            .catch((error) => {
                console.error('Error deleting vehicle:', error);
            });
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-center text-2xl font-bold my-4">Vehicle List</h2>
            <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
                onClick={openModal}
            >
                Add Vehicle
            </button>
            <table className="table-auto w-full border-collapse border border-gray-400">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-400 px-4 py-2">Registration No</th>
                        <th className="border border-gray-400 px-4 py-2">Colour</th>
                        <th className="border border-gray-400 px-4 py-2">Model</th>
                        <th className="border border-gray-400 px-4 py-2">Make</th>
                        <th className="border border-gray-400 px-4 py-2">Has Livery or Signage</th>
                        <th className="border border-gray-400 px-4 py-2">Has Police Radio</th>
                        <th className="border border-gray-400 px-4 py-2">Selected</th>
                        <th className="border border-gray-400 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicleData.map(vehicle => (
                        <tr key={vehicle.id}>
                            <td className="border border-gray-400 px-4 py-2">{vehicle.registration_no}</td>
                            <td className="border border-gray-400 px-4 py-2">{vehicle.colour}</td>
                            <td className="border border-gray-400 px-4 py-2">{vehicle.model}</td>
                            <td className="border border-gray-400 px-4 py-2">{vehicle.make}</td>
                            <td className="border border-gray-400 px-4 py-2">{vehicle.has_livery_or_signage ? 'Yes' : 'No'}</td>
                            <td className="border border-gray-400 px-4 py-2">{vehicle.has_police_radio ? 'Yes' : 'No'}</td>
                            <td className="border border-gray-400 px-4 py-2">{vehicle.selected ? 'Yes' : 'No'}</td>
                            <td className="border border-gray-400 px-4 py-2">
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                                    onClick={() => removeVehicle(vehicle.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
