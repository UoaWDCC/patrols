import ReportIntel from "@components/report/ReportIntel";
import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { formObservationSchema, reportFormSchema } from "../schemas";
import { ReportObservation } from "@components/report/ReportObservation";
import { useState } from "react";
import ReportFinishDetails from "@components/report/ReportFinishDetails";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function Report() {
  const navigate = useNavigate();
  const [observationsList, setObservationsList] = useState<
    z.infer<typeof formObservationSchema>
  >(
    localStorage.getItem("observations")
      ? JSON.parse(localStorage.getItem("observations")!)
      : []
  );

  const [startOdometer, setStartOdometer] = useState<string>(
    localStorage.getItem("startOdometer") || ""
  );

  const form = useForm<z.infer<typeof reportFormSchema>>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      startOdometer: startOdometer || "",
      endOdometer: "",
      weatherCondition: "",
      intel: undefined,
      observations: observationsList || [],
      debrief: "",
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "observations",
  });

  const onSubmit = (data: z.infer<typeof reportFormSchema>) => {
    data.observations = observationsList;
    console.log(data);
  };

  return (
    <div className="relative max-w-3xl mx-auto max-h-screen">
      <div className="bg-[#1E3A8A] py-6 flex justify-between items-center px-8 rounded-b-3xl">
        <h1 className="text-xl font-bold text-white">Shift in progress</h1>
        <p className="text-sm text-white">Event number: #P23848457</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <ReportIntel form={form} setStartOdometer={setStartOdometer} />
            <ReportObservation
              form={form}
              fields={fields}
              observationsList={observationsList}
            />
            <ReportFinishDetails form={form} />
          </div>

          <div className="flex justify-between mt-16 pb-12">
            <Button variant={"outline"} onClick={() => navigate(-1)}>
              <ChevronLeft />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-cpnz-blue-800">Submit</Button>
              </DialogTrigger>
              <DialogContent className="text-center flex flex-col gap-24 p-12">
                <DialogHeader className="text-lg text-center font-semibold">
                  Please double check your information because submitting
                </DialogHeader>
                <DialogDescription className="flex justify-center">
                  <Button
                    className="flex gap-4 px-6 items-center justify-center bg-cpnz-blue-800"
                    onClick={() => navigate("/logHome")}
                  >
                    Confirm Submit <ChevronRight />
                  </Button>
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </Form>
    </div>
  );
}
