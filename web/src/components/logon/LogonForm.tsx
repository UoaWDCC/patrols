import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/ui/command";
import {
  userDetailsSchema,
  vehicleDetailsSchema,
  patrolDetailsSchema,
} from "../../schemas";
import axios from "axios";
import { cn } from "../../lib/utils";

interface LogonFormProps {
  currentUserDetails: z.infer<typeof userDetailsSchema>;
  currentUserVehicles: z.infer<typeof vehicleDetailsSchema>[];
  patrolDetails: z.infer<typeof patrolDetailsSchema>;
}

type VehicleDetails = z.infer<typeof vehicleDetailsSchema>;

export default function LogonForm(props: LogonFormProps) {
  const [driver, setDriver] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [numPatrollers, setNumPatrollers] = useState<number>(2);
  const navigate = useNavigate();
  console.log(numPatrollers);

  const membersFullName = props.patrolDetails["members_dev"]
    .filter((m) => m.cpnz_id !== props.currentUserDetails.cpnz_id)
    .map((m) => ({
      name: `${m.first_names} ${m.surname}`,
    }));

  const formSchema = z
    .object({
      startTime: z.string().min(1),
      endTime: z.string().min(1),
      policeStationBase: z.string(),
      cpCallSign: z.string(),
      patrol: z.string(),
      observerName: z.string(),
      observerNumber: z.string(),
      numPatrollers: z.number().min(2).max(5),
      additionalPatrollers: z
        .array(
          z.object({
            name: z.string(),
            number: z.string(),
          })
        )
        .optional(),
      guestPatrollers: z
        .array(
          z.object({
            name: z.string(),
            number: z.string(),
          })
        )
        .optional(),
      driver: z.string(),
      vehicle: z.string(),
      liveryOrSignage: z.string(),
      havePoliceRadio: z.string(),
      additionalInfo: z.string(),
    })
    .refine(
      (data) => {
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        return end > start;
      },
      {
        message: "End time must be after start time",
        path: ["endTime"],
      }
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startTime: "",
      endTime: "",
      policeStationBase: props.currentUserDetails.police_station.replace(
        /_/g,
        " "
      ),
      cpCallSign: props.currentUserDetails.call_sign,
      patrol: props.patrolDetails.name.replace(/_/g, " "),
      observerName: `${props.currentUserDetails.first_names} ${props.currentUserDetails.surname}`,
      observerNumber: props.currentUserDetails.mobile_phone,
      numPatrollers: 2,
      additionalPatrollers: [],
      guestPatrollers: [],
      driver: "",
      vehicle:
        (props.currentUserVehicles.find((v: VehicleDetails) => v.selected)
          ?.make || "") +
        " " +
        (props.currentUserVehicles.find((v: VehicleDetails) => v.selected)
          ?.model || ""),
      liveryOrSignage: "yes",
      havePoliceRadio: "no",
      additionalInfo: "",
    },
    mode: "onSubmit",
  });

  const {
    fields: additionalPatrollerFields,
    append: appendPatroller,
    remove: removePatroller,
  } = useFieldArray({
    control: form.control,
    name: "additionalPatrollers",
  });

  const {
    fields: guestFields,
    append: appendGuest,
    remove: removeGuest,
  } = useFieldArray({
    control: form.control,
    name: "guestPatrollers",
  });

  const handleNumPatrollersChange = (value: number) => {
    setNumPatrollers(value);
    const currentAdditional =
      form.getValues().additionalPatrollers?.length || 0;
    if (value > 2) {
      for (let i = currentAdditional; i < value - 2; i++) {
        appendPatroller({ name: "", number: "" });
      }
    } else {
      for (let i = currentAdditional; i > 0; i--) {
        removePatroller(i - 1);
      }
    }
    form.setValue("numPatrollers", value);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setSubmitting(true);

      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      const now = new Date();
      const maxShiftDuration = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

      if (start < now) {
        form.setError("startTime", {
          message: "Start time cannot be in the past",
        });
        setSubmitting(false);
        return;
      }

      if (end.getTime() - start.getTime() > maxShiftDuration) {
        form.setError("endTime", {
          message: "Shift duration cannot exceed 12 hours",
        });
        setSubmitting(false);
        return;
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/email/`, {
        email: props.currentUserDetails.email,
        cpnzID: props.currentUserDetails.cpnz_id,
        formData: data,
        driver: props.patrolDetails["members_dev"].find(
          (m) => m.first_names + " " + m.surname === driver
        ),
      });
      console.log(data);
      setSubmitting(false);
      // Navigates to Loghome if successfully logged on.
      navigate("/home");
    } catch (error) {
      axios.isAxiosError(error)
        ? console.log(error.response?.data.error)
        : console.error("Unexpected error during login:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="datetime-local"
                      {...field}
                      className="w-full pl-10"
                      placeholder="Select time"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="datetime-local"
                      {...field}
                      className="w-full pl-10"
                      placeholder="Select time"
                      min={form.watch("startTime")}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="policeStationBase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Police Station Base</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    placeholder="Enter police station base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpCallSign"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CP Call Sign</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patrol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patrol</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numPatrollers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Registered Patrollers</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) =>
                      handleNumPatrollersChange(parseInt(e.target.value))
                    }
                  >
                    {[2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2 mt-6">
            <h4 className="text-2xl font-semibold mb-2">
              Patroller (observer)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="observerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="observerNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="col-span-2">
            <h4 className="text-2xl font-semibold mb-2">Patroller (driver)</h4>
            <FormField
              control={form.control}
              name="driver"
              render={() => (
                <FormItem>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[300px] justify-between text-md text-gray-600"
                        >
                          {driver
                            ? membersFullName.find(
                                (member) => member.name === driver
                              )?.name
                            : "Select Driver"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search..."
                            className="h-9"
                          />
                          <CommandEmpty>No driver found.</CommandEmpty>
                          <CommandList>
                            {membersFullName.map((member) => (
                              <CommandItem
                                key={member.name}
                                value={member.name}
                                onSelect={(currentDriver) => {
                                  const newDriver =
                                    currentDriver === driver
                                      ? ""
                                      : currentDriver;
                                  setDriver(newDriver);
                                  form.setValue("driver", newDriver, {
                                    shouldValidate: true,
                                  });
                                  setOpen(false);
                                }}
                              >
                                {member.name}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    driver === member.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {additionalPatrollerFields.map((field, index) => (
            <div key={field.id} className="col-span-2 mt-6">
              <h4 className="text-2xl font-semibold mb-2">
                Patroller {index + 3}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`additionalPatrollers.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="text-xs">
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                            >
                              {field.value
                                ? membersFullName.find(
                                    (member) => member.name === field.value
                                  )?.name
                                : "Select Patroller"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search patroller..." />
                              <CommandEmpty>No patroller found.</CommandEmpty>
                              <CommandList>
                                {membersFullName.map((member) => (
                                  <CommandItem
                                    key={member.name}
                                    value={member.name}
                                    onSelect={(currentPatroller) => {
                                      form.setValue(
                                        `additionalPatrollers.${index}.name`,
                                        currentPatroller
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === member.name
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {member.name}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name={`additionalPatrollers.${index}.number`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>
            </div>
          ))}

          {guestFields.map((field, index) => (
            <div key={field.id} className="col-span-2 mt-8">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-2xl font-semibold">Guest Patrol</h4>
                <button
                  type="button"
                  className="px-2 py-1 bg-red-500 text-white rounded-md"
                  onClick={() => removeGuest(index)}
                >
                  -
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`guestPatrollers.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Name"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`guestPatrollers.${index}.number`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Number"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          <div className="col-span-2 mt-2">
            <button
              type="button"
              className="px-4 py-2 bg-white text-black border-2 border-cpnz-blue-900 rounded-md font-semibold hover:bg-cpnz-blue-900 hover:text-white"
              onClick={() => appendGuest({ name: "", number: "" })}
            >
              Add Guest Patrols
            </button>
            <p className="text-xs pt-2 italic">
              Patrollers that are not registered with the selected patrol
            </p>
          </div>

          <div className="col-span-2 mt-6">
            <h4 className="text-2xl font-semibold mb-2">Vehicle</h4>
            <div className="grid grid-cols-2 gap-4 items-center">
              <FormField
                control={form.control}
                name="vehicle"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      >
                        {props.currentUserVehicles.map((v) => (
                          <option key={v.id}>
                            {v.make} {v.model}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="liveryOrSignage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Livery or Signage?</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...field}
                        value="Yes"
                        className="mr-2"
                        checked={field.value === "Yes"}
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...field}
                        value="No"
                        className="mr-2"
                        checked={field.value === "No"}
                      />
                      No
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="havePoliceRadio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Do you have a Police Radio</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...field}
                        value="Yes"
                        className="mr-2"
                        checked={field.value === "Yes"}
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...field}
                        value="No"
                        className="mr-2"
                        checked={field.value === "No"}
                      />
                      No
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Information</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    placeholder="Add any additional information here..."
                    className="w-[600px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-12 flex justify-center">
          <Button
            type="submit"
            className="bg-cpnz-blue-900 text-white hover:bg-[#0a0d4a] py-7 w-full"
          >
            {submitting ? (
              <>
                Submitting <Loader2 className="animate-spin ml-4" />{" "}
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
