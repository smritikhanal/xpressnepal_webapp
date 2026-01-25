'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ShoppingCart, Package, Truck, Gift, CreditCard, Tag, Heart, Star, Box } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '../_components/login-form';

// Floating e-commerce icons configuration
const floatingIcons = [
  { Icon: ShoppingCart, left: '5%', top: '15%', size: 'w-12 h-12', delay: 0, duration: 6 },
  { Icon: ShoppingBag, left: '85%', top: '10%', size: 'w-14 h-14', delay: 1, duration: 7 },
  { Icon: Truck, left: '10%', top: '75%', size: 'w-16 h-16', delay: 0.5, duration: 8 },
  { Icon: Package, left: '80%', top: '70%', size: 'w-10 h-10', delay: 2, duration: 5 },
  { Icon: Gift, left: '15%', top: '45%', size: 'w-8 h-8', delay: 1.5, duration: 6 },
  { Icon: CreditCard, left: '90%', top: '40%', size: 'w-10 h-10', delay: 0.8, duration: 7 },
  { Icon: Tag, left: '75%', top: '85%', size: 'w-8 h-8', delay: 2.5, duration: 5 },
  { Icon: Heart, left: '5%', top: '85%', size: 'w-10 h-10', delay: 1.2, duration: 6 },
  { Icon: Star, left: '92%', top: '25%', size: 'w-8 h-8', delay: 0.3, duration: 8 },
  { Icon: Box, left: '3%', top: '30%', size: 'w-10 h-10', delay: 1.8, duration: 7 },
  { Icon: ShoppingBag, left: '70%', top: '5%', size: 'w-8 h-8', delay: 2.2, duration: 6 },
  { Icon: ShoppingCart, left: '25%', top: '90%', size: 'w-10 h-10', delay: 0.7, duration: 7 },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating E-commerce Icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute ${item.size} text-primary/10`}
          style={{ left: item.left, top: item.top }}
          animate={{
            y: [-15, 15, -15],
            x: [-10, 10, -10],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <item.Icon className="w-full h-full" />
        </motion.div>
      ))}

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-primary/10 to-orange-300/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-amber-200/20 to-primary/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardHeader className="space-y-3 text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 rounded-full bg-linear-to-br from-primary to-orange-600 flex items-center justify-center"
            >
              <ShoppingBag className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            
            {/* Login Form */}
            <LoginForm />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  New to XpressNepal?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/register"
                  className="font-semibold text-primary hover:underline"
                >
                  Create Account
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                Want to sell on XpressNepal?{' '}
                <Link
                  href="/auth/register?type=seller"
                  className="font-semibold text-primary hover:underline"
                >
                  Register as Seller
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
