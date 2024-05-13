import { Link, useNavigate } from "react-router-dom";
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
} from "@components/ui/form";
import cogwheelIcon from "../assets/images/cogwheel.png";
import userIcon from "../assets/images/cogwheel.png";

export default function Logon() {
  const navigate = useNavigate();

  const formSchema = z.object({
    shiftTime: z.string(),
    policeStationBase: z.string(),
    cpCallSign: z.string(),
    patrol1Name: z.string(),
    patrol1Number: z.string(),
    patrol2Name: z.string(),
    patrol2Number: z.string(),
    vehicle: z.string(),
    liveryOrSignage: z.string(),
    havePoliceRadio: z.string(),
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

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    navigate("/logon-two");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-7xl w-full">
        <div className="bg-[#EEF6FF] px-8 py-10 flex items-center justify-between">
          <div className="flex items-center">
            <img src={userIcon} alt="User Icon" className="w-10 h-10 mr-4" />
            <h2 className="text-2xl font-bold">Welcome back, XXXXXX</h2>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Settings</span>
            <img src={cogwheelIcon} alt="Settings" className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-8">
          <h3 className="text-xl mb-8">Shift Log-on Form</h3>
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
                        <Input
                          type="datetime-local"
                          {...field}
                          className="w-full"
                        />
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
                    </FormItem>
                  )}
                />
                <div className="col-span-2">
                  <h4 className="text-lg font-semibold mb-2">Patrol 1</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="patrol1Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="w-full" />
                          </FormControl>
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
                            <Input {...field} className="w-full" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <h4 className="text-lg font-semibold mb-2">Patrol 2</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="patrol2Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="w-full" />
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
                            <Input {...field} className="w-full" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <h4 className="text-lg font-semibold mb-2">Vehicle</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="vehicle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select an option</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select a vehicle</option>
                              <option value="vehicle1">Vehicle 1</option>
                              <option value="vehicle2">Vehicle 2</option>
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Add new vehicle
                    </button>
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
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-8">
                <Button type="submit" className="w-full">
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
