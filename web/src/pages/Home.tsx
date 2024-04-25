import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { FaCog } from "react-icons/fa";

const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className="text-center min-h-screen relative">
      <div className="bg-blue-100 py-8 rounded-b-3xl">
        <div className="absolute top-4 right-4">
          <FaCog className="text-2xl text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-300" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, XXXXXX</h1>
      </div>
      <div className="mb-8 ml-4 mr-4">
        <button
          className="bg-blue-500 w-full max-w-3xl mx-auto px-8 py-4 mt-4 rounded-lg transition-all duration-300 hover:bg-blue-600 text-white shadow-sm hover:shadow-lg">
          Log a new report
        </button>
      </div>
      <div className="grid grid-cols-2 mb-8">
        <div
          className="bg-gray-200 text-black p-4 rounded-lg flex items-center mx-4 hover:bg-gray-300 hover:text-black transition-colors duration-300"
        >
          <div className="mr-4">{/* Add an icon or image */}</div>
          <div>
            <h3 className="text-lg font-semibold">Past Reports</h3>
          </div>
        </div>
        <div
          className="bg-gray-200 text-black p-4 rounded-lg flex items-center mx-4 hover:bg-gray-300 hover:text-black transition-colors duration-300"
        >
          <div className="mr-4">{/* Add an icon or image */}</div>
          <div>
            <h3 className="text-lg font-semibold">Report Settings</h3>
          </div>
        </div>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="text-left ml-4">
                  <FormLabel className="text-gray-700 text-lg font-bold">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      {...field}
                      className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500 mt-1">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage className="text-red-500 mt-1" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 ml-auto"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}