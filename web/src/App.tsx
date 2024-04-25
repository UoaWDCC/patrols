import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import Home from "@pages/Home";
import Report from "@pages/Report";
import Logon from "@pages/Logon";

const router = createBrowserRouter([
  {
    path: "/logon",
    element: <Logon />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/report",
    element: <Report />,
  },
]);

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
