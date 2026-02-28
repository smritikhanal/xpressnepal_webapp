import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, User, Mail, Lock, ShoppingBag, AlertCircle, Phone, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { handleRegister } from "@/lib/actions/auth-action";

type RegisterFormData = z.infer<typeof registerSchema>;

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['customer', 'seller']),
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

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [accountType, setAccountType] = useState<'customer' | 'seller'>('customer');
  const { setAuth } = useAuthStore();
  const { mergeGuestWishlist } = useWishlistStore();

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

  const onSubmit = async (values: RegisterFormData) => {
    setError(null);
    startTransition(async () => {
      try {
        const payload = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password,
          role: values.role,
          ...(values.role === 'seller' && {
            shopName: values.shopName,
            businessDescription: values.businessDescription,
          }),
        };

        const response = await handleRegister(payload);
        
        if (response.success) {
          setAuth(response.data.user, response.data.token);
          // Merge any guest wishlist items into the DB
          mergeGuestWishlist();
          // Use window.location for reliable redirect after registration
          if (response.data.user.role === 'seller') {
            window.location.href = '/seller/dashboard';
          } else {
            window.location.href = '/';
          }
        } else {
             setError(response.message);
        }
      } catch (err: any) {
        setError(err.message || 'Registration failed');
      }
    });
  };

  return (
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
                  disabled={isPending}
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
                    disabled={isPending}
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
                      disabled={isPending}
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
                      disabled={isPending}
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
                        disabled={isPending}
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
                      disabled={isPending}
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
                      disabled={isPending}
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
                      disabled={isPending}
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
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
  );
}
