import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';

dotenv.config();

const categories = [
  {
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic devices and gadgets",
    "parentCategory": null,
    "isActive": true
  },

  /* ===== Electronics → Mobile & Computing ===== */

  {
    "name": "Phones",
    "slug": "phones",
    "description": "Mobile phones and accessories",
    "parentCategory": "electronics",
    "isActive": true
  },
  {
    "name": "Smartphones",
    "slug": "smartphones",
    "description": "Android and iOS smartphones",
    "parentCategory": "phones",
    "isActive": true
  },
  {
    "name": "Feature Phones",
    "slug": "feature-phones",
    "description": "Basic mobile phones",
    "parentCategory": "phones",
    "isActive": true
  },
  {
    "name": "Phone Accessories",
    "slug": "phone-accessories",
    "description": "Cases, chargers, cables, screen protectors",
    "parentCategory": "phones",
    "isActive": true
  },

  {
    "name": "Computers",
    "slug": "computers",
    "description": "Desktops and laptops",
    "parentCategory": "electronics",
    "isActive": true
  },
  {
    "name": "Laptops",
    "slug": "laptops",
    "description": "Personal and gaming laptops",
    "parentCategory": "computers",
    "isActive": true
  },
  {
    "name": "Desktops",
    "slug": "desktops",
    "description": "Desktop PCs and workstations",
    "parentCategory": "computers",
    "isActive": true
  },
  {
    "name": "Computer Accessories",
    "slug": "computer-accessories",
    "description": "Keyboards, mouse, monitors, storage",
    "parentCategory": "computers",
    "isActive": true
  },

  /* ===== Electronics → Audio & Video ===== */

  {
    "name": "Audio",
    "slug": "audio",
    "description": "Audio devices",
    "parentCategory": "electronics",
    "isActive": true
  },
  {
    "name": "Headphones",
    "slug": "headphones",
    "description": "Wired and wireless headphones",
    "parentCategory": "audio",
    "isActive": true
  },
  {
    "name": "Speakers",
    "slug": "speakers",
    "description": "Bluetooth and wired speakers",
    "parentCategory": "audio",
    "isActive": true
  },

  {
    "name": "TV & Video",
    "slug": "tv-video",
    "description": "Television and video devices",
    "parentCategory": "electronics",
    "isActive": true
  },
  {
    "name": "Televisions",
    "slug": "televisions",
    "description": "Smart and LED TVs",
    "parentCategory": "tv-video",
    "isActive": true
  },
  {
    "name": "Streaming Devices",
    "slug": "streaming-devices",
    "description": "Chromecast, Firestick, Android TV box",
    "parentCategory": "tv-video",
    "isActive": true
  },

  /* ===== Fashion ===== */

  {
    "name": "Fashion",
    "slug": "fashion",
    "description": "Clothing and accessories",
    "parentCategory": null,
    "isActive": true
  },
  {
    "name": "Men",
    "slug": "men-fashion",
    "description": "Men clothing and accessories",
    "parentCategory": "fashion",
    "isActive": true
  },
  {
    "name": "Women",
    "slug": "women-fashion",
    "description": "Women clothing and accessories",
    "parentCategory": "fashion",
    "isActive": true
  },
  {
    "name": "Footwear",
    "slug": "footwear",
    "description": "Shoes, sandals, slippers",
    "parentCategory": "fashion",
    "isActive": true
  },

  /* ===== Home & Living ===== */

  {
    "name": "Home & Living",
    "slug": "home-living",
    "description": "Home appliances and furniture",
    "parentCategory": null,
    "isActive": true
  },
  {
    "name": "Kitchen Appliances",
    "slug": "kitchen-appliances",
    "description": "Cookers, mixers, microwaves",
    "parentCategory": "home-living",
    "isActive": true
  },
  {
    "name": "Furniture",
    "slug": "furniture",
    "description": "Beds, sofas, tables",
    "parentCategory": "home-living",
    "isActive": true
  },
  {
    "name": "Home Decor",
    "slug": "home-decor",
    "description": "Decorative items",
    "parentCategory": "home-living",
    "isActive": true
  },

  /* ===== Beauty & Health ===== */

  {
    "name": "Beauty & Health",
    "slug": "beauty-health",
    "description": "Beauty and healthcare products",
    "parentCategory": null,
    "isActive": true
  },
  {
    "name": "Skincare",
    "slug": "skincare",
    "description": "Creams, lotions, facewash",
    "parentCategory": "beauty-health",
    "isActive": true
  },
  {
    "name": "Haircare",
    "slug": "haircare",
    "description": "Shampoo, oils, styling products",
    "parentCategory": "beauty-health",
    "isActive": true
  },
  {
    "name": "Health Devices",
    "slug": "health-devices",
    "description": "Thermometers, BP machines",
    "parentCategory": "beauty-health",
    "isActive": true
  },

  /* ===== Sports & Outdoor ===== */

  {
    "name": "Sports & Outdoor",
    "slug": "sports-outdoor",
    "description": "Sports and outdoor equipment",
    "parentCategory": null,
    "isActive": true
  },
  {
    "name": "Fitness Equipment",
    "slug": "fitness-equipment",
    "description": "Gym and fitness tools",
    "parentCategory": "sports-outdoor",
    "isActive": true
  },
  {
    "name": "Outdoor Gear",
    "slug": "outdoor-gear",
    "description": "Camping and hiking gear",
    "parentCategory": "sports-outdoor",
    "isActive": true
  },

  /* ===== Books & Stationery ===== */

  {
    "name": "Books & Stationery",
    "slug": "books-stationery",
    "description": "Books and office supplies",
    "parentCategory": null,
    "isActive": true
  },
  {
    "name": "Books",
    "slug": "books",
    "description": "Educational and novels",
    "parentCategory": "books-stationery",
    "isActive": true
  },
  {
    "name": "Stationery",
    "slug": "stationery",
    "description": "Pens, notebooks, office items",
    "parentCategory": "books-stationery",
    "isActive": true
  }
];

