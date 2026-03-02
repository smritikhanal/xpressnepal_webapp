'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'General',
    question: 'What is XpressNepal?',
    answer: 'XpressNepal is a comprehensive e-commerce platform that connects buyers and sellers across Nepal. We offer a wide range of products with secure payment options, fast delivery, and excellent customer service. The platform features advanced functionalities for customers, sellers, and administrators to ensure a seamless shopping experience.'
  },
  {
    category: 'General',
    question: 'How do I create an account?',
    answer: 'Click on the "Sign Up" button in the top right corner, fill in your details including name, email, and password, and verify your email address. Once verified, you can start shopping immediately.'
  },
  {
    category: 'Orders',
    question: 'How can I track my order?',
    answer: 'You can track your order by logging into your account and visiting the Orders page, or use our Track Order feature by entering your order ID and email address. You\'ll also receive email notifications at each stage of delivery.'
  },
  {
    category: 'Orders',
    question: 'How long does delivery take?',
    answer: 'Delivery within Kathmandu Valley typically takes 1-3 business days. For locations outside the valley, delivery takes 3-7 business days. You\'ll receive tracking updates via email.'
  },
  {
    category: 'Orders',
    question: 'Can I cancel or modify my order?',
    answer: 'You can cancel or modify your order within 2 hours of placing it. After that, the order enters processing and cannot be changed. Please contact our support team if you need assistance.'
  },
  {
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept multiple payment methods including Cash on Delivery (COD), eSewa, Khalti, and online banking. Choose your preferred payment method during checkout.'
  },
  {
    category: 'Payment',
    question: 'Is it safe to use my payment information?',
    answer: 'Yes, all payment transactions are secure and encrypted. We never store your complete payment information on our servers. Digital wallet payments are processed through their secure gateways.'
  },
  {
    category: 'Returns',
    question: 'What is your return policy?',
    answer: 'We offer a 7-day return policy for most products. Items must be unused, in original packaging, and with all tags attached. See our Return Policy page for complete details.'
  },
  {
    category: 'Returns',
    question: 'How do I return a product?',
    answer: 'Go to your Orders page, select the order, and click "Return Item". Fill in the return reason and we\'ll arrange pickup. Refunds are processed within 5-7 business days after receiving the returned item.'
  },
  {
    category: 'Sellers',
    question: 'Can I sell on XpressNepal?',
    answer: 'Yes! Click on "Become a Seller" to register as a seller. You\'ll need to provide business details and complete verification. Once approved, you can list your products and start selling.'
  },
  {
    category: 'Sellers',
    question: 'What are the seller fees?',
    answer: 'Seller fees are competitive and transparent. We charge a small commission on each sale to maintain and improve the platform. Payment processing fees apply based on the payment method used. Contact our support team for detailed fee structure and partnership plans.'
  },
  {
    category: 'Technical',
    question: 'The website is not loading properly. What should I do?',
    answer: 'Try clearing your browser cache and cookies, or try accessing the site in an incognito/private window. Ensure you\'re using an updated browser like Chrome, Firefox, or Safari. If issues persist, contact our support team.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-maroon via-red-600 to-orange-500 hover:from-maroon hover:via-red-700 hover:to-orange-600 text-white py-16 text-center transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">FAQ</h1>
          </div>
          <p className="text-xl opacity-90 text-center">Frequently Asked Questions</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Intro */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <p className="text-gray-700 text-center">
              Find answers to common questions about XpressNepal. Can't find what you're looking for? 
              <Link href="/contact" className="text-maroon hover:underline ml-1">Contact us</Link>
            </p>
          </div>

          {/* FAQs by Category */}
          {categories.map((category) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{category}</h2>
              <div className="space-y-3">
                {faqs
                  .filter(faq => faq.category === category)
                  .map((faq, index) => {
                    const globalIndex = faqs.indexOf(faq);
                    const isOpen = openIndex === globalIndex;

                    return (
                      <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 pr-8">{faq.question}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

          {/* Contact CTA */}
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
            <p className="text-gray-700 mb-4">
              Our support team is here to help you with any inquiries.
            </p>
            <Link href="/contact">
              <button className="bg-gradient-to-r from-maroon via-red-600 to-orange-500 hover:from-maroon hover:via-red-700 hover:to-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
