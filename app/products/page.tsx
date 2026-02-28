'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Package, 
  X,
  Filter,
  Sparkles,
  TrendingUp,
  Zap,
  Star,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { Product, Category } from '@/types';
import { useCartStore } from '@/store/cart-store';
import { normalizeImageUrl } from '@/lib/utils';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const { addItem } = useCartStore();

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const params = new URLSearchParams();
      
      // Only add filters if they're active
      if (selectedCategory !== 'all') {
        params.append('categoryId', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      // Add pagination only if filters are active
      if (selectedCategory !== 'all' || searchQuery) {
        params.append('page', page.toString());
        params.append('limit', '12');
      }
      
      // Add sort
      if (sortBy === 'price-low') {
        params.append('sort', 'price');
      } else if (sortBy === 'price-high') {
        params.append('sort', '-price');
      }

      const response = await fetch(`${backendUrl}/api/products${params.toString() ? `?${params}` : ''}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched products:', data);
        let fetchedProducts = data.data?.products || [];
        
        // Client-side filter for in-stock products
        if (inStockOnly) {
          fetchedProducts = fetchedProducts.filter((p: Product) => p.stock > 0);
        }
        
        setProducts(fetchedProducts);
        setTotalPages(data.data?.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, sortBy, searchQuery, inStockOnly]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data?.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  // Floating particles background
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10
    })), []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/10"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with Scroll Animation */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="mb-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-orange-500/20 px-6 py-2 rounded-full mb-4 border border-primary/30"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">New Arrivals Daily</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-4 relative"
          >
            <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Discover
            </span>
            <br />
            <span className="relative">
              Amazing Products
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 -z-10"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Shop the latest collection with <span className="text-primary font-semibold">{products.length}</span> handpicked items
          </motion.p>
        </motion.div>

        {/* Top Bar with Filter Toggle & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-8 border-2 border-white/50 relative overflow-hidden"
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-orange-500/5 pointer-events-none" />
          <div className="flex flex-col md:flex-row gap-4 relative z-10">
            {/* Filter Toggle Button */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="h-14 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white font-medium gap-2"
            >
              <Filter className="h-5 w-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>

            {/* Search with Icon Animation */}
            <div className="flex-1 relative group">
              <motion.div
                animate={{ scale: searchQuery ? 1.2 : 1, rotate: searchQuery ? 360 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary group-focus-within:text-primary" />
              </motion.div>
              <Input
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 h-14 border-2 border-primary/20 focus-visible:ring-primary focus-visible:ring-2 focus-visible:border-primary rounded-2xl bg-white/50 text-base font-medium placeholder:text-muted-foreground/60"
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="hidden md:flex gap-2 bg-white/50 p-1 rounded-2xl border-2 border-primary/20">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className={`h-12 w-12 rounded-xl ${viewMode === 'grid' ? 'bg-primary' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Package className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                className={`h-12 w-12 rounded-xl ${viewMode === 'list' ? 'bg-primary' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content: Sidebar + Products Grid */}
        <div className="relative">
          {/* Collapsible Sidebar Filter Drawer - Fixed Overlay */}
          <AnimatePresence>
            {showFilters && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowFilters(false)}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                />
                
                {/* Sidebar */}
                <motion.aside
                  initial={{ x: -320, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -320, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed left-0 top-24 bottom-0 w-80 z-50"
                >
                  <div className="bg-white/95 backdrop-blur-xl rounded-r-3xl shadow-2xl border-2 border-white/50 relative h-full flex flex-col">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-orange-500/5 pointer-events-none" />
                  
                  <div className="relative z-10 space-y-6 p-6 overflow-y-auto flex-1">
                    {/* Categories Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Package className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-lg">Categories</h3>
                      </div>
                      <div className="space-y-2">
                        <Button
                          variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                          className={`w-full justify-start h-12 rounded-xl ${selectedCategory === 'all' ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
                          onClick={() => {
                            setSelectedCategory('all');
                            setPage(1);
                          }}
                        >
                          🏷️ All Categories
                        </Button>
                        {categories.map((category) => (
                          <Button
                            key={category._id}
                            variant={selectedCategory === category._id ? 'default' : 'ghost'}
                            className={`w-full justify-start h-12 rounded-xl ${selectedCategory === category._id ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
                            onClick={() => {
                              setSelectedCategory(category._id);
                              setPage(1);
                            }}
                          >
                            {category.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                    {/* Sort Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-lg">Sort By</h3>
                      </div>
                      <div className="space-y-2">
                        <Button
                          variant={sortBy === 'newest' ? 'default' : 'ghost'}
                          className={`w-full justify-start h-12 rounded-xl ${sortBy === 'newest' ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
                          onClick={() => {
                            setSortBy('newest');
                            setPage(1);
                          }}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Newest First
                        </Button>
                        <Button
                          variant={sortBy === 'price-low' ? 'default' : 'ghost'}
                          className={`w-full justify-start h-12 rounded-xl ${sortBy === 'price-low' ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
                          onClick={() => {
                            setSortBy('price-low');
                            setPage(1);
                          }}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Price: Low → High
                        </Button>
                        <Button
                          variant={sortBy === 'price-high' ? 'default' : 'ghost'}
                          className={`w-full justify-start h-12 rounded-xl ${sortBy === 'price-high' ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
                          onClick={() => {
                            setSortBy('price-high');
                            setPage(1);
                          }}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Price: High → Low
                        </Button>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                    {/* Availability Filter */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Package className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-lg">Availability</h3>
                      </div>
                      <label className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary/5 cursor-pointer transition-colors border-2 border-transparent hover:border-primary/20">
                        <input
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={(e) => {
                            setInStockOnly(e.target.checked);
                            setPage(1);
                          }}
                          className="w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary focus:ring-2"
                        />
                        <span className="font-medium">In Stock Only</span>
                      </label>
                    </div>

                    {/* Active Filters */}
                    <AnimatePresence>
                      {(selectedCategory !== 'all' || searchQuery || inStockOnly) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-4" />
                          <div className="flex items-center gap-2 mb-3">
                            <Filter className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-sm">Active Filters</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedCategory !== 'all' && (
                              <Badge variant="secondary" className="gap-2 py-2 px-3">
                                {categories.find(c => c._id === selectedCategory)?.name}
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={() => {
                                    setSelectedCategory('all');
                                    setPage(1);
                                  }}
                                />
                              </Badge>
                            )}
                            {inStockOnly && (
                              <Badge variant="secondary" className="gap-2 py-2 px-3">
                                In Stock
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={() => {
                                    setInStockOnly(false);
                                    setPage(1);
                                  }}
                                />
                              </Badge>
                            )}
                            {searchQuery && (
                              <Badge variant="secondary" className="gap-2 py-2 px-3">
                                Search: {searchQuery}
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={() => setSearchQuery('')}
                                />
                              </Badge>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <motion.div
              layout
              className={`grid gap-8 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}
            >
              <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                    whileHover={{ y: -12, scale: 1.02 }}
                    onHoverStart={() => setHoveredProduct(product._id)}
                    onHoverEnd={() => setHoveredProduct(null)}
                    className="h-full"
                  >
                    <Link href={`/products/${product.slug}`}>
                      <Card className="group h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-white to-orange-50/30 relative">
                        {/* Hover Glow Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          animate={hoveredProduct === product._id ? { x: [-100, 400] } : {}}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                        
                        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
                          {/* Discount Badge */}
                          {product.discountPrice && product.discountPrice < product.price && (
                            <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 200 }}
                              className="absolute top-3 left-3 z-10"
                            >
                              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg px-3 py-1 text-xs font-bold">
                                <Zap className="h-3 w-3 inline mr-1" />
                                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                              </Badge>
                            </motion.div>
                          )}
                          
                          {/* Wishlist Button */}
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.preventDefault();
                              // Wishlist functionality
                            }}
                          >
                            <Heart className="h-5 w-5 text-primary" />
                          </motion.button>

                          {/* Product Image */}
                          {product.images && product.images.length > 0 ? (
                            <motion.div
                              whileHover={{ scale: 1.15, rotate: 2 }}
                              transition={{ duration: 0.5 }}
                              className="relative w-full h-full"
                            >
                              <Image
                                src={normalizeImageUrl(product.images[0])}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            </motion.div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-24 w-24 text-gray-300" />
                            </div>
                          )}

                          {/* Quick Actions Overlay */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"
                          >
                            <Button 
                              className="w-full bg-primary hover:bg-primary/90 shadow-xl gap-2"
                              onClick={(e) => {
                                e.preventDefault();
                                addItem(product, 1);
                              }}
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Quick Add
                            </Button>
                          </motion.div>
                        </div>

                        <CardHeader className="space-y-3 pb-3">
                          {/* Brand Badge */}
                          {product.brand && (
                            <Badge variant="secondary" className="w-fit text-xs font-semibold">
                              {product.brand}
                            </Badge>
                          )}
                          
                          {/* Product Title */}
                          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                            {product.title}
                          </CardTitle>

                          {/* Rating */}
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product.ratingAvg || 0)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              ({product.ratingCount || 0})
                            </span>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4 pt-0">
                          {/* Price */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {product.discountPrice && product.discountPrice < product.price ? (
                              <>
                                <span className="text-3xl font-black bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                                  NPR {product.discountPrice.toLocaleString()}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  NPR {product.price.toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <span className="text-3xl font-black text-gray-900">
                                NPR {product.price.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* View Details Button */}
                          <Button className="w-full h-11 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/50 transition-all font-semibold">
                            View Details
                            <motion.span
                              className="ml-2"
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              →
                            </motion.span>
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center gap-2 mt-12"
              >
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="border-2"
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    onClick={() => setPage(i + 1)}
                    className={page === i + 1 ? "bg-primary" : "border-2"}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="border-2"
                >
                  Next
                </Button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <Package className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-2">No Products Found</h2>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search query
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}>
              Clear Filters
            </Button>
          </motion.div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
