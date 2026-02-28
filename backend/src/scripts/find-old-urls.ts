import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

async function findOldUrls() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/xpressnepal');
    
    const productsWithOldUrls = await Product.find({
      images: { 
        $elemMatch: { 
          $regex: /http:\/\/(10\.0\.2\.2|localhost):5000/ 
        }
      }
    }).select('title images');
    
    console.log(`Found ${productsWithOldUrls.length} products with old URL format:`);
    productsWithOldUrls.forEach(p => {
      console.log(`\nTitle: ${p.title}`);
      console.log(`Images: ${JSON.stringify(p.images)}`);
    });
    
    if (productsWithOldUrls.length > 0) {
      console.log('\n⚠️  Run: npm run fix:images to update these products');
    } else {
      console.log('\n✅ All products have correct relative path image URLs');
    }
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

findOldUrls();
