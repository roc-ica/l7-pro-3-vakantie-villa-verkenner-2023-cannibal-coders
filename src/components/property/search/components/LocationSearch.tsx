// filepath: c:\Users\ivanr\OneDrive\Documenten\school\l7-pro-3-vakantie-villa-verkenner-2023-cannibal-coders\src\components\property\search\LocationSearch.tsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { FilterComponentProps } from '../types';

const LocationSearch: React.FC<FilterComponentProps> = ({ filters, onChange, className = '' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ location: e.target.value });
  };
  
  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border border-custom-cream/20 ${className}`}>
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-custom-terra" />
        <input
          id="location"
          name="location"
          type="text"
          value={filters.location || ''}
          onChange={handleChange}
          placeholder="Where would you like to go?"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-custom-cream focus:outline-none focus:ring-2 focus:ring-custom-terra/20 focus:border-custom-terra"
        />
      </div>
    </div>
  );
};

export default LocationSearch;