import axios from 'axios';
import React, { useState } from 'react';

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddVehicle: (newVehicle: any) => void; // Replace 'any' with the type of newVehicle
    patrolId: string;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose, onAddVehicle, patrolId }) => {
    const [registrationNo, setRegistrationNo] = useState('');
    const [colour, setColour] = useState('');
    const [model, setModel] = useState('');
    const [make, setMake] = useState('');
    const [hasLiveryOrSignage, setHasLiveryOrSignage] = useState(false);
    const [hasPoliceRadio, setHasPoliceRadio] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newVehicle = {
            patrol_id: patrolId,
            registration_no: registrationNo,
            colour: colour,
            model: model,
            make: make,
            has_livery_or_signage: hasLiveryOrSignage,
            has_police_radio: hasPoliceRadio,
            selected: false, // You may set other default values as needed
        };
        console.log('newVehicle:', newVehicle);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/vehicle`, newVehicle);
            const addedVehicle = response.data;
            onAddVehicle(addedVehicle);
            onClose();
        } catch (error) {
            console.error('Error adding vehicle:', error);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div className="relative w-auto max-w-lg mx-auto my-6">
                        <div className="relative flex flex-col bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
                                <h3 className="text-3xl font-semibold">Add Vehicle</h3>
                                <button
                                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    onClick={onClose}
                                >
                                    <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                                </button>
                            </div>
                            <div className="relative p-6 flex-auto">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="registrationNo" className="block text-sm font-medium text-gray-700">Registration No</label>
                                        <input
                                            type="text"
                                            id="registrationNo"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Enter registration number"
                                            value={registrationNo}
                                            onChange={(e) => setRegistrationNo(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="colour" className="block text-sm font-medium text-gray-700">Colour</label>
                                        <input
                                            type="text"
                                            id="colour"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Enter colour"
                                            value={colour}
                                            onChange={(e) => setColour(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                                        <input
                                            type="text"
                                            id="model"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Enter model"
                                            value={model}
                                            onChange={(e) => setModel(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="make" className="block text-sm font-medium text-gray-700">Make</label>
                                        <input
                                            type="text"
                                            id="make"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Enter make"
                                            value={make}
                                            onChange={(e) => setMake(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <div className="flex items-center">
                                            <input
                                                id="hasLiveryOrSignage"
                                                type="checkbox"
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                checked={hasLiveryOrSignage}
                                                onChange={(e) => setHasLiveryOrSignage(e.target.checked)}
                                            />
                                            <label htmlFor="hasLiveryOrSignage" className="ml-2 block text-sm text-gray-900">Has Livery or Signage</label>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <div className="flex items-center">
                                            <input
                                                id="hasPoliceRadio"
                                                type="checkbox"
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                checked={hasPoliceRadio}
                                                onChange={(e) => setHasPoliceRadio(e.target.checked)}
                                            />
                                            <label htmlFor="hasPoliceRadio" className="ml-2 block text-sm text-gray-900">Has Police Radio</label>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end mt-6">
                                        <button
                                            type="button"
                                            className="mr-3 px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
                                        >
                                            Add Vehicle
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className={`${isOpen ? 'opacity-25 fixed inset-0 z-40 bg-black' : 'hidden'}`}></div>
        </>
    );
};

export default AddVehicleModal;
