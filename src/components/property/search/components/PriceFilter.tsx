import React, { useState, useEffect } from 'react';
import { FaTag } from 'react-icons/fa';
import { FilterComponentProps } from '../types';
import CollapsibleSection from './CollapsibleSection';

const PriceFilter: React.FC<FilterComponentProps> = ({ filters, onChange }) => {
  // Format price for display
  const formatPrice = (price: number | undefined) => {
    if (!price) return "$0";
    return `$${price.toLocaleString()}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    onChange({ [name]: numValue });
  };
  
  // Ensure min doesn't exceed max and max doesn't go below min
  useEffect(() => {
    if (filters.minPrice && filters.maxPrice && filters.minPrice > filters.maxPrice) {
      onChange({ minPrice: filters.maxPrice });
    }
  }, [filters.minPrice, filters.maxPrice]);
  
  return (
    <CollapsibleSection title="Price Range" icon={FaTag} defaultExpanded={true}>
      <div className="flex flex-col space-y-4">
        <div className="relative w-full">
          <label className="block text-custom-charcoal mb-2">Minimum Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-charcoal text-lg">$</span>
            <input
              name="minPrice"
              type="number"
              value={filters.minPrice || ''}
              onChange={handleChange}
              placeholder="Min"
              className="w-full pl-10 pr-4 py-4 text-lg rounded-lg border border-custom-cream focus:outline-none focus:ring-2 focus:ring-custom-terra/20 focus:border-custom-terra"
            />
          </div>
        </div>
        
        <div className="relative w-full">
          <label className="block text-custom-charcoal mb-2">Maximum Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-charcoal text-lg">$</span>
            <input
              name="maxPrice"
              type="number"
              value={filters.maxPrice || ''}
              onChange={handleChange}
              placeholder="Max"
              className="w-full pl-10 pr-4 py-4 text-lg rounded-lg border border-custom-cream focus:outline-none focus:ring-2 focus:ring-custom-terra/20 focus:border-custom-terra"
            />
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default PriceFilter;