import ReportIntel from "@components/report/ReportIntel";
import { Form } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { formObservationSchema, reportFormSchema } from "../schemas";
import { ReportObservation } from "@components/report/ReportObservation";
import { useState } from "react";
import { useNavigate } from "react-router";
import BottomNavBar from '@components/BottomNavBar';
import { Button } from "@components/ui/button";
import { ChevronLeft} from "lucide-react";

export default function Report() {
  const navigate = useNavigate();
  const handleConfirmation = () => {
    navigate("/confirmation");
  }
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
    <div className="text-center min-h-screen relative bg-[#FFFFFF] max-w-3xl mx-auto">
      <div className="bg-white pt-14 pb-4 flex flex-col items-start px-8">
          <h1 className="text-xl font-bold text-black mx-4">
            Welcome, <span className="underline">XXXXXXX</span>
          </h1>
          <p className="text-left mx-4 mt-2">
            Event ID: xxxxxxxxxx
          </p>
      </div>
      <div className="max-w-800 mx-auto px-14 my-8">
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
            </div>
          </form>
        </Form>
        <button className="bg-[#FF8080] my-10 rounded-lg shadow-md p-4 w-full hover:bg-[#ff4d4d]"
        onClick={handleConfirmation}
        >
          Submit Report & Log Off
        </button>
      </div>
      <BottomNavBar />
    </div>
  );
}
