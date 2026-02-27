'use client';

import { useState } from 'react';
import { ProductAttributes, AttributeOption } from '@/types';

interface ProductAttributeSelectorProps {
  attributes?: ProductAttributes;
  basePrice: number;
  onPriceChange: (finalPrice: number) => void;
}

export default function ProductAttributeSelector({
  attributes,
  basePrice,
  onPriceChange,
}: ProductAttributeSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<AttributeOption | null>(null);
  const [selectedSize, setSelectedSize] = useState<AttributeOption | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<AttributeOption | null>(null);

  const calculateFinalPrice = (
    color: AttributeOption | null,
    size: AttributeOption | null,
    weight: AttributeOption | null
  ) => {
    let price = basePrice;
    if (color) price += color.priceModifier;
    if (size) price += size.priceModifier;
    if (weight) price += weight.priceModifier;
    return price;
  };

  const handleColorSelect = (option: AttributeOption) => {
    setSelectedColor(option);
    const finalPrice = calculateFinalPrice(option, selectedSize, selectedWeight);
    onPriceChange(finalPrice);
  };

  const handleSizeSelect = (option: AttributeOption) => {
    setSelectedSize(option);
    const finalPrice = calculateFinalPrice(selectedColor, option, selectedWeight);
    onPriceChange(finalPrice);
  };

  const handleWeightSelect = (option: AttributeOption) => {
    setSelectedWeight(option);
    const finalPrice = calculateFinalPrice(selectedColor, selectedSize, option);
    onPriceChange(finalPrice);
  };

  if (!attributes) return null;

  const hasAttributes =
    (attributes.color && attributes.color.length > 0) ||
    (attributes.size && attributes.size.length > 0) ||
    (attributes.weight && attributes.weight.length > 0);

  if (!hasAttributes) return null;

  return (
    <div className="space-y-6">
      {/* Color Options */}
      {attributes.color && attributes.color.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Color {selectedColor && <span className="text-primary">- {selectedColor.value}</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            {attributes.color.map((option, index) => (
              <button
                key={index}
                onClick={() => handleColorSelect(option)}
                className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                  selectedColor?.value === option.value
                    ? 'border-primary bg-primary text-white shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:bg-primary/5'
                }`}
              >
                {option.value}
                {option.priceModifier !== 0 && (
                  <span className="ml-1 text-xs opacity-75">
                    ({option.priceModifier > 0 ? '+' : ''}NPR {option.priceModifier})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Options */}
      {attributes.size && attributes.size.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Size {selectedSize && <span className="text-primary">- {selectedSize.value}</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            {attributes.size.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSizeSelect(option)}
                className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                  selectedSize?.value === option.value
                    ? 'border-primary bg-primary text-white shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:bg-primary/5'
                }`}
              >
                {option.value}
                {option.priceModifier !== 0 && (
                  <span className="ml-1 text-xs opacity-75">
                    ({option.priceModifier > 0 ? '+' : ''}NPR {option.priceModifier})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Weight Options */}
      {attributes.weight && attributes.weight.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Weight {selectedWeight && <span className="text-primary">- {selectedWeight.value}</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            {attributes.weight.map((option, index) => (
              <button
                key={index}
                onClick={() => handleWeightSelect(option)}
                className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                  selectedWeight?.value === option.value
                    ? 'border-primary bg-primary text-white shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:bg-primary/5'
                }`}
              >
                {option.value}
                {option.priceModifier !== 0 && (
                  <span className="ml-1 text-xs opacity-75">
                    ({option.priceModifier > 0 ? '+' : ''}NPR {option.priceModifier})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
