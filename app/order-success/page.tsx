'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Package,
  Truck,
  Home,
  ShoppingBag,
  Calendar,
  CreditCard,
  MapPin,
  Loader2,
  PartyPopper
} from 'lucide-react';
import { normalizeImageUrl } from '@/lib/utils';

interface OrderDetails {
  _id: string;
  orderNumber: string;
  items: Array<{
    productId: {
      title: string;
      images: string[];
      slug: string;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  address?: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${backendUrl}/api/orders/${orderId}`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.data);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }
    fetchOrderDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const paymentMethodNames: Record<string, string> = {
    cod: 'Cash on Delivery',
    esewa: 'eSewa',
    khalti: 'Khalti',
    card: 'Credit/Debit Card',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  const confetti = useMemo(() => {
    const colors = ['#FF6B35', '#F7931E', '#FDC830', '#4ECDC4', '#44A8F5'];
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      color: colors[i % 5],
      left: (i * 43) % 100,
      xOffset: -100 + (i * 23) % 200,
      rotation: (i % 2 === 0 ? 1 : -1) * 360,
      duration: 2 + (i * 7) % 3,
      delay: (i * 3) % 5 / 10,
    }));
  }, []);

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white relative overflow-hidden">
      {/* Confetti Animation */}
      {confetti.map((c) => (
        <motion.div
          key={c.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: c.color,
            left: `${c.left}%`,
            top: -20,
          }}
          animate={{
            y: [0, typeof window !== 'undefined' ? window.innerHeight + 100 : 900],
            x: [0, c.xOffset],
            rotate: [0, c.rotation],
            opacity: [1, 0],
          }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            ease: "easeOut",
          }}
        />
      ))}

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="max-w-2xl mx-auto text-center mb-8"
        >
          <div className="relative inline-block mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl"
            >
              <CheckCircle2 className="h-16 w-16 text-white" />
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -top-2 -right-2"
            >
              <PartyPopper className="h-12 w-12 text-yellow-500" />
            </motion.div>
          </div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent"
          >
            Order Placed Successfully!
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-muted-foreground mb-6"
          >
            Thank you for your purchase. Your order has been confirmed.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl border-2 border-white/50 rounded-2xl px-6 py-3 shadow-lg"
          >
            <Package className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-lg font-bold text-primary">{order.orderNumber || order._id}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Order Details */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Delivery Timeline */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Truck className="h-6 w-6 text-primary" />
                  Delivery Status
                </h2>
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 h-1 bg-gradient-to-r from-green-500 to-gray-300"></div>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="flex-1 h-1 bg-gray-300"></div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                <div className="flex justify-between mt-3 text-sm">
                  <span className="text-green-600 font-semibold">Order Placed</span>
                  <span className="text-muted-foreground">Processing</span>
                  <span className="text-muted-foreground">Delivered</span>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Estimated Delivery:</strong> Your order will be delivered within 3-5 business days.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Information */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Order Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Date */}
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="font-semibold">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="font-semibold">{paymentMethodNames[order.paymentMethod] || order.paymentMethod}</p>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-200">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-semibold text-xl text-primary">NPR {order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200">
                      <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order Status</p>
                      <Badge className="mt-1 bg-green-500 capitalize">{order.status}</Badge>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                {order.address && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-red-100 to-red-200">
                        <MapPin className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Delivery Address</p>
                        <p className="font-semibold">{order.address.fullName}</p>
                        <p className="text-sm">{order.address.phone}</p>
                        <p className="text-sm">
                          {order.address.addressLine1}
                          {order.address.addressLine2 && `, ${order.address.addressLine2}`}
                        </p>
                        <p className="text-sm">
                          {order.address.city}, {order.address.state} - {order.address.zipCode}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gradient-to-br from-orange-50/50 to-transparent rounded-xl"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                        <Image
                          src={normalizeImageUrl(item.productId.images[0])}
                          alt={item.productId.title}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/products/${item.productId.slug}`}
                          className="font-semibold hover:text-primary transition-colors"
                        >
                          {item.productId.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-primary">
                          NPR {(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          NPR {item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/products">
              <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 w-full sm:w-auto">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link href="/orders">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl w-full sm:w-auto">
                <Package className="h-5 w-5 mr-2" />
                View All Orders
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl w-full sm:w-auto">
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white flex items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
