'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Heart,
  Menu
} from 'lucide-react';
import { NotificationBell } from '@/components/NotificationBell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';
import { Category } from '@/types';

export default function Navbar() {
  const router = useRouter();
  // const { isAuthenticated, user, clearAuth } = useAuthStore();
  // const { getItemCount, fetchCart, cart } = useCartStore();
  // const { getItemCount: getWishlistCount } = useWishlistStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const isAuthenticated = false; // Replace with actual auth state
  const user = null;
  const fetchCart = () => {}; // Replace with actual fetch cart function
  const getItemCount = () => 0; // Replace with actual get item count function
  const getWishlistCount = () => 0;
  

  // Fetch cart on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  // Update counts when cart or wishlist changes
  useEffect(() => {
    setCartCount(getItemCount());
    setWishlistCount(getWishlistCount());
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/categories?limit=4`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data?.categories || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    clearAuth();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 p-4 rounded">
            <Image
              src="/logo.png"
              alt="XpressNepal"
              width={50}
              height={50}
              className="object-contain"
            />
          </Link>

          {/* Categories - Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link 
                  key={category._id}
                  href={`/categories/${category.slug}`} 
                  className="hover:text-primary transition-colors whitespace-nowrap"
                >
                  {category.name}
                </Link>
              ))
            ) : (
              <>
                <Link href="/categories/electronics" className="hover:text-primary transition-colors whitespace-nowrap">
                  Electronics
                </Link>
                <Link href="/categories/fashion" className="hover:text-primary transition-colors whitespace-nowrap">
                  Fashion
                </Link>
              </>
            )}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
              className="relative w-full"
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Auth Buttons */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    <User className="h-4 w-4 mr-2" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login" className="hidden md:block">
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register" className="hidden md:block">
                  <Button variant="ghost" className="rounded-full px-6">
                    Register
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {/* Quick Links */}
                  <div className="border-b pb-4 mb-4">
                    <Link href="/wishlist" className="text-lg font-medium flex items-center gap-2 mb-3">
                      <Heart className="h-5 w-5" />
                      Wishlist
                      {wishlistCount > 0 && (
                        <Badge className="bg-red-500">{wishlistCount}</Badge>
                      )}
                    </Link>
                    <Link href="/cart" className="text-lg font-medium flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Cart
                      {cartCount > 0 && (
                        <Badge>{cartCount}</Badge>
                      )}
                    </Link>
                  </div>

                  {categories.length > 0 ? (
                    <>
                      {categories.map((category) => (
                        <Link 
                          key={category._id}
                          href={`/categories/${category.slug}`} 
                          className="text-lg font-medium"
                        >
                          {category.name}
                        </Link>
                      ))}
                      <Link href="/categories" className="text-lg font-medium">
                        All Categories
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/categories/electronics" className="text-lg font-medium">
                        Electronics
                      </Link>
                      <Link href="/categories/fashion" className="text-lg font-medium">
                        Fashion
                      </Link>
                      <Link href="/categories" className="text-lg font-medium">
                        All Categories
                      </Link>
                    </>
                  )}
                  {!isAuthenticated && (
                    <>
                      <div className="border-t pt-4 mt-4">
                        <Link href="/auth/login" className="text-lg font-medium block mb-3">
                          Login
                        </Link>
                        <Link href="/auth/register" className="text-lg font-medium block">
                          Register
                        </Link>
                      </div>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
