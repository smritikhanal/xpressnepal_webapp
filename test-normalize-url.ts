/**
 * Test normalizeImageUrl function
 * Run: npm run dev and test in browser console or create a test component
 */

import { normalizeImageUrl } from '../lib/utils';

// Test cases
const testUrls = [
  '/uploads/handmade_scarf.jpg',
  'uploads/iphone.jpg',
  'http://10.0.2.2:5000/uploads/red_scarf.jpg',
  'http://localhost:5000/uploads/test.jpg',
  'https://external.com/image.jpg',
];

console.log('Testing normalizeImageUrl with NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
console.log('---\n');

testUrls.forEach(url => {
  const normalized = normalizeImageUrl(url);
  console.log(`Input:  ${url}`);
  console.log(`Output: ${normalized}`);
  console.log('---\n');
});

// Expected results with NEXT_PUBLIC_API_URL=http://localhost:5000:
// Input:  /uploads/handmade_scarf.jpg
// Output: http://localhost:5000/uploads/handmade_scarf.jpg

// Input:  uploads/iphone.jpg
// Output: http://localhost:5000/uploads/iphone.jpg

// Input:  http://10.0.2.2:5000/uploads/red_scarf.jpg
// Output: http://localhost:5000/uploads/red_scarf.jpg

// Input:  http://localhost:5000/uploads/test.jpg
// Output: http://localhost:5000/uploads/test.jpg

// Input:  https://external.com/image.jpg
// Output: https://external.com/image.jpg
