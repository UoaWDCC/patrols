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

export default function Login() {
  const formSchema = z.object({
      email: z.string(),
      password: z
          .string()
          .min(3, { message: 'Password must be at least 3 characters' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
          email: '',
          password: '',
      },
  });

  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { user } = useAuth();

  // Prevent access to login page if user is authenticated
  if (user) {
      return <Navigate to={'/home'} />;
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault(); // Prevents form data being reset when incorrect details entered

      try {
          const session = await axios.post(
              `${import.meta.env.VITE_API_URL}/auth/login`,
              { email: email, password: password }
          );

          const { access_token: accessToken, refresh_token: refreshToken } =
              tokenSchema.parse(session.data.session);

          if (!accessToken || !refreshToken) {
              throw new Error('Missing access token or refresh token');
          }

          const { error: sessionError } = await supabaseClient.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
          });

          if (sessionError) {
              throw new Error('Unable to set session');
          }

          // Navigates to home upon successful login. Can be changed to any route
          navigate('/home');
      } catch (error) {
          axios.isAxiosError(error)
              ? console.log(error.response?.data.error)
              : console.error('Unexpected error during login:', error);
      }
  };

  return (
      <div className="min-h-screen flex flex-col justify-items-center items-center bg-[#eff6ff]">
          <div>
              <img src={cpnzLogo} alt="cpnz logo" className="pt-16" />
          </div>
          <div className="text-center mt-8 px-10">
              <h3 className="font-bold px-10">
                  One sentence description/opening about the community patrols
                  app
              </h3>
          </div>
          <div>
              <h2 className="text-2xl tracking-[0.25px] leading-[28.8px] mb-5 mt-10 text-center">
                  Log In
              </h2>
              <p className="text-xs text-muted-foreground">
                  Please contact XXX if you do not have your login details.
              </p>
          </div>
          <div className="pt-14">
              <Form {...form}>
                  <form onSubmit={onSubmit} className="space-y-5">
                      <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="text-base">
                                      Email
                                  </FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="example@example.com"
                                          {...field}
                                          onChange={(e) =>
                                              setEmail(e.target.value)
                                          }
                                          value={email}
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
                                  <FormLabel className="text-base">
                                      Password
                                  </FormLabel>
                                  <FormControl>
                                      <Input
                                          type="password"
                                          placeholder="Password"
                                          {...field}
                                          value={password}
                                          onChange={(e) =>
                                              setPassword(e.target.value)
                                          }
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <div className="text-center">
                          <a
                              href="#"
                              className="text-xs underline text-muted-foreground"
                          >
                              Forgot your password?
                          </a>
                      </div>
                      <Button
                          type="submit"
                          className="bg-[#0f1363] w-full flex"
                      >
                          Log In
                      </Button>
                  </form>
              </Form>
          </div>
      </div>
  );
}
