import { FaChevronLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Report = () => {
    // Example usage of useAuth hook to check session
    const { user } = useAuth();

    if (!user) {
        return <Navigate to={'/'} />;
    }

    return (
        <div className="text-center h-[80vh] pt-24 flex flex-col justify-between items-center">
            <div>
                <h1 className="text-5xl font-bold mb-6">Report an Incident</h1>
                <h3></h3>
            </div>

            <div>
                <Link to="/">
                    <button className="flex items-center gap-4 border-b-2 border-green-200 hover:border-green-500 px-8 py-4 transition-all duration-300  shadow-sm hover:shadow-lg">
                        <FaChevronLeft size={12} /> Back
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Report;
