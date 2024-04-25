import React from 'react';
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
    email: z.string().email('Invalid email format').min(2, { message: 'Email must be at least 2 characters' }),
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
    <div>
    </div>
  );
};

