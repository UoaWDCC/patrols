import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

interface IProtectedRoutes extends PropsWithChildren {}

export default function ProtectedRoutes({ children }: IProtectedRoutes) {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login'), { replace: true }; // Prevents user from navigating back if previously authenticated
        }
    }, [navigate, user]);

    return children;
}
