import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import CancelButton from "./CancelButton";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  patrolId: string;
}

const addVehicleSchema = z.object({
  registrationNo: z.string().min(5),
  colour: z.string().min(1),
  model: z.string().min(1),
  make: z.string().min(1),
  hasLiveryOrSignage: z.boolean(),
  hasPoliceRadio: z.boolean(),
});

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  patrolId,
}) => {
  const form = useForm<z.infer<typeof addVehicleSchema>>({
    resolver: zodResolver(addVehicleSchema),
    defaultValues: {
      registrationNo: "",
      colour: "",
      model: "",
      make: "",
      hasLiveryOrSignage: false,
      hasPoliceRadio: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof addVehicleSchema>) => {
    try {
      const newVehicle = {
        patrol_id: patrolId,
        registration_no: data.registrationNo,
        colour: data.colour,
        model: data.model,
        make: data.make,
        has_livery_or_signage: data.hasLiveryOrSignage,
        has_police_radio: data.hasPoliceRadio,
        selected: false,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/vehicle`, newVehicle);

      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <div className="max-w-[600px] mx-auto bg-white p-12 mt-[15vh] rounded-3xl">
            <h3 className="text-center mb-6 text-lg font-bold text-cpnz-blue-800">
              Add a Vehicle
            </h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="registrationNo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 mb-2 ">
                      <FormLabel>Registration No</FormLabel>
                      <Input
                        type="text"
                        placeholder="Registration No"
                        {...field}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="colour"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 mb-2 ">
                      <FormLabel>Colour</FormLabel>
                      <Input type="text" placeholder="Colour" {...field} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 mb-2 ">
                      <FormLabel>Model</FormLabel>
                      <Input type="text" placeholder="Model" {...field} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 mb-2 ">
                      <FormLabel>Make</FormLabel>
                      <Input type="text" placeholder="Make" {...field} />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-2 mt-4">
                  <FormField
                    control={form.control}
                    name="hasLiveryOrSignage"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-normal gap-4">
                        <FormLabel className="text-[16px] text-nowrap">
                          Has livery or signage
                        </FormLabel>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="w-5 h-5"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hasPoliceRadio"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-12">
                        <FormLabel className="text-[16px] text-nowrap">
                          Has Police Radio
                        </FormLabel>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="w-5 h-5"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-6 flex items-center justify-between">
                  <CancelButton onClick={onClose} />
                  <Button type="submit" className="bg-cpnz-blue-800">
                    Create
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}

      <div
        className={`${
          isOpen ? "opacity-25 fixed inset-0 z-40 bg-black" : "hidden"
        }`}
      ></div>
    </>
  );
};

export default AddVehicleModal;
