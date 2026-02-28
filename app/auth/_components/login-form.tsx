import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { handleLogin } from "@/lib/actions/auth-action";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { setAuth, clearAuth } = useAuthStore();
  const { mergeGuestWishlist } = useWishlistStore();

  // Clear any stale auth state when login page loads
  useEffect(() => {
    clearAuth();
  }, [clearAuth]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormData) => {
    setError(null);
    startTransition(async () => {
      try {
        const response = await handleLogin(values);
        if (response.success) {
          setAuth(response.data.user, response.data.token);
          // Merge any guest wishlist items into the DB
          mergeGuestWishlist();
          toast.success(`Welcome back, ${response.data.user.name}!`);
          
          // Use window.location for reliable redirect after login
          if (response.data.user.role === "superadmin") {
            window.location.href = "/admin/dashboard";
          } else if (response.data.user.role === "seller") {
            window.location.href = "/seller/dashboard";
          } else {
            window.location.href = "/";
          }
        } else {
            setError(response.message);
            toast.error(response.message);
        }
      } catch (err: any) {
        const errorMsg = err.message || "Login failed";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="pl-10 h-12 border-2 focus-visible:ring-primary"
            {...register("email")}
            disabled={isPending}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/auth/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-10 h-12 border-2 focus-visible:ring-primary"
            {...register("password")}
            disabled={isPending}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
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
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
