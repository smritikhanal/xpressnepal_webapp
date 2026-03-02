import { Truck, MapPin, Clock, Package, DollarSign, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-maroon via-red-600 to-orange-500 hover:from-maroon hover:via-red-700 hover:to-orange-600 text-white py-16 text-center transition-all duration-300">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping Information</h1>
          <p className="text-xl opacity-90">Fast and reliable delivery across Nepal</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">Our Shipping Promise</h2>
            </div>
            <p className="text-gray-700 mb-4">
              We strive to deliver your orders as quickly as possible. All orders are processed promptly 
              and shipped with trusted delivery partners across Nepal, ensuring safe and timely delivery.
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Nationwide Coverage:</strong> XpressNepal delivers to all major cities and remote areas 
              across Nepal, bringing quality products right to your doorstep.
            </p>
          </div>

          {/* Delivery Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-7 h-7 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Delivery Timeline</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6">
                <MapPin className="w-8 h-8 text-orange-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Within Kathmandu Valley</h3>
                <p className="text-3xl font-bold text-orange-500 mb-2">1-3 Days</p>
                <p className="text-gray-600 text-sm">
                  Express delivery available for select areas. Standard delivery for all locations.
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6">
                <MapPin className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Outside Valley</h3>
                <p className="text-3xl font-bold text-red-600 mb-2">3-7 Days</p>
                <p className="text-gray-600 text-sm">
                  Delivery time varies based on location. Remote areas may take additional 1-2 days.
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Charges */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-7 h-7 text-maroon" />
              <h2 className="text-2xl font-bold text-gray-900">Shipping Charges</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Kathmandu Valley</p>
                  <p className="text-sm text-gray-600">Standard delivery</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">Rs. 50</p>
                  <p className="text-sm text-green-600">Free above Rs. 1,000</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Outside Valley - Major Cities</p>
                  <p className="text-sm text-gray-600">Pokhara, Chitwan, Biratnagar, etc.</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">Rs. 100</p>
                  <p className="text-sm text-green-600">Free above Rs. 2,000</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Remote Areas</p>
                  <p className="text-sm text-gray-600">Hill and mountain regions</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">Rs. 150</p>
                  <p className="text-sm text-green-600">Free above Rs. 3,000</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Free Shipping</p>
                  <p className="text-sm text-gray-700">
                    Enjoy free shipping when your order value exceeds the minimum amount for your location!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Process */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-7 h-7 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">How Shipping Works</h2>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Order Confirmation</h3>
                  <p className="text-gray-600">
                    Once you place an order, you'll receive a confirmation email with order details.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Processing</h3>
                  <p className="text-gray-600">
                    Our team processes your order within 1-2 business days. You'll be notified when it's ready for shipment.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Dispatch</h3>
                  <p className="text-gray-600">
                    Your order is dispatched with our delivery partner. You'll receive tracking information via email and SMS.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Out for Delivery</h3>
                  <p className="text-gray-600">
                    Our delivery partner will contact you before delivery. Make sure someone is available to receive the package.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-600">
                    5
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Delivered</h3>
                  <p className="text-gray-600">
                    Package delivered to your address. Please check the items before accepting delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Important Information</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Order Tracking</p>
                  <p className="text-gray-600 text-sm">
                    Track your order anytime using the tracking link sent to your email or visit the 
                    <Link href="/track-order" className="text-blue-600 hover:underline ml-1">Track Order</Link> page.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Delivery Attempts</p>
                  <p className="text-gray-600 text-sm">
                    Our delivery partner will make up to 3 delivery attempts. If unsuccessful, the order 
                    will be returned to our warehouse.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Package Inspection</p>
                  <p className="text-gray-600 text-sm">
                    You can inspect the package before accepting delivery. If there's any damage, 
                    please refuse the delivery and contact us immediately.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Address Accuracy</p>
                  <p className="text-gray-600 text-sm">
                    Please ensure your delivery address is complete and accurate. Include landmarks 
                    and contact number for smooth delivery.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Holidays & Weekends</p>
                  <p className="text-gray-600 text-sm">
                    We deliver on all days except major public holidays. Delivery times may vary 
                    during festival seasons.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Questions about shipping?</p>
            <Link href="/faq">
              <button className="bg-gradient-to-r from-maroon via-red-600 to-orange-500 hover:from-maroon hover:via-red-700 hover:to-orange-600 text-white px-6 py-2 rounded-lg transition-colors mr-3">
                View FAQ
              </button>
            </Link>
            <Link href="/contact">
              <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-2 rounded-lg transition-colors">
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
