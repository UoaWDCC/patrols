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
  DialogFooter,
} from "@components/ui/dialog";
import { useState } from "react";

interface ReportObservationProps {
  form: UseFormReturn<z.infer<typeof reportFormSchema>>;
  fields: Observation[];
  setObservationsList: (value: z.infer<typeof formObservationSchema>) => void;
  replace: any;
  remove: any;
  update: any;
}

type Observation = z.infer<typeof formObservationSchema>[number];

enum type {
  observation = "observation",
  intel = "intel",
}

const observationCategories = [
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
  const updatedFields = [...fields];
  updatedFields.splice(i, 1);
  remove(i);
  setFields(updatedFields);
  localStorage.setItem("observations", JSON.stringify(updatedFields));
};

const addObservation = (
  newObservation: Observation,
  fields: Observation[],
  setFields: any,
  replace: any
) => {
  const updatedFields = [...fields, newObservation];
  setFields(updatedFields);
  replace(updatedFields)
  localStorage.setItem("observations", JSON.stringify(updatedFields));
  console.log(JSON.parse(localStorage.getItem("observations")!).length);
};

const editObservation = (
  i: number,
  fields: Observation[],
  setFields: any,
  update: any,
  observation: Observation
) => {
  const updatedFields = [...fields];
  updatedFields[i] = observation;
  setFields(updatedFields);
  update(i, observation);
  localStorage.setItem("observations", JSON.stringify(updatedFields));
};

const ReportObservation = ({
  form,
  fields,
  setObservationsList,
  replace,
  remove,
  update,
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

  const [editObservationData, setEditObservationData] =
    useState<Observation | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: keyof Observation
  ) => {
    setNewObservation({
      ...newObservation,
      [field]: e.target.value,
    });
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: keyof Observation
  ) => {
    if (editObservationData) {
      setEditObservationData({
        ...editObservationData,
        [field]: e.target.value,
      });
    }
  };

  const handleAddObservation = () => {
    if (
      newObservation.location &&
      newObservation.category &&
      newObservation.description
    ) {
      addObservation(newObservation, fields, setObservationsList, replace);
      setNewObservation({
        location: address,
        description: "",
        time: parsedDate,
        category: "",
        type: type.observation,
        displayed: true,
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditObservation = () => {
    if (editObservationData && editIndex !== null) {
      editObservation(
        editIndex,
        fields,
        setObservationsList,
        update,
        editObservationData
      );
      setEditObservationData(null);
      setEditIndex(null);
      setIsEditDialogOpen(false);
    }
  };

  const expandEditObservation = (index: number) => {
    setEditObservationData(fields[index]);
    setEditIndex(index);
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <div className="my-4">
            <h2 className="text-left font-semibold text-base">Observations</h2>
            <Button
              className="mt-2 w-full bg-[#038400] p-7 items-center flex flex-row justify-center"
              type="button"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <img src={plus} alt="plus" className="w-5 mx-2" />
              Add Observation
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <div className="flex flex-col gap-4">
            <h2 className="text-xs text-left font-light mb-4">
              Add an observation - PLEASE FILL IN ALL FIELDS
            </h2>
            <div className="flex gap-4 items-start flex-col text-left space-y-2">
              <div className="flex items-center justify-between w-full">
                <FormField
                  control={form.control}
                  name="observations.0.location"
                  render={() => (
                    <FormItem className="w-full">
                      <FormLabel className="font-semibold text-base">
                        Location
                      </FormLabel>
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
                      <FormLabel className="font-semibold text-base">
                        Time
                      </FormLabel>
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
                      <FormLabel className="font-semibold text-base">
                        Category
                      </FormLabel>
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
                      <FormLabel className="font-semibold text-base">
                        Description
                      </FormLabel>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {fields.map((observation: Observation, i: number) => (
          <div
            key={`observation-${i}`}
            className="shadow-md bg-[#F8F8F8] rounded-lg p-4 my-4 text-left"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-base font-semibold">
                  {observation.location}
                </h3>
                <p className="text-xs text-gray-500 font-light">
                  {observation.time}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <DialogTrigger asChild>
                  <button
                    onClick={() => expandEditObservation(i)}
                    className="text-blue-500 hover:text-blue-700 text-xs"
                    type="button"
                  >
                    Edit
                  </button>
                </DialogTrigger>
                <button
                  onClick={() =>
                    deleteObservation(i, fields, setObservationsList, remove)
                  }
                  className="text-red-500 hover:text-red-700 text-xs"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Category: {observation.category}
            </p>
            <p className="text-base">{observation.description}</p>
          </div>
        ))}
        <DialogContent>
          <div className="flex flex-col gap-4">
            <h2 className="text-xs text-left font-light mb-4">
              EDIT OBSERVATION
            </h2>
            <div className="flex gap-4 items-start flex-col text-left space-y-2">
              <div className="flex items-center justify-between w-full">
                <FormField
                  control={form.control}
                  name="observations.0.location"
                  render={() => (
                    <FormItem className="w-full">
                      <FormLabel className="font-semibold text-base">
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="font-light text-xs h-12"
                          placeholder="Type your message here"
                          type="text"
                          value={
                            editObservationData
                              ? editObservationData.location
                              : ""
                          }
                          onChange={(e) => handleEditInputChange(e, "location")}
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
                      <FormLabel className="font-semibold text-base">
                        Time
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="font-light text-xs h-12"
                          type="text"
                          value={
                            editObservationData ? editObservationData.time : ""
                          }
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
                      <FormLabel className="font-semibold text-base">
                        Category
                      </FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 h-12"
                          value={
                            editObservationData
                              ? editObservationData.category
                              : ""
                          }
                          onChange={(e) => handleEditInputChange(e, "category")}
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
                      <FormLabel className="font-semibold text-base">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="font-light text-xs h-40 py-2 px-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                          value={
                            editObservationData
                              ? editObservationData.description
                              : ""
                          }
                          placeholder="Type your message here"
                          onChange={(e) =>
                            handleEditInputChange(e, "description")
                          }
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
                  onClick={handleEditObservation}
                  type="button"
                >
                  Save Changes
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { ReportObservation };
