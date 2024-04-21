// import { useQuery } from "@tanstack/react-query";
// import QueryKeys from "@utils/queryKeys";
// import axios from "axios";
// import { useParams } from "react-router";
// import urls from "@utils/urls";

import { Link } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form"
import { Input } from "@components/ui/input"
 
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export default function Home() {
  // const { name } = useParams();

  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: [QueryKeys.GetIntro, name],
  //   queryFn: async () => {
  //     const { data } = await axios(`/hello/${name}`, {
  //       method: 'get',
  //       baseURL: urls.apiUrl,
  //     });
  //     return data;
  //   },
  // });

  // if (isLoading) {
  //   return <div className="loading loading-spinner" />;
  // }
  // if (isError) {
  //   return <div>Error: {error.name}</div>;
  // }
  // return <div>{data}</div>;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: ""
    }
  })

  const onSubmit = (e: any) => {
    e.preventDefault();
  }

  return (
    <div className="text-center h-[80vh] pt-24 flex flex-col justify-between items-center">
      <div>
        <h1 className="text-5xl font-bold mb-6">Hello World</h1>
        <h3>Welcome to CPNZ progressive web app</h3>
      </div>

      <div>
        <Link to="/report">
          <button className="bg-green-100 px-8 py-4 rounded-lg transition-all duration-300 hover:bg-green-600 hover:text-white shadow-sm hover:shadow-lg">
            Report
          </button>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
