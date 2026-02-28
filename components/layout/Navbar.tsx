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
  Menu,
  X,
  LogOut,
  Package,
  MapPin,
  Settings,
  Sparkles,
  Home
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
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
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { getItemCount, fetchCart, cart } = useCartStore();
  const { getItemCount: getWishlistCount, fetchWishlist, items: wishlistItems } = useWishlistStore();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fetch cart on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  // Fetch wishlist on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  // Update counts when cart or wishlist changes
  useEffect(() => {
    setCartCount(getItemCount());
    setWishlistCount(getWishlistCount());
    setMounted(true);
  }, [cart, wishlistItems, getItemCount, getWishlistCount]);

  const handleLogout = () => {
    clearAuth();
    setTimeout(() => {
      window.location.replace('/auth/login');
    }, 100);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-black shadow-sm">
      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between gap-4 py-3">

          {/* Left Section - Logo & Home */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-accent/5">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/logo.png"
                        alt="XpressNepal"
                        width={45}
                        height={45}
                        className="object-contain"
                      />
                      <div>
                        <h2 className="font-bold text-lg">XpressNepal</h2>
                        <p className="text-xs text-muted-foreground">Shop with joy ✨</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Menu Content */}
                  <nav className="flex-1 p-4 space-y-2">
                    <SheetClose asChild>
                      <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Home className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">Home</span>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                      >
                        <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/30 group-hover:bg-pink-200 dark:group-hover:bg-pink-900/50 transition-colors">
                          <Heart className="h-5 w-5 text-pink-500" />
                        </div>
                        <span className="font-medium">Wishlist</span>
                        {wishlistCount > 0 && (
                          <Badge className="ml-auto bg-pink-500 hover:bg-pink-600">{wishlistCount}</Badge>
                        )}
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link
                        href="/cart"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                      >
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                          <ShoppingCart className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className="font-medium">Cart</span>
                        {cartCount > 0 && (
                          <Badge className="ml-auto bg-blue-500 hover:bg-blue-600">{cartCount}</Badge>
                        )}
                      </Link>
                    </SheetClose>

                    {mounted && isAuthenticated && (
                      <>
                        <div className="pt-4 pb-2">
                          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
                        </div>
                        <SheetClose asChild>
                          <Link
                            href="/user/profile"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                          >
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                              <User className="h-5 w-5 text-purple-500" />
                            </div>
                            <span className="font-medium">My Profile</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/orders"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                          >
                            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                              <Package className="h-5 w-5 text-orange-500" />
                            </div>
                            <span className="font-medium">My Orders</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/user/profile?tab=addresses"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                          >
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                              <MapPin className="h-5 w-5 text-green-500" />
                            </div>
                            <span className="font-medium">My Addresses</span>
                          </Link>
                        </SheetClose>
                        {user?.role === 'admin' && (
                          <SheetClose asChild>
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                            >
                              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
                                <Settings className="h-5 w-5 text-amber-500" />
                              </div>
                              <span className="font-medium">Admin Dashboard</span>
                            </Link>
                          </SheetClose>
                        )}
                      </>
                    )}
                  </nav>

                  {/* Mobile Menu Footer */}
                  <div className="p-4 border-t mt-auto">
                    {mounted && isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 px-2">
                          <Avatar className="h-10 w-10 border-2 border-primary/20">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 font-semibold">
                              {user?.name ? getInitials(user.name) : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-900/30"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <SheetClose asChild>
                          <Link href="/auth/login" className="block">
                            <Button className="w-full rounded-xl bg-primary hover:bg-primary/90">
                              Login
                            </Button>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/auth/register" className="block">
                            <Button variant="outline" className="w-full rounded-xl">
                              Create Account
                            </Button>
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="XpressNepal"
                  width={42}
                  height={42}
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
                {/* <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
              </div>
              <span className="font-bold text-xl hidden sm:block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                XpressNepal
              </span>
            </Link>
          </div>

          {/* Center Section - Search Bar */}
          <div className={`flex-1 max-w-xl hidden md:block transition-all duration-300 ${isSearchFocused ? 'max-w-2xl' : ''}`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl opacity-0 transition-opacity duration-300 ${isSearchFocused ? 'opacity-100' : 'group-hover:opacity-50'}`} />
              <div className="relative flex items-center">
                <Search className={`absolute left-4 h-5 w-5 transition-colors duration-200 ${isSearchFocused ? 'text-primary' : 'text-muted-foreground'}`} />
                <Input
                  type="search"
                  placeholder="Search for amazing products..."
                  className={`w-full pl-12 pr-4 h-12 rounded-full border-2 bg-gray-50 dark:bg-gray-900 transition-all duration-300 ${isSearchFocused
                    ? 'border-primary shadow-lg shadow-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            {mounted && isAuthenticated && (
              <div className="hidden sm:block">
                <NotificationBell />
              </div>
            )}

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-full transition-all duration-200 group"
              >
                <Heart className="h-5 w-5 group-hover:text-pink-500 transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-lg animate-in zoom-in duration-200">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all duration-200 group"
              >
                <ShoppingCart className="h-5 w-5 group-hover:text-blue-500 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg animate-in zoom-in duration-200">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Auth Section - Desktop */}
            <div className="hidden md:flex items-center gap-2 ml-2">
              {mounted && isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full pl-2 pr-4 h-10"
                    >
                      <Avatar className="h-8 w-8 border-2 border-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-sm font-semibold">
                          {user?.name ? getInitials(user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm max-w-24 truncate">{user?.name?.split(' ')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl">
                    <DropdownMenuLabel className="pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 font-semibold">
                            {user?.name ? getInitials(user.name) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link href="/user/profile" className="flex items-center gap-3 py-2">
                        <User className="h-4 w-4 text-purple-500" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link href="/orders" className="flex items-center gap-3 py-2">
                        <Package className="h-4 w-4 text-orange-500" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link href="/user/profile?tab=addresses" className="flex items-center gap-3 py-2">
                        <MapPin className="h-4 w-4 text-green-500" />
                        My Addresses
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                          <Link href="/admin" className="flex items-center gap-3 py-2">
                            <Settings className="h-4 w-4 text-amber-500" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-lg cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/30"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      className="rounded-full px-5 h-10 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button
                      className="rounded-full px-5 h-10 font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Expandable */}
        {isMobileSearchOpen && (
          <div className="md:hidden pb-3 animate-in slide-in-from-top duration-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                  setIsMobileSearchOpen(false);
                }
              }}
              className="relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-12 pr-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
