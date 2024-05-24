import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";

interface ReportIntelProps {
  form: any;
  setStartOdometer: (value: string) => void;
}

export default function ReportIntel({
  form,
  setStartOdometer,
}: ReportIntelProps) {
  return (
    <div className="relative bg-[#FFFFFF] max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold py-4 text-center">INTEL</h2>
      <p className="text-left mb-6">
        Message:{" "}
        {
          "Temporarily generated dummmy intel message but this should be a message that the chairman / secretary / police liasion can set for a specific patrol to will show for all patrollers in that patrol"
        }
      </p>
      <FormField
        control={form.control}
        name="startOdometer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Odometer Start KMs</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                onChange={(event) => {
                  const value = event.target.value;
                  setStartOdometer(value);
                  localStorage.setItem("startOdometer", value);
                  form.setValue("startOdometer", value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
