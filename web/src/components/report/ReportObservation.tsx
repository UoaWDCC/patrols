import { Button } from "@components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { z } from "zod";
import { formObservationSchema } from "../../schemas";

interface ReportObservationProps {
  form: any;
  observationsList: z.infer<typeof formObservationSchema>;
  setObservationsList: React.Dispatch<
    React.SetStateAction<z.infer<typeof formObservationSchema>>
  >;
}

type Observation = z.infer<typeof formObservationSchema>[number];

enum type {
  observation = "observation",
  intel = "intel",
}

const addObservation = (
  type: type,
  observationsList: Observation[],
  setObservationsList: React.Dispatch<React.SetStateAction<Observation[]>>
) => {
  const date = new Date();
  const newObservation: Observation = {
    location: "",
    description: "",
    time: date,
    category: "",
    type: type,
    displayed: true,
  };
  setObservationsList([...observationsList, newObservation]);
};

const ReportObservation = ({
  form,
  observationsList,
  setObservationsList,
}: ReportObservationProps) => {
  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4">
        {observationsList.map((observation, i) => (
          <div
            className="flex gap-4 items-center"
            key={observation.location + i}
          >
            <div className="mt-8">Observation {i}</div>
            <FormField
              control={form.control}
              name={`location+${i}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} defaultValue={""} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`description+${i}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input type="textarea" {...field} defaultValue={""} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`time${i}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input
                      type="textarea"
                      {...field}
                      value={
                        observation.time.getHours() +
                        ":" +
                        observation.time.getMinutes()
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>

      <Button
        className="mt-6"
        onClick={() =>
          addObservation(
            type.observation,
            observationsList,
            setObservationsList
          )
        }
      >
        Add observation
      </Button>
    </div>
  );
};

export { ReportObservation };
