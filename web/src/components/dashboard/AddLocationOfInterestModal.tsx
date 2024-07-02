import React, { useState } from 'react';
import { z } from 'zod';
import { locationOfInterestSchema } from '../../schemas';

type LocationOfInterestDetails = z.infer<typeof locationOfInterestSchema>;

interface AddLocationOfInterestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddVehicle: (newLocationOfInterest: LocationOfInterestDetails) => void;
    patrolId: string;
}

const AddLocationOfInterestModal: React.FC<AddLocationOfInterestModalProps> = ({ isOpen, onClose, onAddVehicle, patrolId }) => {
    const [newLocationOfInterest, setNewLocationOfInterest] = useState<LocationOfInterestDetails>({
        id: '',
        patrol_id: patrolId,
        start_time: '',
        end_time: '',
        location: '',
        is_police_or_security_present: false,
        incident_category: '',
        incident_sub_category: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement & HTMLTextAreaElement;
        setNewLocationOfInterest((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = () => {
        // Validate and add new location of interest
        try {
            const validatedData = locationOfInterestSchema.parse(newLocationOfInterest);
            onAddVehicle(validatedData);
        } catch (error) {
            console.error('Validation error:', error);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add New Location of Interest</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Start Time</label>
                        <input
                            type="datetime-local"
                            name="start_time"
                            value={newLocationOfInterest.start_time}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">End Time</label>
                        <input
                            type="datetime-local"
                            name="end_time"
                            value={newLocationOfInterest.end_time}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={newLocationOfInterest.location}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Is Police or Security Present?</label>
                        <input
                            type="checkbox"
                            name="is_police_or_security_present"
                            checked={newLocationOfInterest.is_police_or_security_present}
                            onChange={handleChange}
                            className="mr-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Incident Category</label>
                        <input
                            type="text"
                            name="incident_category"
                            value={newLocationOfInterest.incident_category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Incident Subcategory</label>
                        <input
                            type="text"
                            name="incident_sub_category"
                            value={newLocationOfInterest.incident_sub_category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Description</label>
                        <textarea
                            name="description"
                            value={newLocationOfInterest.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLocationOfInterestModal;
