import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalize image URLs to work in both Next.js (localhost) and Android emulator (10.0.2.2)
 * @param url - The image URL from the backend (can be relative or absolute)
 * @returns Normalized URL that works in the current environment
 */
export function normalizeImageUrl(url: string): string {
  if (!url) return url;
  
  // If it's a relative path to backend uploads, use Next.js proxy
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    const path = url.startsWith('/') ? url.slice(1) : url; // Remove leading slash
    return `/api-uploads/${path.replace('uploads/', '')}`;
  }
  
  // If it's a full URL with localhost or 10.0.2.2, convert to proxy path
  if (url.includes('localhost:5000/uploads/') || url.includes('10.0.2.2:5000/uploads/')) {
    const filename = url.split('/uploads/')[1];
    return `/api-uploads/${filename}`;
  }
  
  // External URLs pass through unchanged
  return url;
}
