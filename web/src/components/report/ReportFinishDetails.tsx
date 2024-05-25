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
    <div className="mt-12">
      <div className="relative bg-[#FFFFFF] max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold py-4 text-center">
          Shift Finish Details
        </h2>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="endOdometer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Odometer Finish KMs</FormLabel>
                <FormControl>
                  <Input
                    {...field}
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
                <FormLabel>
                  End of Shift De-brief Comments / Concerns (to be reviewed by
                  Patrol Leader)
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
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
