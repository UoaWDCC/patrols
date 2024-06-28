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
import exit from "../../assets/images/exit.png";
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
  type: type,
  fields: Observation[],
  setFields: any,
  append: any,
  address: string
) => {
  const date = new Date();
  let parsedDate = "";
  if (date.getMinutes() < 10) {
    parsedDate = date.getHours() + ":0" + date.getMinutes();
  } else {
    parsedDate = date.getHours() + ":" + date.getMinutes();
  }
  const newObservation: Observation = {
    location: address,
    description: "",
    time: parsedDate,
    category: "",
    type: type,
    displayed: true,
  };

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
  const [latestObservationIndex, setLatestObservationIndex] = useState<number | null>(null);
  const handleAddObservation = () => {
    addObservation(
      type.observation,
      fields,
      setObservationsList,
      append,
      address
    );
    setLatestObservationIndex(fields.length);
  };
  const handleRemoveObservation = () => {
    if (latestObservationIndex !== null) {
      deleteObservation(latestObservationIndex, fields, setObservationsList, remove);
    }
    setLatestObservationIndex(null);
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <div className="my-4">
          <h2 className="text-left font-semibold text-base">Observations</h2>
          <Button
            className=" mt-2 w-full bg-[#038400] p-7 items-center flex flex-row justify-center"
            onClick={handleAddObservation}
            type="button"
          >
            <img src={plus} alt="plus" className="w-5 mx-2"/>
            Add Observation
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
      <div className="flex flex-col gap-4">
        <DialogClose onClick={handleRemoveObservation}>
        </DialogClose>
        <h2 className="text-xs text-left font-light mb-4">
          ADD AN OBSERVATION
        </h2>
        {fields.map((observation: any, i: number) => (
          <div
            className="flex gap-4 items-start flex-col text-left space-y-2"
            key={observation.location + i}
          >
            <div className="flex items-center justify-between w-full">
              <FormField
                control={form.control}
                name={`observations.${i}.location`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-semibold text-base">Location</FormLabel>
                    <FormControl>
                      <Input
                        className="font-light text-xs h-12"
                        placeholder="Type your message here"
                        type="text"
                        {...field}
                        key={observation.id}
                        onChange={(event) => {
                          const value = event.target.value;
                          fields[i].location = value;
                          form.setValue(`observations.${i}.location`, value);
                          localStorage.setItem(
                            "observations",
                            JSON.stringify(fields)
                          );
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )} 
              />
            </div>
            <div className="flex gap-5 justify-center items-center w-full">
              <FormField
                control={form.control}
                name={`observations.${i}.time`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-base">Time</FormLabel>
                    <FormControl>
                      <Input
                        className="font-light text-xs h-12"
                        type="text"
                        {...field}
                        value={fields[i]?.time || ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name={`observations.${i}.category`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-semibold text-base">Category</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 h-12"
                          onChange={(e) => {
                            const value = e.target.value;
                            fields[i].category = value;
                            form.setValue(`observations.${i}.category`, value);
                            localStorage.setItem(
                              "observations",
                              JSON.stringify(fields)
                            );
                          }}
                        >
                          <option value="" disabled>
                            Select an Option
                          </option>
                          {observationCategories.map((category) => (
                            <option key={category + i} value={category}>
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
                  name={`observations.${i}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-base">Description</FormLabel>
                      <FormControl>
                      <Textarea
                        className="font-light text-xs h-40 py-2 px-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                        {...field}
                        placeholder="Type your message here"
                        onChange={(event) => {
                          const value = event.target.value;
                          fields[i].description = value;
                          form.setValue(`observations.${i}.description`, value);
                          localStorage.setItem(
                            "observations",
                            JSON.stringify(fields)
                          );
                        }}
                      />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              className=" mt-2 w-full bg-[#038400] p-7 items-center flex flex-row justify-center"
              onClick={handleAddObservation}
              type="button"
            >
              <img src={plus} alt="plus" className="w-5 mx-2"/>
              Add Observation
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { ReportObservation };
