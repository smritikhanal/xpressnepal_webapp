import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/xpressnepal');
    
    const products = await Product.find({}).limit(5).select('title images');
    
    console.log('First 5 products:');
    products.forEach(p => {
      console.log(`\nTitle: ${p.title}`);
      console.log(`Images: ${JSON.stringify(p.images)}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkProducts();
