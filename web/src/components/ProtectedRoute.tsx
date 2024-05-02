import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

interface IProtectedRoutes extends PropsWithChildren {}

export default function ProtectedRoutes({ children }: IProtectedRoutes) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to={'/login'} replace={true} />; // Prevents user from navigating back if previously authenticated
    }

    return children;
}
