import { Button } from "@components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { z } from "zod";
import { formObservationSchema, reportFormSchema } from "../../schemas";
import { UseFormReturn } from "react-hook-form";
import useCurrentLocation from "../../hooks/useCurrentLocation";
import plus from "../../assets/images/plus2.png";
import exit from "../../assets/images/exit.png";
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
  const [showModal, setShowModal] = useState(false);
  const [latestObservationIndex, setLatestObservationIndex] = useState<number | null>(null);
  const handleAddObservation = () => {
    setShowModal(true);
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
    setShowModal(false);
    setLatestObservationIndex(null);
  }

  return (
    <div className="mt-8">
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
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#C4C4C4] bg-opacity-90">
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
            <div className="flex flex-col gap-4">
              <button
                onClick={handleRemoveObservation}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <img src={exit} alt="close" className="w-6" />
              </button>
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
            <Button
              className=" mt-6 w-full bg-[#038400] p-7 items-center flex flex-row justify-center"
              type="button"
            >
              <img src={plus} alt="plus" className="w-5 mx-2"/>
              Add Observation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { ReportObservation };
