'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { Package } from 'lucide-react';

interface ProductImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string | null | undefined;
  alt: string;
  fallbackIcon?: boolean;
}

/**
 * ProductImage component with built-in error handling
 * Automatically falls back to placeholder if image fails to load
 */
export function ProductImage({ 
  src, 
  alt, 
  fallbackIcon = true,
  className,
  ...props 
}: ProductImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use placeholder if no src or if image failed to load
  const imageSrc = error || !src ? '/placeholder-image.svg' : src;

  return (
    <div className="relative w-full h-full">
      {!error && src ? (
        <Image
          {...props}
          src={imageSrc}
          alt={alt}
          className={className}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            console.warn(`Failed to load image: ${src}`);
            setError(true);
            setIsLoading(false);
          }}
        />
      ) : (
        // Fallback when no image or error
        <>
          {fallbackIcon ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <Package className="h-16 w-16 text-gray-300" />
            </div>
          ) : (
            <Image
              {...props}
              src="/placeholder-image.svg"
              alt={alt}
              className={className}
            />
          )}
        </>
      )}
      
      {/* Loading state */}
      {isLoading && !error && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </div>
  );
}
