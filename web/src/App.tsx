import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import Home from "@pages/Home";
import Report from "@pages/Report";
import LogHome from "@pages/LogHome";
import Logon from "@pages/Logon";
import LogonTwo from "@pages/LogonTwo";
import AuthProvider from "./providers/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/",
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
