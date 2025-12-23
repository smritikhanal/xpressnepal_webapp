'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, User, Mail, Lock, ShoppingBag, AlertCircle, Phone, Store } from 'lucide-react';
// import { useAuthStore } from '@/store/auth-store';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['customer', 'seller']),
  // Seller-specific fields
  shopName: z.string().optional(),
  businessDescription: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => {
  if (data.role === 'seller') {
    return data.shopName && data.shopName.length >= 3;
  }
  return true;
}, {
  message: 'Shop name is required for sellers (min 3 characters)',
  path: ['shopName'],
});

const useAuthStore = () => {
  const setAuth = (user: any, token: string) => {
    // Placeholder function to simulate setting auth state
    console.log('User:', user);
    console.log('Token:', token);
  }
  return { setAuth };
}
type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState<'customer' | 'seller'>('customer');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'customer',
    },
  });

  const selectedRole = watch('role');

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'seller') {
      setAccountType('seller');
      setValue('role', 'seller');
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError('');

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          role: data.role,
          ...(data.role === 'seller' && {
            shopName: data.shopName,
            businessDescription: data.businessDescription,
          }),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      // Store auth data
      setAuth(result.data.user, result.data.token);

      // Redirect based on role
      if (result.data.user.role === 'seller') {
        router.push('/seller/dashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Particles */}
      {Array.from({ length: 8 }, (_, i) => ({
        id: i,
        width: 60 + (i * 13) % 80,
        height: 60 + (i * 17) % 80,
        left: (i * 47) % 100,
        top: (i * 31) % 100,
        yOffset: -30 + (i * 19) % 60,
        xOffset: -30 + (i * 23) % 60,
        duration: 12 + (i * 5) % 8,
      })).map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/5"
          style={{
            width: p.width,
            height: p.height,
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
          animate={{
            y: [0, p.yOffset],
            x: [0, p.xOffset],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10"
      >
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardHeader className="space-y-3 text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center"
            >
              <ShoppingBag className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-base">
              Join XpressNepal and start shopping or selling today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Account Type Selection */}
              <div className="space-y-3">
                <Label>Account Type</Label>
                <RadioGroup
                  value={selectedRole}
                  onValueChange={(value) => {
                    setValue('role', value as 'customer' | 'seller');
                    setAccountType(value as 'customer' | 'seller');
                  }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="customer"
                      id="customer"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="customer"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer"
                    >
                      <User className="mb-2 h-6 w-6" />
                      <span className="font-semibold">Customer</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">
                        Shop products
                      </span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="seller"
                      id="seller"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="seller"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer"
                    >
                      <Store className="mb-2 h-6 w-6" />
                      <span className="font-semibold">Seller</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">
                        Sell products
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-10 h-12 border-2 focus-visible:ring-primary"
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 h-12 border-2 focus-visible:ring-primary"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9812345678"
                      className="pl-10 h-12 border-2 focus-visible:ring-primary"
                      {...register('phone')}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Seller-specific fields */}
              {selectedRole === 'seller' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Shop Name *</Label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="shopName"
                        placeholder="My Awesome Shop"
                        className="pl-10 h-12 border-2 focus-visible:ring-primary"
                        {...register('shopName')}
                      />
                    </div>
                    {errors.shopName && (
                      <p className="text-sm text-red-500">{errors.shopName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessDescription">Business Description (Optional)</Label>
                    <Input
                      id="businessDescription"
                      placeholder="Describe what you sell..."
                      className="h-12 border-2 focus-visible:ring-primary"
                      {...register('businessDescription')}
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 border-2 focus-visible:ring-primary"
                      {...register('password')}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 border-2 focus-visible:ring-primary"
                      {...register('confirmPassword')}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
