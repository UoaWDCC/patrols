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
    <div className="relative bg-[#FFFFFF] max-w-3xl mx-auto text-left">
      <h2 className="text-lg font-semibold py-4 text-center my-14">INTEL</h2>
      <FormField
        control={form.control}
        name="startOdometer"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold text-base">Starting Odometer</FormLabel>
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
