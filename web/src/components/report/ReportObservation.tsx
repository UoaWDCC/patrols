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
import { X } from "lucide-react";

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
  append: any
) => {
  const date = new Date();
  let parsedDate = "";
  if (date.getMinutes() < 10) {
    parsedDate = date.getHours() + ":0" + date.getMinutes();
  } else {
    parsedDate = date.getHours() + ":" + date.getMinutes();
  }
  const newObservation: Observation = {
    location: "",
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
  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4">
        {fields.map((observation: any, i: number) => (
          <div
            className="flex gap-4 items-center"
            key={observation.location + i}
          >
            <div className="mt-8">Observation {i}</div>
            <FormField
              control={form.control}
              name={`observations.${i}.location`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
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
            <FormField
              control={form.control}
              name={`observations.${i}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      type="textarea"
                      {...field}
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
            <FormField
              control={form.control}
              name={`observations.${i}.time`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input
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
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <Button
              variant={"destructive"}
              onClick={() =>
                deleteObservation(i, fields, setObservationsList, remove)
              }
              type="button"
            >
              <X size={16} />
            </Button>
          </div>
        ))}
      </div>

      <Button
        className="mt-6"
        onClick={() =>
          addObservation(type.observation, fields, setObservationsList, append)
        }
        type="button"
      >
        Add observation
      </Button>
    </div>
  );
};

export { ReportObservation };
