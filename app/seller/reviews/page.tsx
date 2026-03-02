'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Star, Package, User, Calendar, MessageSquare, ArrowLeft } from 'lucide-react';
import { normalizeImageUrl } from '@/lib/utils';

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  productId: {
    _id: string;
    title: string;
    images?: string[];
    price: number;
    discountPrice?: number;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function SellerReviewsPage() {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');

  const fetchAllReviews = async () => {
    try {
      setError(null);
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }
      
      // Fetch seller's products first
      const productsRes = await fetch(`http://localhost:5000/api/products?sellerId=${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!productsRes.ok) {
        throw new Error(`Products fetch failed: ${productsRes.status}`);
      }
      
      const productsData = await productsRes.json();
      const products = productsData.success ? productsData.data.products : [];
      
      // Fetch reviews for all products
      if (products.length > 0) {
        const productIds = products.map((p: any) => p._id);
        const reviewsPromises = productIds.map((id: string) =>
          fetch(`http://localhost:5000/api/reviews?productId=${id}`)
            .then(res => res.json())
            .then(data => data.data?.reviews || [])
            .catch(error => {
              console.error('Error fetching reviews for product:', error);
              return [];
            })
        );
        
        const allReviewsArrays = await Promise.all(reviewsPromises);
        const allReviews = allReviewsArrays.flat();
        
        // Sort by date (newest first)
        const sortedReviews = allReviews.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setReviews(sortedReviews);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch reviews');
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user?.id) {
        fetchAllReviews();
      } else {
        setLoading(false);
        setError('User not authenticated');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user?.id]);

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(filter));

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => window.location.href = '/seller/dashboard'}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="mt-2 text-gray-600">
            Manage and respond to customer feedback
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 col-span-2">
          <p className="text-sm font-medium text-gray-700 mb-3">Rating Distribution</p>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-8">{rating} ★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: reviews.length > 0 
                        ? `${(ratingCounts[rating as keyof typeof ratingCounts] / reviews.length) * 100}%` 
                        : '0%'
                    }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-8">
                  {ratingCounts[rating as keyof typeof ratingCounts]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilter(rating.toString() as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === rating.toString()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {rating} ★ ({ratingCounts[rating as keyof typeof ratingCounts]})
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {filter === 'all' ? 'All Reviews' : `${filter} Star Reviews`}
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No reviews found</p>
              <p className="text-sm text-gray-500 mt-1">
                {filter === 'all' 
                  ? 'Reviews will appear here once customers review your products'
                  : `No ${filter} star reviews yet`
                }
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review._id} className="p-6 hover:bg-gray-50 transition-colors">
                {/* Product Info */}
                <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                  {review.productId?.images && review.productId.images.length > 0 ? (
                    <img
                      src={normalizeImageUrl(review.productId.images[0])}
                      alt={review.productId.title}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {review.productId?.title || 'Product'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      NPR {(review.productId?.discountPrice || review.productId?.price)?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Review Content */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">
                          {review.userId?.name || 'Anonymous'}
                        </span>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
