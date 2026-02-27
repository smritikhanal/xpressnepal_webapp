'use client';

import { useEffect, useState } from 'react';
import { Store, Search, CheckCircle, XCircle } from 'lucide-react';

interface Seller {
  _id: string;
  name: string;
  email: string;
  shopName?: string;
  businessDescription?: string;
  isSellerActive: boolean;
  phone?: string;
  createdAt: string;
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const token = localStorage.getItem('token');
      // TODO: Create a proper API endpoint for fetching sellers
      // For now, we'll use a mock approach or you can create /api/users?role=seller
      const response = await fetch('http://localhost:5000/api/users?role=seller', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.users && Array.isArray(data.data.users)) {
          setSellers(data.data.users);
        } else {
          setSellers([]);
        }
      } else {
        setSellers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      setLoading(false);
    }
  };

  const toggleSellerStatus = async (sellerId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${sellerId}/toggle-seller`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSellers(sellers.map(seller =>
          seller._id === sellerId
            ? { ...seller, isSellerActive: !currentStatus }
            : seller
        ));
      }
    } catch (error) {
      console.error('Error toggling seller status:', error);
    }
  };

  const filteredSellers = (Array.isArray(sellers) ? sellers : []).filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.shopName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sellers</h1>
        <p className="mt-2 text-gray-600">
          Manage seller accounts and permissions
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search sellers by name, email, or shop name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSellers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No sellers found
          </div>
        ) : (
          filteredSellers.map((seller) => (
            <div
              key={seller._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {seller.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {seller.shopName || seller.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{seller.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSellerStatus(seller._id, seller.isSellerActive)}
                  className={`p-2 rounded-lg transition-colors ${
                    seller.isSellerActive
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  {seller.isSellerActive ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {seller.businessDescription && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {seller.businessDescription}
                  </p>
                )}
                {seller.phone && (
                  <p className="text-sm text-gray-500">📞 {seller.phone}</p>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Joined {new Date(seller.createdAt).toLocaleDateString()}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      seller.isSellerActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {seller.isSellerActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
