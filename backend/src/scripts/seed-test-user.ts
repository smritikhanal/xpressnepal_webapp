/**
 * Test Script: Create a sample user to verify MongoDB connection
 * Run with: npx tsx src/scripts/seed-test-user.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

async function seedTestUser() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@xpressnepal.com' });
    
    if (existingUser) {
      console.log('Test user already exists:');
      console.log({
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      });
    } else {
      // Create a test user
      const testUser = await User.create({
        name: 'Test User',
        email: 'test@xpressnepal.com',
        passwordHash: 'temporary-hash-will-be-replaced-with-bcrypt',
        role: 'user',
        isVerified: false,
        authProvider: 'local',
      });

      console.log('Test user created successfully!');
      console.log({
        id: testUser._id,
        name: testUser.name,
        email: testUser.email,
        role: testUser.role,
      });
    }

    // List all collections
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('\nCollections in database:');
      collections.forEach((col) => console.log(`  - ${col.name}`));
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedTestUser();
