/**
 * Seed Script: Create initial superadmin user
 * Run with: npm run seed:admin
 * 
 * Usage:
 * - Default: npm run seed:admin (uses default credentials)
 * - Custom: npm run seed:admin -- --email=admin@xpressnepal.com --password=securepass123 --name="Admin User"
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { hashPassword } from '../utils/auth.js';

dotenv.config();

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config: { email?: string; password?: string; name?: string } = {};

  args.forEach((arg) => {
    if (arg.startsWith('--email=')) {
      config.email = arg.split('=')[1];
    } else if (arg.startsWith('--password=')) {
      config.password = arg.split('=')[1];
    } else if (arg.startsWith('--name=')) {
      config.name = arg.split('=')[1];
    }
  });

  return config;
}

async function seedSuperAdmin() {
  try {
    // Get MongoDB URI
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined in .env file');
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Parse custom credentials or use defaults
    const customArgs = parseArgs();
    const superadminEmail = customArgs.email || 'superadmin@xpressnepal.com';
    const superadminPassword = customArgs.password || 'SuperAdmin@123';
    const superadminName = customArgs.name || 'Super Administrator';

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({
      email: superadminEmail.toLowerCase(),
    });

    if (existingSuperAdmin) {
      console.log('⚠️  Superadmin user already exists with this email!');
      console.log('Email:', existingSuperAdmin.email);
      console.log('Role:', existingSuperAdmin.role);
      console.log('Created:', existingSuperAdmin.createdAt);
      
      if (existingSuperAdmin.role !== 'superadmin') {
        console.log('\n⚠️  WARNING: Existing user is not a superadmin!');
        console.log('Please use a different email or delete the existing user first.');
      }
      
      await mongoose.disconnect();
      process.exit(0);
    }

    // Hash password
    console.log('\nCreating superadmin user...');
    const passwordHash = await hashPassword(superadminPassword);

    // Create superadmin user
    const superadmin = await User.create({
      name: superadminName,
      email: superadminEmail.toLowerCase(),
      passwordHash,
      role: 'superadmin',
      authProvider: 'local',
      isVerified: true, // Auto-verify superadmin
      phone: '+977-9800000000', // Default phone
    });

    console.log('\n✅ Superadmin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', superadmin.email);
    console.log('🔑 Password:', superadminPassword);
    console.log('👤 Name:', superadmin.name);
    console.log('🎯 Role:', superadmin.role);
    console.log('✓  Verified:', superadmin.isVerified);
    console.log('📅 Created:', superadmin.createdAt);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Save these credentials securely!');
    console.log('You can now login at: http://localhost:3000/auth/login');
    console.log('\nAfter login, you will be redirected to: /admin/dashboard');

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding superadmin:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the seed function
seedSuperAdmin();
