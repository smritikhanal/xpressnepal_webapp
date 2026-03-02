import { FileText, ShieldCheck, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-maroon via-red-600 to-orange-500 hover:from-maroon hover:via-red-700 hover:to-orange-600 text-white py-16 text-center transition-all duration-300">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl opacity-90">Please read these terms carefully</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Welcome to XpressNepal. By accessing and using this website, you accept and agree to be bound 
              by the terms and conditions outlined below. Please read these terms carefully before using our platform.
            </p>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Important Notice:</strong> These terms and conditions govern your use of the XpressNepal 
                e-commerce platform. By continuing to browse and use this website, you agree to comply with and 
                be bound by these terms.
              </p>
            </div>
          </div>

          {/* Use of Website */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Use of Website</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>1.1 Eligibility:</strong> You must be at least 18 years old to use this platform. 
                By using this website, you represent that you have the legal capacity to enter into a 
                binding agreement.
              </p>
              <p>
                <strong>1.2 Account Registration:</strong> To purchase products, you must create an account. 
                You are responsible for maintaining the confidentiality of your account credentials and for 
                all activities that occur under your account.
              </p>
              <p>
                <strong>1.3 Prohibited Activities:</strong> You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the platform for any illegal purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit viruses or malicious code</li>
                <li>Attempt to gain unauthorized access to the platform</li>
                <li>Harass, abuse, or harm other users</li>
              </ul>
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Product Information & Pricing</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>2.1 Product Descriptions:</strong> We strive to provide accurate product descriptions, 
                images, and specifications. However, we do not warrant that product descriptions or other 
                content is error-free, complete, or current.
              </p>
              <p>
                <strong>2.2 Pricing:</strong> All prices are listed in Nepali Rupees (NPR). We reserve the 
                right to change prices at any time without notice. Prices applicable are those at the time 
                of order placement.
              </p>
              <p>
                <strong>2.3 Availability:</strong> Product availability is subject to change. We reserve the 
                right to limit quantities or discontinue products at any time.
              </p>
            </div>
          </div>

          {/* Orders & Payment */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Orders & Payment</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>3.1 Order Acceptance:</strong> Your order is an offer to purchase products. We reserve 
                the right to accept or reject any order for any reason, including product availability, 
                errors in pricing, or fraud detection.
              </p>
              <p>
                <strong>3.2 Payment Methods:</strong> We accept Cash on Delivery (COD), eSewa, Khalti, and 
                other payment methods as displayed during checkout.
              </p>
              <p>
                <strong>3.3 Order Cancellation:</strong> You may cancel your order within 2 hours of placement. 
                After this period, orders in processing cannot be cancelled.
              </p>
            </div>
          </div>

          {/* Shipping & Delivery */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Shipping & Delivery</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>4.1 Delivery Timeline:</strong> Estimated delivery times are provided during checkout. 
                These are estimates and not guarantees. Delays may occur due to unforeseen circumstances.
              </p>
              <p>
                <strong>4.2 Shipping Address:</strong> You are responsible for providing accurate shipping 
                information. We are not liable for delays or non-delivery due to incorrect address.
              </p>
              <p>
                For detailed shipping information, please visit our 
                <Link href="/shipping" className="text-maroon hover:underline ml-1">Shipping Information</Link> page.
              </p>
            </div>
          </div>

          {/* Returns & Refunds */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Returns & Refunds</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We offer a 7-day return policy for eligible products. Please refer to our 
                <Link href="/return-policy" className="text-maroon hover:underline ml-1">Return Policy</Link> 
                for complete details on eligibility, process, and refund terms.
              </p>
            </div>
          </div>

          {/* User Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Content</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>6.1 Reviews & Ratings:</strong> You may post product reviews and ratings. By doing so, 
                you grant us a non-exclusive, royalty-free license to use, reproduce, and display your content.
              </p>
              <p>
                <strong>6.2 Content Standards:</strong> User content must not be offensive, defamatory, or 
                violate any laws. We reserve the right to remove any content that violates these standards.
              </p>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                All content on this website, including text, graphics, logos, images, and software, is the 
                property of XpressNepal or its content suppliers and is protected by copyright and other 
                intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, or create derivative works from any content without 
                express written permission.
              </p>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                To the fullest extent permitted by law, XpressNepal shall not be liable for any indirect, 
                incidental, special, or consequential damages arising from your use of the platform or 
                purchase of products.
              </p>
              <p>
                Our total liability to you for any claim arising from your use of the platform shall not 
                exceed the amount you paid for the product(s) in question.
              </p>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Your use of this platform is also governed by our 
                <Link href="/privacy" className="text-maroon hover:underline ml-1">Privacy Policy</Link>. 
                Please review it to understand how we collect, use, and protect your personal information.
              </p>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately 
                upon posting. Your continued use of the platform after changes are posted constitutes your 
                acceptance of the modified terms.
              </p>
            </div>
          </div>

          {/* Governing Law */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                These terms shall be governed by and construed in accordance with the laws of Nepal. 
                Any disputes shall be subject to the exclusive jurisdiction of the courts of Nepal.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-maroon flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions About These Terms?</h3>
                <p className="text-gray-700 mb-3">
                  If you have any questions about these terms and conditions, please contact us.
                </p>
                <Link href="/contact">
                  <button className="bg-gradient-to-r from-maroon via-red-600 to-orange-500 hover:from-maroon hover:via-red-700 hover:to-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            Last Updated: January 2025
          </div>
        </div>
      </div>
    </div>
  );
}
