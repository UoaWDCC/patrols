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
import { useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";
import axios from "axios";
import {
  patrolDetailsSchema,
  userDetailsSchema,
  vehicleDetailsSchema,
} from "../schemas";

type UserDetails = z.infer<typeof userDetailsSchema>;
type VehicleDetails = z.infer<typeof vehicleDetailsSchema>;
type PatrolDetails = z.infer<typeof patrolDetailsSchema>;

export default function Logon() {
  const [loading, setLoading] = useState(true);
  const [currentUserDetails, setCurrentUserDetails] = useState<UserDetails>();
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [callSign, setCallSign] = useState<string>("");
  const [patrolName, setPatrolName] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [policeStation, setPoliceStation] = useState<string>("");
  const [currentUserVehicles, setCurrentUserVehicles] = useState<
    VehicleDetails[]
  >([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetails | null>(
    null
  );
  const [membersInPatrol, setMembersInPatrol] = useState<PatrolDetails[]>([]);
  const [driverName, setDriverName] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/getUserDetails`
        );

        const { userDetails, patrolDetails, vehicleDetails } = response.data;
        const parsedUserDetails = userDetailsSchema.parse(userDetails);
        const parsedVehicleDetails = vehicleDetailsSchema
          .array()
          .parse(vehicleDetails);
        setCurrentUserDetails(parsedUserDetails);
        setCallSign(userDetails.call_sign);
        setPatrolName(patrolDetails.name);
        setPoliceStation(userDetails.police_station.replace(/_/g, " ")); // Replace enum underscores with space
        setMobileNumber(userDetails.mobile_phone);
        setFullName(`${userDetails.first_names} ${userDetails.surname}`);

        if (parsedVehicleDetails.length === 0) {
          setSelectedVehicle(null);
          setCurrentUserVehicles([]);
        } else {
          setSelectedVehicle(
            parsedVehicleDetails.find((vehicle) => vehicle.selected) || null
          );
          const reorderedVehicles = [
            ...parsedVehicleDetails.filter((vehicle) => vehicle.selected),
            ...parsedVehicleDetails.filter((vehicle) => !vehicle.selected),
          ];
          setCurrentUserVehicles(reorderedVehicles);
        }

        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    fetchUserData();
  }, []);

  const navigate = useNavigate();
  const [guestPatrols, setGuestPatrols] = useState<
    { name: string; number: string }[]
  >([]);

  const formSchema = z.object({
    startTime: z.string(),
    endTime: z.string(),
    policeStationBase: z.string().min(1, "Police Station Base is required"),
    cpCallSign: z.string().min(1, "CP Call Sign is required"),
    patrol: z.string().min(1, "Patrol is required"),
    observerName: z.string().min(1, "Observer Name is required"),
    observerNumber: z.string().min(1, "Observer Mobile Number is required"),
    driver: z.string(),
    vehicle: z.string().refine((value) => value !== "", {
      message: "Please select a vehicle",
    }),
    liveryOrSignage: z.string().min(1, "Livery or Signage is required"),
    havePoliceRadio: z.string().min(1, "Police Radio is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startTime: "",
      endTime: "",
      policeStationBase: currentUserDetails?.police_station,
      cpCallSign: callSign,
      patrol: patrolName,
      observerName: fullName,
      observerNumber: mobileNumber,
      driver: "",
      vehicle: selectedVehicle?.name || "",
      liveryOrSignage: "",
      havePoliceRadio: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/send-email`, {
        email: "jasonabc0626@gmail.com",
        patrolName: data.observerName,
        patrolID: "10",
        formData: JSON.stringify(data),
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

  // const removeGuestPatrol = (index: number) => {
  //   setGuestPatrols(guestPatrols.filter((_, i) => i !== index));
  // };

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
                  render={() => (
                    <FormItem>
                      <FormLabel>Police Station Base</FormLabel>
                      <FormControl>
                        <Input
                          defaultValue={policeStation}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpCallSign"
                  render={() => (
                    <FormItem>
                      <FormLabel>CP Call Sign</FormLabel>
                      <FormControl>
                        <Input
                          defaultValue={policeStation}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="patrol"
                  render={() => (
                    <FormItem>
                      <FormLabel>Patrol</FormLabel>
                      <FormControl>
                        <Input defaultValue={patrolName} className="w-full" />
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
                      render={() => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input defaultValue={fullName} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="observerNumber"
                      render={() => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input
                              defaultValue={mobileNumber}
                              className="w-full"
                            />
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
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="w-full"
                            onChange={(e) => setDriverName(e.target.value)}
                          />
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
                                <option key={v.name} value={v.name}>
                                  {v.name}
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
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
