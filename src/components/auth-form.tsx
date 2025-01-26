import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './auth-provider';

interface AuthFormProps {
  onSuccess: () => void;
}

interface FormData {
  email: string;
  password: string;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signIn } = useAuth();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error('Error signing in:', error);
        toast({
          title: 'Error signing in',
          description: 'Invalid credentials. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Signed in successfully',
        description: 'You are now logged in.',
      });

      if (signInData?.session) {
        await supabase.auth.setSession(signInData.session);
        signIn(signInData.session); // Use the signIn function from useAuth if it handles session
        onSuccess();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Unexpected error',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full"
          />
          {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="w-full"
          />
          {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}
