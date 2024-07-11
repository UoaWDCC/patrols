import axios from 'axios';
import React, { useState } from 'react';
import TextInputField from './TextInputField';
import CheckboxInputField from './CheckboxInputField';
import CancelButton from './CancelButton';
import SubmitButton from './SubmitButton';

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddVehicle: (newVehicle: any) => void;
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
                                    <TextInputField
                                        id="registrationNo"
                                        label="Registration No"
                                        placeholder="Enter registration number"
                                        value={registrationNo}
                                        onChange={(e) => setRegistrationNo(e.target.value)}
                                    />
                                    <TextInputField
                                        id="colour"
                                        label="Colour"
                                        placeholder="Enter colour"
                                        value={colour}
                                        onChange={(e) => setColour(e.target.value)}
                                    />
                                    <TextInputField
                                        id="model"
                                        label="Model"
                                        placeholder="Enter model"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                    />
                                    <TextInputField
                                        id="make"
                                        label="Make"
                                        placeholder="Enter make"
                                        value={make}
                                        onChange={(e) => setMake(e.target.value)}
                                    />
                                    <CheckboxInputField 
                                        id="hasLiveryOrSignage"
                                        label="Has Livery or Signage"
                                        checked={hasLiveryOrSignage}
                                        onChange={(e) => setHasLiveryOrSignage(e.target.checked)}
                                    />
                                    <CheckboxInputField 
                                        id="hasPoliceRadio"
                                        label="Has Police Radio"
                                        checked={hasPoliceRadio}
                                        onChange={(e) => setHasPoliceRadio(e.target.checked)}
                                    />
                                    <div className="flex items-center justify-end mt-6">
                                        <CancelButton onClick={onClose} />
                                        <SubmitButton label='Add Vehicle' />
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
