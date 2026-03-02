import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Heart, Truck, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-maroon via-red-600 to-orange-500 hover:from-maroon hover:via-red-700 hover:to-orange-600 text-white py-16 text-center transition-all duration-300">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About XpressNepal</h1>
          <p className="text-xl opacity-90">Your trusted e-commerce platform in Nepal</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* About XpressNepal */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About XpressNepal</h2>
            <p className="text-gray-700 mb-4">
              XpressNepal is a modern, full-featured e-commerce platform designed to provide seamless online shopping 
              experiences across Nepal. Our platform connects buyers with trusted sellers, offering a wide range of 
              products from electronics to fashion, home goods, and more.
            </p>
            <p className="text-gray-700 mb-4">
              Built with cutting-edge web technologies, XpressNepal offers a comprehensive marketplace with advanced 
              features including real-time order tracking, secure payment options, seller analytics, admin dashboards, 
              and instant messaging between buyers and sellers.
            </p>
          </section>

          {/* Our Mission */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              At XpressNepal, we're committed to revolutionizing online shopping in Nepal by providing a reliable, 
              user-friendly platform that brings together quality products, competitive prices, and excellent customer service.
            </p>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
              <p className="text-gray-700">
                Developed by <span className="font-semibold text-maroon">Smriti Khanal</span>, a skilled full-stack developer 
                specializing in modern web technologies including Next.js, React, TypeScript, Node.js, Express, and MongoDB.
              </p>
            </div>
          </section>

          {/* Features */}
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <ShoppingBag className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Easy Shopping</h3>
                  <p className="text-gray-600 text-sm">
                    Browse thousands of products with advanced search and filtering options.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Truck className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                  <p className="text-gray-600 text-sm">
                    Quick and reliable delivery service across Nepal.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Shield className="w-8 h-8 text-maroon" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
                  <p className="text-gray-600 text-sm">
                    Multiple payment options including Cash on Delivery, eSewa, and Khalti.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Heart className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Customer Support</h3>
                  <p className="text-gray-600 text-sm">
                    Dedicated support team ready to help with your queries.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Technologies */}
          {/* <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technologies Used</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Next.js 14', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Zustand'].map((tech) => (
                <div key={tech} className="bg-gray-50 rounded-lg p-3 text-center">
                  <span className="font-medium text-gray-700">{tech}</span>
                </div>
              ))}
            </div>
          </section> */}

          {/* CTA */}
          <div className="text-center">
            <Link href="/products">
              <Button size="lg" className="bg-gradient-to-r from-maroon via-red-600 to-orange-500 hover:from-maroon hover:via-red-700 hover:to-orange-600 text-white">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
