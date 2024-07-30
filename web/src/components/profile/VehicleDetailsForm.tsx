import { FormItem, FormLabel, Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
// import useUserData from "../../hooks/useUserData";
import { formSchema, vehicleDetailsSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import car from "../../assets/images/car.png";
// import { Button } from "@components/ui/button";
// import axios from "axios";
import { useRef, useState, ChangeEvent, useEffect } from "react";

interface VehicleDetailsFormFormProps {
  currentUserVehicles: z.infer<typeof vehicleDetailsSchema>[];
}
type VehicleDetails = z.infer<typeof vehicleDetailsSchema>;

export default function VehicleDetailsForm(props: VehicleDetailsFormFormProps) {
  const vehicleSelectRef = useRef<HTMLSelectElement | null>(null);
  // const [canSaveVehicle, setCanSaveVehicle] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetails | null>(
    null
  );

  // const { refetch } = useUserData();

  useEffect(() => {
    if (props) {
      if (props.currentUserVehicles.length === 0) {
        setSelectedVehicle(null);
      } else {
        setSelectedVehicle(
          props.currentUserVehicles.find((vehicle) => vehicle.selected) || null
        );
      }
    }
  }, [props]);

  // const changeSelectedVehicle = async () => {
  //   try {
  //     const updateSelectedVehicle = {
  //       newVehicle: vehicleSelectRef.current?.value,
  //     };

  //     await axios.patch(
  //       `${import.meta.env.VITE_API_URL}/user/updateUserSelectedVehicle`,
  //       updateSelectedVehicle
  //     );
  //     refetch();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleVehicleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedVehicleName = event.target.value;
    const selectedVehicle = props.currentUserVehicles.find(
      (vehicle) => vehicle.model + " " + vehicle.make === selectedVehicleName
    );
    setSelectedVehicle(selectedVehicle || null);
    // setCanSaveVehicle(true);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  return (
    <div className="my-6 mx-8 space-y-5 text-left px-7">
      <div className="flex items-center justify-start">
        <div>
          <img src={car} alt="car" className="w-10 h-10" />
        </div>
        <h2 className="text-2xl pl-2">VEHICLE DETAILS</h2>
      </div>
      <Form {...form}>
        <Form {...form}>
          <FormItem className="flex flex-col flex-1">
            <FormLabel htmlFor="vehicles">Patrol Vehicle</FormLabel>
            {props.currentUserVehicles.length === 0 ? (
              <p>No vehicles available</p>
            ) : (
              <select
                ref={vehicleSelectRef}
                className="rounded-md px-3 py-2 border-[#CBD5E1] border-[1px]"
                onChange={(event) => {
                  // const selectedVehicleInDatabase =
                  //   props.currentUserVehicles[0];
                  // const selectedVehicleName = event.target.value;
                  // const vehicleChanged =
                  //   selectedVehicleName !==
                  //   selectedVehicleInDatabase?.model +
                  //     " " +
                  //     selectedVehicleInDatabase?.make;
                  // setCanSaveVehicle(vehicleChanged);
                  handleVehicleSelect(event);
                }}
                value={selectedVehicle?.model + " " + selectedVehicle?.make}
              >
                {props.currentUserVehicles.map((vehicle, index) => (
                  <option
                    key={index}
                    value={vehicle.model + " " + vehicle.make}
                  >
                    {vehicle.model + " " + vehicle.make}
                  </option>
                ))}
              </select>
            )}
          </FormItem>
        </Form>
        <div className="flex flex-col gap-8 ">
          <div className="flex flex-col">
            {selectedVehicle && (
              <div className="flex flex-col gap-4">
                <FormItem className="flex flex-col flex-1">
                  <FormLabel htmlFor={`reg-0`}>Registration Number</FormLabel>
                  <Input
                    type="text"
                    id={`reg-0`}
                    name={`reg-0`}
                    value={selectedVehicle.registration_no}
                    disabled
                    className="rounded-md px-3 py-2 border-[#CBD5E1]"
                  />
                </FormItem>
                <FormItem className="flex flex-col flex-1">
                  <FormLabel htmlFor={`colour-0`}>Colour</FormLabel>
                  <Input
                    type="text"
                    id={`colour-0`}
                    name={`colour-0`}
                    value={selectedVehicle.colour}
                    disabled
                    className="rounded-md px-3 py-2 border-[#CBD5E1]"
                  />
                </FormItem>
                <FormItem className="flex flex-col flex-1">
                  <FormLabel htmlFor={`livery-0`}>Livery / Signage</FormLabel>
                  <Input
                    type="text"
                    id={`livery-0`}
                    name={`livery-0`}
                    value={selectedVehicle.has_livery_or_signage ? "Yes" : "No"}
                    disabled
                    className="rounded-md px-3 py-2 border-[#CBD5E1]"
                  />
                </FormItem>
              </div>
            )}
          </div>
          {/* {canSaveVehicle ? (
            <Button onClick={changeSelectedVehicle}>Save</Button>
          ) : (
            <></>
          )} */}
        </div>
      </Form>
    </div>
  );
}
