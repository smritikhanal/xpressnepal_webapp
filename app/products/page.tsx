'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Package,
  X,
  SlidersHorizontal,
  Star,
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  LayoutGrid,
  List,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { Product, Category } from '@/types';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { normalizeImageUrl } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
];

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
  const [addedId, setAddedId] = useState<string | null>(null);

  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('categoryId', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'all' || searchQuery) {
        params.append('page', page.toString());
        params.append('limit', '12');
      }
      if (sortBy === 'price-low') params.append('sort', 'price');
      else if (sortBy === 'price-high') params.append('sort', '-price');

      const response = await fetch(`${backendUrl}/api/products${params.toString() ? `?${params}` : ''}`);
      if (response.ok) {
        const data = await response.json();
        let fetched: Product[] = data.data?.products || [];
        if (inStockOnly) fetched = fetched.filter((p) => p.stock > 0);
        if (sortBy === 'rating') fetched = [...fetched].sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
        setProducts(fetched);
        setTotalPages(data.data?.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, sortBy, searchQuery, inStockOnly]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data?.categories || []);
      }
    } catch {}
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    await addItem(productId, 1);
    setAddedId(productId);
    setTimeout(() => setAddedId(null), 1800);
  };

  const handleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    isInWishlist(product._id) ? removeFromWishlist(product._id) : addToWishlist(product);
  };

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (selectedCategory !== 'all') n++;
    if (inStockOnly) n++;
    if (searchQuery) n++;
    return n;
  }, [selectedCategory, inStockOnly, searchQuery]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setInStockOnly(false);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
                XpressNepal Store
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                All Products
              </h1>
              {!loading && (
                <p className="text-sm text-gray-500 mt-1">
                  {products.length} item{products.length !== 1 ? 's' : ''} found
                </p>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="pl-9 pr-9 h-11 rounded-xl border-gray-200 bg-gray-50 focus-visible:ring-primary focus-visible:bg-white text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* ── Toolbar ── */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium border transition-colors ${
                showFilters
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Category pills */}
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => { setSelectedCategory('all'); setPage(1); }}
                className={`h-9 px-4 rounded-lg text-sm font-medium border transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                All
              </button>
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => { setSelectedCategory(cat._id); setPage(1); }}
                  className={`h-9 px-4 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap ${
                    selectedCategory === cat._id
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Right side: sort + view */}
            <div className="ml-auto flex items-center gap-2">
              {/* Sort */}
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="h-9 pl-8 pr-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* View toggle */}
              <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`h-9 w-9 flex items-center justify-center transition-colors ${
                    viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`h-9 w-9 flex items-center justify-center transition-colors ${
                    viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Expanded Filter Row ── */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-gray-100 flex flex-wrap items-center gap-4">
                  {/* In Stock */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div
                      onClick={() => { setInStockOnly(!inStockOnly); setPage(1); }}
                      className={`w-10 h-5 rounded-full transition-colors relative ${inStockOnly ? 'bg-primary' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${inStockOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">In Stock Only</span>
                  </label>

                  {/* Active filter chips */}
                  {activeFilterCount > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedCategory !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                          {categories.find((c) => c._id === selectedCategory)?.name}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => { setSelectedCategory('all'); setPage(1); }} />
                        </span>
                      )}
                      {searchQuery && (
                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                          "{searchQuery}"
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                        </span>
                      )}
                      {inStockOnly && (
                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                          In Stock
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setInStockOnly(false)} />
                        </span>
                      )}
                      <button onClick={clearFilters} className="text-xs text-gray-500 underline hover:text-gray-800">
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Product Grid ─────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <motion.div
              layout
              className={`grid gap-5 ${
                viewMode === 'grid'
                  ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                  : 'grid-cols-1'
              }`}
            >
              <AnimatePresence mode="popLayout">
                {products.map((product, index) => {
                  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
                  const discountPct = hasDiscount
                    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
                    : 0;
                  const wishlisted = isInWishlist(product._id);
                  const justAdded = addedId === product._id;

                  if (viewMode === 'list') {
                    return (
                      <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Link href={`/products/${product.slug}`}>
                          <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex gap-4 p-4 overflow-hidden">
                            {/* Image */}
                            <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-gray-50">
                              {product.images?.[0] ? (
                                <Image
                                  src={normalizeImageUrl(product.images[0])}
                                  alt={product.title}
                                  fill
                                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-10 w-10 text-gray-300" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                {product.brand && (
                                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{product.brand}</p>
                                )}
                                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                  {product.title}
                                </h3>
                                <div className="flex items-center gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.ratingAvg || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                                  ))}
                                  <span className="text-xs text-gray-400 ml-1">({product.ratingCount || 0})</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-base font-black text-gray-900">
                                    NPR {(hasDiscount ? product.discountPrice! : product.price).toLocaleString()}
                                  </span>
                                  {hasDiscount && (
                                    <span className="text-xs text-gray-400 line-through">NPR {product.price.toLocaleString()}</span>
                                  )}
                                </div>
                                <button
                                  onClick={(e) => handleAddToCart(e, product._id)}
                                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                                    justAdded
                                      ? 'bg-green-500 text-white'
                                      : 'bg-primary text-white hover:bg-primary/90'
                                  }`}
                                >
                                  {justAdded ? <CheckCircle2 className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
                                  {justAdded ? 'Added' : 'Add'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  }

                  // GRID card
                  return (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.04, type: 'spring', stiffness: 280, damping: 24 }}
                      className="group"
                    >
                      <Link href={`/products/${product.slug}`}>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
                          {/* Image area */}
                          <div className="relative aspect-square bg-gray-50 overflow-hidden">
                            {/* Discount badge */}
                            {hasDiscount && (
                              <div className="absolute top-2.5 left-2.5 z-10 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <Zap className="h-2.5 w-2.5" /> -{discountPct}%
                              </div>
                            )}
                            {/* Stock badge */}
                            {product.stock === 0 && (
                              <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Out of Stock</span>
                              </div>
                            )}
                            {/* Wishlist */}
                            <button
                              onClick={(e) => handleWishlist(e, product)}
                              className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all opacity-0 group-hover:opacity-100 ${
                                wishlisted ? 'bg-red-50 opacity-100' : 'bg-white'
                              }`}
                            >
                              <Heart className={`h-4 w-4 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                            </button>

                            {/* Product image */}
                            {product.images?.[0] ? (
                              <Image
                                src={normalizeImageUrl(product.images[0])}
                                alt={product.title}
                                fill
                                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-16 w-16 text-gray-200" />
                              </div>
                            )}

                            {/* Quick add overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                              <button
                                onClick={(e) => handleAddToCart(e, product._id)}
                                className={`w-full h-9 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-all ${
                                  justAdded
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-900 text-white hover:bg-primary'
                                }`}
                              >
                                {justAdded
                                  ? <><CheckCircle2 className="h-4 w-4" /> Added to Cart</>
                                  : <><ShoppingCart className="h-4 w-4" /> Quick Add</>
                                }
                              </button>
                            </div>
                          </div>

                          {/* Card body */}
                          <div className="p-3.5 flex flex-col flex-1">
                            {product.brand && (
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{product.brand}</p>
                            )}
                            <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1.5 flex-1">
                              {product.title}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-2.5">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.ratingAvg || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                                ))}
                              </div>
                              <span className="text-[11px] text-gray-400">({product.ratingCount || 0})</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base font-black text-gray-900">
                                NPR {(hasDiscount ? product.discountPrice! : product.price).toLocaleString()}
                              </span>
                              {hasDiscount && (
                                <span className="text-xs text-gray-400 line-through">
                                  NPR {product.price.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-9 w-9 flex items-center justify-center rounded-lg text-sm font-semibold border transition-colors ${
                      page === i + 1
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Package className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">No products found</h2>
            <p className="text-sm text-gray-500 mb-5">Try adjusting your filters or search term.</p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

 