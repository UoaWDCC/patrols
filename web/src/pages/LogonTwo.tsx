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
import imageCpnzLogo from '../assets/images/cpnz_logo.png';

export default function LogonTwo() {
    const formSchema = z.object({
        vehicleChecklist: z.string(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            vehicleChecklist: '',
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        // Handle form submission
        console.log(data);
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
                                            name="vehicleChecklist"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="block mb-1">
                                                        Please record any
                                                        visible damage before
                                                        starting your shift (if
                                                        applicable)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Check condition of tyres, Lighting, external damage etc"
                                                            {...field}
                                                            className="max-w-screen-xl"
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="text-xs italic text-black">
                                                        e.g. small dent on lower
                                                        left hand passenger
                                                        door, by B Pillar,
                                                        behind decal
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex justify-end items-center space-x-4">
                                        <Link to="/logon">
                                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-green-600 hover:text-white shadow-sm hover:shadow-lg">
                                                <FaChevronLeft size={12} /> Back
                                            </button>
                                        </Link>
                                        <Button type="submit">Next Page</Button>
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
