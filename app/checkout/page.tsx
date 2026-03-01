'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Loader2,
  MapPin,
  Plus,
  Check,
  Package,
  CreditCard,
  Wallet,
  Edit2,
  Trash2,
  Calendar,
  Clock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { normalizeImageUrl } from '@/lib/utils';

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  postalCode: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { cart, getSubtotal, getTotal, fetchCart } = useCartStore();
  const { toast } = useToast();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'esewa'>('cod');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  
  // Delivery scheduling
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  // Address form state
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    country: 'Nepal',
    state: '',
    city: '',
    street: '',
    postalCode: '',
    isDefault: false,
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (!cart || cart.items.length === 0) {
      router.push('/cart');
      return;
    }
    fetchAddresses();
  }, [user, cart, router]);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setAddresses(data.data);
        // Select default address or first address
        const defaultAddr = data.data.find((addr: Address) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        } else if (data.data.length > 0) {
          setSelectedAddressId(data.data[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!newAddress.fullName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Full name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!newAddress.phone.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Phone number is required',
        variant: 'destructive',
      });
      return;
    }

    if (!newAddress.state.trim()) {
      toast({
        title: 'Validation Error',
        description: 'State is required',
        variant: 'destructive',
      });
      return;
    }

    if (!newAddress.city.trim()) {
      toast({
        title: 'Validation Error',
        description: 'City is required',
        variant: 'destructive',
      });
      return;
    }

    if (!newAddress.street.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Street address is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (editingAddressId) {
        // Update existing address
        const response = await fetch(`http://localhost:5000/api/addresses/${editingAddressId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newAddress),
        });

        const data = await response.json();
        if (data.success) {
          setAddresses(addresses.map(addr => 
            addr._id === editingAddressId ? data.data : addr
          ));
          setShowAddressForm(false);
          setEditingAddressId(null);
          setNewAddress({
            fullName: '',
            phone: '',
            country: 'Nepal',
            state: '',
            city: '',
            street: '',
            postalCode: '',
            isDefault: false,
          });
          toast({
            title: 'Success',
            description: 'Address updated successfully',
          });
        } else {
          toast({
            title: 'Error',
            description: data.message || 'Failed to update address',
            variant: 'destructive',
          });
        }
      } else {
        // Add new address
        const response = await fetch('http://localhost:5000/api/addresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newAddress),
        });

        const data = await response.json();
        if (data.success) {
          setAddresses([...addresses, data.data]);
          setSelectedAddressId(data.data._id);
          setShowAddressForm(false);
          setNewAddress({
            fullName: '',
            phone: '',
            country: 'Nepal',
            state: '',
            city: '',
            street: '',
            postalCode: '',
            isDefault: false,
          });
          toast({
            title: 'Success',
            description: 'Address added successfully',
          });
        } else {
          toast({
            title: 'Error',
            description: data.message || 'Failed to add address',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving address',
        variant: 'destructive',
      });
    }
  };

  const handleEditAddress = (address: Address) => {
    setNewAddress({
      fullName: address.fullName,
      phone: address.phone,
      country: address.country,
      state: address.state,
      city: address.city,
      street: address.street,
      postalCode: address.postalCode || '',
      isDefault: address.isDefault,
    });
    setEditingAddressId(address._id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setAddresses(addresses.filter(addr => addr._id !== addressId));
        if (selectedAddressId === addressId) {
          setSelectedAddressId(addresses.length > 1 ? addresses[0]._id : '');
        }
        toast({
          title: 'Success',
          description: 'Address deleted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to delete address',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while deleting address',
        variant: 'destructive',
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a delivery address',
        variant: 'destructive',
      });
      return;
    }

    if (!deliveryDate) {
      toast({
        title: 'Validation Error',
        description: 'Please select a delivery date',
        variant: 'destructive',
      });
      return;
    }

    setPlacingOrder(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddressId: selectedAddressId,
          paymentMethod: paymentMethod === 'cod' ? 'cash_on_delivery' : paymentMethod,
          deliveryDate: deliveryDate,
          deliveryTimeSlot: deliveryTimeSlot,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // For eSewa, show demo payment success
        if (paymentMethod === 'esewa') {
          toast({
            title: 'Payment Successful',
            description: 'eSewa Payment Demo: Payment successful! (In production, this would redirect to eSewa gateway)',
          });
        }
        toast({
          title: 'Order Placed',
          description: 'Your order has been placed successfully!',
        });
        // Redirect to order confirmation
        router.push(`/orders/${data.data._id}`);
      } else {
        if (typeof data.message === 'string' && data.message.includes('no longer available')) {
          await fetchCart();
          toast({
            title: 'Cart updated',
            description: data.message,
            variant: 'destructive',
          });
          router.push('/cart');
          return;
        }

        toast({
          title: 'Error',
          description: data.message || 'Failed to place order',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while placing order',
        variant: 'destructive',
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                  <Dialog open={showAddressForm} onOpenChange={(open) => {
                    setShowAddressForm(open);
                    if (!open) {
                      setEditingAddressId(null);
                      setNewAddress({
                        fullName: '',
                        phone: '',
                        country: 'Nepal',
                        state: '',
                        city: '',
                        street: '',
                        postalCode: '',
                        isDefault: false,
                      });
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingAddressId ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddAddress} className="space-y-4 mt-4">
                        <div>
                          <Label>Full Name *</Label>
                          <Input
                            value={newAddress.fullName}
                            onChange={(e) =>
                              setNewAddress({ ...newAddress, fullName: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label>Phone *</Label>
                          <Input
                            value={newAddress.phone}
                            onChange={(e) =>
                              setNewAddress({ ...newAddress, phone: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>State *</Label>
                            <Input
                              value={newAddress.state}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, state: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label>City *</Label>
                            <Input
                              value={newAddress.city}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, city: e.target.value })
                              }
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Street Address *</Label>
                          <Input
                            value={newAddress.street}
                            onChange={(e) =>
                              setNewAddress({ ...newAddress, street: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label>Postal Code</Label>
                          <Input
                            value={newAddress.postalCode}
                            onChange={(e) =>
                              setNewAddress({ ...newAddress, postalCode: e.target.value })
                            }
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          {editingAddressId ? 'Update Address' : 'Save Address'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        selectedAddressId === address._id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1" onClick={() => setSelectedAddressId(address._id)}>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{address.fullName}</p>
                            {address.isDefault && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{address.phone}</p>
                          <p className="text-sm mt-2">
                            {address.street}, {address.city}, {address.state}
                            {address.postalCode && ` - ${address.postalCode}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedAddressId === address._id && (
                            <Check className="h-5 w-5 text-primary shrink-0" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(address);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit address"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(address._id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete address"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No saved addresses. Please add a delivery address.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'cod' | 'esewa')}>
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:border-primary/50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Wallet className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">Cash on Delivery</p>
                          <p className="text-sm text-muted-foreground">
                            Pay when you receive your order
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:border-primary/50">
                    <RadioGroupItem value="esewa" id="esewa" />
                    <Label htmlFor="esewa" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">eSewa Payment</p>
                          <p className="text-sm text-muted-foreground">
                            Pay securely with eSewa (Demo Mode)
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Delivery Scheduling */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Delivery Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Delivery Date */}
                <div>
                  <Label htmlFor="deliveryDate" className="mb-2 block">
                    Preferred Delivery Date *
                  </Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
                    max={new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]} // 30 days from now
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Select a date from tomorrow to next 30 days
                  </p>
                </div>

                {/* Time Slot */}
                <div>
                  <Label className="mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time Slot *
                  </Label>
                  <RadioGroup value={deliveryTimeSlot} onValueChange={(value) => setDeliveryTimeSlot(value as 'morning' | 'afternoon' | 'evening')}>
                    <div className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:border-primary/50">
                      <RadioGroupItem value="morning" id="morning" />
                      <Label htmlFor="morning" className="flex-1 cursor-pointer">
                        <p className="font-semibold">Morning</p>
                        <p className="text-sm text-muted-foreground">9:00 AM - 12:00 PM</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:border-primary/50">
                      <RadioGroupItem value="afternoon" id="afternoon" />
                      <Label htmlFor="afternoon" className="flex-1 cursor-pointer">
                        <p className="font-semibold">Afternoon</p>
                        <p className="text-sm text-muted-foreground">12:00 PM - 5:00 PM</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer hover:border-primary/50">
                      <RadioGroupItem value="evening" id="evening" />
                      <Label htmlFor="evening" className="flex-1 cursor-pointer">
                        <p className="font-semibold">Evening</p>
                        <p className="text-sm text-muted-foreground">5:00 PM - 9:00 PM</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart?.items.map((item) => (
                    <div key={item.productId._id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {item.productId.images?.[0] ? (
                          <Image
                            src={normalizeImageUrl(item.productId.images[0])}
                            alt={item.productId.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-2">
                          {item.productId.title}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm font-semibold">
                            NPR {(item.priceAtTime * item.quantity).toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">NPR {getSubtotal().toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">NPR 100</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      NPR {getTotal().toFixed(0)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={placingOrder || !selectedAddressId}
                >
                  {placingOrder ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>

                <Link href="/cart">
                  <Button variant="outline" className="w-full">
                    Back to Cart
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
