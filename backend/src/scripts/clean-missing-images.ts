/**
 * Script to clean up products with missing images
 * Run with: npm run clean:missing-images
 * Or: npx tsx src/scripts/clean-missing-images.ts
 */
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import readline from 'readline';

dotenv.config();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

async function checkImageExists(imagePath: string): Promise<boolean> {
    const filename = imagePath
        .replace(/^\//, '')
        .replace(/^uploads\//, '');
    
    const fullPath = path.join(UPLOADS_DIR, filename);
    return fs.existsSync(fullPath);
}

async function cleanMissingImages() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/xpressnepal';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB\n');

        // Find products with missing images
        const products = await Product.find({});
        const productsToFix: any[] = [];

        for (const product of products) {
            if (!product.images || product.images.length === 0) continue;

            const missingImages: string[] = [];
            for (const imagePath of product.images) {
                const exists = await checkImageExists(imagePath);
                if (!exists) {
                    missingImages.push(imagePath);
                }
            }

            if (missingImages.length > 0) {
                productsToFix.push({
                    product,
                    missingImages
                });
            }
        }

        if (productsToFix.length === 0) {
            console.log('✅ No products with missing images found!');
            await mongoose.disconnect();
            rl.close();
            return;
        }

        console.log(`Found ${productsToFix.length} product(s) with missing images:\n`);
        productsToFix.forEach((item, i) => {
            console.log(`${i + 1}. ${item.product.title} (${item.product.slug})`);
            console.log(`   Missing: ${item.missingImages.join(', ')}`);
        });

        console.log('\n' + '='.repeat(60));
        console.log('How would you like to fix these products?');
        console.log('1. Delete all products with missing images');
        console.log('2. Remove missing image references (keep products with no images)');
        console.log('3. Cancel (do nothing)');
        console.log('='.repeat(60));

        const choice = await question('\nEnter your choice (1-3): ');

        switch (choice.trim()) {
            case '1':
                // Delete products
                console.log('\n⚠️  WARNING: This will permanently delete these products!');
                const confirm1 = await question('Are you sure? (yes/no): ');
                
                if (confirm1.toLowerCase() === 'yes') {
                    const productIds = productsToFix.map(item => item.product._id);
                    const result = await Product.deleteMany({ _id: { $in: productIds } });
                    console.log(`\n✅ Deleted ${result.deletedCount} product(s)`);
                } else {
                    console.log('\n❌ Cancelled');
                }
                break;

            case '2':
                // Remove missing image references
                console.log('\n🔧 Removing missing image references...');
                let updated = 0;
                
                for (const item of productsToFix) {
                    const validImages = item.product.images.filter((img: string) => 
                        !item.missingImages.includes(img)
                    );
                    
                    await Product.findByIdAndUpdate(item.product._id, {
                        $set: { images: validImages }
                    });
                    updated++;
                    console.log(`   ✓ Updated ${item.product.title}`);
                }
                
                console.log(`\n✅ Updated ${updated} product(s)`);
                console.log('⚠️  Note: Some products may now have no images');
                break;

            case '3':
                console.log('\n❌ Cancelled - No changes made');
                break;

            default:
                console.log('\n❌ Invalid choice - No changes made');
        }

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        rl.close();
    } catch (error) {
        console.error('Error:', error);
        rl.close();
        process.exit(1);
    }
}

// Run the script
cleanMissingImages();
