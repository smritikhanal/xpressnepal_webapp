'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Truck, Save } from 'lucide-react';
import DeliveryTracking from '@/components/DeliveryTracking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  userId: string;
  orderItems: any[];
  totalAmount: number;
  paymentStatus: string;
  orderStatus: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: any;
  deliveryPersonnel?: {
    name: string;
    phone: string;
  };
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Form states
  const [orderStatus, setOrderStatus] = useState<string>('placed');
  const [deliveryPersonName, setDeliveryPersonName] = useState('');
  const [deliveryPersonPhone, setDeliveryPersonPhone] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    if (order) {
      setOrderStatus(order.orderStatus);
      setDeliveryPersonName(order.deliveryPersonnel?.name || '');
      setDeliveryPersonPhone(order.deliveryPersonnel?.phone || '');
      setLatitude(order.currentLocation?.latitude?.toString() || '');
      setLongitude(order.currentLocation?.longitude?.toString() || '');
    }
  }, [order]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      toast.error('An error occurred while fetching order details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!order) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      console.log('🚀 Updating order status to:', orderStatus);
      
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: orderStatus }),
      });

      const data = await response.json();
      console.log('📡 Status update response:', data);
      
      if (data.success) {
        setOrder(data.data);
        toast.success(`✅ Order status updated to "${orderStatus}" - Customer will be notified in real-time`, {
          duration: 4000,
        });
        console.log('✅ Order status updated successfully');
      } else {
        toast.error(data.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('An error occurred while updating order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateDeliveryTracking = async () => {
    if (!order) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/delivery-tracking`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          deliveryPersonnel: {
            name: deliveryPersonName,
            phone: deliveryPersonPhone,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
        toast.success('📍 Delivery tracking updated - Customer can see live location now', {
          duration: 4000,
        });
        console.log('✅ Delivery tracking updated successfully');
      } else {
        toast.error(data.message || 'Failed to update delivery tracking');
      }
    } catch (err) {
      console.error('Error updating delivery tracking:', err);
      toast.error('An error occurred while updating delivery tracking');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <Link href="/admin/orders" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Order Details
          </h1>
          <p className="text-gray-600 mt-1">
            Order ID: <span className="font-mono text-sm">{order._id}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Admin Controls */}
          <div className="space-y-6">
            {/* Order Status Control */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Update Order Status
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Order Status</Label>
                  <Select value={orderStatus} onValueChange={setOrderStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="placed">Placed</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={updating || orderStatus === order.orderStatus}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Update Status
                </Button>
              </div>
            </div>

            {/* Delivery Tracking Control */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Update Delivery Tracking
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deliveryPersonName">Delivery Person Name</Label>
                  <Input
                    id="deliveryPersonName"
                    value={deliveryPersonName}
                    onChange={(e) => setDeliveryPersonName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryPersonPhone">Phone Number</Label>
                  <Input
                    id="deliveryPersonPhone"
                    value={deliveryPersonPhone}
                    onChange={(e) => setDeliveryPersonPhone(e.target.value)}
                    placeholder="+977-9812345678"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="27.717245"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="85.323959"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  💡 Tip: Right-click on Google Maps and select coordinates to copy them
                </p>
                <Button
                  onClick={handleUpdateDeliveryTracking}
                  disabled={updating || !latitude || !longitude}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Update Delivery Tracking
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold">NPR {order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="font-semibold capitalize">{order.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-semibold">{order.orderItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-semibold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Real-time Tracking Display */}
          <div>
            <DeliveryTracking
              orderId={order._id}
              orderStatus={order.orderStatus}
              currentLocation={order.currentLocation}
              deliveryPersonnel={order.deliveryPersonnel}
            />
          </div>
        </div>
      </div>
    </div>
  );
  }


