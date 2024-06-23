import { FormItem, FormLabel, Form } from '@components/ui/form';
import { Input } from '@components/ui/input';
import {
  formSchema,
  patrolDetailsSchema,
  userDetailsSchema,
} from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PatrolDetailsFormProps {
  currentUserDetails: z.infer<typeof userDetailsSchema>;
  patrolDetails: z.infer<typeof patrolDetailsSchema>;
}

export default function PatrolDetailsForm(props: PatrolDetailsFormProps) {
  const { call_sign, police_station } = props.currentUserDetails;
  const { name } = props.patrolDetails;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <div className="my-6 mx-8 space-y-5 text-left px-8">
      <h2 className="text-2xl">PATROL INFORMATION</h2>
      <Form {...form}>
        <FormItem className="flex flex-col">
          <FormLabel htmlFor="cpCallSign">CP Call Sign </FormLabel>
          <Input
            type="text"
            id="cpCallSign"
            name="cpCallSign"
            value={call_sign}
            disabled
            className="rounded-md px-3 py-2 border-[#CBD5E1]"
          />
        </FormItem>
        <FormItem className="flex flex-col">
          <FormLabel htmlFor="patrol">Patrol (Region) </FormLabel>
          <Input
            type="text"
            id="patrol"
            name="patrol"
            value={name.replace(/_/g, " ")}
            disabled
            className="rounded-md px-3 py-2 border-[#CBD5E1]"
          />
        </FormItem>
        <FormItem className="flex flex-col">
          <FormLabel htmlFor="policeBase">Police Base Station </FormLabel>
          <Input
            type="text"
            id="policeBase"
            name="policeBase"
            disabled
            value={police_station.replace(/_/g, " ")}
            className="rounded-md px-3 py-2 border-[#CBD5E1]"
          />
        </FormItem>
      </Form>
    </div>
  );
}
