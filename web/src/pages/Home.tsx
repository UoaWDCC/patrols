import { Link, useNavigate } from 'react-router-dom';
import { FaCog, FaClipboardList, FaCogs, FaPlus } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@components/ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@components/ui/dialog';
import { userDetailsSchema } from '../schemas';


const reportsDetailsSchema = z.object({
    message: z.string(),
    reports: z.array(z.object({
        id: z.number(),
        title: z.string(),
        createdAt: z.string(),
        location: z.string(),
        patrolID: z.number(),
        reportIncidentType: z.string() 
    })),
});

type reportsDetails = z.infer<typeof reportsDetailsSchema>;

export default function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [data, setData] = useState<reportsDetails>();
    const [id, setId] = useState<number>();

    // Function to navigate to the logon page when new report button is clicked
    const handleNewReport = () => {
        navigate('/logon');
    };

    const { signOut } = useAuth();

    const handleSignOut = () => {
        signOut(); // Calls the signOut function when the sign out button is clicked
    }

    useEffect(() => {
        const getPatrolLeadID = async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/user/getUserDetails`
            );
        
            const userDetails = userDetailsSchema.parse(response.data);
            setId(Number(userDetails.id))
        };

        getPatrolLeadID();
    })

    useEffect(() => {
        const getAllReports = async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/report/lead/${id}`
            );
        
            const reportsData = reportsDetailsSchema.parse(response.data);
            setData(reportsData);
        };

        if (id !== undefined) {
            getAllReports()
        }
    }, [id])

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
                    <Dialog>              
                        <DialogTrigger className='text-lg font-semibold bg-[#969696] text-white text-center p-8 rounded-lg flex items-center hover:bg-[#808080] transition-colors duration-300'>
                        <FaClipboardList className="mr-12" />Past Reports</DialogTrigger>
                        <DialogContent className='p-8'>
                            <DialogHeader>
                            <DialogTitle className='text-center text-subheading pb-12'>All Reports</DialogTitle>
                            <DialogDescription>
                                {data == null ? 
                                    <div>
                                        No reports found
                                    </div> : 
                                    <div className='flex flex-col w-full gap-8'>
                                        {data.reports.map((d) => (
                                            <div key={d.id} className='flex-1 border-2 border-zinc-400 rounded-lg shadow-md px-6 py-4'>
                                                <h3 className='text-lg font-semibold'>
                                                    {d.title}
                                                </h3>
                                                <p>Location: {d.location}</p>
                                                <p>Type: {d.reportIncidentType}</p>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
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
