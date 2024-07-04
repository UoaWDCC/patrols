import axios from 'axios';
import React, { useState } from 'react';
import TextInputField from './TextInputField';
import CheckboxInputField from './CheckboxInputField';
import CancelButton from './CancelButton';
import SubmitButton from './SubmitButton';
import DateTimeInputField from './DateTimeInputField';

interface AddLocationOfInterestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddLocationOfInterest: (newLocationOfInterest: any) => void;
    patrolId: string;
}

const AddLocationOfInterestModal: React.FC<AddLocationOfInterestModalProps> = ({ isOpen, onClose, onAddLocationOfInterest, patrolId }) => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    const [isPoliceOrSecurityPresent, setIsPoliceOrSecurityPresent] = useState(false);
    const [incidentCategory, setIncidentCategory] = useState('');
    const [incidentSubCategory, setIncidentSubCategory] = useState('');       
    const [description, setDesciption] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newLocationOfInterest = {
            patrol_id: patrolId,
            start_time: startTime,
            end_time: endTime,
            location: location,
            is_police_or_security_present: isPoliceOrSecurityPresent,
            incident_category: incidentCategory,
            incident_sub_category: incidentSubCategory,
            description: description,
        };
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/location-of-interest`, newLocationOfInterest);
            const addedLocationOfInterest = response.data;
            onAddLocationOfInterest(addedLocationOfInterest);
            onClose();
        } catch (error) {
            console.error('Error adding location of interest:', error);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div className="relative w-auto max-w-lg mx-auto my-6">
                        <div className="relative flex flex-col bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
                                <h3 className="text-3xl font-semibold">Add Location Of Interest</h3>
                                <button
                                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    onClick={onClose}
                                >
                                    <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                                </button>
                            </div>
                            <div className="relative p-6 flex-auto">
                                <form onSubmit={handleSubmit}>
                                    <DateTimeInputField 
                                        name="startTime"
                                        label="Start Time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                    <DateTimeInputField
                                        name="endTime"
                                        label="End Time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                    <TextInputField
                                        id="location"
                                        label="Location"
                                        placeholder="Enter location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                    <CheckboxInputField 
                                        id="isPoliceOrSecurityPresent"
                                        label="Is Police or Security Present"
                                        checked={isPoliceOrSecurityPresent}
                                        onChange={(e) => setIsPoliceOrSecurityPresent(e.target.checked)}
                                    />
                                    <TextInputField
                                        id="incidentCategory"
                                        label="Incident Category"
                                        placeholder="Enter incident category"
                                        value={incidentCategory}
                                        onChange={(e) => setIncidentCategory(e.target.value)}
                                    />
                                    <TextInputField
                                        id="incidentSubCategory"
                                        label="Incident Sub Category"
                                        placeholder="Enter incident sub category"
                                        value={incidentSubCategory}
                                        onChange={(e) => setIncidentSubCategory(e.target.value)}
                                    />
                                    <TextInputField
                                        id="description"
                                        label="Description"
                                        placeholder="Enter description"
                                        value={description}
                                        onChange={(e) => setDesciption(e.target.value)}
                                    />
                                    <div className="flex items-center justify-end mt-6">
                                        <CancelButton onClick={onClose} />
                                        <SubmitButton label='Add Location Of Interest' />
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

export default AddLocationOfInterestModal;
