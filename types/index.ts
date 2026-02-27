/**
 * Core Type Definitions
 * Mirrors backend models for type safety
 */

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin' | 'seller' | 'customer';
  phone?: string;
  isVerified: boolean;
  authProvider: 'local' | 'google' | 'github';
  image?: string;
  shopName?: string;
  businessDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: string | Category;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Attribute Option with value and price modifier
 */
export interface AttributeOption {
  value: string;
  priceModifier: number;
}

/**
 * Product Attributes Entity
 */
export interface ProductAttributes {
  color?: AttributeOption[];
  size?: AttributeOption[];
  weight?: AttributeOption[];
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  categoryId: string | Category;
  sellerId?: string | {
    _id: string;
    name: string;
    shopName?: string;
    email: string;
  };
  brand?: string;
  images: string[];
  stock: number;
  attributes?: ProductAttributes;
  ratingAvg: number;
  ratingCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string | Product;
  quantity: number;
  price: number;
  _id: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  userId: string;
  fullName: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string | Product;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: 'cash_on_delivery' | 'esewa' | 'khalti' | 'card';
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  userId: string | User;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  _id: string;
  userId: string;
  products: (string | Product)[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  senderId: string | User;
  receiverId: string | User;
  productId?: string | Product;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  senderId: string | User;
  receiverId: string | User;
  productId?: string | Product;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
