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
  DialogDescription,
} from "@components/ui/dialog";

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
  const [endOdometer, setEndOdometer] = useState<string>(
    localStorage.getItem("endOdometer") || ""
  );
  const [debrief, setDebrief] = useState<string>(
    localStorage.getItem("debrief") || ""
  );

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [formData, setFormData] = useState<z.infer<
    typeof reportFormSchema
  > | null>(null);

  const form = useForm<z.infer<typeof reportFormSchema>>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      startOdometer: startOdometer,
      endOdometer: endOdometer,
      weatherCondition: "",
      intel: undefined,
      observations: observationsList,
      debrief: debrief,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "observations",
  });

  const onSubmit = (data: z.infer<typeof reportFormSchema>) => {
    setFormData(data);
    setOpenDialog(true);
  };

  const handleConfirmSubmit = () => {
    if (!formData) return;

    const [
      kmTravelled,
      vehicleIncidents,
      personIncidents,
      propertyIncidents,
      willfulDamageIncidents,
      otherIncidents,
    ] = [
      parseInt(formData.endOdometer) - parseInt(formData.startOdometer),
      ...["vehicle", "people", "property", "willful damage", "other"].map(
        (category) =>
          formData.observations.filter(
            (o) => o.category.toString() === category
          ).length
      ),
    ];
    const totalIncidents =
      vehicleIncidents +
      personIncidents +
      propertyIncidents +
      willfulDamageIncidents +
      otherIncidents;

    const statistics = {
      kmTravelled,
      vehicleIncidents,
      personIncidents,
      propertyIncidents,
      willfulDamageIncidents,
      totalIncidents,
      otherIncidents,
    };
    console.log(formData, statistics);

    localStorage.removeItem("observations");
    localStorage.removeItem("startOdometer");
    localStorage.removeItem("endOdometer");
    localStorage.removeItem("debrief");

    form.reset();
    setOpenDialog(false);
    navigate("/logHome");
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
              setObservationsList={setObservationsList}
              append={append}
              remove={remove}
            />
            <ReportFinishDetails
              form={form}
              setDebrief={setDebrief}
              setEndOdometer={setEndOdometer}
            />
          </div>

          <div className="flex justify-between mt-16 pb-12">
            <Button
              variant={"outline"}
              onClick={() => navigate(-1)}
              type="button"
            >
              <ChevronLeft />
            </Button>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger></DialogTrigger>
              <DialogContent className="text-center flex flex-col gap-24 p-12">
                <DialogHeader className="text-lg text-center font-semibold">
                  Please double check your information before submitting
                </DialogHeader>
                <DialogDescription className="flex justify-center">
                  <Button
                    className="flex gap-4 px-6 items-center justify-center bg-cpnz-blue-800"
                    onClick={handleConfirmSubmit}
                  >
                    Confirm Submit <ChevronRight />
                  </Button>
                </DialogDescription>
              </DialogContent>
            </Dialog>
            <Button className="bg-cpnz-blue-800" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
