import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@components/ui/button';
import { Form, 
  FormControl, 
  FormDescription,
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
    <div className="min-h-screen text-center pt-24 flex flex-col justify-items-center items-center bg-[#eff6ff]">
      <div>
        <h3 className="font-bold">One sentence description/opening about the community patrols app</h3>
      </div>
      <div>
        <h2 className="text-2xl tracking-[0.25px] leading-[28.8px] mb-4 mt-20">Log In</h2>
        <p className="text-xs text-muted-foreground">Please contact XXX if you do not have your login details.</p>
      </div>
    </div>
  );
};