async function seedCategories() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    // Map to store category IDs by slug
    const categoryMap = new Map<string, string>();

    // First pass: Create all parent categories (those with parentCategory: null)
    const parentCategories = categories.filter(cat => cat.parentCategory === null);
    for (const categoryData of parentCategories) {
      const category = await Category.create({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        isActive: categoryData.isActive,
      });
      categoryMap.set(category.slug, category._id.toString());
      console.log(`✅ Created parent category: ${category.name}`);
    }

    // Second pass: Create child categories (those with parentCategory)
    const childCategories = categories.filter(cat => cat.parentCategory !== null);
    for (const categoryData of childCategories) {
      const parentId = categoryMap.get(categoryData.parentCategory!);
      
      if (!parentId) {
        console.log(`⚠️  Skipping ${categoryData.name}: Parent category '${categoryData.parentCategory}' not found`);
        continue;
      }

      const category = await Category.create({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        parentCategory: parentId,
        isActive: categoryData.isActive,
      });
      categoryMap.set(category.slug, category._id.toString());
      console.log(`✅ Created child category: ${category.name} → ${categoryData.parentCategory}`);
    }

    console.log('\n🎉 Categories seeded successfully!');
    console.log(`📊 Total categories created: ${categoryMap.size}`);

    // Display hierarchy
    console.log('\n📁 Category Hierarchy:');
    const mainCategories = await Category.find({ parentCategory: null });
    for (const mainCat of mainCategories) {
      console.log(`\n${mainCat.name}`);
      const subCats1 = await Category.find({ parentCategory: mainCat._id });
      for (const subCat1 of subCats1) {
        console.log(`  ├── ${subCat1.name}`);
        const subCats2 = await Category.find({ parentCategory: subCat1._id });
        for (const subCat2 of subCats2) {
          console.log(`  │   ├── ${subCat2.name}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  }
}

seedCategories();
