import React, { useState } from 'react';
import { PropertyFilter } from '../../types/property';
import Input from '../common/Input';
import Button from '../common/Button';

interface PropertySearchProps {
  onSearch: (filters: PropertyFilter) => void;
}

const PropertySearch: React.FC<PropertySearchProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<PropertyFilter>({
    minPrice: undefined,
    maxPrice: undefined,
    location: '',
    minBedrooms: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Min Price"
          type="number"
          value={filters.minPrice || ''}
          onChange={(e) => setFilters({...filters, minPrice: Number(e.target.value)})}
        />
        <Input
          label="Max Price"
          type="number"
          value={filters.maxPrice || ''}
          onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
        />
        <Input
          label="Location"
          type="text"
          value={filters.location}
          onChange={(e) => setFilters({...filters, location: e.target.value})}
        />
        <Input
          label="Min Bedrooms"
          type="number"
          value={filters.minBedrooms || ''}
          onChange={(e) => setFilters({...filters, minBedrooms: Number(e.target.value)})}
        />
      </div>
      <Button type="submit" className="mt-4">Search</Button>
    </form>
  );
};

export default PropertySearch;
