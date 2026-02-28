'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductAttributeSelector from '@/components/ProductAttributeSelector';
import {
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Check,
  Package,
  Clock,
  AlertCircle,
  Send,
  X
} from 'lucide-react';
import { Product, Review } from '@/types';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { normalizeImageUrl } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  
  // Message state
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const { user, isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const isWishlisted = product ? isInWishlist(product._id) : false;

  useEffect(() => {
    if (slug) {
      fetchProductData();
    }
  }, [slug]);

  useEffect(() => {
    if (product) {
      setFinalPrice(product.discountPrice || product.price);
    }
  }, [product]);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Fetch product details by slug
      const productRes = await fetch(`${backendUrl}/api/products/${slug}`);
      if (productRes.ok) {
        const productData = await productRes.json();
        const fetchedProduct = productData.data;
        setProduct(fetchedProduct);

        // Fetch reviews for this product
        if (fetchedProduct?._id) {
          const reviewsRes = await fetch(`${backendUrl}/api/reviews?productId=${fetchedProduct._id}`);
          if (reviewsRes.ok) {
            const reviewsData = await reviewsRes.json();
            setReviews(reviewsData.data?.reviews || []);
          }

          // Fetch related products (same category)
          if (fetchedProduct.categoryId) {
            const categoryId = typeof fetchedProduct.categoryId === 'string' 
              ? fetchedProduct.categoryId 
              : fetchedProduct.categoryId._id;
            const relatedRes = await fetch(`${backendUrl}/api/products?categoryId=${categoryId}&limit=4`);
            if (relatedRes.ok) {
              const relatedData = await relatedRes.json();
              setRelatedProducts(
                (relatedData.data?.products || []).filter((p: Product) => p._id !== fetchedProduct._id)
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    const success = await addItem(product._id, quantity);
    if (success) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleShare = async () => {
    if (!product) return;
    const shareData = {
      title: product.title,
      text: `Check out ${product.title} on XpressNepal`,
      url: window.location.href,
    };

    try {
      // Try Web Share API (mobile-friendly)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(product?.stock || 1, prev + delta)));
  };

  const handleImageChange = (direction: 'prev' | 'next') => {
    if (!product) return;
    setSelectedImage(prev => {
      if (direction === 'prev') {
        return prev === 0 ? product.images.length - 1 : prev - 1;
      } else {
        return prev === product.images.length - 1 ? 0 : prev + 1;
      }
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Please login to submit a review');
      return;
    }

    // Validation
    if (!reviewComment.trim()) {
      alert('Please write a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const reviewData = {
        productId: product._id,
        rating: reviewRating,
        comment: reviewComment,
      };

      const response = await fetch(`${backendUrl}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        // Reset form
        setReviewComment('');
        setReviewRating(5);
        // Refresh reviews
        await fetchProductData();
        alert('Review submitted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !product.sellerId || typeof product.sellerId !== 'object') return;

    if (!messageSubject.trim() || !messageContent.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setSendingMessage(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${backendUrl}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: product.sellerId._id,
          productId: product._id,
          subject: messageSubject,
          message: messageContent,
        }),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setShowMessageModal(false);
        setMessageSubject('');
        setMessageContent('');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square w-full rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <Package className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/products">
              <Button>Browse All Products</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const discount = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white relative overflow-hidden">
      {/* Floating Background Particles */}
      {[...Array(15)].map((_, i) => (
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
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-8 text-sm"
        >
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
            Products
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground font-medium">{product.title}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl border-2 border-white/50 shadow-2xl group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full cursor-zoom-in"
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <Image
                    src={normalizeImageUrl(product.images[selectedImage])}
                    alt={`${product.title} - Image ${selectedImage + 1}`}
                    fill
                    className="object-contain p-8"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
                    onClick={() => handleImageChange('prev')}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
                    onClick={() => handleImageChange('next')}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Zoom Indicator */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-5 w-5 text-primary" />
              </div>

              {/* Discount Badge */}
              {discount > 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute top-6 left-6"
                >
                  <Badge className="bg-red-500 text-white text-lg py-2 px-4 rounded-xl shadow-lg">
                    {discount}% OFF
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary shadow-lg'
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <Image
                      src={normalizeImageUrl(image)}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-contain p-2 bg-white"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Title & Rating */}
            <div>
              <h1 className="text-4xl font-bold mb-3 leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                {product.title}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.ratingAvg)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-semibold">{product.ratingAvg.toFixed(1)}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.ratingCount} reviews)
                </span>
              </div>
            </div>

            {/* Brand */}
            {product.brand && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Brand:</span>
                <Badge variant="outline" className="text-base py-1 px-3">
                  {product.brand}
                </Badge>
              </div>
            )}

            {/* Price */}
            <div className="bg-gradient-to-br from-primary/10 to-orange-100/50 rounded-2xl p-6 border-2 border-primary/20">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-primary">
                  NPR {finalPrice.toLocaleString()}
                </span>
                {product.discountPrice && finalPrice === (product.discountPrice || product.price) && (
                  <span className="text-2xl text-muted-foreground line-through">
                    NPR {product.price.toLocaleString()}
                  </span>
                )}
              </div>
              {discount > 0 && finalPrice === (product.discountPrice || product.price) && (
                <p className="text-sm text-green-600 font-semibold mt-2">
                  You save NPR {(product.price - (product.discountPrice || product.price)).toLocaleString()}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-600 font-semibold">
                    {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left!`}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                </>
              )}
            </div>

            {/* Product Attributes */}
            <ProductAttributeSelector
              attributes={product.attributes}
              basePrice={product.discountPrice || product.price}
              onPriceChange={setFinalPrice}
            />

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-primary/20 rounded-2xl overflow-hidden bg-white">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-none hover:bg-primary/10"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <span className="w-16 text-center text-xl font-bold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-none hover:bg-primary/10"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Max: {product.stock} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 h-14 text-lg rounded-2xl bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.div
                      key="added"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-6 w-6" />
                      Added!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="add"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="h-6 w-6" />
                      Add to Cart
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className={`h-14 w-14 rounded-2xl border-2 transition-all ${
                  isWishlisted
                    ? 'bg-red-50 border-red-300 hover:bg-red-100'
                    : 'border-primary/20 hover:border-primary'
                }`}
                onClick={handleToggleWishlist}
              >
                <Heart
                  className={`h-6 w-6 transition-colors ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-primary'
                  }`}
                />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-14 w-14 rounded-2xl border-2 border-primary/20 hover:border-primary"
                onClick={handleShare}
              >
                <Share2 className="h-6 w-6 text-primary" />
              </Button>
            </div>

            {/* Seller Info */}
            {product.sellerId && typeof product.sellerId === 'object' && (
              <div className="bg-white/70 backdrop-blur-sm border-2 border-primary/20 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sold by</p>
                    <p className="text-lg font-bold text-primary">
                      {product.sellerId.shopName || product.sellerId.name}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => {
                      if (isAuthenticated) {
                        setShowMessageModal(true);
                        setMessageSubject(`Inquiry about: ${product.title}`);
                      } else {
                        alert('Please login to message the seller');
                      }
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Message Seller
                  </Button>
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex flex-col items-center text-center p-3 bg-white/50 rounded-xl">
                <Truck className="h-8 w-8 text-primary mb-2" />
                <span className="text-xs font-semibold">Free Delivery</span>
                <span className="text-xs text-muted-foreground">Within 3 days</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-white/50 rounded-xl">
                <RotateCcw className="h-8 w-8 text-primary mb-2" />
                <span className="text-xs font-semibold">7 Day Return</span>
                <span className="text-xs text-muted-foreground">No questions</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-white/50 rounded-xl">
                <Shield className="h-8 w-8 text-primary mb-2" />
                <span className="text-xs font-semibold">Warranty</span>
                <span className="text-xs text-muted-foreground">1 Year</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section - Description & Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start bg-white/70 backdrop-blur-xl border-2 border-white/50 rounded-2xl p-2 mb-6">
              <TabsTrigger
                value="description"
                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl py-3 text-base font-semibold"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl py-3 text-base font-semibold"
              >
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
                <CardContent className="p-8">
                  <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                    {product.description}
                  </p>
                  
                  {product.attributes && Object.keys(product.attributes).some(k => {
                    const v = (product.attributes as Record<string, unknown>)[k];
                    return Array.isArray(v) ? v.length > 0 : Boolean(v);
                  }) && (
                    <div className="mt-8 pt-8 border-t">
                      <h3 className="text-xl font-bold mb-4">Specifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(product.attributes).map(([key, value]) => {
                          // value can be AttributeOption[] or a string
                          let displayValue: string;
                          if (Array.isArray(value)) {
                            displayValue = value.map((opt: any) => opt.value ?? String(opt)).join(', ');
                          } else {
                            displayValue = String(value);
                          }
                          if (!displayValue) return null;
                          return (
                            <div key={key} className="flex justify-between p-3 bg-gradient-to-r from-orange-50/50 to-transparent rounded-lg">
                              <span className="font-semibold capitalize">{key}:</span>
                              <span className="text-muted-foreground">{displayValue}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-8">
                {/* Write Review Form */}
                <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <Star className="h-6 w-6 text-primary" />
                      Write a Review
                    </h3>
                    <form onSubmit={handleSubmitReview} className="space-y-6">
                      {/* Rating Selector */}
                      <div>
                        <label className="block text-sm font-semibold mb-3">Your Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <motion.button
                              key={rating}
                              type="button"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setReviewRating(rating)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-8 w-8 transition-colors ${
                                  rating <= reviewRating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 hover:text-yellow-200'
                                }`}
                              />
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {!isAuthenticated ? (
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 text-center">
                          <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-3" />
                          <p className="text-lg font-semibold text-amber-900 mb-2">Login Required</p>
                          <p className="text-amber-700 mb-4">Please login to submit a review for this product.</p>
                          <Link href="/login">
                            <Button className="bg-amber-600 hover:bg-amber-700">
                              Login to Review
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <>
                          {/* Review Comment */}
                          <div>
                            <label className="block text-sm font-semibold mb-2">Your Review *</label>
                            <Textarea
                              placeholder="Share your experience with this product..."
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              required
                              rows={5}
                              className="border-2 border-primary/20 focus-visible:ring-primary rounded-xl resize-none"
                            />
                          </div>

                          {/* Submit Button */}
                          <Button
                            type="submit"
                            size="lg"
                            disabled={submittingReview}
                            className="w-full h-14 text-lg rounded-2xl bg-primary hover:bg-primary/90 shadow-lg"
                          >
                            {submittingReview ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              >
                                <Clock className="h-6 w-6" />
                              </motion.div>
                            ) : (
                              <>
                                <Send className="h-6 w-6 mr-2" />
                                Submit Review
                              </>
                            )}
                          </Button>

                          {user && (
                            <p className="text-sm text-muted-foreground text-center">
                              Posting as <span className="font-semibold text-primary">{user.name}</span>
                            </p>
                          )}
                        </>
                      )}
                    </form>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
                    {reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-b last:border-0 pb-6 last:pb-0"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="font-semibold">
                                    {typeof review.userId === 'object' && review.userId !== null ? review.userId.name : 'Anonymous'}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-muted-foreground">{review.comment}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No Reviews Yet</h3>
                        <p className="text-muted-foreground">Be the first to review this product!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                You May Also Like
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/products/${relatedProduct.slug}`}>
                    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-white to-orange-50/30 h-full">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={relatedProduct.images[0]}
                          alt={relatedProduct.title}
                          fill
                          className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedProduct.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(relatedProduct.ratingAvg)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({relatedProduct.ratingCount})
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-primary">
                            NPR {(relatedProduct.discountPrice || relatedProduct.price).toLocaleString()}
                          </span>
                          {relatedProduct.discountPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              NPR {relatedProduct.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Message Seller Modal */}
      {showMessageModal && product && typeof product.sellerId === 'object' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Message Seller</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageSubject('');
                  setMessageContent('');
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground">To</p>
              <p className="text-lg font-semibold">
                {product.sellerId.shopName || product.sellerId.name}
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!messageContent.trim()) {
                  alert('Please write a message');
                  return;
                }

                setSendingMessage(true);
                try {
                  const token = localStorage.getItem('token');
                  const response = await fetch('http://localhost:5000/api/messages', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      receiverId: typeof product.sellerId === 'object' ? product.sellerId._id : product.sellerId,
                      productId: product._id,
                      subject: messageSubject,
                      message: messageContent,
                    }),
                  });

                  if (response.ok) {
                    alert('Message sent successfully!');
                    setShowMessageModal(false);
                    setMessageSubject('');
                    setMessageContent('');
                  } else {
                    alert('Failed to send message');
                  }
                } catch (error) {
                  console.error('Error sending message:', error);
                  alert('An error occurred while sending the message');
                } finally {
                  setSendingMessage(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  placeholder="Message subject"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Write your message here..."
                  rows={5}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageSubject('');
                    setMessageContent('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={sendingMessage}
                >
                  {sendingMessage ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
