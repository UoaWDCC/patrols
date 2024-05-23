import ReportIntel from "@components/report/ReportIntel";
import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formObservationSchema, reportFormSchema } from "../schemas";
import { ReportObservation } from "@components/report/ReportObservation";
import { useState } from "react";

export default function Report() {
  const form = useForm<z.infer<typeof reportFormSchema>>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      startOdometer: 0,
      endOdometer: 0,
      weatherCondition: "",
      intel: undefined,
      observations: [],
    },
  });

  const [observationsList, setObservationsList] = useState<
    z.infer<typeof formObservationSchema>
  >([]);

  const onSubmit = () => {};

  return (
    <div className="relative bg-[#FFFFFF] max-w-3xl mx-auto">
      <div className="bg-[#1E3A8A] py-6 flex justify-between items-center px-8 rounded-b-3xl">
        <h1 className="text-xl font-bold text-white">Shift in progress</h1>
        <p className="text-sm text-white">Event number: #P23848457</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <ReportIntel />
            <ReportObservation
              form={form}
              observationsList={observationsList}
              setObservationsList={setObservationsList}
            />
          </div>
        </form>
      </Form>
      {/* <Button className="bg-cpnz-blue-800">Submit</Button> */}
    </div>
  );
}
