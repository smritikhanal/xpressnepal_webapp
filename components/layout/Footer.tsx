import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="bg-muted mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">XpressNepal</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted online shopping destination in Nepal. Quality products, fast delivery, and excellent service.
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/return-policy" className="text-muted-foreground hover:text-primary">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📍 Kathmandu, Nepal</li>
              <li>📞 +977 9841234567</li>
              <li>✉️ support@xpressnepal.com</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2025 XpressNepal. All rights reserved to Smriti Khanal.</p>
          <div className="flex gap-4">
            <span>We accept:</span>
            <span className="font-medium">Cash on Delivery | eSewa | Khalti | Cards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
