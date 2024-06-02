import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        <Loader2 className="animate-spin" />
        <p>Loading...</p>
      </div>
    </div>
  );
}
