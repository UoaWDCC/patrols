import { Button } from "@components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { z } from "zod";
import { formObservationSchema, reportFormSchema } from "../../schemas";
import { UseFormReturn } from "react-hook-form";
import useCurrentLocation from "../../hooks/useCurrentLocation";
import plus from "../../assets/images/plus2.png";
import { Textarea } from "@components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@components/ui/dialog";
import { useState } from "react";

interface ReportObservationProps {
  form: UseFormReturn<z.infer<typeof reportFormSchema>>;
  fields: Observation[];
  setObservationsList: (value: z.infer<typeof formObservationSchema>) => void;
  append: any;
  remove: any;
}

type Observation = z.infer<typeof formObservationSchema>[number];

enum type {
  observation = "observation",
  intel = "intel",
}

const observationCategories = [
  "",
  "vehicle",
  "people",
  "property",
  "willful damage",
  "other",
];

const deleteObservation = (
  i: number,
  fields: Observation[],
  setFields: any,
  remove: any
) => {
  const updatedFields = [...fields]; // Create a copy of the fields array
  updatedFields.splice(i, 1); // Delete the observation at index i
  remove(i);
  setFields(updatedFields); // Update the state with the updated fields array
  localStorage.setItem("observations", JSON.stringify(updatedFields)); // Update localStorage as well
};

const addObservation = (
  newObservation: Observation,
  fields: Observation[],
  setFields: any,
  append: any
) => {
  const updatedFields = [...fields, newObservation];
  setFields(updatedFields);
  append(newObservation);
  localStorage.setItem("observations", JSON.stringify(updatedFields)); // Update localStorage as well
};

const ReportObservation = ({
  form,
  fields,
  setObservationsList,
  append,
  remove,
}: ReportObservationProps) => {
  const { address } = useCurrentLocation();
  const date = new Date();
  let parsedDate = "";
  if (date.getMinutes() < 10) {
    parsedDate = date.getHours() + ":0" + date.getMinutes();
  } else {
    parsedDate = date.getHours() + ":" + date.getMinutes();
  }
  const [newObservation, setNewObservation] = useState<Observation>({
    location: address,
    description: "",
    time: parsedDate,
    category: "",
    type: type.observation,
    displayed: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: keyof Observation) => {
    setNewObservation({
      ...newObservation,
      [field]: e.target.value,
    });
  };

  const handleAddObservation = () => {
    if (
      newObservation.location &&
      newObservation.category &&
      newObservation.description
    ) {
      addObservation(newObservation, fields, setObservationsList, append);
      setNewObservation({
        location: address,
        description: "",
        time: parsedDate,
        category: "",
        type: type.observation,
        displayed: true,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <div className="my-4">
          <h2 className="text-left font-semibold text-base">Observations</h2>
          <Button
            className="mt-2 w-full bg-[#038400] p-7 items-center flex flex-row justify-center"
            type="button"
          >
            <img src={plus} alt="plus" className="w-5 mx-2" />
            Add Observation
          </Button>
        </div>
      </DialogTrigger>
      {fields.map((observation: Observation, i: number) => (
        <div
          key={`observation-${i}`}
          className="shadow-md bg-[#F8F8F8] rounded-lg p-4 my-4 text-left"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-base font-semibold">{observation.location}</h3>
              <p className="text-xs text-gray-500 font-light">{observation.time}</p>
            </div>
            <button
              onClick={() => deleteObservation(i, fields, setObservationsList, remove)}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Delete
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Category: {observation.category}</p>
          <p className="text-base">{observation.description}</p>
        </div>
      ))}
      <DialogContent>
        <div className="flex flex-col gap-4">
          <h2 className="text-xs text-left font-light mb-4">ADD AN OBSERVATION</h2>
          <div className="flex gap-4 items-start flex-col text-left space-y-2">
            <div className="flex items-center justify-between w-full">
              <FormField
                control={form.control}
                name="observations.0.location"
                render={() => (
                  <FormItem className="w-full">
                    <FormLabel className="font-semibold text-base">Location</FormLabel>
                    <FormControl>
                      <Input
                        className="font-light text-xs h-12"
                        placeholder="Type your message here"
                        type="text"
                        value={newObservation.location}
                        onChange={(e) => handleInputChange(e, "location")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-5 justify-center items-center w-full">
              <FormField
                control={form.control}
                name="observations.0.time"
                render={() => (
                  <FormItem>
                    <FormLabel className="font-semibold text-base">Time</FormLabel>
                    <FormControl>
                      <Input
                        className="font-light text-xs h-12"
                        type="text"
                        value={newObservation.time}
                        readOnly
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="observations.0.category"
                render={() => (
                  <FormItem className="w-full">
                    <FormLabel className="font-semibold text-base">Category</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 h-12"
                        value={newObservation.category}
                        onChange={(e) => handleInputChange(e, "category")}
                      >
                        <option value="" disabled>
                          Select an Option
                        </option>
                        {observationCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="observations.0.description"
                render={() => (
                  <FormItem>
                    <FormLabel className="font-semibold text-base">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="font-light text-xs h-40 py-2 px-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                        value={newObservation.description}
                        placeholder="Type your message here"
                        onChange={(e) => handleInputChange(e, "description")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                className=" mt-2 w-full bg-[#038400] p-7 items-center flex flex-row justify-center"
                onClick={handleAddObservation}
                type="button"
              >
                Add Observation
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ReportObservation };
