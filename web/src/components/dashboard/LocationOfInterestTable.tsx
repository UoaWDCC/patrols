import { useEffect, useState } from 'react';
import axios from 'axios';
import { locationOfInterestSchema, userDetailsSchema } from '../../schemas';
import { z } from 'zod';
import AddLocationOfInterestModal from './AddLocationOfInterestModal';

type LocationOfInterestDetails = z.infer<typeof locationOfInterestSchema>;

const VehicleTable = () => {
    const [patrolId, setPatrolId] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [locationOfInterestData, setLocationOfInterest] = useState<LocationOfInterestDetails[]>([]);

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
        const getLocationOfInterestByPatrolId = async () => {
            if (!patrolId) return; // Ensure patrolId is not empty

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/location-of-interest/${patrolId}`);
                console.log('API Response:', response.data);
                const locationOfInterestData = locationOfInterestSchema.array().parse(response.data);
                setLocationOfInterest(locationOfInterestData);
            } catch (error) {
                console.error('Error fetching location of interest:', error);
            }
        };

        getLocationOfInterestByPatrolId();
    }, [patrolId]);

    const handleAddVehicle = async (newLocationOfInterest: LocationOfInterestDetails) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/location-of-interest`, newLocationOfInterest);
            const addedLocationOfInterest = response.data;
            setLocationOfInterest([...locationOfInterestData, addedLocationOfInterest]);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding vehicle:', error);
        }
    };

    const removeVehicle = async (id: string) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/location-of-interest/${id}`);
            setLocationOfInterest(prev => prev.filter(location_of_interest => location_of_interest.id !== id));
        } catch (error) {
            console.error('Error deleting vehicle:', error);
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
            <h2 className="text-center text-2xl font-bold my-4">Location Of Interest List</h2>
            <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
                onClick={openModal}
            >
                Add Vehicle
            </button>
            <table className="table-auto w-full border-collapse border border-gray-400">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-400 px-4 py-2">Start Time</th>
                        <th className="border border-gray-400 px-4 py-2">End Time</th>
                        <th className="border border-gray-400 px-4 py-2">Location</th>
                        <th className="border border-gray-400 px-4 py-2">Is Police Or Security Present</th>
                        <th className="border border-gray-400 px-4 py-2">Incident Category</th>
                        <th className="border border-gray-400 px-4 py-2">Incident Sub Category</th>
                        <th className="border border-gray-400 px-4 py-2">Description</th>
                        <th className="border border-gray-400 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {locationOfInterestData.map(location_of_interest => (
                        <tr key={location_of_interest.id}>
                            <td className="border border-gray-400 px-4 py-2">{location_of_interest.start_time}</td>
                            <td className="border border-gray-400 px-4 py-2">{location_of_interest.end_time}</td>
                            <td className="border border-gray-400 px-4 py-2">{location_of_interest.location}</td>
                            <td className="border border-gray-400 px-4 py-2">{location_of_interest.is_police_or_security_present ? 'Yes' : 'No'}</td>
                            <td className="border border-gray-400 px-4 py-2">{location_of_interest.incident_category}</td>
                            <td className="border border-gray-400 px-4 py-2">{location_of_interest.incident_sub_category}</td>
                            <td className="border border-gray-400 px-4 py-2">{location_of_interest.description}</td>
                            <td className="border border-gray-400 px-4 py-2">
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                                    onClick={() => removeVehicle(location_of_interest.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AddLocationOfInterestModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onAddVehicle={handleAddVehicle}
                patrolId={patrolId}
            />
        </div>
    );
};

export default VehicleTable;
