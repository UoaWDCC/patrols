import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import useGetUserRole from '../hooks/useGetUserRole';

interface IChairmanProtectedRoute extends PropsWithChildren {}

export default function ChairmanProtectedRoute({ children }: IChairmanProtectedRoute) {
    const { userRole, error, isLoading } = useGetUserRole();
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        console.error('user role:', userRole);
        return <div>Error fetching user role</div>;
    }

    if (userRole !== "chairman") {
        return <Navigate to={'/home'} replace={true} />;
    }

    return children;
}
