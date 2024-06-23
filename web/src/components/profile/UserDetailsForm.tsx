import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormItem, FormLabel } from '@components/ui/form';
import { z } from "zod";
import useUserData from "../../hooks/useUserData";
import { useEffect, useState } from "react";
import { supabaseClient as supabase } from "../../auth-client/SupabaseClient";
import { useForm } from "react-hook-form";
import { formSchema, userDetailsSchema } from "../../schemas";

interface UserDetailsFormProps {
  currentUserDetails: z.infer<typeof userDetailsSchema>;
}

export default function UserDetailsForm(props: UserDetailsFormProps) {
  const [editable, setEditable] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { fullName } = useUserData();

  const { cpnz_id, email, mobile_phone } = props.currentUserDetails;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpnzID: "",
      password: "",
      confirmPassword: "",
    },
  });

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

  const handlePasswordChange = async () => {
    const { error } = await supabase.auth.updateUser({
      email: email,
      password: confirmPassword,
    });
    if (error) {
      setErrorMessage(`Error changing password: ${error}`);
    }
    setPassword("");
    setConfirmPassword("");
    setEditable(false);
  };

  const handleCancel = () => {
    setEditable(false);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="bg-[#EEF6FF] py-6 mx-8 my-10 space-y-5 text-left px-7 rounded-md shadow-md">
      <Form {...form}>
        <FormItem className="flex flex-col w-full">
          <FormLabel htmlFor="email">Full Name</FormLabel>
          <Input
            type="text"
            id="fullName"
            name="fullName"
            disabled
            value={fullName}
            className="rounded-md border-[#CBD5E1]"
          />
        </FormItem>
        <div className="flex flex-col-2 gap-4">
          <FormItem className="flex flex-col basis-1/2">
            <FormLabel htmlFor="id">
              ID
              <Input
                type="text"
                id="id"
                name="id"
                value={cpnz_id}
                disabled
                className="rounded-md border-[#CBD5E1]"
              />
            </FormLabel>
          </FormItem>
          <FormItem className="flex flex-col basis-1/2">
            <FormLabel htmlFor="email">
              Email Address
              <Input
                type="email"
                id="email"
                name="email"
                disabled
                value={email}
                className="rounded-md border-[#CBD5E1]"
              />
            </FormLabel>
          </FormItem>
        </div>
        <div className="flex flex-col-2 space-x-6">
          <FormItem className="flex flex-col flex-1">
            <FormLabel htmlFor="cpnzId">
              Mobile Number
              <Input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={mobile_phone}
                disabled
                className="rounded-md border-[#CBD5E1]"
              />
            </FormLabel>
          </FormItem>
        </div>
        {editable && (
          <>
            <div className="flex flex-col-2 gap-4">
              <FormItem className="basis-1/2">
                <FormLabel htmlFor="password">New Password </FormLabel>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-md border-[#CBD5E1]"
                />
              </FormItem>
              <FormItem className="basis-1/2">
                <FormLabel htmlFor="confirmPassword" className="font-semibold">
                  Confirm New Password{" "}
                </FormLabel>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-md border-[#CBD5E1]"
                />
              </FormItem>
            </div>
            {errorMessage && (
              <div className="text-red-600 flex justify-center">
                <p>{errorMessage}</p>
              </div>
            )}
          </>
        )}
        {!editable ? (
          <Button onClick={handleEdit} className="bg-cpnz-blue-900 w-full flex">
            Change Password
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button
              onClick={handlePasswordChange}
              disabled={password !== confirmPassword}
              className="bg-cpnz-blue-900 mt-4 w-28"
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
  );
}
