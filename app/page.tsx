'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  Package,
  ArrowRight,
  Sparkles,
  Zap,
  Heart,
  Star,
  MousePointer2,
  ShoppingBag,
  ArrowUpRight,
  Clock,
  Flame
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Product, Category } from "@/types";
import { motion, useScroll, useTransform, useInView, AnimatePresence, Variants } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import Spline to avoid SSR issues
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-white/60 text-sm font-medium">Loading 3D Experience...</span>
      </div>
    </div>
  )
});

// Playful floating animation variants
const floatAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "backOut"
    }
  }
};

// Marquee text component
const MarqueeText = ({ text, direction = 1 }: { text: string; direction?: number }) => (
  <div className="overflow-hidden whitespace-nowrap py-4">
    <motion.div
      className="inline-flex gap-8"
      animate={{ x: direction > 0 ? [0, -1000] : [-1000, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {[...Array(10)].map((_, i) => (
        <span key={i} className="text-6xl md:text-8xl font-black text-transparent stroke-text select-none">
          {text}
        </span>
      ))}
    </motion.div>
  </div>
);

// Interactive blob cursor follower
const BlobCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed w-64 h-64 rounded-full bg-maroon/10 pointer-events-none -z-10 blur-3xl hidden md:block"
      animate={{ x: mousePos.x - 128, y: mousePos.y - 128 }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
    />
  );
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  
  const heroRef = useRef(null);
  
  const isHeroInView = useInView(heroRef, { once: true });

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${backendUrl}/api/products?limit=10`, { cache: 'no-store' }),
          fetch(`${backendUrl}/api/categories?limit=6`, { cache: 'no-store' })
        ]);

        const productsData = productsRes.ok ? await productsRes.json() : null;
        const categoriesData = categoriesRes.ok ? await categoriesRes.json() : null;

        const allProducts = productsData?.data?.products || [];
        
        // Use first 4 products for flash sale, next 5 for trending
        setFlashSaleProducts(allProducts.slice(0, 4));
        setProducts(allProducts.slice(0, 5));
        setCategories(categoriesData?.data?.categories || []);
      } catch (error) {
        console.error('Error fetching home page data:', error);
      }
    };

    fetchData();
  }, []);

  // Cycle through categories
  useEffect(() => {
    if (categories.length === 0) return;
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [categories.length]);

  // Flash sale countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset timer when it reaches 0
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="bg-white text-black overflow-hidden">
      <BlobCursor />

       {/* Hero Section with Spline */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen bg-black overflow-hidden"
      >
        {/* Spline 3D Background */}
        <div className="absolute inset-0 z-0">
          <Spline 
            scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
            className="w-full h-full"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20">
          <motion.div
            initial="hidden"
            animate={isHeroInView ? "show" : "hidden"}
            variants={staggerContainer}
            className="max-w-5xl"
          >
            {/* Playful badge */}
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge className="bg-maroon text-white px-4 py-2 text-sm font-medium rounded-full hover:scale-105 transition-transform cursor-pointer">
                <Sparkles className="w-4 h-4 mr-2" />
                New Season Collection 2025
              </Badge>
            </motion.div>

            {/* Main headline with playful typography */}
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight mb-6"
            >
              Shop the
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-maroon">
                Extraordinary
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-white/70 max-w-xl mb-8 leading-relaxed"
            >
              Discover curated collections that blend style with substance. 
              Where every product tells a story.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-100 font-bold px-8 py-6 text-lg rounded-full group transition-all hover:scale-105 hover:shadow-2xl"
                >
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
            </motion.div>

            {/* Floating stats */}
            <motion.div 
              variants={fadeInUp}
              className="mt-16 flex gap-12"
            >
              {[
                { value: "10K+", label: "Products" },
                { value: "50K+", label: "Customers" },
                { value: "99%", label: "Happy" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="text-white"
                >
                  <div className="text-3xl md:text-4xl font-black">{stat.value}</div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-white/50"
            >
              <MousePointer2 className="w-5 h-5" />
            </motion.div>
            <span className="text-xs text-white/30 uppercase tracking-widest">Scroll to explore</span>
          </motion.div>
        </div>
      </motion.section>
    
      {/* Flash Sale Section */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-r from-maroon via-red-600 to-orange-500">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10"
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center"
              >
                <Flame className="w-8 h-8 text-maroon" />
              </motion.div>
              <div>
                <Badge className="bg-white/20 text-white mb-2">Limited Time Only ⚡</Badge>
                <h2 className="text-3xl md:text-4xl font-black text-white">
                  Flash Sale
                </h2>
              </div>
            </div>
            
            {/* Countdown Timer */}
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-white/80" />
              <span className="text-white/80 font-medium">Ends in:</span>
              <div className="flex gap-2">
                {[
                  { value: timeLeft.hours, label: 'HRS' },
                  { value: timeLeft.minutes, label: 'MIN' },
                  { value: timeLeft.seconds, label: 'SEC' }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    className="bg-white rounded-xl px-3 py-2 min-w-[60px] text-center"
                    animate={{ scale: item.label === 'SEC' ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <div className="text-xl font-black text-maroon">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] font-bold text-gray-500">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Flash Sale Products Grid */}
          {flashSaleProducts.length > 0 ? (
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {flashSaleProducts.map((product: Product) => {
                const hasDiscount = product.discountPrice && product.discountPrice < product.price;
                const discountPercent = hasDiscount 
                  ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
                  : 20;
                const displayPrice = hasDiscount ? product.discountPrice! : Math.round(product.price * 0.8);
                
                return (
                  <motion.div
                    key={product._id}
                    variants={scaleIn}
                    whileHover={{ y: -8 }}
                    className="group"
                  >
                    <Link href={`/products/${product.slug}`}>
                      <Card className="border-0 shadow-xl overflow-hidden bg-white rounded-2xl">
                        <div className="relative aspect-square overflow-hidden">
                          <Badge className="absolute top-3 left-3 bg-black text-white z-10 font-bold text-sm px-3 py-1">
                            -{discountPercent}%
                          </Badge>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full"
                          >
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0]}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <Package className="h-16 w-16 text-gray-300" />
                              </div>
                            )}
                          </motion.div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-sm line-clamp-1 mb-2 group-hover:text-maroon transition-colors">
                            {product.title}
                          </h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-maroon">
                              NPR {displayPrice.toFixed(0)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              NPR {product.price.toFixed(0)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/80 text-lg">Loading flash deals...</p>
            </div>
          )}

          {/* View All Flash Sale Link */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link href="/products">
              <Button className="bg-white text-maroon hover:bg-gray-100 font-bold rounded-full px-8">
                View All Flash Deals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section - Interactive Pills */}
      {categories.length > 0 && (
        <section className="py-24 px-6 md:px-12 lg:px-20 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-4">
                  Browse by <span className="text-maroon">Category</span>
                </h2>
                <p className="text-gray-500">Find exactly what you&apos;re looking for</p>
              </div>
              <Link href="/categories">
                <Button variant="ghost" className="font-bold group">
                  View All Categories 
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {/* Category Pills */}
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="flex flex-wrap gap-3 mb-12"
            >
              {categories.map((category: Category, i: number) => (
                <motion.div key={category._id} variants={scaleIn}>
                  <Link href={`/categories/${category.slug}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-full font-bold text-sm transition-all cursor-pointer ${
                        i === activeCategory
                          ? 'bg-black text-white shadow-lg'
                          : 'bg-white text-black border-2 border-black/10 hover:border-maroon hover:text-maroon'
                      }`}
                    >
                      {category.name}
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Featured Category Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative bg-black rounded-3xl p-8 md:p-12 overflow-hidden min-h-[300px]"
              >
                <div className="relative z-10">
                  <Badge className="bg-maroon text-white mb-4">Featured</Badge>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                    {categories[activeCategory]?.name || "Category"}
                  </h3>
                  <p className="text-white/60 max-w-md mb-6">
                    {categories[activeCategory]?.description || "Explore our curated collection"}
                  </p>
                  <Link href={`/categories/${categories[activeCategory]?.slug}`}>
                    <Button className="bg-white text-black hover:bg-gray-100 font-bold rounded-full">
                      Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                {/* Abstract shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-maroon/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-20 w-32 h-32 bg-white/5 rounded-full" />
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Products Section - Modern Grid */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          >
            <div>
              <Badge className="bg-black text-white mb-4">Hot Right Now 🔥</Badge>
              <h2 className="text-4xl md:text-5xl font-black">
                Trending <span className="text-maroon">Products</span>
              </h2>
            </div>
            <Link href="/products">
              <Button variant="outline" className="font-bold border-2 border-black hover:bg-black hover:text-white rounded-full px-6">
                View All Products
              </Button>
            </Link>
          </motion.div>

          {products.length > 0 ? (
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {products.map((product: Product) => (
                <motion.div
                  key={product._id}
                  variants={fadeInUp}
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <Link href={`/products/${product.slug}`}>
                    <Card className="group border-0 shadow-none hover:shadow-2xl transition-all duration-500 overflow-hidden bg-gray-50 rounded-3xl">
                      <div className="relative aspect-square overflow-hidden">
                        {/* Discount Badge */}
                        {product.discountPrice && product.discountPrice < product.price && (
                          <Badge className="absolute top-4 left-4 bg-maroon text-white z-10 font-bold">
                            -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                          </Badge>
                        )}
                        
                        {/* Wishlist Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.preventDefault()}
                        >
                          <Heart className="w-5 h-5 text-gray-700" />
                        </motion.button>

                        {/* Product Image */}
                        <motion.div
                          animate={{ scale: hoveredProduct === product._id ? 1.08 : 1 }}
                          transition={{ duration: 0.4 }}
                          className="w-full h-full"
                        >
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <Package className="h-20 w-20 text-gray-400" />
                            </div>
                          )}
                        </motion.div>

                        {/* Quick Add Button */}
                        <motion.div
                          initial={{ y: 100, opacity: 0 }}
                          animate={{ 
                            y: hoveredProduct === product._id ? 0 : 100, 
                            opacity: hoveredProduct === product._id ? 1 : 0 
                          }}
                          className="absolute bottom-4 left-4 right-4"
                        >
                          <Button 
                            className="w-full bg-black text-white hover:bg-maroon font-bold rounded-full"
                            onClick={(e) => e.preventDefault()}
                          >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Quick Add
                          </Button>
                        </motion.div>
                      </div>

                      <CardContent className="p-4 bg-white">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-sm line-clamp-1 text-gray-900 group-hover:text-maroon transition-colors">
                            {product.title}
                          </h3>
                          {product.ratingAvg > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {product.ratingAvg.toFixed(1)}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-baseline gap-2">
                          {product.discountPrice && product.discountPrice < product.price ? (
                            <>
                              <span className="text-lg font-black text-gray-900">
                                NPR {product.discountPrice.toFixed(0)}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                NPR {product.price.toFixed(0)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-black text-gray-900">NPR {product.price.toFixed(0)}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-gray-50 rounded-3xl"
            >
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No products available at the moment.</p>
              <p className="text-gray-400 text-sm mt-2">Check back soon for amazing deals!</p>
            </motion.div>
          )}
        </div>
      </section>



      {/* Bottom Marquee */}
      <section className="bg-maroon py-4 overflow-hidden">
        <motion.div
          animate={{ x: [0, -500] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 whitespace-nowrap"
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-white font-bold text-sm flex items-center gap-4">
              <Star className="w-4 h-4 fill-white" /> FREE SHIPPING ON ORDERS OVER NPR 2000
              <Star className="w-4 h-4 fill-white" /> EASY RETURNS
              <Star className="w-4 h-4 fill-white" /> 24/7 SUPPORT
            </span>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
