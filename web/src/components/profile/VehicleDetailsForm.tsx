import { FormItem, FormLabel, Form } from '@components/ui/form';
import { Input } from '@components/ui/input';
import useUserData from '../../hooks/useUserData';
import { formSchema } from '../../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import car from '../../assets/images/car.png';
import { Button } from '@components/ui/button';
import axios from 'axios';
import { useRef, useState, ChangeEvent } from 'react';
import { Loader2 } from 'lucide-react';

export default function VehicleDetailsForm() {
  const vehicleSelectRef = useRef<HTMLSelectElement | null>(null);
  const [canSaveVehicle, setCanSaveVehicle] = useState(false);

  const { currentUserVehicles, selectedVehicle, setSelectedVehicle, loading } =
    useUserData();

  const changeSelectedVehicle = async () => {
    try {
      const updateSelectedVehicle = {
        // currentVehicle: selectedVehicle[0]?.name,
        newVehicle: vehicleSelectRef.current?.value,
      };

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/user/updateUserSelectedVehicle`,
        updateSelectedVehicle
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleVehicleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedVehicleName = event.target.value;
    const selectedVehicle = currentUserVehicles.find(
      (vehicle) => vehicle.name === selectedVehicleName
    );
    setSelectedVehicle(selectedVehicle || null);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <p>Loading vehicles...</p>
        <Loader2 className="animate-spin ml-4" />
      </div>
    );
  }

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
            {currentUserVehicles.length === 0 ? (
              <p>No vehicles available</p>
            ) : (
              <select
                ref={vehicleSelectRef}
                className="rounded-md px-3 py-2 border-[#CBD5E1] border-[1px]"
                onChange={(event) => {
                  const selectedVehicleInDatabase = currentUserVehicles[0];
                  const selectedVehicleName = event.target.value;
                  const vehicleChanged =
                    selectedVehicleName !== selectedVehicleInDatabase?.name;
                  setCanSaveVehicle(vehicleChanged);
                  handleVehicleSelect(event);
                }}
                value={selectedVehicle?.name}
              >
                {currentUserVehicles.map((vehicle, index) => (
                  <option key={index} value={vehicle.name}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
            )}
          </FormItem>
        </Form>
        <div className="flex flex-col gap-8 ">
          <div className="flex flex-col">
            {selectedVehicle && (
              <>
                <FormItem className="flex flex-col flex-1">
                  <FormLabel htmlFor={`reg-0`}>Registration Number</FormLabel>
                  <Input
                    type="text"
                    id={`reg-0`}
                    name={`reg-0`}
                    value={selectedVehicle.registration_number}
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
                  <FormLabel htmlFor={`livery-0`}>Livery</FormLabel>
                  <Input
                    type="text"
                    id={`livery-0`}
                    name={`livery-0`}
                    value={selectedVehicle.livery ? 'Yes' : 'No'}
                    disabled
                    className="rounded-md px-3 py-2 border-[#CBD5E1]"
                  />
                </FormItem>
              </>
            )}
          </div>
          {canSaveVehicle ? (
            <Button onClick={changeSelectedVehicle}>Save</Button>
          ) : (
            <></>
          )}
        </div>
      </Form>
    </div>
  );
}
