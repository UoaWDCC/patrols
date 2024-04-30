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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/LogHome",
    element: <LogHome />,
  },
  {
    path: "/Report",
    element: <Report />,
  },
  {
    path: "/logon",
    element: <Logon />,
  },
  {
    path: "/logon-two",
    element: <LogonTwo />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default function App() {
    const [queryClient] = useState(() => new QueryClient());
    // const { user } = useAuth();
  
    // // Render the default page based on user authentication status
    // useEffect(() => {
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
