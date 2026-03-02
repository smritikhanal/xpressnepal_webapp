'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, Search, CheckCircle, Truck, MapPin, Home } from 'lucide-react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [tracking, setTracking] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setTracking(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-maroon via-red-600 to-orange-500 hover:from-maroon hover:via-red-700 hover:to-orange-600 text-white py-16 text-center transition-all duration-300">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Track Your Order</h1>
          <p className="text-xl opacity-90">Check the status of your delivery</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Track Form */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">Enter Order Details</h2>
            </div>

            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID
                </label>
                <Input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g., ORD-123456789"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  You can find your order ID in the confirmation email or your orders page
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-maroon via-red-600 to-orange-500 hover:from-maroon hover:via-red-700 hover:to-orange-600 text-white">
                <Search className="w-4 h-4 mr-2" />
                Track Order
              </Button>
            </form>
          </div>

          {/* Alternative Tracking Methods */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Other Ways to Track</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">View All Orders</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Sign in to your account to view all your orders and their current status
                  </p>
                  <Link href="/orders">
                    <Button variant="outline" size="sm" className="border-maroon text-maroon hover:bg-maroon hover:text-white">Go to Orders</Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Package className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email Notifications</h4>
                  <p className="text-gray-600 text-sm">
                    You'll receive email updates at each stage of your order's journey
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Timeline Info */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Typical Delivery Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-orange-500" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Order Confirmed</h4>
                  <p className="text-gray-600 text-sm">Immediately after placing order</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Processing</h4>
                  <p className="text-gray-600 text-sm">1-2 business days</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-maroon" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Out for Delivery</h4>
                  <p className="text-gray-600 text-sm">Within Kathmandu: 1-3 days | Outside Valley: 3-7 days</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Home className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Delivered</h4>
                  <p className="text-gray-600 text-sm">Package delivered to your address</p>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Need help with your order?</p>
            <Link href="/contact">
              <Button variant="outline" className="border-maroon text-maroon hover:bg-maroon hover:text-white">Contact Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
