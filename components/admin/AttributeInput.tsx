'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { AttributeOption } from '@/types';

interface AttributeInputProps {
  label: string;
  attributeName: 'color' | 'size' | 'weight';
  options: AttributeOption[];
  onChange: (options: AttributeOption[]) => void;
}

export default function AttributeInput({
  label,
  attributeName,
  options,
  onChange,
}: AttributeInputProps) {
  const [newValue, setNewValue] = useState('');
  const [newPriceModifier, setNewPriceModifier] = useState('0');

  const addOption = () => {
    if (!newValue.trim()) return;

    const option: AttributeOption = {
      value: newValue.trim(),
      priceModifier: parseFloat(newPriceModifier) || 0,
    };

    onChange([...options, option]);
    setNewValue('');
    setNewPriceModifier('0');
  };

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addOption();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Existing Options */}
      {options.length > 0 && (
        <div className="space-y-2">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex-1">
                <span className="font-medium text-gray-900">{option.value}</span>
                {option.priceModifier !== 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    ({option.priceModifier > 0 ? '+' : ''}NPR {option.priceModifier})
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Option */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`e.g., ${attributeName === 'color' ? 'Red' : attributeName === 'size' ? 'M' : '500g'}`}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <input
          type="number"
          value={newPriceModifier}
          onChange={(e) => setNewPriceModifier(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Price +/-"
          step="0.01"
          className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <button
          type="button"
          onClick={addOption}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      <p className="text-xs text-gray-500">
        Add {label.toLowerCase()} options. Price modifier adjusts the base price (e.g., +100 for premium colors).
      </p>
    </div>
  );
}
