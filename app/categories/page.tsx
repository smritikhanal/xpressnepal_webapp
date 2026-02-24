'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Tag, ChevronRight, Loader2 } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: string;
  isActive: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      if (data.success && Array.isArray(data.data.categories)) {
        // Filter only parent categories (no parentCategory)
        const parentCategories = data.data.categories.filter(
          (cat: Category) => !cat.parentCategory
        );
        setCategories(parentCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore our wide range of products organized by categories
        </p>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category._id} href={`/categories/${category.slug}`}>
              <Card className="group h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mb-6 group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
                    <Tag className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center justify-center text-primary text-sm font-medium">
                    <span>Browse</span>
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-muted-foreground">No categories available.</p>
        </div>
      )}
    </div>
  );
}
