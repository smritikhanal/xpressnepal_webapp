'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/use-socket';
import { MapPin, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeliveryTrackingProps {
  orderId: string;
  orderStatus: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };
  deliveryPersonnel?: {
    name: string;
    phone: string;
  };
}

export default function DeliveryTracking({
  orderId,
  orderStatus,
  currentLocation: initialLocation,
  deliveryPersonnel: initialPersonnel,
}: DeliveryTrackingProps) {
  const { isConnected, on, off, trackOrder, untrackOrder } = useSocket();
  const [currentLocation, setCurrentLocation] = useState(initialLocation);
  const [deliveryPersonnel, setDeliveryPersonnel] = useState(initialPersonnel);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Start tracking this order
    trackOrder(orderId);

    // Listen for delivery tracking updates
    const handleTrackingUpdate = (data: any) => {
      if (data.orderId === orderId) {
        if (data.currentLocation) {
          setCurrentLocation(data.currentLocation);
        }
        if (data.deliveryPersonnel) {
          setDeliveryPersonnel(data.deliveryPersonnel);
        }
        setLastUpdated(new Date());
      }
    };

    on('delivery:tracking-updated', handleTrackingUpdate);

    // Cleanup
    return () => {
      off('delivery:tracking-updated', handleTrackingUpdate);
      untrackOrder(orderId);
    };
  }, [orderId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <Package className="w-6 h-6" />;
      case 'confirmed':
      case 'processing':
        return <Clock className="w-6 h-6" />;
      case 'shipped':
        return <Truck className="w-6 h-6" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <Package className="w-6 h-6" />;
    }
  };

  const statusSteps = [
    { key: 'placed', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex((step) => step.key === orderStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-sm">
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
          }`}
        />
        <span className={isConnected ? 'text-green-600' : 'text-gray-500'}>
          {isConnected ? 'Live Tracking' : 'Offline'}
        </span>
      </div>

      {/* Order Status Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{
                width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.key} className="flex flex-col items-center">
                  <motion.div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                      isCompleted
                        ? 'bg-primary border-primary text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: isCurrent ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {getStatusIcon(step.key)}
                  </motion.div>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delivery Personnel */}
      {deliveryPersonnel && orderStatus === 'shipped' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Delivery Personnel
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{deliveryPersonnel.name}</p>
              <p className="text-sm text-gray-600">{deliveryPersonnel.phone}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* GPS Location */}
      {currentLocation && orderStatus === 'shipped' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Location</h3>
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="text-sm text-gray-700 mb-1">
                Latitude: {currentLocation.latitude.toFixed(6)}
              </p>
              <p className="text-sm text-gray-700">
                Longitude: {currentLocation.longitude.toFixed(6)}
              </p>
              <a
                href={`https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline mt-2 inline-block"
              >
                View on Google Maps →
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
