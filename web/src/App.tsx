import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import Home from "@pages/Home";
import Report from "@pages/Report";
import LogHome from "@pages/LogHome";
import Logon from "@pages/Logon";
import LogonTwo from "@pages/LogonTwo";
import Login from "@pages/Login";
import AuthProvider from "./providers/AuthProvider";
import ProtectedRoute from "@components/ProtectedRoute";
import ReportFormIntel from "@pages/ReportTwo";
import ReportFormObservation from "@pages/ReportThree";
import Profile from "@pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/LogHome",
    element: (
      <ProtectedRoute>
        <LogHome />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Report",
    element: (
      <ProtectedRoute>
        <Report />
      </ProtectedRoute>
    ),
  },
  {
    path: "/logon",
    element: (
      <ProtectedRoute>
        <Logon />
      </ProtectedRoute>
    ),
  },
  {
    path: "/logon-two",
    element: (
      <ProtectedRoute>
        <LogonTwo />
      </ProtectedRoute>
    ),
  },
  {
    path: "/report",
    element: (
      <ProtectedRoute>
        <Report />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ReportTwo",
    element: (
      <ProtectedRoute>
        <ReportFormIntel />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ReportThree",
    element: (
      <ProtectedRoute>
        <ReportFormObservation />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  // const { user } = useAuth();

  // console.log(1);

  // // Render the default page based on user authentication status
  // useEffect(() => {

  //   console.log(user)
  //     if (!user) {
  //       router.navigate("/login"); // Go to login page if user is not authenticated
  //     } else {
  //       router.navigate("/home"); // Go to home page if user is authenticated
  //     }
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
