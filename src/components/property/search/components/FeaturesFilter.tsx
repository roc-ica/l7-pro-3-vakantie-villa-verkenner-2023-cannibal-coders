// filepath: c:\Users\ivanr\OneDrive\Documenten\school\l7-pro-3-vakantie-villa-verkenner-2023-cannibal-coders\src\components\property\search\FeaturesFilter.tsx
import React from 'react';
import { FaFilter, FaBed, FaUsers, FaHome } from 'react-icons/fa';
import { FilterComponentProps } from '../types';
import CollapsibleSection from './CollapsibleSection';

const FeaturesFilter: React.FC<FilterComponentProps> = ({ filters, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'bedrooms' || name === 'capacity') {
      const numValue = value === '' ? 0 : Number(value);
      onChange({ [name]: numValue });
    } else {
      onChange({ [name]: value });
    }
  };
  
  const propertyTypes = [
    { value: 'villa', label: 'Villa', icon: FaHome },
    { value: 'apartment', label: 'Apartment', icon: FaHome },
    { value: 'house', label: 'House', icon: FaHome },
    { value: 'cabin', label: 'Cabin', icon: FaHome },
  ];
  
  return (
    <CollapsibleSection title="Property Features" icon={FaFilter} defaultExpanded={true}>
      <div className="grid gap-4">
        {/* Bedrooms */}
        <div>
          <label htmlFor="bedrooms" className="flex items-center text-custom-dark text-sm mb-2">
            <FaBed className="mr-2 text-custom-sage" />
            Bedrooms
          </label>
          <select
            id="bedrooms"
            name="bedrooms"
            value={filters.bedrooms || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-custom-cream focus:outline-none focus:ring-2 focus:ring-custom-terra/20 focus:border-custom-terra appearance-none bg-white"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num}+ Bedrooms</option>
            ))}
          </select>
        </div>
        
        {/* Capacity */}
        <div>
          <label htmlFor="capacity" className="flex items-center text-custom-dark text-sm mb-2">
            <FaUsers className="mr-2 text-custom-sage" />
            Guests
          </label>
          <select
            id="capacity"
            name="capacity"
            value={filters.capacity || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-custom-cream focus:outline-none focus:ring-2 focus:ring-custom-terra/20 focus:border-custom-terra appearance-none bg-white"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>{num}+ Guests</option>
            ))}
            <option value="9">9+ Guests</option>
          </select>
        </div>
        
        {/* Property Types */}
        <div>
          <label className="flex items-center text-custom-dark text-sm mb-2">
            <FaHome className="mr-2 text-custom-sage" />
            Property Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {propertyTypes.map(type => {
              const isSelected = filters.propertyType === type.value;
              const TypeIcon = type.icon;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => onChange({ 
                    propertyType: isSelected ? '' : type.value 
                  })}
                  className={`px-3 py-2 rounded-md text-left flex items-center transition-colors ${
                    isSelected 
                      ? 'bg-custom-terra/10 text-custom-terra border border-custom-terra/30' 
                      : 'bg-white border border-gray-200 text-custom-charcoal hover:bg-custom-cream/30'
                  }`}
                >
                  <TypeIcon className="mr-2 text-sm" />
                  <span className="text-sm">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default FeaturesFilter;