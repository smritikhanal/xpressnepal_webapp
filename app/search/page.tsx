'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { normalizeImageUrl } from '@/lib/utils';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sortBy]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      let url = `${backendUrl}/api/products?search=${encodeURIComponent(query)}`;
      
      if (sortBy === 'price-low') {
        url += '&sortBy=price&order=asc';
      } else if (sortBy === 'price-high') {
        url += '&sortBy=price&order=desc';
      } else if (sortBy === 'rating') {
        url += '&sortBy=ratingAvg&order=desc';
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data.products || []);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    await addItem(productId, 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Search className="w-5 h-5" />
            <span>Search results for:</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">&quot;{query}&quot;</h1>
          <p className="text-gray-600 mt-2">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={sortBy === 'relevance' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('relevance')}
            >
              Relevance
            </Button>
            <Button
              variant={sortBy === 'price-low' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('price-low')}
            >
              Price: Low to High
            </Button>
            <Button
              variant={sortBy === 'price-high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('price-high')}
            >
              Price: High to Low
            </Button>
            <Button
              variant={sortBy === 'rating' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('rating')}
            >
              Rating
            </Button>
          </div>
        </div>

        {/* Results */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <Link href="/products">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Link href={`/products/${product.slug}`}>
                    <Image
                      src={normalizeImageUrl(product.images[0] || '/placeholder.png')}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  {product.discountPrice && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </Badge>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`absolute top-2 right-2 bg-white/80 hover:bg-white ${
                      isInWishlist(product._id) ? 'text-red-500' : ''
                    }`}
                    onClick={() => addToWishlist(product)}
                  >
                    <Heart
                      className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`}
                    />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.ratingAvg)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({product.ratingCount})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {product.discountPrice ? (
                      <>
                        <span className="text-xl font-bold text-gray-900">
                          NPR {product.discountPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          NPR {product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-gray-900">
                        NPR {product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
