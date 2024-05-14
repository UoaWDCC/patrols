import { Link, useNavigate } from 'react-router-dom';
import { FaCog, FaClipboardList, FaCogs, FaPlus } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@components/ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { z } from 'zod';

const reportsDetailsSchema = z.object({
    message: z.string(),
    reports: z.array(z.string()),
});

type reportsDetails = z.infer<typeof reportsDetailsSchema>;

export default function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [data, setData] = useState<reportsDetails>();

    // Function to navigate to the logon page when new report button is clicked
    const handleNewReport = () => {
        navigate('/logon');
    };

    const { signOut } = useAuth();

    const handleSignOut = () => {
        signOut(); // Calls the signOut function when the sign out button is clicked
    }

    useEffect(() => {
        const getAllReports = async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/report/lead/${user?.id}`
            );
        
            const reportsData = reportsDetailsSchema.parse(response.data);
            setData(reportsData);
        };

        getAllReports();
    }, [])

    return (
        <div className="text-center min-h-screen relative bg-[#E6F0FF]">
            <div className="bg-[#1E3A8A] py-8 rounded-b-3xl flex flex-col justify-between">
                <div className="absolute top-4 right-4">
                    <FaCog className="text-2xl text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-300" />
                </div>
                <Link to="/another-page">
                    <div className="pl-4 pb-2 cursor-pointer">
                        <h1 className="text-xl font-bold text-white">
                            Welcome back, XXXXXX
                        </h1>
                    </div>
                </Link>
            </div>
            <div className="max-w-800 mx-auto px-4 my-8">
                <button
                    onClick={handleNewReport} // If user clicks log new report button, navigate to logon page
                    className="bg-[#334D92] w-full mx-auto px-8 py-8 mt-4 rounded-lg text-lg font-semibold flex items-center justify-center transition-all duration-300 hover:bg-[#243B73] text-white shadow-sm hover:shadow-lg"
                >
                    <FaPlus className="mr-2" /> Log a new report
                </button>
                <div className="grid grid-cols-2 mb-8 mt-8 gap-6">
                    <div className="bg-[#969696] text-white text-center p-8 rounded-lg flex items-center hover:bg-[#808080] transition-colors duration-300">
                        <FaClipboardList className="mr-12" />
                        <div>
                            <h3 className="text-lg font-semibold">
                                Past Reports
                            </h3>
                        </div>
                    </div>
                    <div className="bg-[#969696] text-white p-6 rounded-lg flex items-center hover:bg-[#808080] transition-colors duration-300">
                        <FaCogs className="mr-12" />
                        <div>
                            <h3 className="text-lg font-semibold">
                                Report Settings
                            </h3>
                        </div>
                    </div>
                </div>
                <div>
                    <Button onClick={handleSignOut} className='bg-cpnz-blue-900 h-12 hover:bg-cpnz-blue-800'>
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
}
