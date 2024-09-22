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
import useUserData from "../hooks/useUserData";
import axios from "axios";

export default function Report() {
  const [submitting, setSubmitting] = useState(false);

  const { currentUserDetails, shiftDetails } = useUserData();
  const [registrationInput, setRegistrationInput] = useState("");
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [openVehicleDialog, setOpenVehicleDialog] = useState<boolean>(false);
  const [vehicleNotFound, setVehicleNotFound] = useState<boolean>(false);

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
      weatherCondition: "wet",
      observations: observationsList,
      debrief: debrief,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
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

    // JSON.parse(localStorage.getItem("observations")!).forEach((o: any) => {
    //   formData.observations.push(o);
    //   console.log(formData.observations);
    // });

    const data = {
      email: currentUserDetails?.email,
      cpnzID: currentUserDetails?.cpnz_id,
      formData: {
        ...formData,
        memberId: currentUserDetails?.id,
        shiftId: shiftDetails?.id,
        vehicleId: "13",
        isFootPatrol: false,
      },
      statistics,
    };

    console.log(data);

    try {
      setSubmitting(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/logoff/`, {
        recipientEmail: "jasonabc0626@gmail.com",
        data,
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

  // Function to handle vehicle search
  const handleSearchRegistration = async () => {
    console.log("Searching for registration number:", registrationInput);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/stolen-vehicle/${registrationInput}`
      );
      setVehicleData(response.data); // Set the fetched vehicle data
      setVehicleNotFound(false); // Reset the not found flag
      setOpenVehicleDialog(true); // Open the dialog to show the vehicle data
    } catch (error) {
      setVehicleData(null); // Clear vehicle data if not found
      setVehicleNotFound(true); // Set the not found flag
      setOpenVehicleDialog(true); // Open the dialog to show the vehicle status
      axios.isAxiosError(error)
        ? console.log("Axios error:", error.response?.data.error)
        : console.error("Unexpected error during vehicle search:", error);
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto max-h-screen">
      <div className="bg-cpnz-blue-900 py-6 flex justify-between items-center px-8 rounded-b-2xl">
        <h1 className="text-xl font-bold text-white">Shift in progress</h1>
        <p className="text-sm text-white">
          Event number: {shiftDetails?.event_no}
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <ReportIntel form={form} setStartOdometer={setStartOdometer} />
            {/* <LocationOfInterestTable showActions={false} /> */}
            <ReportObservation
              form={form}
              fields={fields}
              setObservationsList={setObservationsList}
              append={append}
              remove={remove}
              update={update}
            />
            <div className="mt-8">
              <label className="block text-left font-semibold ml-1">
                Enter a Registration Number:
              </label>
              <div className="flex mt-2 h-12">
                <input
                  type="text"
                  className="font-light text-xs p-2 border border-gray-300 rounded-l-md w-full"
                  placeholder="Enter registration number"
                  value={registrationInput}
                  onChange={(e) => setRegistrationInput(e.target.value)}
                />
                <button 
                  type="button"
                  className="bg-cpnz-blue-900 text-white px-10 py-2 rounded-r-md hover:opacity-80 ml-2"
                  onClick={handleSearchRegistration}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <button 
            type="submit"
            className="bg-[#FF8080] my-10 rounded-lg shadow-md p-4 w-full hover:bg-[#ff4d4d]"
          >
            Submit Report & Log Off
          </button>
          <div>
            <Dialog open={openVehicleDialog} onOpenChange={setOpenVehicleDialog}>
              <DialogContent>
                <DialogDescription>
                  <div className="mt-4 p-4 rounded-md">
                  <h3 className="font-semibold text-[20px] text-black text-center my-4">Vehicle stolen status:</h3>
                  {vehicleData ? (
                    <>
                      <p className="text-center">Vehicle is stolen.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-center">This vehicle is not stolen.</p>
                    </>
                  )}
                  </div>
                </DialogDescription>
              </DialogContent>
            </Dialog>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger>
              </DialogTrigger>
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
