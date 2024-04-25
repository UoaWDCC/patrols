import { useState } from "react";
import { Link } from "react-router-dom";
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
  const items = ["Item 1", "Item 2", "Item 3"];
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const formSchema = z.object({
    eventNo: z.string().min(8, {
      message: "Event Number must be 8 digits.",
    }),
    patrolVehicle: z.string(),
    reg: z.string(),
    colour: z.string(),
    livery: z.string(),
    callSign: z.string(),
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
    },
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
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
                    <div className="flex space-x-4">
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
                              >
                                <option value="" disabled selected>
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
                  </div>

                  <div className="flex justify-end items-center space-x-4">
                    <Link to="/home">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-green-600 hover:text-white shadow-sm hover:shadow-lg">
                        <FaChevronLeft size={12} /> Back
                      </button>
                    </Link>
                    <Button type="submit">Next Page</Button>
                  </div>
                </form>
              </Form>

              <div></div>

              {/*Buttons for Report and Home*/}
              {/* <div className="mt-8">
                <Link to="/report">
                  <button className="bg-green-100 px-8 py-4 rounded-lg transition-all duration-300 hover:bg-green-600 hover:text-white shadow-sm hover:shadow-lg">
                    Report
                  </button>
                </Link>
                <Link to="/home">
                  <button className="flex items-center gap-4 border-b-2 border-green-200 hover:border-green-500 px-8 py-4 transition-all duration-300 shadow-sm hover:shadow-lg">
                    <FaChevronLeft size={12} /> Back
                  </button>
                </Link>
              </div> */}

              {/*List Element*/}
              {/* <div>
                <h1>List</h1>
                <ul className="bg-white rounded-lg border border-gray-200 text-gray-900">
                  {items.length === 0 && <p>No Item Found</p>}
                  {items.map((item, index) => (
                    <li
                      key={item}
                      className={
                        selectedIndex === index
                          ? "px-6 py-2 border-b border-gray-200 w-full active [&.active] bg-gray-100"
                          : "px-6 py-2 border-b border-gray-200 w-full"
                      }
                      onClick={() => {
                        setSelectedIndex(index);
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
