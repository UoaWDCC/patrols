import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import cpnzLogo from "../assets/logo/cpnzLogo.png";
import { supabaseClient } from "../auth-client/SupabaseClient";
import { useNavigate, Navigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { tokenSchema } from "../schemas";
import { Loader2 } from "lucide-react";

export default function Login() {
  const formSchema = z.object({
    cpnzID: z.string(),
    password: z
      .string()
      .min(3, { message: "Password must be at least 3 characters" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpnzID: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const [cpnzID, setCPNZID] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();

  // Prevent access to login page if user is authenticated
  if (user) {
    return <Navigate to={"/home"} />;
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents form data being reset when incorrect details entered
    setIsLoading(true);

    try {
      const session = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { cpnzID: cpnzID as string, password: password }
      );

      const { access_token: accessToken, refresh_token: refreshToken } =
        tokenSchema.parse(session.data.session);

      if (!accessToken || !refreshToken) {
        throw new Error("Missing access token or refresh token");
      }

      const { error: sessionError } = await supabaseClient.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) {
        throw new Error("Unable to set session");
      }

      // Navigates to home upon successful login. Can be changed to any route
      navigate("/home");
    } catch (error) {
      axios.isAxiosError(error)
        ? console.log(error.response?.data.error)
        : console.error("Unexpected error during login:", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#eff6ff] lg:pb-24">
      <div>
        <img src={cpnzLogo} alt="cpnz logo" />
      </div>
      <div className="text-center mt-8 px-10">
        <h3 className="font-bold px-10">
          Empowering communities for a secure tomorrow
        </h3>
      </div>
      <div>
        <h2 className="text-2xl tracking-[0.25px] leading-[28.8px] mb-5 mt-10 text-center">
          Log In
        </h2>
        <p className="text-xs text-muted-foreground">
          If you cannot log in, please contact your Patrol Leader or National
          Office
        </p>
      </div>
      <div className="pt-14">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5">
            <FormField
              control={form.control}
              name="cpnzID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">CPNZ ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="CPNZ ID"
                      {...field}
                      onChange={(e) => setCPNZID(e.target.value)}
                      value={cpnzID}
                      className="w-80"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-[#0f1363] w-full flex items-center gap-4"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
