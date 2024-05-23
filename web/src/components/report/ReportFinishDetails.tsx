import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";

interface ReportFinishProps {
  form: any;
}

export default function ReportFinishDetails({ form }: ReportFinishProps) {
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
                  <Input {...field} type="number" />
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
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="mb-4">
<h2 className="text-left font-semibold mb-2">SHIFT FINISH DETAILS</h2>
</div>
<div className="mb-4">
<label className="block text-left font-semibold mb-1">
  Odometer FINISH Kms (5 digits)
</label>
<input
  type="text"
  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="Type your message here"
/>
</div>
<div className="mb-4">
<label className="block text-left font-semibold mb-1">
  End of Shift De-brief Comments / Concerns (to be reviewed by Patrol
  Leader)
</label>
<textarea
  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
  rows={4}
  placeholder="Type your message here"
></textarea>
</div> */
}
