import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUserRole = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/getUserDetails`);
        return response.data.userRole.officer_type;
    } catch (error) {
        console.error('Error fetching user role:', error);
    }
};

const useGetUserRole = () => {
    const {data: userRole, error, isLoading} = useQuery({
        queryKey: ['userRole'],
        queryFn: fetchUserRole,
    });

    return {
        userRole,
        error,
        isLoading,
    };
}

export default useGetUserRole;