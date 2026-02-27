import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Coupon from '../models/Coupon.js';

dotenv.config();

const sampleCoupons = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 500,
    maxDiscountAmount: 500,
    isActive: true,
    usageLimit: 100,
    usageCount: 0,
    expiresAt: new Date('2026-12-31'),
  },
  {
    code: 'SAVE20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 2000,
    maxDiscountAmount: 1000,
    isActive: true,
    usageLimit: 50,
    usageCount: 0,
    expiresAt: new Date('2026-06-30'),
  },
  {
    code: 'FLAT200',
    discountType: 'fixed',
    discountValue: 200,
    minOrderAmount: 1000,
    isActive: true,
    usageLimit: 200,
    usageCount: 0,
    expiresAt: new Date('2026-12-31'),
  },
  {
    code: 'BIGDEAL',
    discountType: 'percentage',
    discountValue: 30,
    minOrderAmount: 5000,
    maxDiscountAmount: 2000,
    isActive: true,
    usageLimit: 25,
    usageCount: 0,
    expiresAt: new Date('2026-03-31'),
  },
  {
    code: 'NEWYEAR25',
    discountType: 'percentage',
    discountValue: 25,
    minOrderAmount: 3000,
    maxDiscountAmount: 1500,
    isActive: true,
    usageLimit: 100,
    usageCount: 0,
    expiresAt: new Date('2026-01-31'),
  },
  {
    code: 'FLAT500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 2500,
    isActive: true,
    usageLimit: 50,
    usageCount: 0,
    expiresAt: new Date('2026-12-31'),
  },
  {
    code: 'FIRST100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderAmount: 500,
    isActive: true,
    usageLimit: 500,
    usageCount: 0,
    expiresAt: new Date('2026-12-31'),
  },
  {
    code: 'MEGA50',
    discountType: 'percentage',
    discountValue: 50,
    minOrderAmount: 10000,
    maxDiscountAmount: 5000,
    isActive: true,
    usageLimit: 10,
    usageCount: 0,
    expiresAt: new Date('2026-02-28'),
  },
];

async function seedCoupons() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/xpressnepal';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing coupons
    await Coupon.deleteMany({});
    console.log('Cleared existing coupons');

    // Insert sample coupons
    const coupons = await Coupon.insertMany(sampleCoupons);
    console.log(`\n✅ Successfully seeded ${coupons.length} coupons!\n`);

    // Display coupon details
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 AVAILABLE DISCOUNT COUPONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    coupons.forEach((coupon, index) => {
      console.log(`${index + 1}. ${coupon.code}`);
      console.log(`   Type: ${coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `NPR ${coupon.discountValue} OFF`}`);
      console.log(`   Min Order: NPR ${coupon.minOrderAmount || 0}`);
      if (coupon.maxDiscountAmount) {
        console.log(`   Max Discount: NPR ${coupon.maxDiscountAmount}`);
      }
      console.log(`   Valid Until: ${coupon.expiresAt?.toDateString()}`);
      console.log(`   Usage: ${coupon.usageCount}/${coupon.usageLimit || '∞'}`);
      console.log('');
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 TIP: Use these codes at checkout to get discounts!\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding coupons:', error);
    process.exit(1);
  }
}

seedCoupons();
