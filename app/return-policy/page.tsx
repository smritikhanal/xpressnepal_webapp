import { PackageOpen, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-maroon via-red-600 to-orange-500 hover:from-maroon hover:via-red-700 hover:to-orange-600 text-white py-16 text-center transition-all duration-300">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Return & Refund Policy</h1>
          <p className="text-xl opacity-90">Easy returns, hassle-free refunds</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <PackageOpen className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">Our Return Promise</h2>
            </div>
            <p className="text-gray-700 mb-4">
              At XpressNepal, we want you to be completely satisfied with your purchase. If you're not happy 
              with your order, we offer a straightforward return and refund process designed to give you peace of mind.
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Customer First:</strong> Our return policy is designed with your satisfaction in mind, 
              ensuring a hassle-free experience when you need to return or exchange products.
            </p>
          </div>

          {/* Return Window */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-7 h-7 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Return Window</h2>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
              <p className="text-lg font-semibold text-gray-900 mb-2">7-Day Return Policy</p>
              <p className="text-gray-700">
                You have 7 days from the date of delivery to initiate a return. The return window 
                starts from the day you receive your order.
              </p>
            </div>
          </div>

          {/* Eligible Items */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-7 h-7 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">What Can Be Returned?</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Products in original, unused condition</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Items with original packaging and tags intact</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Defective or damaged products</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Wrong items delivered</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Products that don't match description</span>
              </li>
            </ul>
          </div>

          {/* Non-Returnable Items */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-7 h-7 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Non-Returnable Items</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Personal care and hygiene products</span>
              </li>
              <li className="flex gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Innerwear and socks</span>
              </li>
              <li className="flex gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Used or damaged products</span>
              </li>
              <li className="flex gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Products with missing tags or packaging</span>
              </li>
              <li className="flex gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Customized or personalized items</span>
              </li>
            </ul>
          </div>

          {/* Return Process */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Return</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Initiate Return Request</h3>
                  <p className="text-gray-600">
                    Log into your account, go to Orders, select the item you want to return, 
                    and click "Return Item". Provide a reason for the return.
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
                  <h3 className="font-semibold text-gray-900 mb-1">Wait for Approval</h3>
                  <p className="text-gray-600">
                    Our team will review your request within 24 hours and approve it if eligible.
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
                  <h3 className="font-semibold text-gray-900 mb-1">Pickup Arranged</h3>
                  <p className="text-gray-600">
                    Once approved, we'll arrange a pickup from your address at no extra cost.
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
                  <h3 className="font-semibold text-gray-900 mb-1">Quality Check</h3>
                  <p className="text-gray-600">
                    We'll inspect the returned item to ensure it meets return conditions.
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
                  <h3 className="font-semibold text-gray-900 mb-1">Refund Processed</h3>
                  <p className="text-gray-600">
                    Refunds are processed within 5-7 business days after receiving the returned item.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Details */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Information</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Refund Timeline</h3>
                <p className="text-gray-700">
                  Refunds are processed within 5-7 business days. The amount will be credited to 
                  your original payment method.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Cash on Delivery Orders</h3>
                <p className="text-gray-700">
                  For COD orders, refunds will be processed via bank transfer. You'll need to 
                  provide your bank account details.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Digital Wallet Payments</h3>
                <p className="text-gray-700">
                  For eSewa and Khalti payments, refunds will be credited back to your wallet 
                  within 3-5 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-gray-900">Important Notes</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• Shipping charges are non-refundable</li>
              <li>• Return shipping is free if the product is defective or wrong</li>
              <li>• For customer preference returns, return shipping may be charged</li>
              <li>• Please ensure products are in original condition with all accessories</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Need help with a return?</p>
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-maroon via-red-600 to-orange-500 hover:from-maroon hover:via-red-700 hover:to-orange-600 text-white">Contact Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
