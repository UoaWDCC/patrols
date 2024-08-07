import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { reportFormSchema } from "../../schemas";

interface ReportFinishProps {
  form: UseFormReturn<z.infer<typeof reportFormSchema>>;
  setDebrief: (value: string) => void;
  setEndOdometer: (value: string) => void;
}

export default function ReportFinishDetails({
  form,
  setDebrief,
  setEndOdometer,
}: ReportFinishProps) {
  return (
    <div className="mt-6 text-black">
      <div className="relative bg-[#FFFFFF] max-w-3xl mx-auto">
        <div className=" text-center space-y-2 mb-8">
          <h2 className="text-lg font-semibold min-w-96">
            Confirm your Details
          </h2>
          <p className="font-light">Details here</p>
        </div>
        <div className="flex flex-col gap-4 text-left">
          <FormField
            control={form.control}
            name="endOdometer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  End Odometer
                </FormLabel>
                <FormControl>
                  <Input
                    className="font-light text-xs h-12"
                    {...field}
                    placeholder="Type your message here"
                    type="number"
                    onChange={(event) => {
                      const value = event.target.value;
                      setEndOdometer(value);
                      localStorage.setItem("endOdometer", value);
                      form.setValue("endOdometer", value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="debrief"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  End Debrief
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="font-light text-xs h-40 py-2 px-3 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                    {...field}
                    placeholder="Type your message here"
                    onChange={(event) => {
                      const value = event.target.value;
                      setDebrief(value);
                      localStorage.setItem("debrief", value);
                      form.setValue("debrief", value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
