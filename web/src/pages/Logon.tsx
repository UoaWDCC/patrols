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
import { FaCog } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export default function Logon() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const formSchema = z.object({
    shiftTime: z.string(),
    policeStationBase: z.string().nonempty("Police Station Base is required"),
    cpCallSign: z.string().nonempty("CP Call Sign is required"),
    patrol1Name: z.string().nonempty("Patrol 1 Name is required"),
    patrol1Number: z.string().nonempty("Patrol 1 Mobile Number is required"),
    patrol2Name: z.string(),
    patrol2Number: z.string(),
    vehicle: z.string().refine((value) => value !== "", {
      message: "Please select a vehicle",
    }),
    liveryOrSignage: z.string().nonempty("Livery or Signage is required"),
    havePoliceRadio: z.string().nonempty("Police Radio is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shiftTime: "",
      policeStationBase: "",
      cpCallSign: "",
      patrol1Name: "",
      patrol1Number: "",
      patrol2Name: "",
      patrol2Number: "",
      vehicle: "",
      liveryOrSignage: "",
      havePoliceRadio: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const email = await axios.post(
        `${import.meta.env.VITE_API_URL}/send-email`,
        { email: "jasonabc0626@gmail.com", patrolName: data.patrol1Name, patrolID: "10", formData: JSON.stringify(data)}
      );

      // Navigates to Loghome if succesfully logged on. 
      navigate("/LogHome");
    } catch (error) {
      axios.isAxiosError(error)
        ? console.log(error.response?.data.error)
        : console.error("Unexpected error during login:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-7xl w-full">
        <div className="bg-[#EEF6FF] px-8 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={userIcon}
              alt="User Icon"
              className="w-16 h-16 mr-4 rounded-full"
            />
            <h2 className="text-2xl font-bold">Welcome back, XXXXXX</h2>
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
                  name="shiftTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shift Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="datetime-local"
                            {...field}
                            className="w-full pl-10"
                            placeholder="Select date and time"
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
                                d="M6 2C5.44772 2 5 2.44772 5 3V4H4C2.89543 4 2 4.89543 2 6V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V6C18 4.89543 17.1046 4 16 4H15V3C15 2.44772 14.5523 2 14 2C13.4477 2 13 2.44772 13 3V4H7V3C7 2.44772 6.55228 2 6 2ZM6 7C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H14C14.5523 9 15 8.55228 15 8C15 7.44772 14.5523 7 14 7H6Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div></div>
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
                          placeholder="Base"
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
                        <Input
                          {...field}
                          className="w-full"
                          placeholder="Call Sign"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-2 mt-6">
                  <h4 className="text-2xl font-semibold mb-2">Patrol 1</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="patrol1Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full"
                              placeholder="Name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="patrol1Number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full"
                              placeholder="Number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <h4 className="text-2xl font-semibold mb-2">Patrol 2</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="patrol2Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full"
                              placeholder="Name"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="patrol2Number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full"
                              placeholder="Number"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="col-span-2 mt-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-white text-black border-2 border-[#83E960] rounded-md font-semibold underline hover:bg-[#83E960]"
                  >
                    Add more Patrol
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
                              <option value="" disabled>
                                Select an option
                              </option>
                              <option value="vehicle1">Vehicle 1</option>
                              <option value="vehicle2">Vehicle 2</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center justify-start">
                      <span className="mr-4 font-bold">OR</span>
                      <button
                        type="button"
                        className="px-4 py-2 bg-white text-black border-2 border-[#83E960] rounded-md font-semibold underline hover:bg-[#83E960]"
                      >
                        Add new vehicle
                      </button>
                    </div>
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
                  className="w-full bg-[#83E960] text-black hover:bg-[#6ec253]"
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
