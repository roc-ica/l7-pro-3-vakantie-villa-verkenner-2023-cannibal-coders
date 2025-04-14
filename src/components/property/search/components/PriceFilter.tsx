import React, { useState, useEffect } from 'react';
import { FaTag } from 'react-icons/fa';
import { FilterComponentProps } from '../types';
import CollapsibleSection from './CollapsibleSection';

const PriceFilter: React.FC<FilterComponentProps> = ({ filters, onChange }) => {
  const maxPossiblePrice = 2000;
  const [showMinTooltip, setShowMinTooltip] = useState(false);
  const [showMaxTooltip, setShowMaxTooltip] = useState(false);

  // Calculate visual position for slider elements (clamped to 0-100%)
  const getVisualPosition = (price: number) => {
    return Math.min(100, (price / maxPossiblePrice) * 100);
  };

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
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = Number(value);
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
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-charcoal">$</span>
          <input
            name="minPrice"
            type="number"
            value={filters.minPrice || ''}
            onChange={handleChange}
            placeholder="Min"
            className="w-full pl-8 pr-4 py-3 rounded-lg border border-custom-cream focus:outline-none focus:ring-2 focus:ring-custom-terra/20 focus:border-custom-terra"
          />
        </div>
        <span className="text-custom-charcoal">to</span>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-charcoal">$</span>
          <input
            name="maxPrice"
            type="number"
            value={filters.maxPrice || ''}
            onChange={handleChange}
            placeholder="Max"
            className="w-full pl-8 pr-4 py-3 rounded-lg border border-custom-cream focus:outline-none focus:ring-2 focus:ring-custom-terra/20 focus:border-custom-terra"
          />
        </div>
      </div>
      
      {/* Interactive Price Range Slider */}
      <div className="mt-6 px-2">
        <div className="h-7 relative mb-2">
          {/* Track and colored range */}
          <div className="absolute h-2 w-full bg-custom-cream/50 rounded-full top-1/2 -translate-y-1/2"></div>
          <div 
            className="absolute h-2 bg-custom-terra rounded-full top-1/2 -translate-y-1/2 transition-all duration-150"
            style={{
              left: `${getVisualPosition(filters.minPrice || 0)}%`,
              right: `${100 - getVisualPosition(filters.maxPrice || maxPossiblePrice)}%`
            }}
          ></div>
          
          {/* Min price slider */}
          <input
            type="range"
            name="minPrice"
            min="0"
            max={maxPossiblePrice * 2} // Allow higher values
            value={filters.minPrice || 0}
            onChange={handleSliderChange}
            onMouseEnter={() => setShowMinTooltip(true)}
            onMouseLeave={() => setShowMinTooltip(false)}
            onTouchStart={() => setShowMinTooltip(true)}
            onTouchEnd={() => setShowMinTooltip(false)}
            className="absolute w-full appearance-none bg-transparent pointer-events-auto cursor-pointer"
            style={{ height: '28px', opacity: 0, zIndex: 2 }}
            aria-label="Minimum price"
          />
          
          {/* Max price slider */}
          <input
            type="range"
            name="maxPrice"
            min="0"
            max={maxPossiblePrice * 2} // Allow higher values
            value={filters.maxPrice || maxPossiblePrice}
            onChange={handleSliderChange}
            onMouseEnter={() => setShowMaxTooltip(true)}
            onMouseLeave={() => setShowMaxTooltip(false)}
            onTouchStart={() => setShowMaxTooltip(true)}
            onTouchEnd={() => setShowMaxTooltip(false)}
            className="absolute w-full appearance-none bg-transparent pointer-events-auto cursor-pointer"
            style={{ height: '28px', opacity: 0, zIndex: 2 }}
            aria-label="Maximum price"
          />
          
          {/* Slider handles */}
          <div 
            className="absolute h-5 w-5 bg-white border-2 border-custom-terra rounded-full -ml-2.5 top-1/2 -translate-y-1/2 z-1 shadow-md transition-all duration-150"
            style={{ left: `${getVisualPosition(filters.minPrice || 0)}%` }}
          ></div>
          <div 
            className="absolute h-5 w-5 bg-white border-2 border-custom-terra rounded-full -ml-2.5 top-1/2 -translate-y-1/2 z-1 shadow-md transition-all duration-150"
            style={{ left: `${getVisualPosition(filters.maxPrice || maxPossiblePrice)}%` }}
          ></div>
          
          {/* Tooltips */}
          {showMinTooltip && (
            <div 
              className="absolute bottom-full mb-2 bg-custom-charcoal text-white px-2 py-1 rounded text-xs transform -translate-x-1/2 z-10"
              style={{ 
                left: `${Math.min(98, Math.max(2, getVisualPosition(filters.minPrice || 0)))}%` 
              }}
            >
              {formatPrice(filters.minPrice)}
            </div>
          )}
          {showMaxTooltip && (
            <div 
              className="absolute bottom-full mb-2 bg-custom-charcoal text-white px-2 py-1 rounded text-xs transform -translate-x-1/2 z-10"
              style={{ 
                left: `${Math.min(98, Math.max(2, getVisualPosition(filters.maxPrice || maxPossiblePrice)))}%` 
              }}
            >
              {formatPrice(filters.maxPrice)}
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-1 text-xs text-custom-charcoal">
          <span>$0</span>
          <span>$1000</span>
          <span className="relative group cursor-help">
            $2000+
            <span className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-custom-charcoal text-white text-xs rounded px-2 py-1 whitespace-nowrap transition-opacity duration-200">
              Slider capped at $2000 for display, but higher values are accepted
            </span>
          </span>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default PriceFilter;