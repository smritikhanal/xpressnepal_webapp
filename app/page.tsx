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
  Flame,
  ShoppingCart,
  Gift,
  CreditCard,
  Tag,
  Percent,
  Box,
  PackageCheck,
  Eye
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Product, Category } from "@/types";
import { motion, useScroll, useTransform, useInView, AnimatePresence, Variants } from "framer-motion";
import { normalizeImageUrl } from "@/lib/utils";

// Animated floating shopping elements for hero
const FloatingElements = () => {
  const [windowWidth, setWindowWidth] = useState(1400);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
  <div className="absolute inset-0 overflow-hidden">
    {/* Animated gradient orbs */}
    <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-maroon/30 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-maroon/30 rounded-full blur-3xl animate-pulse delay-1000" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-maroon/10 via-transparent to-purple-500/10 rounded-full blur-3xl" />
    
    {/* Large Shopping Bag - Top Right */}
    <motion.div
      className="absolute top-[10%] right-[10%] text-white/15"
      animate={{ y: [-20, 20, -20], rotate: [-5, 5, -5] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <ShoppingBag className="w-40 h-40" />
    </motion.div>
    
    {/* Shopping Cart - Left Side */}
    <motion.div
      className="absolute top-[25%] left-[5%] text-white/12"
      animate={{ y: [15, -15, 15], x: [-5, 10, -5] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    >
      <ShoppingCart className="w-36 h-36" />
    </motion.div>
    
    {/* Delivery Truck - Bottom Moving Across */}
    <motion.div
      className="absolute bottom-[15%] text-white/10"
      animate={{ 
        x: [-100, windowWidth], 
        y: [0, -10, 0, 10, 0]
      }}
      transition={{ 
        x: { duration: 20, repeat: Infinity, ease: "linear" },
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Truck className="w-28 h-28" />
    </motion.div>
    
    {/* Another Truck - Top Moving Opposite */}
    <motion.div
      className="absolute top-[20%] text-white/8"
      animate={{ 
        x: [windowWidth, -100], 
        y: [0, 5, 0, -5, 0]
      }}
      transition={{ 
        x: { duration: 25, repeat: Infinity, ease: "linear", delay: 5 },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Truck className="w-20 h-20" />
    </motion.div>
    
    {/* Package Box - Center Left */}
    <motion.div
      className="absolute top-[45%] left-[15%] text-white/12"
      animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    >
      <Package className="w-28 h-28" />
    </motion.div>
    
    {/* Box - Right Side */}
    <motion.div
      className="absolute top-[55%] right-[8%] text-white/10"
      animate={{ y: [-15, 15, -15], rotate: [5, -5, 5] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    >
      <Box className="w-24 h-24" />
    </motion.div>
    
    {/* Gift Box - Top Center */}
    <motion.div
      className="absolute top-[8%] left-[40%] text-white/10"
      animate={{ y: [-10, 15, -10], scale: [1, 1.1, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
    >
      <Gift className="w-20 h-20" />
    </motion.div>
    
    {/* Shopping Bag - Bottom Left */}
    <motion.div
      className="absolute bottom-[30%] left-[25%] text-white/10"
      animate={{ y: [10, -20, 10], x: [5, -5, 5] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
    >
      <ShoppingBag className="w-24 h-24" />
    </motion.div>
    
    {/* Cart - Right Center */}
    <motion.div
      className="absolute top-[40%] right-[25%] text-white/8"
      animate={{ y: [-12, 12, -12], rotate: [0, 5, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
    >
      <ShoppingCart className="w-20 h-20" />
    </motion.div>
    
    {/* Credit Card - Floating */}
    <motion.div
      className="absolute bottom-[45%] right-[15%] text-white/10"
      animate={{ y: [15, -15, 15], rotate: [-10, 10, -10] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
    >
      <CreditCard className="w-18 h-18" />
    </motion.div>
    
    {/* Tag/Label - Top Left */}
    <motion.div
      className="absolute top-[30%] left-[35%] text-white/8"
      animate={{ y: [-8, 8, -8], rotate: [0, 15, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    >
      <Tag className="w-16 h-16" />
    </motion.div>
    
    {/* Percent/Discount - Bottom Right */}
    <motion.div
      className="absolute bottom-[20%] right-[30%] text-white/10"
      animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      <Percent className="w-16 h-16" />
    </motion.div>
    
    {/* Package Check - Delivered */}
    <motion.div
      className="absolute top-[65%] left-[8%] text-white/8"
      animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 4 }}
    >
      <PackageCheck className="w-22 h-22" />
    </motion.div>
    
    {/* Sparkles - Decorative */}
    <motion.div
      className="absolute top-[75%] right-[40%] text-white/15"
      animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <Sparkles className="w-14 h-14" />
    </motion.div>
    
    {/* Star - Rating */}
    <motion.div
      className="absolute bottom-[40%] left-[45%] text-white/10"
      animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    >
      <Star className="w-12 h-12" />
    </motion.div>
    
    {/* Heart - Wishlist */}
    <motion.div
      className="absolute top-[50%] right-[5%] text-white/10"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <Heart className="w-16 h-16" />
    </motion.div>
    
    {/* Small floating bags scattered */}
    <motion.div
      className="absolute top-[80%] left-[60%] text-white/6"
      animate={{ y: [-5, 5, -5] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <ShoppingBag className="w-12 h-12" />
    </motion.div>
    
    <motion.div
      className="absolute top-[15%] left-[55%] text-white/6"
      animate={{ y: [5, -5, 5] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    >
      <ShoppingCart className="w-10 h-10" />
    </motion.div>

    {/* Grid pattern overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
    
    {/* Animated delivery path lines */}
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M0,50% Q25%,30% 50%,50% T100%,50%"
        stroke="url(#gradient1)" 
        strokeWidth="2"
        fill="none"
        strokeDasharray="10 5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.2 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.line
        x1="0%" y1="30%" x2="100%" y2="70%"
        stroke="url(#gradient1)" strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.3 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.line
        x1="100%" y1="20%" x2="0%" y2="80%"
        stroke="url(#gradient2)" strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.2 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
      />
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#800020" stopOpacity="0" />
          <stop offset="50%" stopColor="#800020" stopOpacity="1" />
          <stop offset="100%" stopColor="#800020" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
  );
};

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
      const fallbackProducts = [
        {
          _id: "p1",
          title: "Sample Product 1",
          slug: "sample-product-1",
          description: "A great product for demonstration.",
          price: 1250,
          images: [
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
          ],
          category: "Fashion",
          categoryId: "1",
          stock: 100,
          ratingAvg: 4.5,
          ratingCount: 10,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "p2",
          title: "Sample Product 2",
          slug: "sample-product-2",
          description: "Another awesome product.",
          price: 240000,
          images: [
            "https://media.gadgetbytenepal.com/2025/09/1757575327_0.jpg",
          ],
          category: "Electronics",
          categoryId: "2",
          stock: 50,
          ratingAvg: 4.2,
          ratingCount: 8,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "p3",
          title: "Sample Product 3",
          slug: "sample-product-3",
          description: "Best seller item.",
          price: 179000,
          images: [
            "https://media.gadgetbytenepal.com/2025/01/Samsung-Galaxy-S25-Ultra-Titanium-Silverbue.jpg",
          ],
          category: "Home & Living",
          categoryId: "3",
          stock: 30,
          ratingAvg: 4.8,
          ratingCount: 15,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "p4",
          title: "Sample Product 4",
          slug: "sample-product-4",
          description: "Popular choice.",
          price: 32000,
          images: [
            "https://cdn-1.azazie.com/upimg/h65/9b/71/5fa2b0951fe5c3535716b20263a09b71.jpg.webp",
          ],
          category: "Beauty",
          categoryId: "4",
          stock: 80,
          ratingAvg: 4.0,
          ratingCount: 5,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      const fallbackCategories = [
        {
          _id: "1",
          name: "Fashion",
          slug: "fashion",
          description: "Latest trends in clothing and accessories.",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "2",
          name: "Electronics",
          slug: "electronics",
          description: "Gadgets, devices, and more.",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "3",
          name: "Home & Living",
          slug: "home-living",
          description: "Essentials for your home.",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "4",
          name: "Beauty",
          slug: "beauty",
          description: "Skincare, makeup, and wellness.",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "5",
          name: "Sports",
          slug: "sports",
          description: "Gear and apparel for active lifestyles.",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "6",
          name: "Kids",
          slug: "kids",
          description: "Toys, clothing, and more for children.",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
       try {
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${backendUrl}/api/products?limit=10`, { cache: "no-store" }),
          fetch(`${backendUrl}/api/categories?limit=6`, { cache: "no-store" }),
        ]);
        let productsData = null;
        let categoriesData = null;
        if (productsRes.ok) {
          productsData = await productsRes.json();
        }
        if (categoriesRes.ok) {
          categoriesData = await categoriesRes.json();
        }
        const allProducts = productsData?.data?.products || fallbackProducts;
        setFlashSaleProducts(allProducts.slice(0, 4));
        setProducts(allProducts.slice(0, 5));
        setCategories(categoriesData?.data?.categories || fallbackCategories);
      } catch (error) {
        setFlashSaleProducts(fallbackProducts.slice(0, 4));
        setProducts(fallbackProducts.slice(0, 5));
        setCategories(fallbackCategories);
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
      
      {/* Hero Section with Animated Background */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen bg-black overflow-hidden"
      >
        {/* Animated E-commerce Background */}
        <div className="absolute inset-0 z-0">
          <FloatingElements />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
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

      {/* Marquee Section */}
      <section className="bg-black py-8 border-y border-white/10">
        <MarqueeText text="XPRESS NEPAL •" />
      </section>

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
                                src={normalizeImageUrl(product.images[0])}
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
                            {product.title.length > 35 ? `${product.title.substring(0, 35)}...` : product.title}
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

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col h-full"
              >
                {/* Product Image Container */}
                <div className="relative overflow-hidden flex items-center justify-center rounded-2xl bg-[#F6F7FB] dark:bg-gray-800 h-[270px] mb-4 border border-gray-100 dark:border-gray-700">
                  <Link href={`/products/${product.slug}`} className="flex items-center justify-center w-full h-full">
                    <Image
                      src={normalizeImageUrl(product.images[0] || '/placeholder.png')}
                      alt={product.title}
                      width={250}
                      height={250}
                      className="object-contain p-4 max-h-[230px] w-auto transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  
                  {/* Hover Action Buttons */}
                  <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 transition-transform duration-300 ease-out group-hover:translate-y-0">
                    {/* Quick View Button */}
                    <button 
                      aria-label="Quick view"
                      className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-maroon dark:hover:text-maroon transition-colors duration-200"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    {/* Add to Cart Button */}
                    <button className="inline-flex items-center font-medium text-sm py-2.5 px-5 rounded-full bg-maroon text-white hover:bg-maroon/90 transition-colors duration-200 shadow-lg">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to cart
                    </button>
                    
                    {/* Favorite Button */}
                    <button 
                      aria-label="Add to wishlist"
                      className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-pink-500 transition-colors duration-200"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Discount Badge */}
                  {product.price < 1000 && (
                    <Badge className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1">
                      Sale
                    </Badge>
                  )}
                </div>

                {/* Product Info - Flex grow to push price to bottom */}
                <div className="flex flex-col flex-grow">
                  <h3 className="font-medium text-gray-900 dark:text-white hover:text-maroon dark:hover:text-maroon transition-colors duration-200 mb-1.5 line-clamp-2 min-h-[48px]">
                    <Link href={`/products/${product.slug}`}>
                      {product.title}
                    </Link>
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.floor(product.ratingAvg || 0) 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">({product.ratingCount || 0})</span>
                  </div>
                  
                  {/* Price - Always at bottom */}
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <span className="text-sm line-through text-gray-400">
                      Rs. {Math.round(product.price * 1.15).toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View More Button - Mobile */}
          <div className="mt-10 text-center md:hidden">
            <Link href="/products">
              <Button className="bg-black text-white hover:bg-maroon rounded-full px-8">
                View All Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Delivery Banner - Playful Design */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Delivery That <span className="text-maroon">Delights</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Choose how you want your order delivered. We&apos;ve got options for every lifestyle.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Express Delivery",
                description: "Get it within 2 hours in Kathmandu Valley",
                tag: "Fastest"
              },
              {
                icon: Truck,
                title: "Standard Delivery",
                description: "Free delivery on orders above NPR 2000",
                tag: "Most Popular"
              },
              {
                icon: Package,
                title: "Pickup Points",
                description: "Collect from 50+ locations nationwide",
                tag: "Flexible"
              }
            ].map((option, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all"
              >
                <Badge className="absolute top-4 right-4 bg-maroon text-white text-xs">
                  {option.tag}
                </Badge>
                <motion.div 
                  variants={floatAnimation}
                  initial="initial"
                  animate="animate"
                  className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6"
                >
                  <option.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                <p className="text-white/50 text-sm">{option.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-maroon/10 text-maroon mb-6">Join the Club</Badge>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Stay in the <span className="text-maroon">Loop</span>
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to get exclusive deals, early access to new drops, and style tips delivered straight to your inbox.
            </p>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full border-2 border-black/10 focus:border-maroon focus:outline-none font-medium"
              />
              <Button className="bg-black text-white hover:bg-maroon font-bold px-8 py-4 rounded-full whitespace-nowrap">
                Subscribe
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            
            <p className="text-xs text-gray-400 mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </motion.div>
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
