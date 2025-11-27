'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrainCircuit, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';

const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

type SignUpValues = z.infer<typeof signUpSchema>;
type SignInValues = z.infer<typeof signInSchema>;

export default function LoginPage() {
  const { user, loading: isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/home');
    }
  }, [user, isUserLoading, router]);

  const handleAuthError = (error: any) => {
    let title = 'Authentication Error';
    let description = 'An unexpected error occurred. Please try again.';

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          title = 'Email In Use';
          description = 'This email is already registered. Please sign in instead.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          title = 'Login Failed';
          description = 'Invalid email or password. Please check your credentials and try again.';
          break;
        case 'auth/operation-not-allowed':
          title = 'Sign-in Method Disabled';
          description = 'This sign-in method is currently disabled. Please contact support.';
          break;
        default:
          title = `Auth Error: ${error.code}`;
          description = error.message;
      }
    }
    toast({ variant: 'destructive', title, description });
  };

  const handleSignUp = async (values: SignUpValues) => {
    if (!auth) return;
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: 'Account created successfully!', description: 'You are now signed in.' });
      router.push('/home');
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (values: SignInValues) => {
    if (!auth) return;
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: 'Signed in successfully!' });
      router.push('/home');
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render a loader while checking auth state, or if user is already logged in (and redirecting)
  if (isUserLoading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="container flex min-h-screen items-center justify-center py-12">
      <div className="w-full max-w-md">
         <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center justify-center gap-4 mb-8"
        >
          <BrainCircuit className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-4xl font-bold font-headline text-primary">
              RolePath AI
            </h1>
          </div>
        </motion.div>
        
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
            <Spotlight>
                <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <Card>
                    <CardHeader>
                        <CardTitle>Welcome Back</CardTitle>
                        <CardDescription>
                        Sign in to access your personalized career roadmap.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={signInForm.handleSubmit(handleSignIn)}>
                        <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email-signin">Email</Label>
                            <Input
                            id="email-signin"
                            type="email"
                            placeholder="m@example.com"
                            {...signInForm.register('email')}
                            />
                            {signInForm.formState.errors.email && (
                            <p className="text-xs text-destructive">{signInForm.formState.errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password-signin">Password</Label>
                            <Input id="password-signin" type="password" {...signInForm.register('password')} />
                            {signInForm.formState.errors.password && (
                            <p className="text-xs text-destructive">{signInForm.formState.errors.password.message}</p>
                            )}
                        </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In
                        </Button>
                        </CardFooter>
                    </form>
                    </Card>
                </TabsContent>
                <TabsContent value="signup">
                    <Card>
                    <CardHeader>
                        <CardTitle>Create an Account</CardTitle>
                        <CardDescription>
                        Join now to start building your career path with AI.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={signUpForm.handleSubmit(handleSignUp)}>
                        <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email-signup">Email</Label>
                            <Input id="email-signup" type="email" placeholder="m@example.com" {...signUpForm.register('email')} />
                            {signUpForm.formState.errors.email && (
                            <p className="text-xs text-destructive">{signUpForm.formState.errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password-signup">Password</Label>
                            <Input id="password-signup" type="password" {...signUpForm.register('password')} />
                            {signUpForm.formState.errors.password && (
                            <p className="text-xs text-destructive">{signUpForm.formState.errors.password.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input id="confirm-password" type="password" {...signUpForm.register('confirmPassword')} />
                            {signUpForm.formState.errors.confirmPassword && (
                            <p className="text-xs text-destructive">{signUpForm.formState.errors.confirmPassword.message}</p>
                            )}
                        </div>
                        </CardContent>
                        <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            Sign Up
                        </Button>
                        </CardFooter>
                    </form>
                    </Card>
                </TabsContent>
                </Tabs>
            </Spotlight>
        </motion.div>
      </div>
    </main>
  );
}
