import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import Home from "@pages/Home";
import Report from "@pages/Report";
import ReportTwo from "@pages/ReportTwo";
import ReportThree from "@pages/ReportThree";
import LogHome from "@pages/LogHome";
import Logon from "@pages/Logon";
import LogonTwo from "@pages/LogonTwo";
import Login from "@pages/Login";
import Profile from '@pages/Profile';
import AuthProvider from "./providers/AuthProvider";
import ProtectedRoute from '@components/ProtectedRoute';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        ),
    },
    {
        path: '/home',
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        ),
    },
    {
        path: '/LogHome',
        element: (
            <ProtectedRoute>
                <LogHome />
            </ProtectedRoute>
        ),
    },
    {
        path: '/Report',
        element: (
            <ProtectedRoute>
                <Report />
            </ProtectedRoute>
        ),
    },
    {
        path: '/ReportTwo',
        element: (
            <ProtectedRoute>
                <ReportTwo />
            </ProtectedRoute>
        ),
    },
    {
        path: '/ReportThree',
        element: (
            <ProtectedRoute>
                <ReportTwo />
            </ProtectedRoute>
        ),
    },
    {
        path: '/logon',
        element: (
            <ProtectedRoute>
                <Logon />
            </ProtectedRoute>
        ),
    },
    {
        path: '/logon-two',
        element: (
            <ProtectedRoute>
                <LogonTwo />
            </ProtectedRoute>
        ),
    },
    {
        path: '/profile',
        element: (
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        ),
    },
    {
        path: '/login',
        element: <Login />,
    },
]);

export default function App() {
    const [queryClient] = useState(() => new QueryClient());
    
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </QueryClientProvider>
    );
}
