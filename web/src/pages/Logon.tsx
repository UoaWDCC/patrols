import { Link, useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import imageCpnzLogo from "../assets/images/cpnz_logo.png";

export default function Logon() {
  const navigate = useNavigate();

  const formSchema = z.object({
    //Gonna also have to check whether the Event Number is even a number.
    eventNo: z
      .string()
      .max(8, { message: "Event Number must be 8 digits." })
      .min(8, {
        message: "Event Number must be 8 digits.",
      })
      .regex(/^[0-9]*$/, {
        message: "Event Number must only contain numbers.",
      }),
    patrolVehicle: z.string().refine((value) => value !== "", {
      message: "Please select a patrol vehicle.",
    }),
    reg: z.string(),
    colour: z.string(),
    livery: z.string(),
    callSign: z.string(),
    vehicleWof: z.string().refine((value) => value !== "", {
      message: "Please select an option.",
    }),
    vehicleRegistration: z.string().refine((value) => value !== "", {
      message: "Please select an option.",
    }),
    vehicleSafety: z.string().refine((value) => value !== "", {
      message: "Please select an option.",
    }),
    vehicleDamage: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventNo: "",
      patrolVehicle: "",
      reg: "",
      colour: "",
      livery: "",
      callSign: "",
      vehicleWof: "",
      vehicleRegistration: "",
      vehicleSafety: "",
      vehicleDamage: "",
    },
  });

  const handleVehicleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVehicle = event.target.value;
    let reg = "";
    let colour = "";
    let livery = "";
    let callSign = "";

    if (selectedVehicle === "") {
      // Set initial values to an empty string when no vehicle is selected
      reg = "";
      colour = "";
      livery = "";
      callSign = "";
    } else if (selectedVehicle === "HAVAL Jolion") {
      reg = "QHK6";
      colour = "WHITE";
      livery = "YES";
      callSign = "CSCP";
    } else if (selectedVehicle === "HAVAL H2") {
      reg = "LTB442";
      colour = "WHITE";
      livery = "YES";
      callSign = "CSCP2";
    }

    form.setValue("patrolVehicle", selectedVehicle);
    form.setValue("reg", reg);
    form.setValue("colour", colour);
    form.setValue("livery", livery);
    form.setValue("callSign", callSign);
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formErrors = form.formState.errors;

    // Check if there are any form errors
    if (Object.keys(formErrors).length === 0) {
      console.log(data);
      navigate("/logon-two");
    } else {
      // There are errors, do not navigate
      console.log("Please fix the errors before proceeding.");
    }
  };

  return (
    <div className="min-h-screen bg-[#BFBFBF] flex items-center justify-center">
      <div className="max-w-7xl">
        <div className="bg-[#E9EFF2] inline-block">
          {/*Title and Logo*/}
          <div className="flex items-center justify-center px-12 py-4">
            <img
              src={imageCpnzLogo}
              alt="CPNZ Logo"
              className="h-32 w-auto mr-4 inline"
            />
            <h1 className="text-3xl font-bold inline">
              SHIFT REPORT - WDCC COMMUNITY PATROL
            </h1>
          </div>

          <div className="w-full px-14 py-6">
            <div className="flex flex-col justify-between">
              {/*Form to enter the Event Number*/}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div>
                    <FormField
                      control={form.control}
                      name="eventNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-1">
                            Enter your Event No. (P0 XXXXXXXXX)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Only enter the 8 digits after the P0"
                              {...field}
                              className="w-60"
                              maxLength={8}
                            />
                          </FormControl>
                          <FormDescription className="text-xs italic text-black">
                            Obtain Event Number from Comm's
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/*Patrol Vehicle Selection*/}
                  <div>
                    <h2 className="text-lg font-bold">
                      Patrol Vehicle Compulsory Check-List (before shift starts)
                    </h2>
                    <p className="text-xs mb-6 italic">
                      Driver is responsible for ensuring vehicle is LEGAL & SAFE
                      to drive
                    </p>
                    <div className="flex space-x-4 mb-4">
                      <FormField
                        control={form.control}
                        name="patrolVehicle"
                        render={({ field }) => (
                          <>
                            <FormItem>
                              <FormLabel className="block mb-2">
                                Select Patrol Vehicle
                              </FormLabel>
                              <select
                                {...field}
                                className="w-60 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleVehicleChange}
                              >
                                <option value="" disabled>
                                  Select a vehicle
                                </option>
                                <option value="HAVAL Jolion">
                                  HAVAL Jolion
                                </option>
                                <option value="HAVAL H2">HAVAL H2</option>
                              </select>
                              <FormMessage />
                            </FormItem>
                          </>
                        )}
                      />

                      {/*Patrol Vehicle Details*/}
                      <FormField
                        control={form.control}
                        name="reg"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reg.</FormLabel>
                            <FormControl>
                              <Input {...field} className="w-20" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="colour"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Colour</FormLabel>
                            <FormControl>
                              <Input {...field} className="w-20" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="livery"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Livery?</FormLabel>
                            <FormControl>
                              <Input {...field} className="w-20" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="callSign"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Call Sign</FormLabel>
                            <FormControl>
                              <Input {...field} className="w-20" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    {/*Patrol Vehicle Condition*/}
                    <div className="flex space-x-4">
                      <FormField
                        control={form.control}
                        name="vehicleWof"
                        render={({ field }) => (
                          <>
                            <FormItem>
                              <FormLabel className="block">
                                Vehicle has current WOF?
                              </FormLabel>
                              <select
                                {...field}
                                className="w-60 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="" disabled>
                                  Select
                                </option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                              <FormMessage />
                            </FormItem>
                          </>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vehicleRegistration"
                        render={({ field }) => (
                          <>
                            <FormItem>
                              <FormLabel className="block">
                                Vehicle has current Registration?
                              </FormLabel>
                              <select
                                {...field}
                                className="w-60 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="" disabled>
                                  Select
                                </option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                              <FormMessage />
                            </FormItem>
                          </>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vehicleSafety"
                        render={({ field }) => (
                          <>
                            <FormItem>
                              <FormLabel className="block">
                                Is vehicle safe to drive? (e.g. good tyres etc)?
                              </FormLabel>
                              <select
                                {...field}
                                className="w-60 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="" disabled>
                                  Select
                                </option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                              <FormMessage />
                            </FormItem>
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="vehicleDamage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block mb-1">
                            Please record any visible damage before starting
                            your shift (if applicable)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Check condition of tyres, Lighting, external damage etc"
                              {...field}
                              className="max-w-screen-xl"
                            />
                          </FormControl>
                          <FormDescription className="text-xs italic text-black">
                            e.g. small dent on lower left hand passenger door,
                            by B Pillar, behind decal
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end items-center space-x-4">
                    <Link to="/home">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-green-600 hover:text-white shadow-sm hover:shadow-lg">
                        <FaChevronLeft size={12} /> Back
                      </button>
                    </Link>
                    <Button type="button" onClick={form.handleSubmit(onSubmit)}>
                      Next Page
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
