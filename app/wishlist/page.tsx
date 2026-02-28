'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  ShoppingCart,
  X,
  Star,
  Package,
  Sparkles
} from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist-store';
import { useCartStore } from '@/store/cart-store';
import { normalizeImageUrl } from '@/lib/utils';
import { useEffect } from 'react';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist, fetchWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white relative overflow-hidden">
        {/* Floating Background Particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/5"
            style={{
              width: Math.random() * 80 + 40,
              height: Math.random() * 80 + 40,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-pink-200 flex items-center justify-center">
              <Heart className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Save items you love by clicking the heart icon.
            </p>
            <Link href="/products">
              <Button size="lg" className="h-14 px-8 text-lg rounded-2xl bg-primary hover:bg-primary/90 shadow-lg">
                <Package className="h-6 w-6 mr-2" />
                Browse Products
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white relative overflow-hidden">
      {/* Floating Background Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/5"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-5xl font-bold mb-2 flex items-center gap-3">
              <Heart className="h-12 w-12 text-red-500 fill-red-500" />
              <span className="bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
                My Wishlist
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              className="h-12 rounded-2xl border-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300"
              onClick={clearWishlist}
            >
              Clear All
            </Button>
          )}
        </motion.div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((product, index) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="h-full"
              >
                <Card className="group overflow-hidden border border-border shadow-md hover:shadow-xl transition-all duration-300 bg-white flex flex-col h-full relative">
                  {/* Product Image */}
                  <Link href={`/products/${product.slug}`} className="relative block">
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Image
                        src={normalizeImageUrl(product.images?.[0])}
                        alt={product.title}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Discount Badge */}
                      {product.discountPrice && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5">
                          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </Badge>
                      )}
                    </div>
                  </Link>

                  {/* Remove Button — overlays top-right of image */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/90 shadow hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemove(product._id)}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>

                  <CardContent className="p-4 flex flex-col flex-1 gap-2">
                    {/* Brand — fixed height slot */}
                    <div className="h-5">
                      {product.brand && (
                        <Badge variant="outline" className="text-xs">
                          {product.brand}
                        </Badge>
                      )}
                    </div>

                    {/* Title — always 2-line height */}
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-semibold text-sm leading-snug line-clamp-2 min-h-10 hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.ratingAvg || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.ratingCount || 0})
                      </span>
                    </div>

                    {/* Price — fixed height */}
                    <div className="flex items-baseline gap-2 min-h-8">
                      <span className="text-lg font-bold text-primary">
                        NPR {(product.discountPrice || product.price).toLocaleString()}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          NPR {product.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-1.5 text-xs">
                      {product.stock > 0 ? (
                        <>
                          <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                          <span className="text-green-600 font-medium">In Stock</span>
                        </>
                      ) : (
                        <>
                          <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                          <span className="text-red-600 font-medium">Out of Stock</span>
                        </>
                      )}
                    </div>

                    {/* Add to Cart Button — pushed to bottom */}
                    <div className="mt-auto pt-2">
                      <Button
                        className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 gap-2 text-sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Continue Shopping */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 rounded-2xl border-2 border-primary/20 hover:border-primary"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Discover More Products
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
