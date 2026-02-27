/**
 * Seed Script: Create sample data to demonstrate schema relationships
 * Run with: npx tsx src/scripts/seed-sample-data.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
  User,
  Category,
  Product,
  Cart,
  Order,
  Review,
} from '../models/index.js';

dotenv.config();

async function seedSampleData() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    // 1. Create Categories
    console.log('Creating categories...');
    const electronicsCategory = await Category.findOneAndUpdate(
      { slug: 'electronics' },
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        isActive: true,
      },
      { upsert: true, new: true }
    );

    const phonesCategory = await Category.findOneAndUpdate(
      { slug: 'phones' },
      {
        name: 'Phones',
        slug: 'phones',
        description: 'Mobile phones and accessories',
        parentCategory: electronicsCategory._id, // Nested category!
        isActive: true,
      },
      { upsert: true, new: true }
    );

    console.log('✓ Categories created');

    // 2. Create Products with real image URLs
    console.log('Creating products...');
    const product1 = await Product.findOneAndUpdate(
      { slug: 'iphone-15-pro' },
      {
        title: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'Latest Apple iPhone with A17 Pro chip, titanium design, and advanced camera system',
        price: 185000,
        discountPrice: 175000,
        categoryId: phonesCategory._id,
        brand: 'Apple',
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium?wid=800&hei=800&fmt=jpeg',
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=800&hei=800&fmt=jpeg',
        ],
        stock: 50,
        attributes: { color: 'Blue Titanium', size: '256GB' },
        ratingAvg: 4.8,
        ratingCount: 120,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    const product2 = await Product.findOneAndUpdate(
      { slug: 'samsung-galaxy-s24' },
      {
        title: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24',
        description: 'Premium Android flagship with S-Pen, 200MP camera, and AI features',
        price: 165000,
        categoryId: phonesCategory._id,
        brand: 'Samsung',
        images: [
          'https://images.samsung.com/is/image/samsung/p6pim/np/2401/gallery/np-galaxy-s24-ultra-s928-sm-s928bztqphl-thumb-539573044?$480_480_PNG$',
          'https://images.samsung.com/is/image/samsung/p6pim/np/2401/gallery/np-galaxy-s24-ultra-s928-sm-s928bzkqphl-thumb-539573030?$480_480_PNG$',
        ],
        stock: 30,
        attributes: { color: 'Titanium Black', size: '512GB' },
        ratingAvg: 4.6,
        ratingCount: 85,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    console.log('✓ Products created');

    // 3. Demonstrate populate() - Fetching product with category data
    console.log('\n--- EXAMPLE: populate() ---');
    const productWithCategory = await Product.findOne({ slug: 'iphone-15-pro' })
      .populate('categoryId', 'name slug');
    
    console.log('Product with populated category:');
    console.log({
      title: productWithCategory?.title,
      category: productWithCategory?.categoryId,
    });

    // 4. Demonstrate nested populate - Category with parent
    console.log('\n--- EXAMPLE: Nested categories ---');
    const phonesCategoryWithParent = await Category.findOne({ slug: 'phones' })
      .populate('parentCategory', 'name');
    
    console.log('Phones category with parent:');
    console.log({
      name: phonesCategoryWithParent?.name,
      parent: phonesCategoryWithParent?.parentCategory,
    });

    // 5. Demonstrate aggregation - Products by category count
    console.log('\n--- EXAMPLE: Aggregation ---');
    const productsByCategory = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$categoryId',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
        },
      },
    ]);
    
    console.log('Products aggregated by category:');
    console.log(productsByCategory);

    // 6. List all collections
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('\nAll collections in database:');
      collections.forEach((col) => console.log(`  - ${col.name}`));
    }

    await mongoose.disconnect();
    console.log('\n✓ Sample data created successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedSampleData();
