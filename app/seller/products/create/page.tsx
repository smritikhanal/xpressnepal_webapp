'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';
import AttributeInput from '@/components/admin/AttributeInput';
import { AttributeOption, ProductAttributes } from '@/types';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function SellerCreateProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    discountPrice: '',
    categoryId: '',
    brand: '',
    stock: '',
    images: [] as string[],
    attributes: {
      color: [] as AttributeOption[],
      size: [] as AttributeOption[],
      weight: [] as AttributeOption[],
    } as ProductAttributes,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      if (data.success && Array.isArray(data.data.categories)) {
        setCategories(data.data.categories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl.trim()],
      });
      setImageUrl('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrors({ ...errors, upload: '' });

    try {
      const token = localStorage.getItem('token');
      const uploadFormData = new FormData();
      
      // Add all selected files to FormData
      Array.from(files).forEach((file) => {
        uploadFormData.append('images', file);
      });

      const response = await fetch('http://localhost:5000/api/upload/multiple', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const uploadedUrls = data.data.files.map((file: any) => file.url);
        setFormData({
          ...formData,
          images: [...formData.images, ...uploadedUrls],
        });
      } else {
        setErrors({ ...errors, upload: data.message || 'Failed to upload images' });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setErrors({ ...errors, upload: 'An error occurred while uploading images' });
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = 'Valid price is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.stock || Number(formData.stock) < 0)
      newErrors.stock = 'Valid stock is required';
    if (formData.images.length === 0)
      newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          discountPrice: formData.discountPrice
            ? Number(formData.discountPrice)
            : undefined,
          stock: Number(formData.stock),
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Product created successfully!');
        router.push('/seller/products');
      } else {
        alert(data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('An error occurred while creating the product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="mt-2 text-gray-600">Create a new product listing</p>
        </div>
        <Link
          href="/seller/products"
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., iPhone 15 Pro"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.slug ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="iphone-15-pro"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Detailed product description..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Price & Discount */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (NPR) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                step="0.01"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Price (NPR)
              </label>
              <input
                type="number"
                value={formData.discountPrice}
                onChange={(e) =>
                  setFormData({ ...formData, discountPrice: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Apple"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images *
            </label>
            
            {/* File Upload */}
            <div className="mb-3">
              <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <Upload className="w-5 h-5 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {uploading ? 'Uploading...' : 'Upload Images (Click to select files)'}
                </span>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Select multiple images (max 5MB each, up to 10 images)
              </p>
            </div>

            {/* Upload Error */}
            {errors.upload && (
              <p className="mb-2 text-sm text-red-600">{errors.upload}</p>
            )}

            {/* URL Input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Or enter image URL: https://example.com/image.jpg"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>
            {errors.images && (
              <p className="mt-1 text-sm text-red-600">{errors.images}</p>
            )}

            {/* Image List */}
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attributes */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Product Attributes
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Add variations for your product. Each option can have a price modifier.
            </p>

            <div className="space-y-6">
              <AttributeInput
                label="Color Options"
                attributeName="color"
                options={formData.attributes.color || []}
                onChange={(options) =>
                  setFormData({
                    ...formData,
                    attributes: { ...formData.attributes, color: options },
                  })
                }
              />

              <AttributeInput
                label="Size Options"
                attributeName="size"
                options={formData.attributes.size || []}
                onChange={(options) =>
                  setFormData({
                    ...formData,
                    attributes: { ...formData.attributes, size: options },
                  })
                }
              />

              <AttributeInput
                label="Weight Options"
                attributeName="weight"
                options={formData.attributes.weight || []}
                onChange={(options) =>
                  setFormData({
                    ...formData,
                    attributes: { ...formData.attributes, weight: options },
                  })
                }
              />
            </div>
          </div>

          {/* Is Active */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Product is active and visible
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Link
              href="/seller/products"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
