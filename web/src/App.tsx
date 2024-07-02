import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import Home from "@pages/Home";
import Report from "@pages/Report";
import LogHome from "@pages/LogHome";
import Logon from "@pages/Logon";
import Login from "@pages/Login";
import AuthProvider from "./providers/AuthProvider";
import ProtectedRoute from "@components/ProtectedRoute";
import Profile from "@pages/Profile";
import Confirmation from "@pages/Confirmation";

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
    path: "/logon",
    element: (
      <ProtectedRoute>
        <Logon />
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
  {
    path: "/confirmation",
    element: <Confirmation />,
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
