import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { signOut } from '@/lib/auth';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from './auth-provider';

type AuthFormProps = {
  onSuccess: () => void;
};

export function AuthForm({ onSuccess }: AuthFormProps) {
  const { register, handleSubmit, formState } = useForm();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn } = useAuth();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (isSignUp) {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (error) {
          console.error('Error signing up:', error);
          toast({
            title: 'Error signing up',
            description: 'Please try again.',
            variant: 'destructive',
          });
          return;
        }
        toast({
          title: 'Signed up successfully',
          description: 'Please check your email to verify your account.',
        });
        if (signUpData?.session) {
          await supabase.auth.setSession(signUpData.session);
          await signIn();
          onSuccess();
        }
      } else {
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
          onSuccess();
        }
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

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      toast({
        title: 'Signed out successfully',
        description: 'You are now logged out.',
      });
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error signing out',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email', { required: true })}
            className="h-7 px-2 py-0.5"
          />
          {formState?.errors?.email && <span className="text-sm text-red-500">This field is required</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password', { required: true })}
            className="h-7 px-2 py-0.5"
          />
          {formState?.errors?.password && <span className="text-sm text-red-500">This field is required</span>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
        </Button>
      </form>
      <div className="flex items-center mt-4">
        <Checkbox
          id="signUpToggle"
          checked={isSignUp}
          onCheckedChange={setIsSignUp}
        />
        <label
          htmlFor="signUpToggle"
          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Create an account
        </label>
      </div>
      <Button
        variant="outline"
        className="mt-4 w-full max-w-sm"
        onClick={handleSignOut}
        disabled={loading}
      >
        {loading ? 'Signing out...' : 'Sign Out'}
      </Button>
    </div>
  );
}
