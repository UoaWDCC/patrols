import axios from "axios";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@components/ui/button";
import { Form, FormItem, FormLabel } from "@components/ui/form";
import placeholder from "../assets/images/placeholder.png";
import { Input } from "@components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const userDetailsSchema = z.object({
  name: z.string(),
  id: z.number(),
  email: z.string().email(),
  vehicles: z.array(z.string()),
});

type UserDetails = z.infer<typeof userDetailsSchema>;

export default function Profile() {
  const [editable, setEditable] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentUserDetails, setCurrentUserDetails] = useState<UserDetails>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Prevent fetchUserData to be called continuously
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/getUserDetails`
        );

        const userDetails = userDetailsSchema.parse(response.data);
        setCurrentUserDetails(userDetails);
        setEmail(userDetails?.email);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (
      password !== "" &&
      confirmPassword !== "" &&
      password !== confirmPassword
    ) {
      setErrorMessage("Passwords do not match");
    } else {
      setErrorMessage("");
    }
  }, [password, confirmPassword]);

  const handleEdit = () => {
    setEditable(true);
  };

  const handleSave = async () => {
    const updatedUserData = {
      id: currentUserDetails?.id,
      email: email,
      password: confirmPassword,
      // vehicles: currentUserDetails?.vehicles,
    };
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/user/updateUserDetails`,
      updatedUserData
    );
    setPassword("");
    setConfirmPassword("");
    setEditable(false);
  };

  const handleCancel = () => {
    setEditable(false);
    setEmail(currentUserDetails!.email);
    setPassword("");
    setConfirmPassword("");
  };

  const formSchema = z.object({
    cpnzID: z.string(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpnzID: "",
      password: "",
      confirmPassword: "",
    },
  });

  //if (!loading) {
    return (
      <div className="text-center flex-col min-h-screen flex max-w-3xl mx-auto">
        <div className="bg-[#eef6ff] h-28 mb-4 flex items-center justify-start pl-8 pt-4">
          <div className="">
            <img
              src={placeholder}
              alt="placeholder"
              className="rounded-full w-12 h-12"
            />
          </div>
          <div>
            <h1 className="font-bold text-left pl-4 text-2xl">Profile</h1>
          </div>
        </div>
        <div className="bg-[#eef6ff] py-6 mx-8 mt-10 space-y-5 text-left pl-7 rounded-md">
          <Form {...form}>
            <FormItem className="flex flex-col pr-8">
              <FormLabel htmlFor="email">
                Email Address{" "}
              </FormLabel>
              <Input
                type="email"
                id="email"
                name="email"
                disabled={!editable}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-md px-3 py-2"
              />
            </FormItem>
            <div className="flex flex-col-2">
            <FormItem className="flex flex-col pr-8 flex-1">
              <FormLabel htmlFor="cpnzId">
                Mobile Number{" "}
              </FormLabel>
              <Input
                type="text"
                id="cpnzId"
                name="cpnzId"
                value={currentUserDetails?.id}
                disabled
                className="rounded-md px-3 py-2"
              />
            </FormItem>
            <FormItem className="flex flex-col pr-8 flex-1">
              <FormLabel htmlFor="id">
                ID{" "}
              </FormLabel>
              <Input
                type="text"
                id="id"
                name="id"
                value={currentUserDetails?.id}
                disabled
                className="rounded-md px-3 py-2"
              />
            </FormItem>
            </div>
            <FormItem className="flex flex-col pr-8">
              <FormLabel htmlFor="password">
                Existing Password{" "}
              </FormLabel>
              <Input
                type="password"
                id="password"
                name="password"
                disabled={!editable}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-md px-3 py-2"
              />
            </FormItem>
            {editable && (
              <FormItem className="flex flex-col pr-8">
                <FormLabel htmlFor="confirmPassword" className="font-semibold">
                  Confirm Password{" "}
                </FormLabel>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-md px-3 py-2"
                />
                {errorMessage && <p>{errorMessage}</p>}
              </FormItem>
            )}
            <FormItem className="flex flex-col pr-8">
              <FormLabel htmlFor="vehicles">
                Vehicles{" "}
              </FormLabel>
              <Input
                type="text"
                id="vehicles"
                name="vehicles"
                disabled={!editable}
                defaultValue={currentUserDetails?.vehicles}
                className="rounded-md px-3 py-2"
              />
            </FormItem>
              {!editable ? (
                <Button
                  onClick={handleEdit}
                  className="bg-cpnz-blue-900 mt-4 flex-1"
                >
                  Change Password
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Button
                    onClick={handleSave}
                    disabled={password != confirmPassword}
                    className="bg-cpnz-blue-900 mt-4"
                  >
                    Save
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={handleCancel}
                    className="border-cpnz-blue-900 mt-4 w-28"
                  >
                    Cancel
                  </Button>
                </div>
              )}
          </Form>
        </div>
      </div>
    );
  }
//}
