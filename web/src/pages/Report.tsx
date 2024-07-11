import ReportIntel from "@components/report/ReportIntel";
import { Form } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { formObservationSchema, reportFormSchema } from "../schemas";
import { ReportObservation } from "@components/report/ReportObservation";
import { useState } from "react";
import ReportFinishDetails from "@components/report/ReportFinishDetails";
import { ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@components/ui/dialog";
import LocationOfInterestTable from "@components/dashboard/LocationOfInterestTable";
import useUserData from "../hooks/useUserData";
import axios from "axios";

export default function Report() {
  const [submitting, setSubmitting] = useState(false);

  const { currentUserDetails, shiftDetails } = useUserData();

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
    localStorage.getItem("endOdometer") || "1000"
  );
  const [debrief, setDebrief] = useState<string>(
    localStorage.getItem("debrief") || "message"
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

  const handleConfirmSubmit = async () => {
    if (!formData) return;

    console.log("form is submitting");

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

    try {
      setSubmitting(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/logoff/`, {
        recipientEmail: "jasonabc0626@gmail.com",

        email: currentUserDetails?.email,
        cpnzID: currentUserDetails?.cpnz_id,
        formData,
        statistics,
      });
      console.log(formData, statistics);
      setSubmitting(false);

      localStorage.removeItem("observations");
      localStorage.removeItem("startOdometer");
      localStorage.removeItem("endOdometer");
      localStorage.removeItem("debrief");

      form.reset();
      setOpenDialog(false);
      navigate("/home");
    } catch (error) {
      axios.isAxiosError(error)
        ? console.log(error.response?.data.error)
        : console.error("Unexpected error during logoff:", error);
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto max-h-screen">
      <div className="bg-[#1E3A8A] py-6 flex justify-between items-center px-8 rounded-b-3xl">
        <h1 className="text-xl font-bold text-white">Shift in progress</h1>
        <p className="text-sm text-white">
          Event number: {shiftDetails?.event_no}
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <ReportIntel form={form} setStartOdometer={setStartOdometer} />
            <LocationOfInterestTable showActions={false} />
            <ReportObservation
              form={form}
              fields={fields}
              setObservationsList={setObservationsList}
              append={append}
              remove={remove}
            />
            <button className="bg-[#FF8080] my-10 rounded-lg shadow-md p-4 w-full hover:bg-[#ff4d4d]">
              Submit Report & Log Off
            </button>
          </div>

          <div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger></DialogTrigger>
              <DialogContent>
                <DialogDescription className="flex justify-center">
                  <div>
                    <ReportFinishDetails
                      form={form}
                      setDebrief={setDebrief}
                      setEndOdometer={setEndOdometer}
                    />

                    <button
                      onClick={handleConfirmSubmit}
                      className="bg-[#FF8080] flex gap-4 items-center justify-center font-semibold text-[16px] text-black my-10 rounded-lg shadow-md p-4 w-full hover:bg-[#ff4d4d]"
                    >
                      {submitting ? (
                        <p className="flex gap-4">
                          Submitting <Loader2 className="animate-spin" />
                        </p>
                      ) : (
                        <p className="flex gap-4">
                          {" "}
                          Submit Report & Log Off <ChevronRight />
                        </p>
                      )}{" "}
                    </button>
                  </div>
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </Form>
    </div>
  );
}
