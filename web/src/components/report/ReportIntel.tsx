// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
// } from "@components/ui/form";
// import { Input } from "@components/ui/input";

export default function ReportIntel() {
  return (
    <div className="relative bg-[#FFFFFF] max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold py-4 text-center">INTEL</h2>
      <p className="text-left">
        Message:{" "}
        {
          "Temporarily generated dummmy intel message but this should be a message that the chairman / secretary / police liasion can set for a specific patrol to will show for all patrollers in that patrol"
        }
      </p>
      {/* <FormField
        control={form.control}
        name="intel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>intel</FormLabel>
            <FormControl>
              <Input type="text" {...field} />
            </FormControl>
          </FormItem>
        )}
      ></FormField> */}
    </div>
  );
}
