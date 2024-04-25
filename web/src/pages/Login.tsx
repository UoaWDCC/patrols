import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@components/ui/button';
import { Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage } from '@components/ui/form';
import { Input } from '@components/ui/input';

export default function Login() {
  const formSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(4, { message: 'Password must be at least 4 characters' }),
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen pt-24 flex flex-col justify-items-center items-center bg-[#eff6ff]">
      <div className='text-center'>
        <h3 className="font-bold px-10">One sentence description/opening about the community patrols app</h3>
      </div>
      <div>
        <h2 className="text-2xl tracking-[0.25px] leading-[28.8px] mb-5 mt-20 text-center">Log In</h2>
        <p className="text-xs text-muted-foreground">Please contact XXX if you do not have your login details.</p>
      </div>
      <div className='pt-14'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base'>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} className='w-80'/>
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
                <FormLabel className='text-base'>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='text-center'>
            <a href="#" className="text-xs underline text-muted-foreground">
              Forgot your password?
            </a>
          </div>
          <Button type="submit" className="bg-[#0f1363] w-full flex">
            Log In
          </Button>
        </form>
      </Form>
      </div>
    </div>
  );
};

