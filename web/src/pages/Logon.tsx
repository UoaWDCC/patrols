import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
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
import userIcon from "../assets/images/gorilla.png";
import { useState } from "react";
import { FaCog } from "react-icons/fa";
import axios from "axios";
import { Popover } from "@components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/ui/command";
import { cn } from "../lib/utils";
import useUserData from "../hooks/useUserData";

export default function Logon() {
  const {
    loading,
    setLoading,
    cpnzID,
    email,
    currentUserDetails,
    fullName,
    currentUserVehicles,
    membersInPatrol,
  } = useUserData();

  const [open, setOpen] = useState(false);

  // driverName
  const [value, setValue] = useState<string>("");

  const membersFullName = membersInPatrol
    .filter((m) => m.cpnz_id !== currentUserDetails?.cpnz_id)
    .map((m) => ({
      name: `${m.first_names} ${m.surname}`,
    }));

  const navigate = useNavigate();
  const [guestPatrols, setGuestPatrols] = useState<
    { name: string; number: string }[]
  >([]);

  const formSchema = z.object({
    startTime: z.string().min(1),
    endTime: z.string().min(1),
    policeStationBase: z.string(),
    cpCallSign: z.string(),
    patrol: z.string(),
    observerName: z.string(),
    observerNumber: z.string(),
    driver: z.string(),
    vehicle: z.string(),
    liveryOrSignage: z.string(),
    havePoliceRadio: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/getUserDetails`
      );

      const { userDetails, patrolDetails, vehicleDetails } = response.data;
      return {
        startTime: "",
        endTime: "",
        policeStationBase: userDetails.police_station.replace(/_/g, " ") || "",
        cpCallSign: userDetails.call_sign || "",
        patrol: patrolDetails.name || "",
        observerName: userDetails.first_names + " " + userDetails.surname || "",
        observerNumber: userDetails.mobile_phone || "",
        driver: "",
        vehicle: vehicleDetails.filter((v: any) => v.selected)[0].name,
        liveryOrSignage: "yes",
        havePoliceRadio: "no",
      };
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/send-email`, {
        recipientEmail: "jasonabc0626@gmail.com",
        email,
        cpnzID,
        formData: data,
        driver: membersInPatrol.find(
          (m) => m.first_names + " " + m.surname === value
        ),
      });

      // Navigates to Loghome if succesfully logged on.
      navigate("/LogHome");
    } catch (error) {
      axios.isAxiosError(error)
        ? console.log(error.response?.data.error)
        : console.error("Unexpected error during login:", error);
    }
  };

  const addGuestPatrol = () => {
    setGuestPatrols([...guestPatrols, { name: "", number: "" }]);
  };

  return (
    <div className=" bg-white flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="bg-[#EEF6FF] px-8 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={userIcon}
              alt="User Icon"
              className="w-16 h-16 mr-4 rounded-full"
            />
            <h2 className="text-2xl font-bold">Welcome back, {fullName}</h2>
          </div>
          <button className="flex items-center">
            <span className="mr-2 text-lg font-semibold">Settings</span>
            <FaCog className="text-2xl text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-300" />
          </button>
        </div>
        <div className="bg-white p-8">
          <h3 className="text-3xl font-bold mb-8 text-center">
            Shift Log-on Form
          </h3>
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
                        <Input {...field} className="w-full" />
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
                <div className="col-span-2 mt-6">
                  <h4 className="text-2xl font-semibold mb-2">
                    Patrol (observer)
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
                  <h4 className="text-2xl font-semibold mb-2">
                    Patrol (driver)
                  </h4>
                  <FormField
                    control={form.control}
                    name="driver"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                role="combobox"
                                aria-expanded={open}
                                className="w-[300px] justify-between text-md text-gray-600"
                              >
                                {value
                                  ? membersFullName.find(
                                      (member) => member.name === value
                                    )?.name
                                  : "Select Driver"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Command>
                                <CommandInput
                                  placeholder="Search..."
                                  className="w-[255px]"
                                />
                                <CommandEmpty>No user found.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    {membersFullName.map((member) => (
                                      <CommandItem
                                        key={member.name}
                                        value={member.name}
                                        onSelect={(currentValue) => {
                                          setValue(
                                            currentValue === value
                                              ? ""
                                              : currentValue
                                          );
                                          setOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            value === member.name
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {member.name}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {guestPatrols.map((_, index) => (
                  <div key={index} className="col-span-2 mt-8">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-2xl font-semibold">Guest Patrol</h4>
                      <button
                        type="button"
                        className="px-2 py-1 bg-red-500 text-white rounded-md"
                        onClick={() => {
                          const newGuestPatrols = [...guestPatrols];
                          newGuestPatrols.splice(index, 1);
                          setGuestPatrols(newGuestPatrols);
                        }}
                      >
                        -
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
                            placeholder="Name"
                            value={guestPatrols[index].name}
                            onChange={(e) => {
                              const newGuestPatrols = [...guestPatrols];
                              newGuestPatrols[index].name = e.target.value;
                              setGuestPatrols(newGuestPatrols);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
                            placeholder="Number"
                            value={guestPatrols[index].number}
                            onChange={(e) => {
                              const newGuestPatrols = [...guestPatrols];
                              newGuestPatrols[index].number = e.target.value;
                              setGuestPatrols(newGuestPatrols);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                  </div>
                ))}
                <div className="col-span-2 mt-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-white text-black border-2 border-[#0f1363] rounded-md font-semibold underline hover:bg-[#0f1363] hover:text-white"
                    onClick={addGuestPatrol}
                  >
                    Add Guest Patrols
                  </button>
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
                              {currentUserVehicles.map((v) => (
                                <option key={v.name}>{v.name}</option>
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
                              checked
                            />
                            Yes
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              {...field}
                              value="No"
                              className="mr-2"
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
                      <FormLabel>Do you have a Police Radio</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              {...field}
                              value="Yes"
                              className="mr-2"
                            />
                            Yes
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              {...field}
                              value="No"
                              checked
                              className="mr-2"
                            />
                            No
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-8">
                <Button
                  type="submit"
                  className="w-full bg-[#0f1363] text-white hover:bg-[#0a0d4a]"
                >
                  {loading ? (
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
        </div>
      </div>
    </div>
  );
}
