'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Package,
  ChevronRight,
  Home,
  Tag,
  Grid3x3,
  List,
  SlidersHorizontal,
} from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  brand?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: {
    _id: string;
    name: string;
    slug: string;
  };
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      // Fetch category details
      const categoryRes = await fetch(`http://localhost:5000/api/categories/${slug}`);
      const categoryData = await categoryRes.json();

      if (categoryData.success) {
        setCategory(categoryData.data);
        const currentCategoryId = categoryData.data._id;

        // Fetch all categories to get subcategories
        const subCatRes = await fetch('http://localhost:5000/api/categories');
        const subCatData = await subCatRes.json();
        
        let categoryIds = [currentCategoryId];
        
        if (subCatData.success) {
          const allCategories = subCatData.data.categories;
          
          // Find direct subcategories
          const subs = allCategories.filter(
            (cat: SubCategory & { parentCategory?: string | { _id: string } }) => {
              const parentId = typeof cat.parentCategory === 'string' 
                ? cat.parentCategory 
                : cat.parentCategory?._id;
              return parentId === currentCategoryId;
            }
          );
          setSubCategories(subs);
          
          // Get all subcategory IDs (direct children)
          const subCategoryIds = subs.map((sub: SubCategory) => sub._id);
          
          // Find grandchildren (subcategories of subcategories)
          const grandchildren = allCategories.filter(
            (cat: SubCategory & { parentCategory?: string | { _id: string } }) => {
              const parentId = typeof cat.parentCategory === 'string' 
                ? cat.parentCategory 
                : cat.parentCategory?._id;
              return parentId && subCategoryIds.includes(parentId);
            }
          );
          
          const grandchildrenIds = grandchildren.map((gc: SubCategory) => gc._id);
          
          // Include current category + all subcategories + grandchildren
          categoryIds = [currentCategoryId, ...subCategoryIds, ...grandchildrenIds];
        }

        // Fetch products for this category and all its subcategories
        const productPromises = categoryIds.map(catId =>
          fetch(`http://localhost:5000/api/products?category=${catId}`)
            .then(res => res.json())
        );
        
        const productResults = await Promise.all(productPromises);
        
        // Combine all products and remove duplicates
        const allProducts: Product[] = [];
        const seenIds = new Set<string>();
        
        productResults.forEach(result => {
          if (result.success && result.data.products) {
            result.data.products.forEach((product: Product) => {
              if (!seenIds.has(product._id)) {
                seenIds.add(product._id);
                allProducts.push(product);
              }
            });
          }
        });
        
        setProducts(allProducts);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchCategoryData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Category not found</h1>
          <Link href="/categories">
            <Button>Browse All Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/categories" className="hover:text-primary transition-colors">
              Categories
            </Link>
            {category.parentCategory && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link
                  href={`/categories/${category.parentCategory.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {category.parentCategory.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{category.name}</span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Tag className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{category.name}</h1>
              {category.description && (
                <p className="text-muted-foreground mt-2">{category.description}</p>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Subcategories */}
        {subCategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Browse Subcategories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {subCategories.map((subCat) => (
                <Link key={subCat._id} href={`/categories/${subCat.slug}`}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50 h-full">
                    <CardContent className="p-4 text-center">
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <Tag className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-medium text-sm">{subCat.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {products.map((product) => (
              <Link key={product._id} href={`/products/${product.slug}`}>
                <Card
                  className={`group hover:shadow-xl transition-all cursor-pointer h-full ${
                    viewMode === 'list' ? 'flex flex-row' : ''
                  }`}
                >
                  <div
                    className={`relative bg-gray-100 overflow-hidden ${
                      viewMode === 'list'
                        ? 'w-48 h-48 flex-shrink-0'
                        : 'aspect-square'
                    }`}
                  >
                    {product.discountPrice && product.discountPrice < product.price && (
                      <Badge className="absolute top-2 left-2 bg-primary text-white z-10">
                        {Math.round(
                          ((product.price - product.discountPrice) / product.price) * 100
                        )}
                        % OFF
                      </Badge>
                    )}
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-20 w-20 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-base line-clamp-2">
                        {product.title}
                      </CardTitle>
                      {product.brand && (
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                      )}
                      <CardDescription className="text-sm line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-baseline gap-2">
                        {product.discountPrice && product.discountPrice < product.price ? (
                          <>
                            <span className="text-lg font-bold text-primary">
                              NPR {product.discountPrice.toFixed(0)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              NPR {product.price.toFixed(0)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold">
                            NPR {product.price.toFixed(0)}
                          </span>
                        )}
                      </div>

                      {product.stock > 0 ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          Out of Stock
                        </Badge>
                      )}

                      <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                        View Details
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              There are currently no products in this category.
            </p>
            <Link href="/categories">
              <Button>Browse Other Categories</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
