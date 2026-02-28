/**
 * Script to fix existing image URLs in the database
 * Converts full URLs (http://10.0.2.2:5000/uploads/...) to relative paths (/uploads/...)
 * Run: npm run ts-node src/scripts/fix-image-urls.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import models
import Product from '../models/Product.js';
import User from '../models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/xpressnepal';

async function fixImageUrls() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Fix Product images
    console.log('\nFixing Product images...');
    const products = await Product.find({});
    let productCount = 0;

    for (const product of products) {
      let updated = false;

      // Fix images array
      if (product.images && Array.isArray(product.images)) {
        product.images = product.images.map((url: string) => {
          if (url.includes('http://10.0.2.2:5000/uploads/')) {
            updated = true;
            return url.replace('http://10.0.2.2:5000/uploads/', '/uploads/');
          }
          if (url.includes('http://localhost:5000/uploads/')) {
            updated = true;
            return url.replace('http://localhost:5000/uploads/', '/uploads/');
          }
          // If already relative or just filename, ensure it starts with /uploads/
          if (!url.startsWith('/') && !url.startsWith('http')) {
            updated = true;
            return url.startsWith('uploads/') ? `/${url}` : `/uploads/${url}`;
          }
          return url;
        });
      }

      if (updated) {
        await product.save();
        productCount++;
        console.log(`Fixed product: ${product.title} (${product._id})`);
      }
    }

    console.log(`\n✅ Updated ${productCount} products`);

    // Fix User images
    console.log('\nFixing User profile images...');
    const users = await User.find({ image: { $exists: true, $ne: null, $ne: '' } });
    let userCount = 0;

    for (const user of users) {
      let updated = false;
      let originalImage = user.image;

      if (user.image) {
        if (user.image.includes('http://10.0.2.2:5000/uploads/')) {
          user.image = user.image.replace('http://10.0.2.2:5000/uploads/', '/uploads/');
          updated = true;
        } else if (user.image.includes('http://localhost:5000/uploads/')) {
          user.image = user.image.replace('http://localhost:5000/uploads/', '/uploads/');
          updated = true;
        } else if (!user.image.startsWith('/') && !user.image.startsWith('http')) {
          // If it's just a filename or relative path without leading slash
          user.image = user.image.startsWith('uploads/') ? `/${user.image}` : `/uploads/${user.image}`;
          updated = true;
        }
      }

      if (updated) {
        await user.save();
        userCount++;
        console.log(`Fixed user: ${user.email} - ${originalImage} → ${user.image}`);
      }
    }

    console.log(`\n✅ Updated ${userCount} users`);

    console.log('\n✅ Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing image URLs:', error);
    process.exit(1);
  }
}

// Run the script
fixImageUrls();
