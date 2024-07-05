import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchLocationOfInterestByPatrolId = async (id: String) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/location-of-interest/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching location of interest:', error);
    }
};

const useGetLocationOfInterestByPatrolId = (id: String) => {
    const {data: locationOfInterest, error, isLoading} = useQuery({
        queryKey: ['location-of-interest'],
        queryFn: () => fetchLocationOfInterestByPatrolId(id),
    });

    return {
        locationOfInterest,
        error,
        isLoading,
    };
}

export default useGetLocationOfInterestByPatrolId;