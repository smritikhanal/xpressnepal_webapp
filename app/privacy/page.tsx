import { Shield, Lock, Eye, Users, Mail, Database, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-maroon via-red-600 to-orange-500 hover:from-maroon hover:via-red-700 hover:to-orange-600 text-white py-16 text-center transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-xl opacity-90 text-center">Your privacy is our priority</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Privacy</h2>
            <p className="text-gray-700 mb-4">
              At XpressNepal, we are committed to protecting your personal information and your right to privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
              you use our e-commerce platform.
            </p>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Privacy Commitment:</strong> We take your privacy seriously and implement industry-standard 
                security measures to protect your personal data. Your information is never sold to third parties, 
                and we only collect data necessary to provide you with the best shopping experience.
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-7 h-7 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1.1 Personal Information</h3>
                <p className="mb-2">When you create an account or make a purchase, we collect:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment information (processed securely through payment gateways)</li>
                  <li>Account credentials (username and encrypted password)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1.2 Transaction Information</h3>
                <p className="mb-2">We collect information about your purchases and interactions:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Order history and transaction details</li>
                  <li>Shopping cart and wishlist items</li>
                  <li>Product reviews and ratings</li>
                  <li>Communication with customer support</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1.3 Technical Information</h3>
                <p className="mb-2">We automatically collect certain technical data:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>IP address and browser information</li>
                  <li>Device type and operating system</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Referral source and clickstream data</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-7 h-7 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">•</div>
                <p><strong>Order Processing:</strong> To process and fulfill your orders, manage payments, 
                and communicate order status</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">•</div>
                <p><strong>Account Management:</strong> To create and manage your account, provide customer support, 
                and send important notifications</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">•</div>
                <p><strong>Personalization:</strong> To personalize your shopping experience, recommend products, 
                and display relevant content</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">•</div>
                <p><strong>Communication:</strong> To send order confirmations, shipping updates, and promotional 
                emails (you can opt-out anytime)</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">•</div>
                <p><strong>Analytics:</strong> To analyze site usage, improve our services, and enhance user experience</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">•</div>
                <p><strong>Security:</strong> To detect and prevent fraud, protect against security threats, 
                and ensure platform safety</p>
              </div>
            </div>
          </div>

          {/* Information Sharing */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-7 h-7 text-maroon" />
              <h2 className="text-2xl font-bold text-gray-900">3. How We Share Your Information</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>We do not sell your personal information. We may share your data with:</p>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3.1 Service Providers</h3>
                <p>
                  We share information with trusted third-party service providers who assist us in operating 
                  the platform, processing payments, and delivering orders (e.g., payment gateways, delivery partners).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3.2 Sellers</h3>
                <p>
                  When you purchase from a seller, we share necessary order information (name, shipping address, 
                  contact details) to facilitate order fulfillment.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3.3 Legal Requirements</h3>
                <p>
                  We may disclose information if required by law, court order, or government regulation, 
                  or to protect our rights and safety.
                </p>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-7 h-7 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">4. Data Security</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                We implement appropriate technical and organizational security measures to protect your 
                personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encrypted data transmission using SSL/TLS protocols</li>
                <li>Secure password storage using industry-standard hashing</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure payment processing through trusted gateways (eSewa, Khalti)</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-sm">
                  <strong>Note:</strong> While we take reasonable measures to protect your information, 
                  no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                </p>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Your Privacy Rights</h2>
            <div className="space-y-4 text-gray-700">
              <p>You have the following rights regarding your personal information:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Access</h3>
                  <p className="text-sm">Request a copy of the personal data we hold about you</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Correction</h3>
                  <p className="text-sm">Update or correct your personal information</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Deletion</h3>
                  <p className="text-sm">Request deletion of your personal data (subject to legal obligations)</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Opt-Out</h3>
                  <p className="text-sm">Unsubscribe from marketing communications</p>
                </div>
              </div>

              <p className="mt-4">
                To exercise any of these rights, please contact us at 
                <a href="mailto:support@xpressnepal.com" className="text-maroon hover:underline ml-1">
                  support@xpressnepal.com
                </a>
              </p>
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Cookies and Tracking</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We use cookies and similar tracking technologies to enhance your experience:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for site functionality (e.g., shopping cart, login)</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors use the site</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
              </ul>
              <p>
                You can control cookies through your browser settings. Note that disabling cookies may 
                affect site functionality.
              </p>
            </div>
          </div>

          {/* Children's Privacy */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Children's Privacy</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Our platform is not intended for users under 18 years of age. We do not knowingly collect 
                personal information from children. If you believe we have collected information from a 
                child, please contact us immediately.
              </p>
            </div>
          </div>

          {/* Changes to Policy */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Changes to This Policy</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any significant 
                changes by posting the new policy on this page and updating the "Last Updated" date. 
                Your continued use of the platform after changes are posted constitutes acceptance of the 
                updated policy.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-maroon flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions About Privacy?</h3>
                <p className="text-gray-700 mb-3">
                  If you have any questions or concerns about this Privacy Policy or our data practices, 
                  please contact us:
                </p>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>Email: <a href="mailto:support@xpressnepal.com" className="text-maroon hover:underline">support@xpressnepal.com</a></p>
                  <p>Phone: +977 9841234567</p>
                  <p>Address: Kathmandu, Nepal</p>
                </div>
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
