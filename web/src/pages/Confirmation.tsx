// Not currently in use 

import ReportFinishDetails from "@components/report/ReportFinishDetails";
import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { reportFormSchema } from "../schemas";
import { useState } from "react";
import { ChevronLeft} from "lucide-react";
import { useNavigate } from "react-router";
import BottomNavBar from '@components/BottomNavBar';
import { useForm } from "react-hook-form";

export default function Confirmation() {
  const navigate = useNavigate();

  const [endOdometer, setEndOdometer] = useState<string>(
    localStorage.getItem("endOdometer") || ""
  );
  const [debrief, setDebrief] = useState<string>(
    localStorage.getItem("debrief") || ""
  );

  const [formData, setFormData] = useState<z.infer<
    typeof reportFormSchema
  > | null>(null);

  const form = useForm<z.infer<typeof reportFormSchema>>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      endOdometer: endOdometer,
      debrief: debrief,
    },
  });

  const onSubmit = (data: z.infer<typeof reportFormSchema>) => {
    setFormData(data);
  };

  return (
    <div className="text-center min-h-screen relative bg-[#FFFFFF] max-w-3xl mx-auto">
      <div className="max-w-800 mx-auto px-14 my-8">
        <div className="flex items-center mt-16">
          <Button
            onClick={() => navigate(-1)}
            type="button"
            className="bg-[#EEF6FF] text-black shadow-md mr-4 text-base px-10 items-center py-6 hover:bg-cpnz-blue-900 hover:text-white" 
          >
            <ChevronLeft className="h-4 w-4"/> Back
          </Button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <ReportFinishDetails
                form={form}
                setDebrief={setDebrief}
                setEndOdometer={setEndOdometer}
              />
            </div>
          </form>
        </Form>
        <div>
          <button className="bg-[#FF8080] my-10 rounded-lg shadow-md p-4 w-full hover:bg-[#ff4d4d]">
            Submit Report & Log Off
          </button>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
}
