/**
 * Script to find and fix products with missing image files
 * Run with: npm run check:images
 * Or: npx tsx src/scripts/fix-missing-images.ts
 */
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

async function checkImageExists(imagePath: string): Promise<boolean> {
    // Remove leading slash and 'uploads/' prefix if present
    const filename = imagePath
        .replace(/^\//, '')
        .replace(/^uploads\//, '');
    
    const fullPath = path.join(UPLOADS_DIR, filename);
    return fs.existsSync(fullPath);
}

async function fixMissingImages() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/xpressnepal';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Get all products
        const products = await Product.find({});
        console.log(`Found ${products.length} products to check`);

        const productsWithMissingImages: any[] = [];
        const missingImageFiles: string[] = [];

        // Check each product
        for (const product of products) {
            if (!product.images || product.images.length === 0) {
                console.log(`⚠️  Product "${product.title}" has no images`);
                productsWithMissingImages.push({
                    id: product._id,
                    title: product.title,
                    slug: product.slug,
                    images: [],
                    reason: 'No images array'
                });
                continue;
            }

            const missingImages: string[] = [];
            for (const imagePath of product.images) {
                const exists = await checkImageExists(imagePath);
                if (!exists) {
                    missingImages.push(imagePath);
                    missingImageFiles.push(imagePath);
                }
            }

            if (missingImages.length > 0) {
                console.log(`❌ Product "${product.title}" has ${missingImages.length} missing image(s):`);
                missingImages.forEach(img => console.log(`   - ${img}`));
                
                productsWithMissingImages.push({
                    id: product._id,
                    title: product.title,
                    slug: product.slug,
                    images: product.images,
                    missingImages,
                    reason: `${missingImages.length} missing file(s)`
                });
            }
        }

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total products checked: ${products.length}`);
        console.log(`Products with issues: ${productsWithMissingImages.length}`);
        console.log(`Missing image files: ${missingImageFiles.length}`);

        if (productsWithMissingImages.length > 0) {
            console.log('\nProducts with missing images:');
            console.log(JSON.stringify(productsWithMissingImages, null, 2));

            // Option to clean up (remove references to missing images)
            console.log('\n' + '='.repeat(60));
            console.log('To fix these issues, you can:');
            console.log('1. Re-upload missing images');
            console.log('2. Remove products with missing images');
            console.log('3. Update products to use placeholder images');
            console.log('='.repeat(60));
        } else {
            console.log('\n✅ All product images exist!');
        }

        // List existing image files
        console.log('\n' + '='.repeat(60));
        console.log('EXISTING IMAGE FILES');
        console.log('='.repeat(60));
        const uploadedFiles = fs.readdirSync(UPLOADS_DIR)
            .filter(f => f.match(/\.(jpg|jpeg|png|webp|gif)$/i));
        console.log(`Total files in uploads: ${uploadedFiles.length}`);
        
        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Run the script
fixMissingImages();